"use client";

import { useEffect, useState } from "react";
import { useHoliday } from "@/lib/use-holiday";

const SEEN = "holiday-greeted";

/**
 * A small one-time note the first time a visitor lands during a holiday, so the
 * decorations never look like a bug. It names the holiday, offers "Turn off",
 * fades on its own and does not come back for the same holiday. Previews
 * (`?holiday=`) always show it. Real text in a polite live region.
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
      /* storage blocked: show it, it just fades on its own */
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect -- shown once, after the client knows the date
    setOpen(true);
    const t = window.setTimeout(() => setOpen(false), 9000);
    return () => window.clearTimeout(t);
  }, [holiday, off, key]);

  if (!holiday || off || !open) return null;
  return (
    <div
      role="status"
      className="fixed bottom-4 left-4 right-4 z-50 flex items-center gap-3 rounded-xl border border-line bg-card px-4 py-3 text-sm text-ink shadow-lg sm:right-auto sm:max-w-sm"
    >
      <span className="flex-1">
        The site is dressed up for <strong>{holiday.label}</strong>.
      </span>
      <button
        type="button"
        onClick={() => {
          toggle();
          setOpen(false);
        }}
        className="cursor-pointer underline underline-offset-2 text-ink-soft hover:text-ink focus-visible:ring-2 focus-visible:ring-interactive-ink rounded-sm"
      >
        Turn off
      </button>
      <button
        type="button"
        aria-label="Dismiss"
        onClick={() => setOpen(false)}
        className="cursor-pointer text-ink-soft hover:text-ink focus-visible:ring-2 focus-visible:ring-interactive-ink rounded-sm"
      >
        ×
      </button>
    </div>
  );
}
