"use client";

import { useRef, type ToggleEvent } from "react";
import { HOLIDAY_INFO } from "@/lib/holiday-info";
import { useHoliday } from "@/lib/use-holiday";

/**
 * The whole holiday theme now: one greeting in the now bar ("Happy
 * Thanksgiving") while a holiday is on. It used to be edge art, a garland
 * and a header button; that read as an add-on and took the best spot in the
 * header for something people use once (wireframe: the-cursor.html, #358).
 *
 * The greeting opens a small popover with a line on what the holiday is, a
 * link to read more, and a way to hide the greeting, remembered per holiday
 * (lib/use-holiday.ts), so hiding one doesn't silence the next. Nothing opens
 * or moves on its own. Preview any holiday with `?holiday=<id>`.
 */
export default function HolidayGreeting() {
  const { holiday, off, toggle } = useHoliday();
  const button = useRef<HTMLButtonElement>(null);

  if (!holiday || off) return null;
  const info = HOLIDAY_INFO[holiday.id];
  const greeting = holiday.greeting ?? `Happy ${holiday.label}`;

  // A native popover (design's .popover): the browser handles Escape, a
  // click outside and aria-expanded. Browsers without CSS anchor positioning
  // place it from the button's box.
  const onToggle = (e: ToggleEvent<HTMLDivElement>) => {
    if (e.newState !== "open") return;
    if (!CSS.supports("position-area: block-end") && button.current) {
      const r = button.current.getBoundingClientRect();
      const panel = e.currentTarget;
      panel.style.setProperty("--popover-top", `${r.bottom + 6}px`);
      panel.style.setProperty(
        "--popover-left",
        `${Math.max(16, Math.min(r.left, window.innerWidth - panel.offsetWidth - 16))}px`,
      );
    }
  };

  return (
    <>
      <button
        ref={button}
        type="button"
        popoverTarget="holiday-panel"
        className="cursor-pointer text-ink-soft hover:text-ink underline decoration-dotted decoration-[var(--mark-current)] decoration-2 underline-offset-[3px] rounded-sm focus-visible:ring-2 focus-visible:ring-interactive-ink pointer-coarse:py-2.5"
      >
        {greeting}
      </button>
      <div
        id="holiday-panel"
        popover="auto"
        role="group"
        aria-label={holiday.label}
        onToggle={onToggle}
        className="popover w-80 max-w-[calc(100vw-2rem)] p-4 font-sans text-sm whitespace-normal"
      >
        <p className="font-semibold text-ink">{holiday.label}</p>
        {info && <p className="mt-1 text-ink-soft">{info.about}</p>}
        <p className="mt-3 flex flex-wrap gap-x-4 gap-y-2">
          {info && (
            <a
              href={info.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-interactive-ink hover:underline rounded-sm focus-visible:ring-2 focus-visible:ring-interactive-ink"
            >
              More about {holiday.label} ↗
            </a>
          )}
          <button
            type="button"
            popoverTarget="holiday-panel"
            popoverTargetAction="hide"
            onClick={toggle}
            className="cursor-pointer text-interactive-ink hover:underline rounded-sm focus-visible:ring-2 focus-visible:ring-interactive-ink"
          >
            Hide this greeting
          </button>
        </p>
      </div>
    </>
  );
}
