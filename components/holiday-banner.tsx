"use client";

import { useEffect, useRef, useState } from "react";
import { SparklesIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { HOLIDAY_INFO } from "@/lib/holiday-info";
import { useHoliday } from "@/lib/use-holiday";

const SEEN = "holiday-greeted";
/** Fired when the banner has folded away, so the header button can flag itself. */
export const HANDOFF = "holiday-banner-handoff";

/**
 * A banner at the bottom of the header the first time a visitor lands during a
 * holiday, so the decorations are never a mystery: it names the holiday, says in
 * a line what it is, links to read more, and has "Turn off" right there. It stays
 * until dismissed (a timed note is gone before anyone can use it) and then does
 * not return for that holiday this year; the header button, labelled with the
 * holiday's name, stays available. Previews (`?holiday=`) always show it.
 * Closing it shrinks it into that header button, which then lights up briefly,
 * so the visitor sees where the controls went (a plain fade under
 * prefers-reduced-motion).
 * It floats just under the sticky header (never in flow, so no layout shift)
 * and tucks away with the header on scroll.
 */
export default function HolidayBanner() {
  const { holiday, off, toggle } = useHoliday();
  const [shown, setShown] = useState(false);
  const box = useRef<HTMLDivElement>(null);

  const key = holiday ? `${holiday.id}-${new Date().getFullYear()}` : "";

  useEffect(() => {
    if (!holiday) return;
    const preview = new URLSearchParams(window.location.search).has("holiday");
    try {
      if (!preview && localStorage.getItem(SEEN) === key) return;
    } catch {
      /* storage blocked: show it, it stays until dismissed */
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect -- shown after the client knows the date
    setShown(true);
  }, [holiday, key]);

  if (!holiday || !shown) return null;

  const dismiss = () => {
    try {
      localStorage.setItem(SEEN, key);
    } catch {
      /* storage blocked: it returns next visit */
    }
    const done = () => {
      setShown(false);
      window.dispatchEvent(new Event(HANDOFF));
    };
    const el = box.current;
    const btn = document.getElementById("holiday-button");
    if (!el || !btn || !el.animate) return done();
    // Shrink toward the header button so the eye follows it there.
    const a = el.getBoundingClientRect();
    const b = btn.getBoundingClientRect();
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const to = still
      ? "none"
      : `translate(${b.left + b.width / 2 - (a.left + a.width / 2)}px, ${b.top + b.height / 2 - (a.top + a.height / 2)}px) scale(${b.width / a.width}, ${b.height / a.height})`;
    el.animate(
      [
        { transform: "none", opacity: 1 },
        { transform: to, opacity: 0 },
      ],
      {
        duration: still ? 150 : 450,
        easing: "cubic-bezier(.4,0,.2,1)",
        fill: "forwards",
      }
    ).finished.then(done, done);
  };
  const info = HOLIDAY_INFO[holiday.id];

  return (
    // Absolutely positioned under the header, so it floats over the page instead
    // of pushing it down: it appears after hydration, and a push is layout shift.
    <div
      role="region"
      aria-label="Holiday decorations"
      className="absolute inset-x-6 top-full mt-3 md:inset-x-16"
    >
      <div
        ref={box}
        className="mx-auto flex max-w-6xl items-start gap-3 rounded-xl border border-line bg-card px-4 py-3 text-sm text-ink shadow-lg"
      >
        <SparklesIcon className="mt-0.5 size-5 shrink-0 text-interactive-ink" />
        <div className="min-w-0 flex-1">
          <p>
            <strong>The site is dressed up for {holiday.label}.</strong>{" "}
            {info && (
              <span className="text-ink-soft">
                {info.about}{" "}
                <a
                  href={info.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline underline-offset-2 hover:text-ink focus-visible:ring-2 focus-visible:ring-interactive-ink rounded-sm"
                >
                  More about {holiday.label}
                </a>
              </span>
            )}
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1">
            <button
              type="button"
              onClick={() => {
                if (!off) toggle();
                dismiss();
              }}
              className="cursor-pointer rounded-full border border-line bg-surface-hover px-3 py-1 text-xs font-medium hover:text-interactive-ink focus-visible:ring-2 focus-visible:ring-interactive-ink"
            >
              Turn off decorations
            </button>
            <span className="text-xs text-ink-soft">
              Close this and it tucks into the{" "}
              <span className="font-medium text-interactive-ink">
                {holiday.label}
              </span>{" "}
              button up top.
            </span>
          </div>
        </div>
        <button
          type="button"
          aria-label="Dismiss"
          onClick={dismiss}
          className="shrink-0 cursor-pointer text-ink-soft hover:text-ink focus-visible:ring-2 focus-visible:ring-interactive-ink rounded-sm"
        >
          <XMarkIcon className="size-5" />
        </button>
      </div>
    </div>
  );
}
