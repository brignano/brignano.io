const WAKATIME_API_BASE = 'https://wakatime.com/api/v1'

import StatsPie from '../../components/stats/StatsPie'
import WakaTimeDisclaimer from '../../components/stats/WakaTimeDisclaimer'
// DayOfWeekChart removed to avoid premium WakaTime summaries endpoint
// HourlyChart removed: heartbeat endpoint and heartbeat-derived charts are not used

async function fetchWaka(path: string) {
  const apiKey = process.env.WAKATIME_API_KEY
  if (!apiKey) throw new Error('Missing WAKATIME_API_KEY environment variable')

  const url = `${WAKATIME_API_BASE}${path}`
  const res = await fetch(url, {
    headers: {
      Authorization: 'Basic ' + Buffer.from(`${apiKey}:`).toString('base64'),
      'User-Agent': 'brignano.io-wakatime-stats',
    },
    next: { revalidate: 60 * 5 },
  })


  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`WakaTime API error ${res.status}: ${text}`)
  }

  return res.json()
}

async function safeFetch(path: string) {
  try {
    return { data: await fetchWaka(path), error: null }
  } catch (e: any) {
    return { data: null, error: e }
  }
}

async function fetchReadmeLines(): Promise<string | null> {
  try {
    const res = await fetch('https://raw.githubusercontent.com/brignano/brignano/main/readme.md', { next: { revalidate: 60 * 60 } })
    if (!res.ok) return null
    const md = await res.text()

    // Try to find a human-readable "lines" phrase (e.g. "1.80 million%20lines")
    const m = md.match(/([0-9.,]+\s*(?:%20million|k|thousand|M|K)\s*(?:%20))/i)
    if (m) return decodeURIComponent(m[1].trim())

    // Fallback: look for the shields.io badge URL and attempt to decode the badge message
    const urlMatch = md.match(/https?:\/\/img\.shields\.io\/badge\/[^)\s]+/i)
    if (urlMatch) {
      try {
        const urlStr = urlMatch[0]
        const afterBadge = urlStr.split('/badge/')[1]?.split('?')[0]
        if (afterBadge) {
          const decoded = decodeURIComponent(afterBadge)
          // Remove the trailing "-<color>" segment
          const withoutColor = decoded.replace(/-[^-]+$/, '')
          // The message is the substring after the last '-' (label-message-color format)
          const lastHyphen = withoutColor.lastIndexOf('-')
          const message = lastHyphen !== -1 ? withoutColor.slice(lastHyphen + 1).trim() : withoutColor.trim()
          if (message) return message
        }
      } catch (e) {
        // ignore parse errors
      }
    }
    return null
  } catch (e) {
    return null
  }
}

export default async function Page() {
  try {
    const userResp = await safeFetch('/users/current')
    const allTimeResp = await safeFetch('/users/current/stats/all_time')

    const end = new Date()

    const user = userResp?.data?.data ?? null
    const allTime = allTimeResp?.data?.data ?? null

    // No premium endpoints used; summaries removed.

    const languages = Array.isArray(allTime?.languages)
      ? allTime.languages.map((l: any) => ({ name: l.name, seconds: l.total_seconds ?? l.seconds ?? 0 }))
      : []

    const categories = Array.isArray(allTime?.categories)
      ? allTime.categories.map((c: any) => ({ name: c.name, seconds: c.total_seconds ?? c.total_seconds ?? 0 }))
      : []

    // Total coding time from languages (fallback if all_time endpoint provided it differently)
    const totalSecondsFromLanguages = languages.reduce((s: number, l: any) => s + (l.seconds || 0), 0)
    const totalHoursReadable = Number((totalSecondsFromLanguages / 3600).toFixed(1))
    // Prefer the human-readable all_time value when available (includes "Other" language)
    const totalTimeText = (allTime && (allTime as any).human_readable_total_including_other_language)
      ? (allTime as any).human_readable_total_including_other_language
      : `${totalHoursReadable} hours`
    // Prefer the human-readable daily average when available; fall back to computed value
    const dailyAverageText = (allTime && ((allTime as any).human_readable_daily_average_including_other_language ?? (allTime as any).human_readable_daily_average))
      ? ((allTime as any).human_readable_daily_average_including_other_language ?? (allTime as any).human_readable_daily_average)
      : (() => {
          const days = (allTime && (allTime as any).days_including_holidays) || 1
          const avgSec = days > 0 ? totalSecondsFromLanguages / days : 0
          const hrs = Math.floor(avgSec / 3600)
          const mins = Math.round((avgSec % 3600) / 60)
          if (hrs > 0) return `${hrs} hrs ${mins} mins`
          if (mins > 0) return `${mins} mins`
          return '0 secs'
        })()

    // Range helper text from all_time (e.g. "since Dec 11 2020")
    const rangeText = (allTime && (allTime as any).human_readable_range) ? (allTime as any).human_readable_range : null

    // Total lines: heartbeats endpoint removed; prefer README badge fallback
    const totalLines = 0

    // Most recently used language from the `/users/current` response when available.
    const mostRecentLanguage = (() => {
      if (!user) return null

      // common shape: user.last_heartbeat may be an object with language/entity
      const lastHb = (user as any).last_heartbeat ?? (user as any).last_heartbeat_at ?? null
      if (lastHb && typeof lastHb === 'object') return lastHb.language ?? lastHb.entity ?? null

      // fallback common fields
      return (user as any).last_language ?? (user as any).language ?? (user as any).preferred_language ?? null
    })()

    // Most recently used branch from the `/users/current` response when available.
    const mostRecentBranch = (() => {
      if (!user) return null
      const lastHb = (user as any).last_heartbeat ?? null
      if (lastHb && typeof lastHb === 'object') return lastHb.branch ?? lastHb.branch_name ?? null
      return (user as any).last_branch ?? null
    })()

    // summaries removed (premium). Day-of-week averages are not available without premium summaries.
    const dayData: { day: string; avgSeconds: number }[] = []

    // Try to read a fallback total-lines value from the repository README (badge)
    const readmeLines = await fetchReadmeLines()
      // Compute a link to the user's WakaTime profile when available
      const wakaProfile = (() => {
        if (!user) return null
        // try common properties returned by the WakaTime API
        return (user as any).url ?? ((user as any).profile_url ?? null) ?? ((user as any).username ? `https://wakatime.com/@${(user as any).username}` : null)
      })()

    return (
      <main className="max-w-6xl mx-auto md:px-16 px-6 pt-0 pb-12">
        <div className="max-w-6xl mx-auto">
          <h1 className="font-incognito text-4xl font-bold tracking-tight">
            Coding Activity
          </h1>
          <div className="mt-1 text-xs text-zinc-500 dark:text-zinc-400 italic pl-1">... {rangeText ?? '—'}</div>

          <div className="flex flex-col sm:flex-row gap-4 items-center my-6">
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
              <div className="text-lg font-semibold">{readmeLines ?? '—'}</div>
            </div>

                <div className="bg-white dark:bg-zinc-900 border dark:border-zinc-800 border-zinc-200 rounded-md px-4 py-2 shadow-sm w-full sm:w-auto text-center sm:text-left">
                <div className="text-xs text-zinc-500">Last language</div>
                <div className="text-lg font-semibold">{mostRecentLanguage ?? '—'}</div>
              </div>
              <div className="bg-white dark:bg-zinc-900 border dark:border-zinc-800 border-zinc-200 rounded-md px-4 py-2 shadow-sm w-full sm:w-auto text-center sm:text-left">
                <div className="text-xs text-zinc-500">Last branch</div>
                <div className="text-lg font-semibold">{mostRecentBranch ?? '—'}</div>
              </div>
          </div>

          <section className="grid grid-cols-1 gap-8 mt-6">
              <div className="dark:bg-primary-bg bg-secondary-bg border dark:border-zinc-800 border-zinc-200 p-6 rounded-lg">
                <StatsPie data={languages} title="Languages" />
            </div>

              <div className="dark:bg-primary-bg bg-secondary-bg border dark:border-zinc-800 border-zinc-200 p-6 rounded-lg">
              <StatsPie data={categories} title="Activities" />
            </div>
          </section>
            <div className="mt-6 text-sm text-zinc-600 dark:text-zinc-400 flex justify-start">
              <WakaTimeDisclaimer url={wakaProfile} />
            </div>
        </div>
      </main>
    )
  } catch (err: any) {
    return (
      <main className="max-w-4xl mx-auto px-6 pt-0 pb-12">
        <h1 className="prose">Coding Activity</h1>
        <p>Error loading coding statistics: {err?.message ?? String(err)}</p>
        <p>Ensure `WAKATIME_API_KEY` is set in your environment.</p>
      </main>
    )
  }
}
