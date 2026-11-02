"use client";

import { useEffect, useState } from "react";
import { HOLIDAYS, activeHoliday, dayInWindow, type Holiday } from "@/lib/holidays";
import HolidayArt from "@/components/holiday";

/**
 * Switches on a seasonal overlay: sets `data-holiday` on <html> and draws that
 * holiday's decorations (components/holiday/, styled in app/holiday.css).
 * Everything is fixed, decorative and non-interactive, so it never shifts
 * layout or covers anything clickable, and it holds still under
 * prefers-reduced-motion. Runs after hydration so the statically generated
 * pages stay cacheable and the first paint is unchanged.
 *
 * Preview any theme with `?holiday=<id>` (and `&day=N` for how far in);
 * `?holiday=off` forces none.
 */
export default function HolidayTheme() {
  const [holiday, setHoliday] = useState<Holiday | null>(null);
  const [day, setDay] = useState(0);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const override = params.get("holiday");
    const now = new Date();
    const found =
      override === null
        ? activeHoliday(now)
        : (HOLIDAYS.find((h) => h.id === override) ?? null);
    // `?day=N` previews a later night of Hanukkah or Kwanzaa.
    const asked = Number(params.get("day"));
    /* eslint-disable react-hooks/set-state-in-effect -- the date is only known on the client */
    setHoliday(found);
    setDay(
      params.has("day") && Number.isFinite(asked)
        ? asked
        : found
          ? dayInWindow(found, now)
          : 0,
    );
    /* eslint-enable react-hooks/set-state-in-effect */
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
      <HolidayArt id={holiday.id} day={day} />
    </div>
  );
}
