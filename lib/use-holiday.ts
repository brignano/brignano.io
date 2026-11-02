"use client";

import { useCallback, useEffect, useState } from "react";
import {
  HOLIDAYS,
  activeHoliday,
  dayInWindow,
  type Holiday,
} from "@/lib/holidays";

const KEY = "holiday-themes";
const EVENT = "holiday-themes-change";

/**
 * Today's holiday theme, if any, and whether the visitor has turned themes off
 * (remembered in localStorage). The date is only known on the client, so this is
 * `null` until after hydration and the statically generated pages stay cacheable.
 *
 * Preview any theme with `?holiday=<id>` (and `&day=N` for how far in);
 * `?holiday=off` forces none.
 */
export function useHoliday() {
  const [found, setFound] = useState<{ holiday: Holiday | null; day: number }>({
    holiday: null,
    day: 0,
  });
  const [off, setOff] = useState(false);

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
    const read = () => {
      try {
        setOff(localStorage.getItem(KEY) === "off");
      } catch {
        /* storage blocked: themes stay on */
      }
    };
    /* eslint-disable react-hooks/set-state-in-effect -- the date and storage are only known on the client */
    setFound({ holiday, day });
    read();
    /* eslint-enable react-hooks/set-state-in-effect */
    window.addEventListener(EVENT, read);
    return () => window.removeEventListener(EVENT, read);
  }, []);

  const toggle = useCallback(() => {
    try {
      if (localStorage.getItem(KEY) === "off") localStorage.removeItem(KEY);
      else localStorage.setItem(KEY, "off");
    } catch {
      /* storage blocked: nothing to remember */
    }
    window.dispatchEvent(new Event(EVENT));
  }, []);

  return { ...found, off, toggle };
}
