"use client";

import { useEffect, useState } from "react";
import { SparklesIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { HOLIDAY_INFO } from "@/lib/holiday-info";
import { useHoliday } from "@/lib/use-holiday";

const SEEN = "holiday-greeted";

/**
 * A banner at the bottom of the header the first time a visitor lands during a
 * holiday, so the decorations are never a mystery: it names the holiday, says in
 * a line what it is, links to read more, and has "Turn off" right there. It stays
 * until dismissed (a timed note is gone before anyone can use it) and then does
 * not return for that holiday this year; the header button, labelled with the
 * holiday's name, stays available. Previews (`?holiday=`) always show it.
 * It floats just under the sticky header (never in flow, so no layout shift)
 * and tucks away with the header on scroll.
 */
export default function HolidayBanner() {
  const { holiday, off, toggle } = useHoliday();
  const [shown, setShown] = useState(false);

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
    setShown(false);
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
      <div className="mx-auto flex max-w-6xl items-start gap-3 rounded-xl border border-line bg-card px-4 py-3 text-sm text-ink shadow-lg">
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
          <button
            type="button"
            onClick={() => {
              if (!off) toggle();
              dismiss();
            }}
            className="mt-2 cursor-pointer rounded-full border border-line bg-surface-hover px-3 py-1 text-xs font-medium hover:text-interactive-ink focus-visible:ring-2 focus-visible:ring-interactive-ink"
          >
            Turn off decorations
          </button>
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
