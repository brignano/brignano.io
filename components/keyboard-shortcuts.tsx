"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { setTheme } from "@/lib/theme";
import {
  OPEN_CHAT_EVENT,
  OPEN_SHORTCUTS_EVENT,
  PAGE_SHORTCUTS,
  SEQUENCE_TIMEOUT_MS,
  SHORTCUT_GROUPS,
} from "@/lib/shortcuts";
import { event } from "@/lib/gtag";

// Room left above a heading when jumping to it, so the sticky header (about
// 80px) never covers it when it slides back in on the way up.
const SECTION_OFFSET_PX = 96;

function isTypingTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  if (target.isContentEditable) return true;
  return target.closest("input, textarea, select, [contenteditable]") !== null;
}

function prefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function scrollToY(top: number) {
  window.scrollTo({
    top,
    behavior: prefersReducedMotion() ? "auto" : "smooth",
  });
}

// The visible section headings on the page, top to bottom. Visually hidden
// ones (the `sr-only` list labels on /work and /blog) are skipped: jumping to
// them lands on nothing a sighted visitor can see.
function sectionHeadings(): HTMLElement[] {
  return Array.from(document.querySelectorAll<HTMLElement>("main h2")).filter(
    (h) => {
      const rect = h.getBoundingClientRect();
      return rect.width > 1 && rect.height > 1;
    }
  );
}

function jumpToSection(direction: 1 | -1) {
  const headings = sectionHeadings();
  // A couple of pixels of slack so the heading we just landed on doesn't count
  // as "still below" and get picked again.
  const slack = 4;
  const target =
    direction === 1
      ? headings.find(
          (h) => h.getBoundingClientRect().top > SECTION_OFFSET_PX + slack
        )
      : headings
          .slice()
          .reverse()
          .find(
            (h) => h.getBoundingClientRect().top < SECTION_OFFSET_PX - slack
          );

  if (!target) {
    // Past the last heading: `j` does nothing. Above the first: `k` goes to the
    // very top, where the page's title lives.
    if (direction === -1) scrollToY(0);
    return;
  }

  scrollToY(
    window.scrollY + target.getBoundingClientRect().top - SECTION_OFFSET_PX
  );
  // Move focus too, so a screen reader and the next Tab both start from the
  // section the visitor jumped to, not from wherever focus was before.
  if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
  target.focus({ preventScroll: true });
}

function track(action: string) {
  try {
    event(action, { event_category: "keyboard_shortcuts" });
  } catch {
    // noop
  }
}

/**
 * Global keyboard shortcuts and the "?" help dialog. Mounted once in the
 * root layout. The list of keys lives in lib/shortcuts.ts.
 */
export default function KeyboardShortcuts() {
  const router = useRouter();
  const dialogRef = useRef<HTMLDialogElement>(null);
  // Set while waiting for the second key of a `g` sequence.
  const [pendingG, setPendingG] = useState(false);
  const pendingTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const clearPending = () => {
      if (pendingTimer.current) clearTimeout(pendingTimer.current);
      pendingTimer.current = null;
      setPendingG(false);
    };

    const openHelp = () => {
      if (dialog.open) return;
      clearPending();
      dialog.showModal();
      track("shortcuts_opened");
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.defaultPrevented || e.isComposing) return;
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      if (isTypingTarget(e.target)) return;

      // While the help is open only "?" (to close it) matters; Esc is handled
      // by the <dialog> itself.
      if (dialog.open) {
        if (e.key === "?") {
          e.preventDefault();
          dialog.close();
        }
        return;
      }

      // Any other open dialog (the chat panel) owns the keyboard.
      if (document.querySelector('[role="dialog"]:not([hidden])')) return;

      if (pendingTimer.current) {
        clearPending();
        const page = PAGE_SHORTCUTS.find((p) => p.key === e.key);
        if (page) {
          e.preventDefault();
          track(`shortcut_go_${page.key}`);
          router.push(page.href);
        } else if (e.key === "g") {
          e.preventDefault();
          scrollToY(0);
        }
        return;
      }

      switch (e.key) {
        case "?":
          e.preventDefault();
          openHelp();
          break;
        case "g":
          e.preventDefault();
          setPendingG(true);
          pendingTimer.current = setTimeout(clearPending, SEQUENCE_TIMEOUT_MS);
          break;
        case "G":
          e.preventDefault();
          scrollToY(document.documentElement.scrollHeight);
          break;
        case "j":
          e.preventDefault();
          jumpToSection(1);
          break;
        case "k":
          e.preventDefault();
          jumpToSection(-1);
          break;
        case "t":
          e.preventDefault();
          setTheme(!document.documentElement.classList.contains("dark"));
          track("shortcut_theme");
          break;
        case "/":
          e.preventDefault();
          window.dispatchEvent(new Event(OPEN_CHAT_EVENT));
          break;
      }
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener(OPEN_SHORTCUTS_EVENT, openHelp);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener(OPEN_SHORTCUTS_EVENT, openHelp);
      if (pendingTimer.current) clearTimeout(pendingTimer.current);
    };
  }, [router]);

  return (
    <>
      {/* A quiet cue that the next key finishes a "g" sequence. Decorative:
          the help dialog is where the keys are explained. */}
      {pendingG && (
        <div
          aria-hidden="true"
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 rounded-full border border-line-strong bg-card px-3 py-1.5 text-sm text-ink-soft shadow-lg"
        >
          <kbd className="font-mono text-ink">g</kbd> then…
        </div>
      )}

      <dialog
        ref={dialogRef}
        aria-labelledby="shortcuts-title"
        // Clicking the backdrop (the dialog element itself, outside its
        // content box) closes it.
        onClick={(e) => {
          if (e.target === e.currentTarget) e.currentTarget.close();
        }}
        className="m-auto w-[min(32rem,calc(100vw-2rem))] max-h-[calc(100svh-4rem)] rounded-2xl border border-line-strong bg-card text-ink-soft shadow-2xl p-0 backdrop:bg-[var(--scrim)]"
      >
        <div className="flex items-center justify-between gap-3 px-6 py-4 border-b border-line">
          <h2 id="shortcuts-title" className="font-semibold text-ink">
            Keyboard shortcuts
          </h2>
          <button
            type="button"
            onClick={() => dialogRef.current?.close()}
            aria-label="Close keyboard shortcuts"
            className="cursor-pointer p-1.5 rounded-md text-ink-soft hover:text-ink focus-visible:ring-2 focus-visible:ring-interactive-ink"
          >
            <XMarkIcon className="size-5" />
          </button>
        </div>
        <div className="px-6 py-5 grid gap-6 sm:grid-cols-2">
          {SHORTCUT_GROUPS.map((group) => (
            <section
              key={group.title}
              className={group.title === "Go to page" ? "sm:row-span-2" : ""}
            >
              <h3 className="text-xs font-medium uppercase tracking-wide text-slate mb-2">
                {group.title}
              </h3>
              <dl className="space-y-1.5 text-sm">
                {group.items.map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center justify-between gap-4"
                  >
                    <dt>{item.label}</dt>
                    <dd className="flex items-center gap-1 shrink-0">
                      {item.keys.map((k, i) => (
                        <span key={i} className="flex items-center gap-1">
                          {i > 0 && item.keys[0] === "g" && (
                            <span className="text-xs text-slate">then</span>
                          )}
                          <kbd className="min-w-6 text-center font-mono text-xs text-ink bg-bg border border-line rounded-md px-1.5 py-0.5">
                            {k}
                          </kbd>
                        </span>
                      ))}
                    </dd>
                  </div>
                ))}
              </dl>
            </section>
          ))}
        </div>
      </dialog>
    </>
  );
}
