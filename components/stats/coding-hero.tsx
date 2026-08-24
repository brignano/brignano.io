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
      {/* Past tense on purpose: collection has stopped, so this is a closed
          record rather than a live feed. Saying so is better than letting a
          reader assume the numbers are current and quietly stale. */}
      <p className="mt-4 max-w-2xl text-sm md:text-base text-ink-soft leading-relaxed">
        My public GitHub shows only a few hundred commits — but WakaTime quietly
        tracked every keystroke
        {trackingSince ? ` from ${trackingSince}` : ""}, across every editor and
        machine, including thousands of private and enterprise commits that
        never appear publicly. The contribution graph below is just the tip of
        the iceberg.
      </p>
      <p className="mt-3 max-w-2xl text-sm text-slate leading-relaxed">
        Editor tracking is no longer running, so these totals are a complete
        archive rather than a live counter. Current work happens on an
        enterprise GitHub that never reaches this page.
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
