"use client";

import { useEffect, useState } from "react";
import { HOLIDAYS, activeHoliday, type Holiday } from "@/lib/holidays";

/**
 * Switches on a seasonal accent: sets `data-holiday` on <html> (the top strip is
 * pure CSS in app/globals.css) and shows a small greeting pill, bottom-left.
 * Both are fixed and non-interactive, so they never shift layout or cover
 * anything clickable, and both stay still under prefers-reduced-motion. Runs
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
    <div className="holiday-pill" role="status">
      <span aria-hidden="true">{holiday.emoji}</span> {holiday.label}
    </div>
  );
}
