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
      <span className="text-xs uppercase tracking-wide text-slate">
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
    <div className="bg-card border border-line rounded-lg p-6 md:p-8">
      <div className="text-xs uppercase tracking-wide text-slate">
        Total time coding, tracked
      </div>
      <div className="font-sans text-5xl md:text-6xl font-bold tracking-tight mt-1">
        {totalTimeText}
      </div>
      <p className="mt-4 max-w-2xl text-sm md:text-base text-ink-soft leading-relaxed">
        My public GitHub shows only a few hundred commits — but WakaTime has
        tracked my editor time{trackingSince ? ` since ${trackingSince}` : ""},
        across every editor and machine, including thousands of private commits
        that never appear publicly. The contribution graph below is just the tip
        of the iceberg.
      </p>
      {/* Say plainly why the numbers have slowed down, so a reader doesn't
          take the flatter recent stretch as less coding. */}
      <p className="mt-3 max-w-2xl text-sm text-slate leading-relaxed">
        These days the totals mostly grow from personal projects, and much of
        my coding happens alongside AI agents like Claude Code, so editor hours
        tell less of the story than they used to.
      </p>

      <div className="mt-6 flex flex-wrap gap-x-10 gap-y-4 border-t border-line pt-4">
        <SubStat label="Daily average" value={dailyAverageText} />
        {bestDay?.text && (
          <SubStat
            label="Best day ever"
            value={
              <>
                {bestDay.text}
                {bestDayDate && (
                  <span className="font-normal text-slate">
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

// Shown in the hero's place when WakaTime did not answer (API down, key
// rotated, rate limited). The page used to fall through to the normal hero
// with "0 hours" as the headline, which reads as a year of not coding rather
// than a stats outage. Same card, same framing, no number to misread.
export function CodingHeroUnavailable() {
  return (
    <div className="bg-card border border-line rounded-lg p-6 md:p-8">
      <div className="text-xs uppercase tracking-wide text-slate">
        Total time coding, tracked
      </div>
      <div className="font-sans text-2xl md:text-3xl font-bold tracking-tight mt-1">
        WakaTime isn&apos;t answering right now.
      </div>
      <p className="mt-4 max-w-2xl text-sm md:text-base text-ink-soft leading-relaxed">
        This is where the editor time WakaTime has tracked across every machine
        since 2020 usually goes — thousands of hours, most of them on private
        commits that never show up publicly. Check back shortly; the GitHub
        activity below is live.
      </p>
    </div>
  );
}
