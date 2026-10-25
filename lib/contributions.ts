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
