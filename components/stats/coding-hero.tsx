import type { ReactNode } from "react";

interface CodingHeroProps {
  totalTimeText: string;
  dailyAverageText: string;
  rangeText?: string | null;
  bestDay?: { date: string; text: string } | null;
}

function formatDate(date?: string | null): string | null {
  if (!date) return null;
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return date;
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}

function SubStat({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="flex flex-col">
      <span className="text-xs uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
        {label}
      </span>
      <span className="text-base font-semibold">{value}</span>
    </div>
  );
}

// The marquee of the page: WakaTime total as the "wow" number, with the
// iceberg framing that reframes the public GitHub graph as just the visible tip.
export default function CodingHero({
  totalTimeText,
  dailyAverageText,
  rangeText,
  bestDay,
}: CodingHeroProps) {
  // "since Dec 11 2020" -> "Dec 11 2020"
  const trackingSince = rangeText
    ? rangeText.replace(/^since\s+/i, "").trim()
    : null;
  const bestDayDate = formatDate(bestDay?.date);

  return (
    <div className="dark:bg-primary-bg bg-secondary-bg border dark:border-zinc-800 border-zinc-200 rounded-lg p-6 md:p-8">
      <div className="text-xs uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
        Total time coding
      </div>
      <div className="font-incognito text-5xl md:text-6xl font-bold tracking-tight text-primary-color mt-1">
        {totalTimeText}
      </div>
      <p className="mt-4 max-w-2xl text-sm md:text-base text-zinc-600 dark:text-zinc-300 leading-relaxed">
        My public GitHub shows only a few hundred commits — but WakaTime has
        quietly tracked every keystroke
        {trackingSince ? ` since ${trackingSince}` : ""}, across every editor and
        machine, including thousands of private and enterprise commits that
        never appear publicly. The contribution graph below is just the tip of
        the iceberg.
      </p>

      <div className="mt-6 flex flex-wrap gap-x-10 gap-y-4 border-t dark:border-zinc-800 border-zinc-200 pt-4">
        <SubStat label="Daily average" value={dailyAverageText} />
        {bestDay?.text && (
          <SubStat
            label="Best day ever"
            value={
              <>
                {bestDay.text}
                {bestDayDate && (
                  <span className="font-normal text-zinc-500 dark:text-zinc-400">
                    {" "}
                    ({bestDayDate})
                  </span>
                )}
              </>
            }
          />
        )}
        {trackingSince && (
          <SubStat label="Tracking since" value={trackingSince} />
        )}
      </div>
    </div>
  );
}
