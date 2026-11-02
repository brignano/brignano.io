"use client";

import { useEffect, useState } from "react";
import { HOLIDAYS, activeHoliday, type Holiday } from "@/lib/holidays";
import HolidayArt from "@/components/holiday-art";

/**
 * Switches on a seasonal overlay: sets `data-holiday` on <html> and draws that
 * holiday's decorations (components/holiday-art.tsx, styled in app/globals.css).
 * Everything is fixed, decorative and non-interactive, so it never shifts
 * layout or covers anything clickable, and it holds still under
 * prefers-reduced-motion. Runs
 * after hydration so the statically generated pages stay cacheable and the
 * first paint is unchanged.
 *
 * Preview any theme with `?holiday=<id>`; `?holiday=off` forces none.
 */
export default function HolidayTheme() {
  const [holiday, setHoliday] = useState<Holiday | null>(null);

  useEffect(() => {
    const override = new URLSearchParams(window.location.search).get("holiday");
    const found =
      override === null
        ? activeHoliday(new Date())
        : (HOLIDAYS.find((h) => h.id === override) ?? null);
    // eslint-disable-next-line react-hooks/set-state-in-effect -- the date is only known on the client
    setHoliday(found);
  }, []);

  useEffect(() => {
    if (!holiday) return;
    const root = document.documentElement;
    root.dataset.holiday = holiday.id;
    return () => {
      delete root.dataset.holiday;
    };
  }, [holiday]);

  if (!holiday) return null;
  return (
    <div className="holiday-art" aria-hidden="true">
      <HolidayArt id={holiday.id} />
    </div>
  );
}
