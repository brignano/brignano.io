"use client";

import { useEffect, useRef, useState, type ToggleEvent } from "react";
import { SparklesIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { HOLIDAY_INFO } from "@/lib/holiday-info";
import { useHoliday } from "@/lib/use-holiday";

const SEEN = "holiday-greeted";

/**
 * The header button that explains and controls the seasonal decorations. It
 * sits beside the theme toggle and shows only while a holiday is on, labelled
 * with the holiday's name ("Diwali", or "Diwali off") so nobody has to guess
 * what the icon means. Its popover says which holiday it is, says what it is in
 * a line, links to read more and has the switch for the decorations.
 *
 * Nothing opens on its own: a popup on landing covers the page people came to
 * read. Instead, until a visitor has opened the popover once for this holiday
 * this year, the button carries a small dot (the same "something new here" cue
 * a notification badge gives). Opening it clears the dot. Previews
 * (`?holiday=`) always show the dot.
 */
export default function HolidayButton() {
  const { holiday, off, toggle } = useHoliday();
  const [fresh, setFresh] = useState(false);
  const button = useRef<HTMLButtonElement>(null);

  const key = holiday ? `${holiday.id}-${new Date().getFullYear()}` : "";

  // Not opened yet this holiday: show the dot once the client knows the date.
  useEffect(() => {
    if (!holiday) return;
    const preview = new URLSearchParams(window.location.search).has("holiday");
    try {
      if (!preview && localStorage.getItem(SEEN) === key) return;
    } catch {
      /* storage blocked: show the dot; it clears when opened */
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect -- known only after the client knows the date
    setFresh(true);
  }, [holiday, key]);

  // A native popover (design's .popover): the browser handles Escape, a click
  // outside and aria-expanded on the button. Opening it clears the dot.
  // Browsers without CSS anchor positioning place it from the button's box.
  const onToggle = (e: ToggleEvent<HTMLDivElement>) => {
    if (e.newState !== "open") return;
    if (!CSS.supports("position-area: block-end") && button.current) {
      const r = button.current.getBoundingClientRect();
      const panel = e.currentTarget;
      panel.style.setProperty("--popover-top", `${r.bottom}px`);
      panel.style.setProperty(
        "--popover-left",
        `${Math.max(16, Math.min(r.right - panel.offsetWidth, window.innerWidth - panel.offsetWidth - 16))}px`,
      );
    }
    setFresh(false);
    try {
      localStorage.setItem(SEEN, key);
    } catch {
      /* storage blocked: the dot returns next visit */
    }
  };

  if (!holiday) return null;
  const info = HOLIDAY_INFO[holiday.id];
  return (
    <div className="shrink-0">
      <button
        ref={button}
        type="button"
        popoverTarget="holiday-panel"
        className={`btn shrink-0 gap-1.5 rounded-full bg-card pl-2 pr-3 hover:bg-surface-hover hover:text-interactive-ink ${off ? "text-ink-soft" : "text-interactive-ink"}`}
      >
        <span className="relative shrink-0">
          <SparklesIcon className="size-5 cursor-pointer" />
          {fresh && (
            <span
              aria-hidden="true"
              className="absolute -right-0.5 -top-0.5 size-2 rounded-full bg-interactive-ink ring-2 ring-card"
            />
          )}
          {fresh && <span className="sr-only">(new)</span>}
        </span>
        <span className="max-w-28 cursor-pointer truncate text-xs font-medium sm:max-w-none">
          {holiday.label}
          {off && " off"}
        </span>
      </button>
      <div
        id="holiday-panel"
        popover="auto"
        role="group"
        aria-label={`About the ${holiday.label} decorations`}
        onToggle={onToggle}
        className="popover w-80 p-4 text-sm"
      >
        <div className="flex items-start gap-2">
          <SparklesIcon className="mt-0.5 size-5 shrink-0 text-interactive-ink" />
          <p className="min-w-0 flex-1 font-semibold">
            The site is dressed up for {holiday.label}
          </p>
          <button
            type="button"
            aria-label="Close"
            popoverTarget="holiday-panel"
            popoverTargetAction="hide"
            className="shrink-0 cursor-pointer rounded-sm text-ink-soft hover:text-ink focus-visible:ring-2 focus-visible:ring-interactive-ink"
          >
            <XMarkIcon className="size-5" />
          </button>
        </div>
        {info && (
          <p className="mt-1 text-ink-soft">
            {info.about}{" "}
            <a
              href={info.url}
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 hover:text-ink focus-visible:ring-2 focus-visible:ring-interactive-ink rounded-sm"
            >
              More about {holiday.label}
            </a>
          </p>
        )}
        <div className="mt-3 flex items-center justify-between gap-3 border-t border-line pt-3">
          <label htmlFor="holiday-switch">Decorations</label>
          <input
            id="holiday-switch"
            type="checkbox"
            role="switch"
            className="switch"
            checked={!off}
            onChange={toggle}
          />
        </div>
      </div>
    </div>
  );
}
