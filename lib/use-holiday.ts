"use client";

import { useCallback, useEffect, useState } from "react";
import {
  HOLIDAYS,
  activeHoliday,
  dayInWindow,
  type Holiday,
} from "@/lib/holidays";

const KEY = "holiday-themes-off";
const EVENT = "holiday-themes-change";

const readOff = (): string[] => {
  try {
    const v = JSON.parse(localStorage.getItem(KEY) ?? "[]");
    return Array.isArray(v) ? v.filter((x) => typeof x === "string") : [];
  } catch {
    return [];
  }
};

/**
 * Today's holiday theme, if any, and whether the visitor has turned that
 * holiday's decorations off (remembered per holiday in localStorage, so turning
 * one off does not silence the next). The date is only known on the client, so
 * this is `null` until after hydration and the statically generated pages stay
 * cacheable.
 *
 * Preview any theme with `?holiday=<id>` (and `&day=N` for how far in);
 * `?holiday=off` forces none.
 */
export function useHoliday() {
  const [found, setFound] = useState<{ holiday: Holiday | null; day: number }>({
    holiday: null,
    day: 0,
  });
  const [offIds, setOffIds] = useState<string[]>([]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const override = params.get("holiday");
    const now = new Date();
    const holiday =
      override === null
        ? activeHoliday(now)
        : (HOLIDAYS.find((h) => h.id === override) ?? null);
    // `?day=N` previews a later night of Hanukkah or Kwanzaa.
    const asked = Number(params.get("day"));
    const day =
      params.has("day") && Number.isFinite(asked)
        ? asked
        : holiday
          ? dayInWindow(holiday, now)
          : 0;
    const read = () => setOffIds(readOff());
    /* eslint-disable react-hooks/set-state-in-effect -- the date and storage are only known on the client */
    setFound({ holiday, day });
    read();
    /* eslint-enable react-hooks/set-state-in-effect */
    window.addEventListener(EVENT, read);
    return () => window.removeEventListener(EVENT, read);
  }, []);

  const id = found.holiday?.id;
  const off = id ? offIds.includes(id) : false;

  const toggle = useCallback(() => {
    if (!id) return;
    try {
      const ids = readOff();
      const next = ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id];
      localStorage.setItem(KEY, JSON.stringify(next));
    } catch {
      /* storage blocked: nothing to remember */
    }
    window.dispatchEvent(new Event(EVENT));
  }, [id]);

  return { ...found, off, toggle };
}
