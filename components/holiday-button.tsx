"use client";

import { useEffect, useRef, useState } from "react";
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
  const [open, setOpen] = useState(false);
  const [fresh, setFresh] = useState(false);
  const root = useRef<HTMLDivElement>(null);

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

  const close = () => setOpen(false);
  const show = () => {
    setOpen(true);
    setFresh(false);
    try {
      localStorage.setItem(SEEN, key);
    } catch {
      /* storage blocked: the dot returns next visit */
    }
  };

  useEffect(() => {
    if (!open) return;
    const away = (e: PointerEvent) => {
      if (!root.current?.contains(e.target as Node)) close();
    };
    const esc = (e: KeyboardEvent) => e.key === "Escape" && close();
    document.addEventListener("pointerdown", away);
    document.addEventListener("keydown", esc);
    return () => {
      document.removeEventListener("pointerdown", away);
      document.removeEventListener("keydown", esc);
    };
  }, [open]);

  if (!holiday) return null;
  const info = HOLIDAY_INFO[holiday.id];
  return (
    <div ref={root} className="shrink-0 sm:relative">
      <button
        type="button"
        aria-expanded={open}
        aria-controls="holiday-panel"
        onClick={() => (open ? close() : show())}
        className={`flex h-9 shrink-0 items-center gap-1.5 bg-card hover:bg-surface-hover hover:text-interactive-ink border border-line rounded-full pl-2 pr-3 transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-interactive-ink ${off ? "text-ink-soft" : "text-interactive-ink"}`}
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
        role="group"
        aria-label={`About the ${holiday.label} decorations`}
        // The panel stays mounted so it can shrink back into the button.
        className={`absolute inset-x-6 top-full mt-3 origin-top-right sm:inset-x-auto sm:right-0 sm:w-80 rounded-xl border border-line bg-card p-4 text-sm text-ink shadow-lg transition-[opacity,transform,visibility] duration-200 ease-out motion-reduce:transition-none ${open ? "visible scale-100 opacity-100" : "invisible scale-50 opacity-0"}`}
      >
        <div className="flex items-start gap-2">
          <SparklesIcon className="mt-0.5 size-5 shrink-0 text-interactive-ink" />
          <p className="min-w-0 flex-1 font-semibold">
            The site is dressed up for {holiday.label}
          </p>
          <button
            type="button"
            aria-label="Close"
            onClick={close}
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
          <span id="holiday-switch-label">Decorations</span>
          <button
            type="button"
            role="switch"
            aria-checked={!off}
            aria-labelledby="holiday-switch-label"
            onClick={toggle}
            className={`relative h-6 w-11 shrink-0 cursor-pointer rounded-full border border-line transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-interactive-ink ${off ? "bg-surface-hover" : "bg-interactive-ink"}`}
          >
            <span
              className={`absolute left-0.5 top-0.5 size-4.5 rounded-full bg-card shadow transition-transform motion-reduce:transition-none ${off ? "translate-x-0" : "translate-x-5"}`}
            />
          </button>
        </div>
      </div>
    </div>
  );
}
