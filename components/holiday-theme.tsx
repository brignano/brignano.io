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
    // Keep the art below the sticky header so it never covers the logo or the
    // theme toggle: the decorations hang from the header's bottom edge, and
    // slide up with it when it tucks away on scroll (and back when it returns).
    const header = document.querySelector("header");
    const measure = () => {
      // Under reduced motion the header never moves, so neither does the art.
      const tucked =
        header?.classList.contains("-translate-y-full") &&
        !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      root.style.setProperty(
        "--hx-top",
        tucked ? "0px" : `${header?.offsetHeight ?? 0}px`,
      );
    };
    measure();
    const ro = header ? new ResizeObserver(measure) : null;
    const mo = header ? new MutationObserver(measure) : null;
    if (header) {
      ro?.observe(header);
      mo?.observe(header, { attributes: true, attributeFilter: ["class"] });
    }
    return () => {
      ro?.disconnect();
      mo?.disconnect();
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
