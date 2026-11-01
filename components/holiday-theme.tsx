"use client";

import { useEffect } from "react";
import { HOLIDAYS, activeHoliday } from "@/lib/holidays";

/**
 * Switches on a seasonal accent by setting `data-holiday` on <html>; the look
 * itself is pure CSS in app/globals.css (a thin, non-interactive strip along the
 * top edge, still under prefers-reduced-motion). Runs after hydration so the
 * statically generated pages stay cacheable and the first paint is unchanged.
 *
 * Preview any theme with `?holiday=<id>`; `?holiday=off` forces none.
 */
export default function HolidayTheme() {
  useEffect(() => {
    const root = document.documentElement;
    const override = new URLSearchParams(window.location.search).get("holiday");
    const holiday =
      override === null
        ? activeHoliday(new Date())
        : (HOLIDAYS.find((h) => h.id === override) ?? null);

    if (!holiday) return;
    root.dataset.holiday = holiday.id;
    return () => {
      delete root.dataset.holiday;
    };
  }, []);

  return null;
}
