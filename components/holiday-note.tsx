"use client";

import { OPEN_EVENT } from "@/components/holiday-greeting";
import { useHoliday } from "@/lib/use-holiday";

/**
 * The footer line that explains the decorations — "Dressed up for Diwali" — and
 * lets a visitor turn them off. Real text, so screen readers get it too (the art
 * itself is hidden from them). Renders nothing outside a holiday.
 */
export default function HolidayNote() {
  const { holiday, off, toggle } = useHoliday();
  if (!holiday) return null;
  return (
    <small className="text-ink-soft">
      {off ? "Holiday decorations are off" : `Dressed up for ${holiday.label}`}
      {" · "}
      <button
        type="button"
        onClick={() => window.dispatchEvent(new Event(OPEN_EVENT))}
        className="cursor-pointer underline underline-offset-2 hover:text-ink focus-visible:ring-2 focus-visible:ring-interactive-ink rounded-sm"
      >
        What&apos;s this?
      </button>
      {" · "}
      <button
        type="button"
        onClick={toggle}
        className="cursor-pointer underline underline-offset-2 hover:text-ink focus-visible:ring-2 focus-visible:ring-interactive-ink rounded-sm"
      >
        {off ? "Turn on" : "Turn off"}
      </button>
    </small>
  );
}
