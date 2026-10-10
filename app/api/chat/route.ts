import Anthropic from "@anthropic-ai/sdk";
import { takeFromDailyBudget } from "@/lib/chat/budget";
import { getSystemPrompt } from "@/lib/chat/system-prompt";

export const runtime = "nodejs";
export const maxDuration = 30;

const MODEL = "claude-haiku-5-5";
// The system prompt asks for 2–5 sentence replies; this is the ceiling.
const MAX_TOKENS = 512;

// Request shape limits. The widget sends the whole conversation each turn, so
// these bound what one request can cost no matter what a client sends.
// MAX_ASSISTANT_CHARS leaves room for a full MAX_TOKENS reply plus a fallback
// note, so a real conversation is never rejected on its next turn.
const MAX_MESSAGES = 20;
const MAX_USER_CHARS = 1000;
const MAX_ASSISTANT_CHARS = 3000;

// Best-effort per-IP limit. It lives in one function instance's memory, so a
// burst spread across instances can exceed it — the site-wide daily budget
// (lib/chat/budget.ts) and the Anthropic Console spend limit back it up.
const RATE_LIMIT = 20;
const RATE_WINDOW_MS = 10 * 60 * 1000;
const hits = new Map<string, number[]>();

const FALLBACK_REPLY =
  "Sorry, I can't help with that one. You can reach Anthony directly at hi@brignano.io.";

const client = new Anthropic();

function isRateLimited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < RATE_WINDOW_MS);
  if (recent.length >= RATE_LIMIT) {
    hits.set(ip, recent);
    return true;
  }
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) {
    for (const [key, times] of hits) {
      if (times.every((t) => now - t >= RATE_WINDOW_MS)) hits.delete(key);
    }
  }
  return false;
}

function isSameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  if (!origin || !host) return false;
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

/** Validates the client's conversation, or returns null if it's malformed. */
function parseMessages(body: unknown): Anthropic.MessageParam[] | null {
  if (typeof body !== "object" || body === null) return null;
  const raw = (body as { messages?: unknown }).messages;
  if (!Array.isArray(raw) || raw.length === 0 || raw.length > MAX_MESSAGES) {
    return null;
  }

  const messages: Anthropic.MessageParam[] = [];
  for (const [i, m] of raw.entries()) {
    if (typeof m !== "object" || m === null) return null;
    const { role, content } = m as { role?: unknown; content?: unknown };
    // Strictly alternating, starting and ending with the visitor.
    const expected = i % 2 === 0 ? "user" : "assistant";
    if (role !== expected || typeof content !== "string") return null;
    const text = content.trim();
    const limit = role === "user" ? MAX_USER_CHARS : MAX_ASSISTANT_CHARS;
    if (!text || text.length > limit) return null;
    messages.push({ role: expected, content: text });
  }
  return messages.at(-1)?.role === "user" ? messages : null;
}

function errorResponse(status: number, error: string) {
  return Response.json({ error }, { status });
}

export async function POST(request: Request) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return errorResponse(503, "The chat assistant isn't configured yet.");
  }
  if (!isSameOrigin(request)) {
    return errorResponse(403, "Forbidden.");
  }

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";
  if (isRateLimited(ip)) {
    return errorResponse(
      429,
      "You've sent a lot of messages — please wait a few minutes, or email hi@brignano.io."
    );
  }

  let messages: Anthropic.MessageParam[] | null;
  try {
    messages = parseMessages(await request.json());
  } catch {
    messages = null;
  }
  if (!messages) {
    return errorResponse(400, "That message couldn't be sent.");
  }

  if (!(await takeFromDailyBudget())) {
    return errorResponse(
      503,
      "The assistant has answered all the questions it can for today — please email hi@brignano.io instead."
    );
  }

  const system = await getSystemPrompt();
  const stream = client.messages.stream({
    model: MODEL,
    max_tokens: MAX_TOKENS,
    output_config: { effort: "low" },
    // Auto-cache the conversation so far; the explicit breakpoint on the
    // system prompt lets every new visitor reuse the same cached prefix.
    cache_control: { type: "ephemeral" },
    system: [{ type: "text", text: system, cache_control: { type: "ephemeral" } }],
    messages,
  });

  const encoder = new TextEncoder();
  const body = new ReadableStream<Uint8Array>({
    async start(controller) {
      let wroteText = false;
      try {
        for await (const event of stream) {
          if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
            wroteText = true;
            controller.enqueue(encoder.encode(event.delta.text));
          }
        }
        const final = await stream.finalMessage();
        if (final.stop_reason === "refusal") {
          controller.enqueue(encoder.encode((wroteText ? "\n\n" : "") + FALLBACK_REPLY));
        }
      } catch (error) {
        console.error("chat: Anthropic request failed", error);
        controller.enqueue(
          encoder.encode(
            (wroteText ? "\n\n" : "") +
              "Sorry, something went wrong on my end. Please try again, or email hi@brignano.io."
          )
        );
      } finally {
        controller.close();
      }
    },
    cancel() {
      stream.abort();
    },
  });

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}
