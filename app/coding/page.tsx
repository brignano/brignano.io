const WAKATIME_API_BASE = "https://wakatime.com/api/v1";

import type {
  WakaTimeAllTimeStats,
  WakaTimeApiResponse,
  WakaTimeUser,
  StatsData,
} from "@/types/wakatime";
import StatsPie from "../../components/stats/stats-pie";
import WakaTimeDisclaimer from "../../components/stats/wakatime-disclaimer";
import GitHubCalendarClient from "../../components/github-calendar-client";
import LocalTime from "../../components/local-time";

async function fetchWaka(path: string) {
  const apiKey = process.env.WAKATIME_API_KEY;
  if (!apiKey) {
    throw new Error("Missing WAKATIME_API_KEY environment variable");
  }

  const url = `${WAKATIME_API_BASE}${path}`;
  const res = await fetch(url, {
    headers: {
      Authorization: "Basic " + Buffer.from(`${apiKey}:`).toString("base64"),
      "User-Agent": "brignano.io-wakatime-stats",
    },
    next: { revalidate: 60 * 5 },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`WakaTime API error ${res.status}: ${text}`);
  }

  return res.json();
}

async function safeFetch<T>(path: string) {
  try {
    return { data: (await fetchWaka(path)) as T, error: null };
  } catch (e) {
    return { data: null, error: e as Error };
  }
}

async function fetchLatestPublicCommit() {
  try {
    const res = await fetch(
      "https://api.github.com/users/brignano/events/public",
      { next: { revalidate: 60 } }
    );
    if (!res.ok) return null;
    const events = await res.json();
    for (const ev of events) {
      if (ev.type === "PushEvent" && ev.payload) {
        const repo = ev.repo?.name;
        const commits = ev.payload.commits;
        const c = (commits && commits[0]) || ev.payload.head_commit;
        const head = ev.payload.head || (c && c.sha) || null;
        if (head && repo) {
          return {
            sha: head,
            message: c?.message || "",
            url: `https://github.com/${repo}/commit/${head}`,
            repo,
            // prefer the commit author name, but include actor login for linking
            author_name: c?.author?.name || null,
            author_login: ev.actor?.login || null,
            author_avatar: ev.actor?.avatar_url || null,
            date: ev.created_at || null,
          };
        }
      }
    }
    return null;
  } catch (e) {
    return null;
  }
}

// Structured type for the latest commit we render
type LatestCommit = {
  sha: string;
  message?: string | null;
  url?: string | null;
  repo?: string | null;
  author_name?: string | null;
  author_login?: string | null;
  author_avatar?: string | null;
  date?: string | null;
  filesChanged?: number | undefined;
  additions?: number | undefined;
  deletions?: number | undefined;
};

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

async function fetchReadmeLines(): Promise<string | null> {
  try {
    const res = await fetch(
      "https://raw.githubusercontent.com/brignano/brignano/main/readme.md",
      { next: { revalidate: 60 * 60 } }
    );
    if (!res.ok) return null;
    const md = await res.text();

    // Try to find a human-readable "lines" phrase (e.g. "1.80 million%20lines")
    const m = md.match(/([0-9.,]+\s*(?:%20million|k|thousand|M|K)\s*(?:%20))/i);
    if (m) return decodeURIComponent(m[1].trim());

    // Fallback: look for the shields.io badge URL and attempt to decode the badge message
    const urlMatch = md.match(/https?:\/\/img\.shields\.io\/badge\/[^)\s]+/i);
    if (urlMatch) {
      try {
        const urlStr = urlMatch[0];
        const afterBadge = urlStr.split("/badge/")[1]?.split("?")[0];
        if (afterBadge) {
          const decoded = decodeURIComponent(afterBadge);
          // Remove the trailing "-<color>" segment
          const withoutColor = decoded.replace(/-[^-]+$/, "");
          // The message is the substring after the last '-' (label-message-color format)
          const lastHyphen = withoutColor.lastIndexOf("-");
          const message =
            lastHyphen !== -1
              ? withoutColor.slice(lastHyphen + 1).trim()
              : withoutColor.trim();
          if (message) return message;
        }
      } catch (e) {
        // ignore parse errors
      }
    }
    return null;
  } catch (e) {
    return null;
  }
}

function shortSha(sha?: string | null) {
  if (!sha) return "";
  return sha.substring(0, 7);
}

function timeAgo(iso?: string | null) {
  if (!iso) return "";
  try {
    const then = new Date(iso).getTime();
    const now = Date.now();
    const diff = Math.max(0, Math.floor((now - then) / 1000));
    if (diff < 60) return `${diff}s ago`;
    const mins = Math.floor(diff / 60);
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    return `${days}d ago`;
  } catch (e) {
    return "";
  }
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
  } catch (e) {
    return null;
  }
}

export default async function Page() {
  try {
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

    const categories: StatsData[] = Array.isArray(allTime?.categories)
      ? allTime.categories.map((c) => ({
          name: c.name,
          seconds: c.total_seconds ?? c.seconds ?? 0,
        }))
      : [];

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

    // Total lines: prefer README badge fallback
    const totalLines = 0;

    // Try to read a fallback total-lines value from the repository README (badge)
    const readmeLines = await fetchReadmeLines();
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

    // Prepare subject/body for rendering (preserve body formatting)
    let commitSubject = "";
    let commitBody = "";
    if (latestCommit) {
      const parts = splitMessage(latestCommit.message);
      commitSubject = parts.subject;
      commitBody = parts.bodyLines.length ? parts.bodyLines.join("\n") : "";
    }

    return (
      <main className="max-w-6xl mx-auto md:px-16 px-6 pt-0 pb-12">
        <div className="max-w-6xl mx-auto">
          <h1
            data-aos="fade-up"
            data-aos-duration="600"
            data-aos-once="true"
            className="font-incognito text-4xl font-bold tracking-tight"
          >
            Coding Activity
          </h1>
          <div
            data-aos="fade-up"
            data-aos-duration="500"
            data-aos-once="true"
            data-aos-delay="100"
            className="mt-1 text-xs text-zinc-500 dark:text-zinc-400 italic pl-1"
          >
            ... {rangeText ?? "—"}
          </div>

          <div
            data-aos="fade-up"
            data-aos-duration="600"
            data-aos-once="true"
            data-aos-delay="150"
            className="flex flex-col sm:flex-row gap-4 items-center my-6"
          >
            <div className="bg-white dark:bg-zinc-900 border dark:border-zinc-800 border-zinc-200 rounded-md px-4 py-2 shadow-sm w-full sm:w-auto text-center sm:text-left">
              <div className="text-xs text-zinc-500">Total time coding</div>
              <div className="text-lg font-semibold">{totalTimeText}</div>
            </div>

            <div className="bg-white dark:bg-zinc-900 border dark:border-zinc-800 border-zinc-200 rounded-md px-4 py-2 shadow-sm w-full sm:w-auto text-center sm:text-left">
              <div className="text-xs text-zinc-500">Daily average</div>
              <div className="text-lg font-semibold">{dailyAverageText}</div>
            </div>

            <div className="bg-white dark:bg-zinc-900 border dark:border-zinc-800 border-zinc-200 rounded-md px-4 py-2 shadow-sm w-full sm:w-auto text-center sm:text-left">
              <div className="text-xs text-zinc-500">Total lines coded</div>
              <div className="text-lg font-semibold">{readmeLines ?? "—"}</div>
            </div>
          </div>

          {/* Last Commit Tile (server-rendered, styled like other coding tiles) */}
          {latestCommit && (
            <div
              data-aos="fade-up"
              data-aos-duration="700"
              data-aos-once="true"
              data-aos-delay="175"
              className="mb-6"
            >
              <div className="dark:bg-primary-bg bg-secondary-bg border dark:border-zinc-800 border-zinc-200 p-6 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-incognito text-2xl font-bold tracking-tight">
                    Last Commit
                  </h3>
                  <a
                    href={`https://github.com/${latestCommit.repo}/tree/${latestCommit.sha}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-1.5 border rounded bg-zinc-100 dark:bg-zinc-800 text-sm font-medium hover:bg-zinc-200 dark:hover:bg-zinc-700"
                  >
                    <svg
                      aria-hidden="true"
                      focusable="false"
                      className="octicon octicon-file-code w-4 h-4 mr-2 text-zinc-700 dark:text-zinc-200"
                      viewBox="0 0 16 16"
                      width="16"
                      height="16"
                      fill="currentColor"
                      style={{
                        display: "inline-block",
                        overflow: "visible",
                        verticalAlign: "text-bottom",
                      }}
                    >
                      <path d="M4 1.75C4 .784 4.784 0 5.75 0h5.586c.464 0 .909.184 1.237.513l2.914 2.914c.329.328.513.773.513 1.237v8.586A1.75 1.75 0 0 1 14.25 15h-9a.75.75 0 0 1 0-1.5h9a.25.25 0 0 0 .25-.25V6h-2.75A1.75 1.75 0 0 1 10 4.25V1.5H5.75a.25.25 0 0 0-.25.25v2.5a.75.75 0 0 1-1.5 0Zm1.72 4.97a.75.75 0 0 1 1.06 0l2 2a.75.75 0 0 1 0 1.06l-2 2a.749.749 0 0 1-1.275-.326.749.749 0 0 1 .215-.734l1.47-1.47-1.47-1.47a.75.75 0 0 1 0-1.06ZM3.28 7.78 1.81 9.25l1.47 1.47a.751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018l-2-2a.75.75 0 0 1 0-1.06l2-2a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042Zm8.22-6.218V4.25c0 .138.112.25.25.25h2.688l-.011-.013-2.914-2.914-.013-.011Z"></path>
                    </svg>
                    Browse files
                  </a>
                </div>
                <p className="text-sm dark:text-zinc-500 text-zinc-500 mb-4">
                  Most recent public commit on GitHub.
                </p>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <div className="flex items-start justify-between gap-4">
                      {commitSubject && (
                        <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
                          {commitSubject}
                        </div>
                      )}
                      {commitBody && (
                        <div className="mt-2 text-sm text-zinc-600 dark:text-zinc-400 whitespace-pre-wrap">
                          {commitBody}
                        </div>
                      )}
                    </div>
                    <div className="mt-2 text-sm dark:text-zinc-400 text-zinc-600 flex items-center gap-2 flex-wrap">
                      <a
                        href={`https://github.com/${latestCommit.repo}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium"
                      >
                        {latestCommit.repo}
                      </a>
                      <span className="mx-2">•</span>

                      <a
                        href={String(latestCommit.url)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center font-mono text-xs bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded"
                      >
                        <span>{shortSha(latestCommit.sha)}</span>
                        <svg
                          className="w-3 h-3 ml-2 text-zinc-700 dark:text-zinc-300"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          aria-hidden="true"
                        >
                          <path
                            d="M14 3h7v7"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M10 14L21 3"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M21 21H3V3"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </a>

                      {typeof latestCommit.filesChanged === "number" && (
                        <span className="ml-2">
                          • {latestCommit.filesChanged} files changed
                        </span>
                      )}

                      {typeof latestCommit.additions === "number" &&
                        typeof latestCommit.deletions === "number" && (
                          <span className="ml-2">
                            •
                            <span className="ml-2 text-green-600 dark:text-green-400 font-semibold">
                              +{latestCommit.additions}
                            </span>
                            <span className="ml-2 text-red-600 dark:text-red-400 font-semibold">
                              −{latestCommit.deletions}
                            </span>
                          </span>
                        )}

                      {latestCommit.author_avatar ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={latestCommit.author_avatar}
                          alt={
                            latestCommit.author_login ??
                            latestCommit.author_name ??
                            "author"
                          }
                          className="w-6 h-6 rounded-full ml-2"
                        />
                      ) : null}

                      {latestCommit.author_login ? (
                        <a
                          href={`https://github.com/${latestCommit.author_login}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="ml-2 font-medium text-primary-color hover:underline"
                        >
                          {latestCommit.author_login}
                        </a>
                      ) : latestCommit.author_name ? (
                          <span className="ml-2">
                            by {latestCommit.author_name}
                          </span>
                      ) : null}

                      {latestCommit.date && (
                        <LocalTime iso={latestCommit.date} />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div
            data-aos="fade-up"
            data-aos-duration="700"
            data-aos-once="true"
            data-aos-delay="200"
            className="mt-6"
          >
            <GitHubCalendarClient
              initialYear={2026}
              buttonSize="large"
              title="Contribution Graph"
              description={"GitHub contribution activity by year."}
              showDisclaimer={true}
            />
          </div>

          <section className="grid grid-cols-1 gap-8 mt-6">
            <div
              data-aos="fade-up"
              data-aos-duration="700"
              data-aos-once="true"
              data-aos-delay="250"
              className="dark:bg-primary-bg bg-secondary-bg border dark:border-zinc-800 border-zinc-200 p-6 rounded-lg"
            >
              <StatsPie
                data={languages}
                title="Programming Languages"
                description="Languages used in the IDE (when tracked by WakaTime)."
              />
            </div>

            <div
              data-aos="fade-up"
              data-aos-duration="700"
              data-aos-once="true"
              data-aos-delay="300"
              className="dark:bg-primary-bg bg-secondary-bg border dark:border-zinc-800 border-zinc-200 p-6 rounded-lg"
            >
              <StatsPie
                data={categories}
                title="Activity Types"
                description="Types of IDE activity (when tracked by WakaTime)."
              />
            </div>
          </section>
          <div
            data-aos="fade-up"
            data-aos-duration="700"
            data-aos-once="true"
            data-aos-delay="350"
            className="mt-6 text-sm text-zinc-600 dark:text-zinc-400 flex justify-start"
          >
            <WakaTimeDisclaimer url={wakaProfile} />
          </div>
        </div>
      </main>
    );
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    return (
      <main className="max-w-4xl mx-auto px-6 pt-0 pb-12">
        <h1 className="prose">Coding Activity</h1>
        <p>Error loading coding statistics: {errorMessage}</p>
        <p>Ensure `WAKATIME_API_KEY` is set in your environment.</p>
      </main>
    );
  }
}
