"use client";

import { Fragment, useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import { event } from "@/lib/gtag";

type ChatMessage = { role: "user" | "assistant"; content: string };

const GREETING =
  "Hi! I'm an AI assistant who knows Anthony's work. Ask me about his experience, projects, or skills.";

const SUGGESTIONS = [
  "What does Anthony do today?",
  "What are his side projects?",
  "How can I get in touch?",
];

// Mirrors the server's limits in app/api/chat/route.ts.
const MAX_INPUT_CHARS = 1000;
const MAX_HISTORY = 19;
// Show a character count once the visitor gets close to the limit.
const COUNTER_FROM = 800;

// The conversation survives page reloads for the rest of the browser session.
const STORAGE_KEY = "chat:messages";
// How close to the bottom (px) still counts as "following" a streaming reply.
const STICK_THRESHOLD = 40;

function track(action: string, params?: Record<string, unknown>) {
  try {
    event(action, params);
  } catch {
    // noop
  }
}

function loadMessages(): ChatMessage[] {
  try {
    const raw = JSON.parse(sessionStorage.getItem(STORAGE_KEY) ?? "[]");
    if (!Array.isArray(raw)) return [];
    const valid = raw.every(
      (m, i) =>
        m?.role === (i % 2 === 0 ? "user" : "assistant") &&
        typeof m.content === "string" &&
        m.content
    );
    // A saved conversation always ends on a reply.
    return valid && raw.length % 2 === 0 ? raw : [];
  } catch {
    return [];
  }
}

function saveMessages(messages: ChatMessage[]) {
  try {
    if (messages.length) {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } else {
      sessionStorage.removeItem(STORAGE_KEY);
    }
  } catch {
    // noop
  }
}

// URLs, email addresses, and the site's own paths become links.
const LINK_PATTERN =
  /(https?:\/\/[^\s<>()]+[^\s<>().,;:!?'"]|[\w.+-]+@[\w-]+(?:\.[\w-]+)+|(?<![\w/])\/(?:resume|projects|coding)\b)/g;

function Linkified({ text }: { text: string }) {
  const parts = text.split(LINK_PATTERN);
  return (
    <>
      {parts.map((part, i) => {
        if (i % 2 === 0) return <Fragment key={i}>{part}</Fragment>;
        const href = part.startsWith("/") || part.startsWith("http") ? part : `mailto:${part}`;
        const external = part.startsWith("http");
        return (
          <a
            key={i}
            href={href}
            className="underline underline-offset-2 text-interactive-ink break-words"
            {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          >
            {part}
          </a>
        );
      })}
    </>
  );
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Finished replies, for screen readers; streamed text isn't announced.
  const [announcement, setAnnouncement] = useState("");
  const [restored, setRestored] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const stickToBottomRef = useRef(true);

  // Read storage after mount so the server and client render the same thing.
  useEffect(() => {
    setMessages(loadMessages());
    setRestored(true);
  }, []);

  useEffect(() => {
    if (restored && !pending) saveMessages(messages);
  }, [messages, pending, restored]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
    // Lets globals.css hide the scroll-to-top button, which the panel covers.
    document.documentElement.toggleAttribute("data-chat-open", open);
  }, [open]);

  useEffect(() => {
    const list = listRef.current;
    if (list && stickToBottomRef.current) list.scrollTop = list.scrollHeight;
  }, [messages, pending, open]);

  const close = () => {
    setOpen(false);
    toggleRef.current?.focus();
  };

  useEffect(() => {
    if (!open) return;
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => () => abortRef.current?.abort(), []);

  const toggle = () => {
    if (!open) {
      track("chat_opened");
      stickToBottomRef.current = true;
    }
    setOpen(!open);
  };

  const onListScroll = () => {
    const list = listRef.current;
    if (!list) return;
    stickToBottomRef.current =
      list.scrollHeight - list.scrollTop - list.clientHeight < STICK_THRESHOLD;
  };

  const stop = () => {
    abortRef.current?.abort();
    track("chat_stopped");
  };

  async function send(text: string, suggested = false) {
    const content = text.trim();
    if (!content || pending) return;

    // Drop the oldest turns so the request stays within the server's limit
    // and still starts with a visitor message.
    let history = [...messages, { role: "user" as const, content }];
    while (history.length > MAX_HISTORY) history = history.slice(2);

    setMessages([...messages, { role: "user", content }]);
    setInput("");
    setError(null);
    setAnnouncement("");
    setPending(true);
    stickToBottomRef.current = true;
    track("chat_message_sent", { suggested });

    const controller = new AbortController();
    abortRef.current = controller;
    let reply = "";

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history }),
        signal: controller.signal,
      });

      if (!res.ok || !res.body) {
        const data = await res.json().catch(() => null);
        track("chat_error", { status: res.status });
        throw new Error(data?.error ?? "Something went wrong. Please try again.");
      }

      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        reply += chunk;
        setMessages((prev) => {
          const next = [...prev];
          const last = next[next.length - 1];
          next[next.length - 1] = { ...last, content: last.content + chunk };
          return next;
        });
      }
      setAnnouncement(reply);
    } catch (err) {
      // Keep a partial reply. Otherwise take the unanswered question back out
      // (the server needs the conversation to alternate) so it can be retried.
      if (!reply.trim()) {
        setMessages((prev) => {
          const last = prev[prev.length - 1];
          return last?.role === "assistant" ? prev.slice(0, -2) : prev.slice(0, -1);
        });
        setInput(content);
      }
      if (controller.signal.aborted) return;
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setPending(false);
      abortRef.current = null;
    }
  }

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    send(input);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      send(input);
    }
  };

  // Covers both the wait for the response and for its first streamed token.
  const lastMessage = messages[messages.length - 1];
  const waitingForReply = pending && (lastMessage?.role === "user" || lastMessage?.content === "");
  // Suggestions the visitor hasn't asked yet, offered between turns.
  const remainingSuggestions = SUGGESTIONS.filter(
    (s) => !messages.some((m) => m.role === "user" && m.content === s)
  );
  const showSuggestions = !pending && (!lastMessage || lastMessage.role === "assistant");

  return (
    <>
      {open && (
        <div
          id="chat-panel"
          role="dialog"
          aria-label="Chat with Anthony's AI assistant"
          className="fixed z-50 bottom-24 right-4 left-4 sm:left-auto sm:right-6 sm:w-96 h-[min(32rem,calc(100svh-8rem))] flex flex-col rounded-2xl border border-line-strong bg-card shadow-2xl overflow-hidden"
        >
          <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-line">
            <div>
              <p className="font-semibold text-ink text-sm">Ask about Anthony</p>
              <p className="text-xs text-ink-soft">AI assistant · may make mistakes</p>
            </div>
            <button
              type="button"
              onClick={close}
              aria-label="Close chat"
              className="cursor-pointer p-1.5 rounded-md text-ink-soft hover:text-ink focus-visible:ring-2 focus-visible:ring-interactive-ink"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div ref={listRef} onScroll={onListScroll} className="flex-1 overflow-y-auto px-4 py-4 space-y-3 text-sm">
            <div className="max-w-[85%] rounded-2xl rounded-bl-sm px-3.5 py-2.5 bg-bg text-ink border border-line">
              {GREETING}
            </div>

            {messages.map((m, i) =>
              m.role === "user" ? (
                <div key={i} className="flex justify-end">
                  <div className="max-w-[85%] rounded-2xl rounded-br-sm px-3.5 py-2.5 bg-interactive-surface text-ink whitespace-pre-wrap break-words">
                    {m.content}
                  </div>
                </div>
              ) : m.content ? (
                <div
                  key={i}
                  className="max-w-[85%] rounded-2xl rounded-bl-sm px-3.5 py-2.5 bg-bg text-ink border border-line whitespace-pre-wrap break-words"
                >
                  <Linkified text={m.content} />
                </div>
              ) : null
            )}

            {showSuggestions && remainingSuggestions.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-1">
                {remainingSuggestions.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => send(s, true)}
                    className="cursor-pointer text-xs px-3 py-1.5 rounded-full border border-line-strong text-ink hover:bg-surface-hover focus-visible:ring-2 focus-visible:ring-interactive-ink"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}

            {waitingForReply && (
              <div className="inline-flex gap-1 rounded-2xl rounded-bl-sm px-3.5 py-3 bg-bg border border-line" aria-label="Assistant is typing">
                {[0, 150, 300].map((delay) => (
                  <span
                    key={delay}
                    className="w-1.5 h-1.5 rounded-full bg-ink-soft animate-bounce"
                    style={{ animationDelay: `${delay}ms` }}
                  />
                ))}
              </div>
            )}

            {error && (
              <p role="alert" className="text-xs text-danger-ink">
                {error}
              </p>
            )}
          </div>

          <p className="sr-only" aria-live="polite">
            {announcement}
          </p>

          <form onSubmit={onSubmit} className="flex items-end gap-2 p-3 border-t border-line">
            <label htmlFor="chat-input" className="sr-only">
              Your question
            </label>
            <div className="flex-1 flex flex-col gap-1">
              <textarea
                id="chat-input"
                ref={inputRef}
                rows={1}
                value={input}
                maxLength={MAX_INPUT_CHARS}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder="Ask a question…"
                aria-describedby={input.length >= COUNTER_FROM ? "chat-input-count" : undefined}
                // 16px on phones: iOS Safari zooms the page into smaller inputs.
                className="w-full resize-none field-sizing-content min-h-9 max-h-28 rounded-xl border border-line-strong bg-bg px-3 py-2 text-[16px] sm:text-sm text-ink placeholder:text-ink-soft focus:outline-none focus-visible:ring-2 focus-visible:ring-interactive-ink"
              />
              {input.length >= COUNTER_FROM && (
                <p id="chat-input-count" className="text-xs text-ink-soft text-right">
                  {input.length}/{MAX_INPUT_CHARS}
                </p>
              )}
            </div>
            {pending ? (
              // Separate keys so React swaps the element: reusing it would turn the
              // Stop click into a submit once the button flips back to Send.
              <button
                key="stop"
                type="button"
                onClick={stop}
                aria-label="Stop"
                className="cursor-pointer shrink-0 inline-flex items-center justify-center w-9 h-9 rounded-xl bg-interactive text-on-interactive hover:bg-interactive-hover focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-interactive-ink"
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <rect x="5" y="5" width="14" height="14" rx="2" />
                </svg>
              </button>
            ) : (
              <button
                key="send"
                type="submit"
                disabled={!input.trim()}
                aria-label="Send"
                className="cursor-pointer shrink-0 inline-flex items-center justify-center w-9 h-9 rounded-xl bg-interactive text-on-interactive hover:bg-interactive-hover disabled:opacity-40 disabled:cursor-not-allowed focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-interactive-ink"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </button>
            )}
          </form>
        </div>
      )}

      <button
        id="chat-toggle"
        ref={toggleRef}
        type="button"
        onClick={toggle}
        aria-expanded={open}
        aria-controls="chat-panel"
        aria-label={open ? "Close chat" : "Chat with Anthony's AI assistant"}
        className="fixed bottom-6 right-6 z-50 cursor-pointer inline-flex items-center justify-center p-3 border-2 rounded-full shadow-lg transition-all duration-200 bg-card border-line-strong hover:scale-105 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-interactive-ink"
      >
        {open ? (
          <svg className="w-5 h-5 text-ink" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-5 h-5 text-ink" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.86 9.86 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
        )}
      </button>
    </>
  );
}
