"use client";

import { useEffect } from "react";
import HolidayArt from "@/components/holiday";
import { useHoliday } from "@/lib/use-holiday";

/**
 * Switches on a seasonal overlay: sets `data-holiday` on <html> and draws that
 * holiday's decorations (components/holiday/, styled in app/holiday.css).
 * Everything is fixed, decorative and non-interactive, so it never shifts
 * layout or covers anything clickable, and it holds still under
 * prefers-reduced-motion. The header button explains it and lets visitors turn it
 * off (components/holiday-button.tsx).
 */
export default function HolidayTheme() {
  const { holiday, day, off } = useHoliday();
  const shown = holiday && !off ? holiday : null;

  useEffect(() => {
    if (!shown) return;
    const root = document.documentElement;
    root.dataset.holiday = shown.id;
    // Keep the art below the sticky header so it never covers the logo or the
    // theme toggle: the decorations hang from the header's bottom edge. The
    // offset is set once (and on resize) and never animated: moving a fixed
    // layer's `top` counts as layout shift, which Lighthouse scores.
    const header = document.querySelector("header");
    const measure = () =>
      root.style.setProperty("--hx-top", `${header?.offsetHeight ?? 87}px`);
    measure();
    const ro = header ? new ResizeObserver(measure) : null;
    if (header) ro?.observe(header);
    return () => {
      ro?.disconnect();
      root.style.removeProperty("--hx-top");
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
