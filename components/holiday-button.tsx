"use client";

import { useEffect, useRef, useState } from "react";
import { SparklesIcon } from "@heroicons/react/24/outline";
import { HOLIDAY_INFO } from "@/lib/holiday-info";
import { useHoliday } from "@/lib/use-holiday";

/**
 * The header button that explains and controls the seasonal decorations. It
 * sits beside the theme toggle and shows only while a holiday is on. Its
 * popover says which holiday it is, says what it is in a line, links to read
 * more and has the switch for the decorations. The button carries the
 * holiday's name ("Diwali", or "Diwali off") so nobody has to guess what the
 * icon means; the first-visit banner (holiday-banner.tsx) points people to it.
 */
export default function HolidayButton() {
  const { holiday, off, toggle } = useHoliday();
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const away = (e: PointerEvent) => {
      if (!root.current?.contains(e.target as Node)) setOpen(false);
    };
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
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
        onClick={() => setOpen((o) => !o)}
        className={`flex h-9 shrink-0 items-center gap-1.5 bg-card hover:bg-surface-hover hover:text-interactive-ink border border-line rounded-full pl-2 pr-3 transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-interactive-ink ${off ? "text-ink-soft" : "text-interactive-ink"}`}
      >
        <SparklesIcon className="size-5 shrink-0 cursor-pointer" />
        <span className="max-w-28 cursor-pointer truncate text-xs font-medium sm:max-w-none">
          {holiday.label}
          {off && " off"}
        </span>
      </button>
      <div
        id="holiday-panel"
        role="group"
        aria-label={`About the ${holiday.label} decorations`}
        // The panel stays mounted so it can shrink back toward the button.
        className={`absolute inset-x-6 top-full mt-3 origin-top-right sm:inset-x-auto sm:right-0 sm:w-72 rounded-xl border border-line bg-card p-4 text-sm text-ink shadow-lg transition-[opacity,transform,visibility] duration-200 ease-out motion-reduce:transition-none ${open ? "visible scale-100 opacity-100" : "invisible scale-50 opacity-0"}`}
      >
        <p className="font-semibold">{holiday.label}</p>
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
        <div className="mt-3 flex items-center justify-between gap-3">
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
