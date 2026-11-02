"use client";

import { useEffect, useState } from "react";
import { HOLIDAY_INFO } from "@/lib/holiday-info";
import { useHoliday } from "@/lib/use-holiday";

const SEEN = "holiday-greeted";
/** Fired by the footer's "What's this?" to bring the note back. */
export const OPEN_EVENT = "holiday-greeting-open";

/**
 * A note the first time a visitor lands during a holiday, so the decorations
 * never look like a bug. It names the holiday, says in a line what it is, links
 * to read more, and offers "Turn off". It stays until it is dismissed (a timed
 * note is gone before anyone can click it) and does not return for the same
 * holiday this year, but the footer's "What's this?" reopens it any time.
 * Previews (`?holiday=`) always show it. Real text in a polite live region.
 */
export default function HolidayGreeting() {
  const { holiday, off, toggle } = useHoliday();
  const [open, setOpen] = useState(false);

  const key = holiday ? `${holiday.id}-${new Date().getFullYear()}` : "";

  useEffect(() => {
    if (!holiday || off) return;
    const preview = new URLSearchParams(window.location.search).has("holiday");
    try {
      if (!preview && localStorage.getItem(SEEN) === key) return;
      if (!preview) localStorage.setItem(SEEN, key);
    } catch {
      /* storage blocked: show it, it stays until dismissed */
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect -- shown once, after the client knows the date
    setOpen(true);
  }, [holiday, off, key]);

  useEffect(() => {
    const show = () => setOpen(true);
    window.addEventListener(OPEN_EVENT, show);
    return () => window.removeEventListener(OPEN_EVENT, show);
  }, []);

  if (!holiday || !open) return null;
  const info = HOLIDAY_INFO[holiday.id];
  return (
    <div
      role="status"
      className="fixed bottom-4 left-4 right-4 z-50 rounded-xl border border-line bg-card px-4 py-3 text-sm text-ink shadow-lg sm:right-auto sm:max-w-sm"
    >
      <div className="flex items-start gap-3">
        <p className="flex-1">
          {off ? "Holiday decorations are off. " : "The site is dressed up for "}
          {!off && <strong>{holiday.label}</strong>}
          {!off && "."}
          {info && (
            <span className="mt-1 block text-ink-soft">
              {info.about}{" "}
              <a
                href={info.url}
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2 hover:text-ink focus-visible:ring-2 focus-visible:ring-interactive-ink rounded-sm"
              >
                Learn more
              </a>
            </span>
          )}
        </p>
        <button
          type="button"
          aria-label="Dismiss"
          onClick={() => setOpen(false)}
          className="cursor-pointer text-ink-soft hover:text-ink focus-visible:ring-2 focus-visible:ring-interactive-ink rounded-sm"
        >
          ×
        </button>
      </div>
      <button
        type="button"
        onClick={() => {
          toggle();
          if (!off) setOpen(false);
        }}
        className="mt-2 cursor-pointer underline underline-offset-2 text-ink-soft hover:text-ink focus-visible:ring-2 focus-visible:ring-interactive-ink rounded-sm"
      >
        {off ? "Turn on" : "Turn off"}
      </button>
    </div>
  );
}
