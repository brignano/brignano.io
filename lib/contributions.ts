// GitHub contribution data for the calendar graphs, from the same public API
// react-github-calendar used (https://github.com/grubersjoe/github-contributions-api).
// Shared by the server (app/coding, revalidated) and the browser (the homepage
// preview), so it must stay free of Node-only imports.

export type ContributionLevel = 0 | 1 | 2 | 3 | 4;

export interface ContributionDay {
  /** ISO date, YYYY-MM-DD. */
  date: string;
  count: number;
  /** GitHub's own 0–4 intensity bucket. */
  level: ContributionLevel;
}

export interface ContributionYear {
  year: number;
  total: number;
  days: ContributionDay[];
}

const API_BASE = "https://github-contributions-api.jogruber.de/v4";

export function contributionsUrl(username: string, year: number) {
  return `${API_BASE}/${encodeURIComponent(username)}?y=${year}`;
}

/** Validate and normalise the API's JSON. Throws on anything unexpected. */
export function parseContributions(json: unknown, year: number): ContributionYear {
  const data = json as {
    total?: Record<string, number>;
    contributions?: { date?: string; count?: number; level?: number }[];
  };
  if (!data || !Array.isArray(data.contributions)) {
    throw new Error("Unexpected contributions payload");
  }
  const days: ContributionDay[] = data.contributions
    .filter((d) => typeof d.date === "string" && d.date.startsWith(`${year}-`))
    .map((d) => ({
      date: d.date as string,
      count: Math.max(0, Math.round(d.count ?? 0)),
      level: Math.min(4, Math.max(0, Math.round(d.level ?? 0))) as ContributionLevel,
    }))
    .sort((a, b) => (a.date < b.date ? -1 : 1));
  const total =
    data.total?.[String(year)] ?? days.reduce((sum, d) => sum + d.count, 0);
  return { year, total, days };
}

/**
 * Fetch one year. `init` lets the server pass Next's cache options
 * (`{ next: { revalidate } }`); the browser passes nothing.
 */
export async function fetchContributions(
  username: string,
  year: number,
  init?: RequestInit
): Promise<ContributionYear> {
  const res = await fetch(contributionsUrl(username, year), init);
  if (!res.ok) throw new Error(`Contributions API ${res.status}`);
  return parseContributions(await res.json(), year);
}

export interface RecentContributions {
  total: number;
  days: ContributionDay[];
}

const DAY_MS = 86_400_000;

/**
 * The latest `weeks` whole weeks (Sunday to today), stitched across the turn
 * of the year from the per-year API. The window opens on a Sunday so the grid
 * starts on a full column, and stops at `today` so the right edge is this week
 * rather than the empty rest of the year.
 */
export async function fetchRecentContributions(
  username: string,
  weeks: number,
  init?: RequestInit,
  now = new Date()
): Promise<RecentContributions> {
  const today = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
  const thisSunday = today - new Date(today).getUTCDay() * DAY_MS;
  const start = thisSunday - (weeks - 1) * 7 * DAY_MS;
  const startIso = new Date(start).toISOString().slice(0, 10);
  const todayIso = new Date(today).toISOString().slice(0, 10);

  const firstYear = new Date(start).getUTCFullYear();
  const lastYear = now.getUTCFullYear();
  const years: number[] = [];
  for (let y = firstYear; y <= lastYear; y++) years.push(y);

  const results = await Promise.all(
    years.map((y) => fetchContributions(username, y, init))
  );
  const days = results
    .flatMap((r) => r.days)
    .filter((d) => d.date >= startIso && d.date <= todayIso);
  return { total: days.reduce((sum, d) => sum + d.count, 0), days };
}
