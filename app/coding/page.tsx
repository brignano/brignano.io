const WAKATIME_API_BASE = "https://wakatime.com/api/v1";

import type {
  WakaTimeAllTimeStats,
  WakaTimeApiResponse,
  WakaTimeUser,
  StatsData,
} from "@/types/wakatime";
import LanguageBars from "@/components/stats/language-bars";
import CodingHero, {
  CodingHeroUnavailable,
} from "@/components/stats/coding-hero";
import WakaTimeLink from "@/components/stats/wakatime-link";
import DisclaimerLink from "@/components/github-disclaimer-link";
import ContributionGraph from "@/components/contribution-graph";
import BreadcrumbSchema from "@/components/breadcrumb-schema";
import { CODING_HEADING, nowBuilding } from "@/lib/constants";
import { fetchLatestPublicCommit, LatestCommit } from "@/lib/github";
import LocalTime from "../../components/local-time";

const CODING_BREADCRUMBS = [
  {
    name: "Home",
    url: "https://brignano.io",
  },
  {
    name: "Coding",
    url: "https://brignano.io/coding",
  },
];

/**
 * WakaTime only accepts OAuth access tokens (`waka_tok_…`) for reading data.
 * The account's secret API key is now write-only, for editor plugins, and the
 * API answers it with a 403. Use the personal token from
 * https://wakatime.com/oauth, sent as a Bearer token.
 */
function wakaToken() {
  return process.env.WAKATIME_ACCESS_TOKEN || process.env.WAKATIME_API_KEY;
}

async function fetchWaka(path: string, revalidate = 60 * 5) {
  const token = wakaToken();
  if (!token) {
    throw new Error("Missing WAKATIME_ACCESS_TOKEN environment variable");
  }
  if (!token.startsWith("waka_tok_")) {
    console.warn(
      "[coding] WakaTime token does not look like an OAuth token (waka_tok_…). " +
        "Plugin API keys are rejected; get one at https://wakatime.com/oauth"
    );
  }

  const url = `${WAKATIME_API_BASE}${path}`;
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      "User-Agent": "brignano.io-wakatime-stats",
    },
    next: { revalidate },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`WakaTime API error ${res.status}: ${text}`);
  }

  return res.json();
}

async function safeFetch<T>(path: string, revalidate?: number) {
  try {
    return { data: (await fetchWaka(path, revalidate)) as T, error: null };
  } catch (e) {
    // Without this the page quietly shows its fallback and the cause never
    // reaches the Vercel logs.
    console.error(`[coding] WakaTime fetch ${path} failed:`, e);
    return { data: null, error: e as Error };
  }
}

// Additional rendering helpers and local types

function splitMessage(message?: string | null) {
  if (!message) return { subject: "", bodyLines: [] as string[] };
  const lines = message.split(/\r?\n/);
  const subject = (lines[0] || "").trim();
  const rest = lines.slice(1);
  // Trim leading/trailing empty lines from body
  while (rest.length && rest[0].trim() === "") rest.shift();
  while (rest.length && rest[rest.length - 1].trim() === "") rest.pop();
  return { subject, bodyLines: rest };
}

function shortSha(sha?: string | null) {
  if (!sha) return "";
  return sha.substring(0, 7);
}

async function fetchCommitDetails(repoFullName: string, sha: string) {
  try {
    const url = `https://api.github.com/repos/${repoFullName}/commits/${sha}`;
    const res = await fetch(url, {
      headers: {
        "User-Agent": "brignano.io-commit-fetch",
        Accept: "application/vnd.github+json",
      },
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export default async function Page() {
  const userResp =
    await safeFetch<WakaTimeApiResponse<WakaTimeUser>>("/users/current");
  const allTimeResp = await safeFetch<
    WakaTimeApiResponse<WakaTimeAllTimeStats>
  >("/users/current/stats/all_time");

  const user = userResp?.data?.data ?? null;
  const allTime = allTimeResp?.data?.data ?? null;

  const languages: StatsData[] = Array.isArray(allTime?.languages)
    ? allTime.languages.map((l) => ({
        name: l.name,
        seconds: l.total_seconds ?? l.seconds ?? 0,
      }))
    : [];

  // Only languages are shown. Editors, operating systems and activity types
  // were cut in Nov 2026: they describe the tools, not the work. Projects are
  // never shown; they include confidential enterprise project names.
  const bestDay = allTime?.best_day ?? null;

  // Total coding time from languages (fallback if all_time endpoint provided it differently)
  const totalSecondsFromLanguages = languages.reduce(
    (s, l) => s + (l.seconds || 0),
    0
  );
  const totalHoursReadable = Number(
    (totalSecondsFromLanguages / 3600).toFixed(1)
  );
  // Prefer the human-readable all_time value when available (includes "Other" language)
  const totalTimeText =
    allTime?.human_readable_total_including_other_language ||
    `${totalHoursReadable} hours`;
  // Prefer the human-readable daily average when available; fall back to computed value
  const dailyAverageText =
    allTime?.human_readable_daily_average_including_other_language ||
    allTime?.human_readable_daily_average ||
    (() => {
      const days = allTime?.days_including_holidays || 1;
      const avgSec = days > 0 ? totalSecondsFromLanguages / days : 0;
      const hrs = Math.floor(avgSec / 3600);
      const mins = Math.round((avgSec % 3600) / 60);
      if (hrs > 0) return `${hrs} hrs ${mins} mins`;
      if (mins > 0) return `${mins} mins`;
      return "0 secs";
    })();

  // Range helper text from all_time (e.g. "since Dec 11 2020")
  const rangeText = allTime?.human_readable_range || null;
  const trackingSince = rangeText
    ? rangeText.replace(/^since\s+/i, "").trim()
    : null;
  const totalSeconds =
    allTime?.total_seconds_including_other_language ??
    allTime?.total_seconds ??
    (totalSecondsFromLanguages || null);
  const totalHours = totalSeconds ? Math.round(totalSeconds / 3600) : null;

  // Compute a link to the user's WakaTime profile when available
  const wakaProfile = (() => {
    if (!user) return null;
    // try common properties returned by the WakaTime API
    return (
      user.url ??
      user.profile_url ??
      (user.username ? `https://wakatime.com/@${user.username}` : null)
    );
  })();

  // fetch latest public commit (server-side)
  const latestCommitRaw: LatestCommit | null =
    await fetchLatestPublicCommit();
  let latestCommit: LatestCommit | null = latestCommitRaw;
  if (latestCommitRaw?.repo && latestCommitRaw?.sha) {
    const details = await fetchCommitDetails(
      latestCommitRaw.repo,
      latestCommitRaw.sha
    );
    if (details) {
      latestCommit = {
        sha: latestCommitRaw.sha,
        repo: latestCommitRaw.repo,
        url: latestCommitRaw.url,
        message: details.commit?.message || latestCommitRaw.message,
        author_name:
          details.commit?.author?.name || latestCommitRaw.author_name,
        author_login: details.author?.login || latestCommitRaw.author_login,
        author_avatar:
          details.author?.avatar_url || latestCommitRaw.author_avatar,
        date: details.commit?.author?.date || latestCommitRaw.date,
        filesChanged: Array.isArray(details.files)
          ? details.files.length
          : undefined,
        additions: details.stats?.additions ?? undefined,
        deletions: details.stats?.deletions ?? undefined,
      } as LatestCommit;
    }
  }

  // Only the subject line shows; the body stays on GitHub.
  const commitSubject = latestCommit
    ? splitMessage(latestCommit.message).subject
    : "";

  return (
    <>
      <BreadcrumbSchema items={CODING_BREADCRUMBS} />
      <main className="max-w-6xl mx-auto md:px-16 px-6 pt-0 pb-12">
        <header
          data-aos="fade-up"
          data-aos-duration="600"
          data-aos-once="true"
        >
          <p className="font-display uppercase tracking-[0.18em] text-[11px] text-slate">
            Coding
          </p>
          <h1 className="mt-1 font-sans text-4xl sm:text-5xl font-bold tracking-tight">
            {CODING_HEADING}
          </h1>
        </header>

        <section
          aria-label="Editor time"
          data-aos="fade-up"
          data-aos-duration="600"
          data-aos-once="true"
          data-aos-delay="100"
          className="mt-6"
        >
          {allTime ? (
            <CodingHero
              totalHours={totalHours}
              totalTimeText={totalTimeText}
              dailyAverageText={dailyAverageText}
              trackingSince={trackingSince}
              bestDay={bestDay}
              nowBuilding={nowBuilding}
            />
          ) : (
            <CodingHeroUnavailable nowBuilding={nowBuilding} />
          )}
        </section>

        <div className="mt-12 md:mt-16 grid gap-12 lg:grid-cols-2 lg:gap-16 items-start">
          {languages.length > 0 && (
            <section
              aria-labelledby="languages"
              data-aos="fade-up"
              data-aos-duration="700"
              data-aos-once="true"
              data-aos-delay="150"
              className="min-w-0"
            >
              <h2
                id="languages"
                className="font-sans text-2xl font-bold tracking-tight"
              >
                Languages
              </h2>
              <p className="mt-0.5 mb-4 text-sm text-slate">
                Hours in the editor, all time
              </p>
              <LanguageBars data={languages} />
            </section>
          )}

          <section
            aria-labelledby="on-github"
            data-aos="fade-up"
            data-aos-duration="700"
            data-aos-once="true"
            data-aos-delay="200"
            className="min-w-0"
          >
            <h2
              id="on-github"
              className="font-sans text-2xl font-bold tracking-tight"
            >
              On GitHub
            </h2>
            <p className="mt-0.5 mb-4 text-sm text-slate">The public part</p>

            {latestCommit && (
              /* `break-words` + `min-w-0`: a commit subject can carry an
                 unbreakable token (a long path) that would otherwise make
                 the page scroll sideways on a phone. The subject link is
                 `self-start` so its tap area is its text, not the whole row
                 out to where the chat button floats. */
              <div className="mb-5 flex min-w-0 flex-col gap-0.5 break-words border-y border-line py-3">
                <p className="font-display uppercase tracking-[0.18em] text-[11px] text-slate">
                  Last commit
                </p>
                <a
                  href={String(latestCommit.url)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="self-start font-semibold text-ink hover:underline"
                >
                  {commitSubject || shortSha(latestCommit.sha)}
                </a>
                <p className="flex flex-wrap items-baseline gap-x-3 gap-y-0.5 text-sm text-slate">
                  <a
                    href={`https://github.com/${latestCommit.repo}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-ink-soft hover:underline"
                  >
                    {latestCommit.repo}
                  </a>
                  {latestCommit.date && (
                    <LocalTime iso={latestCommit.date} className="" />
                  )}
                  {typeof latestCommit.additions === "number" &&
                    typeof latestCommit.deletions === "number" && (
                      <span className="tabular-nums">
                        <span className="text-success-ink">
                          +{latestCommit.additions}
                        </span>{" "}
                        <span className="text-danger-ink">
                          −{latestCommit.deletions}
                        </span>
                      </span>
                    )}
                </p>
              </div>
            )}

            <ContributionGraph />
          </section>
        </div>

        <p className="mt-12 text-sm text-slate">
          Editor time from <WakaTimeLink url={wakaProfile} />. Commits and
          contributions from <DisclaimerLink />.
        </p>
      </main>
    </>
  );
}
