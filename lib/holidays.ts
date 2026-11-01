// Seasonal holiday themes. Each entry is a date window; the visitor's own
// calendar date decides which (if any) is live, so a theme switches on and off
// by itself — nothing to deploy, and no stale banner in January.
//
// To add a holiday: add an entry here and a matching
// `html[data-holiday="<id>"]` block in app/globals.css. Colours there must come
// from design tokens (no new hex values).

export type Holiday = {
  id: string;
  label: string;
  /** First and last day (inclusive) the theme shows, for the given year. */
  window: (year: number) => { start: Date; end: Date };
};

/** The nth (1-based) given weekday (0 = Sunday) of a month (0 = January). */
function nthWeekday(year: number, month: number, weekday: number, n: number) {
  const first = new Date(year, month, 1).getDay();
  return new Date(year, month, 1 + ((weekday - first + 7) % 7) + (n - 1) * 7);
}

export const HOLIDAYS: readonly Holiday[] = [
  {
    // US Thanksgiving is the 4th Thursday of November: show the week before it
    // through the weekend after.
    id: "thanksgiving",
    label: "Happy Thanksgiving",
    window: (year) => {
      const day = nthWeekday(year, 10, 4, 4);
      return {
        start: new Date(year, 10, day.getDate() - 7),
        end: new Date(year, 10, day.getDate() + 3),
      };
    },
  },
  {
    id: "winter",
    label: "Happy holidays",
    window: (year) => ({
      start: new Date(year, 11, 15),
      end: new Date(year, 11, 31),
    }),
  },
];

/** The holiday whose window contains `date`, or null. Ranges are inclusive. */
export function activeHoliday(
  date: Date,
  holidays: readonly Holiday[] = HOLIDAYS,
): Holiday | null {
  const day = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  for (const h of holidays) {
    const { start, end } = h.window(day.getFullYear());
    if (day >= start && day <= end) return h;
  }
  return null;
}
