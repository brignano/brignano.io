// Seasonal holiday themes. Each entry is a set of date windows; the visitor's
// own calendar date decides which (if any) is live, so a theme switches on and
// off by itself — nothing to deploy, and no stale decoration a month later.
//
// When windows overlap (Hanukkah and the winter lights, Kwanzaa and New Year's,
// Pride and Juneteenth) the visitor gets one of them, alternating by day, so
// the site keeps changing instead of always favouring the same holiday.
//
// To add a holiday: add an entry here, its art in components/holiday-art.tsx,
// and its styles in app/globals.css. Colours there must come from design
// tokens (no new hex values). Skip solemn observances (Yom Kippur, Ramadan,
// Good Friday…): a festive overlay would be wrong for them.

export type Range = { start: Date; end: Date };

export type Holiday = {
  id: string;
  label: string;
  /** Every window (inclusive) the theme shows in, for the given year. */
  windows: (year: number) => Range[];
};

const day = (y: number, m: number, d: number) => new Date(y, m, d);
const shift = (d: Date, days: number) =>
  new Date(d.getFullYear(), d.getMonth(), d.getDate() + days);
const around = (d: Date, before: number, after: number): Range => ({
  start: shift(d, -before),
  end: shift(d, after),
});

/** The nth (1-based) given weekday (0 = Sunday) of a month (0 = January). */
function nthWeekday(year: number, month: number, weekday: number, n: number) {
  const first = new Date(year, month, 1).getDay();
  return new Date(year, month, 1 + ((weekday - first + 7) % 7) + (n - 1) * 7);
}

/** Western Easter Sunday (anonymous Gregorian algorithm). */
function easter(year: number) {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const dayOfMonth = ((h + l - 7 * m + 114) % 31) + 1;
  return day(year, month - 1, dayOfMonth);
}

/**
 * Gregorian days in `year` (between two [month, day] pairs) whose date in
 * another calendar matches. Browsers ship these calendars, so lunar and
 * lunisolar holidays need no date table. Returns [] if the runtime lacks one.
 */
function inCalendar(
  year: number,
  calendar: string,
  from: [number, number],
  to: [number, number],
  options: Intl.DateTimeFormatOptions,
  match: (parts: Record<string, string>) => boolean,
): Date[] {
  try {
    const fmt = new Intl.DateTimeFormat(`en-u-ca-${calendar}`, options);
    const out: Date[] = [];
    for (
      let d = day(year, from[0], from[1]);
      d <= day(year, to[0], to[1]);
      d = shift(d, 1)
    ) {
      const parts = Object.fromEntries(
        fmt.formatToParts(d).map((p) => [p.type, p.value]),
      );
      if (match(parts)) out.push(d);
    }
    return out;
  } catch {
    return [];
  }
}

// Hindu festival dates follow a calendar the browser doesn't have, so they are
// listed by hand: the main day of each. Windows are generous (a day either way)
// because sources differ by a day. Years not listed get no theme; add more.
const DIWALI: Record<number, [number, number]> = {
  2026: [10, 8],
  2027: [9, 29],
  2028: [9, 17],
  2029: [10, 5],
  2030: [9, 26],
};
const HOLI: Record<number, [number, number]> = {
  2026: [2, 4],
  2027: [2, 22],
  2028: [2, 11],
  2029: [2, 1],
  2030: [2, 20],
};

const fromTable = (table: Record<number, [number, number]>, year: number) => {
  const md = table[year];
  return md ? day(year, md[0], md[1]) : null;
};

export const HOLIDAYS: readonly Holiday[] = [
  {
    // US Thanksgiving is the 4th Thursday of November: the week before it
    // through the weekend after.
    id: "thanksgiving",
    label: "Thanksgiving",
    windows: (y) => [around(nthWeekday(y, 10, 4, 4), 7, 3)],
  },
  {
    // Deliberately generic: lights and snow, no tree, cross or other symbol.
    id: "winter",
    label: "Winter holidays",
    windows: (y) => [{ start: day(y, 11, 15), end: day(y, 11, 25) }],
  },
  {
    // Eight nights from 25 Kislev.
    id: "hanukkah",
    label: "Hanukkah",
    windows: (y) =>
      inCalendar(
        y,
        "hebrew",
        [10, 15],
        [11, 31],
        { month: "long", day: "numeric" },
        (p) => p.month === "Kislev" && p.day === "25",
      ).map((d) => around(d, 1, 8)),
  },
  {
    // Seven days, Dec 26 – Jan 1.
    id: "kwanzaa",
    label: "Kwanzaa",
    windows: (y) => [{ start: day(y, 11, 26), end: day(y + 1, 0, 1) }],
  },
  {
    // Spans the year boundary: Dec 26 of `y` through Jan 2 of `y + 1`.
    id: "new-year",
    label: "New Year",
    windows: (y) => [{ start: day(y, 11, 26), end: day(y + 1, 0, 2) }],
  },
  {
    id: "lunar-new-year",
    label: "Lunar New Year",
    // Through the Lantern Festival, 15 days in.
    windows: (y) =>
      inCalendar(
        y,
        "chinese",
        [0, 10],
        [2, 5],
        { month: "numeric", day: "numeric" },
        (p) => p.month === "1" && p.day === "1",
      ).map((d) => around(d, 2, 14)),
  },
  {
    id: "valentines",
    label: "Valentine's Day",
    windows: (y) => [{ start: day(y, 1, 7), end: day(y, 1, 14) }],
  },
  {
    id: "holi",
    label: "Holi",
    windows: (y) => {
      const d = fromTable(HOLI, y);
      return d ? [around(d, 2, 1)] : [];
    },
  },
  {
    id: "st-patricks",
    label: "St. Patrick's Day",
    windows: (y) => [{ start: day(y, 2, 10), end: day(y, 2, 17) }],
  },
  {
    id: "eid-al-fitr",
    label: "Eid al-Fitr",
    windows: (y) =>
      inCalendar(
        y,
        "islamic-umalqura",
        [0, 1],
        [11, 31],
        { month: "numeric", day: "numeric" },
        (p) => p.month === "10" && p.day === "1",
      ).map((d) => around(d, 1, 3)),
  },
  {
    // Western Easter: the week leading up to it through Easter Monday.
    id: "easter",
    label: "Easter",
    windows: (y) => [around(easter(y), 7, 1)],
  },
  {
    id: "eid-al-adha",
    label: "Eid al-Adha",
    windows: (y) =>
      inCalendar(
        y,
        "islamic-umalqura",
        [0, 1],
        [11, 31],
        { month: "numeric", day: "numeric" },
        (p) => p.month === "12" && p.day === "10",
      ).map((d) => around(d, 1, 3)),
  },
  {
    id: "pride",
    label: "Pride Month",
    windows: (y) => [{ start: day(y, 5, 1), end: day(y, 5, 30) }],
  },
  {
    id: "juneteenth",
    label: "Juneteenth",
    windows: (y) => [{ start: day(y, 5, 15), end: day(y, 5, 19) }],
  },
  {
    id: "independence-day",
    label: "Fourth of July",
    windows: (y) => [{ start: day(y, 5, 28), end: day(y, 6, 5) }],
  },
  {
    id: "halloween",
    label: "Halloween",
    windows: (y) => [{ start: day(y, 9, 17), end: day(y, 10, 1) }],
  },
  {
    // Five days of the festival of lights.
    id: "diwali",
    label: "Diwali",
    windows: (y) => {
      const d = fromTable(DIWALI, y);
      return d ? [around(d, 2, 3)] : [];
    },
  },
];

/** Every holiday whose window contains `date` (ranges are inclusive). */
export function activeHolidays(
  date: Date,
  holidays: readonly Holiday[] = HOLIDAYS,
): Holiday[] {
  const today = day(date.getFullYear(), date.getMonth(), date.getDate());
  // Also try last year's windows, so one that spans New Year's still matches
  // in early January.
  const years = [today.getFullYear(), today.getFullYear() - 1];
  return holidays.filter((h) =>
    years.some((y) =>
      h.windows(y).some(({ start, end }) => today >= start && today <= end),
    ),
  );
}

/**
 * The holiday to show today, or null. With several open at once, alternates by
 * day of year so each gets its turn.
 */
export function activeHoliday(
  date: Date,
  holidays: readonly Holiday[] = HOLIDAYS,
): Holiday | null {
  const open = activeHolidays(date, holidays);
  if (open.length === 0) return null;
  const doy = Math.floor(
    (day(date.getFullYear(), date.getMonth(), date.getDate()).getTime() -
      day(date.getFullYear(), 0, 0).getTime()) /
      86_400_000,
  );
  return open[doy % open.length];
}
