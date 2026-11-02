"use client";

import { useEffect } from "react";
import HolidayArt from "@/components/holiday";
import { useHoliday } from "@/lib/use-holiday";

/**
 * Switches on a seasonal overlay: sets `data-holiday` on <html> and draws that
 * holiday's decorations (components/holiday/, styled in app/holiday.css).
 * Everything is fixed, decorative and non-interactive, so it never shifts
 * layout or covers anything clickable, and it holds still under
 * prefers-reduced-motion. The footer says what it is and lets visitors turn it
 * off (components/footer.tsx).
 */
export default function HolidayTheme() {
  const { holiday, day, off } = useHoliday();
  const shown = holiday && !off ? holiday : null;

  useEffect(() => {
    if (!shown) return;
    const root = document.documentElement;
    root.dataset.holiday = shown.id;
    return () => {
      delete root.dataset.holiday;
    };
  }, [shown]);

  if (!shown) return null;
  return (
    <div className="holiday-art" aria-hidden="true">
      <HolidayArt id={shown.id} day={day} />
    </div>
  );
}
