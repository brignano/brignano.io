import type { ReactNode } from "react";
import ContributionCalendar from "@/components/contribution-calendar";
import { fetchRecentContributions } from "@/lib/contributions";

/** A full year on wide screens, the latest half year on phones. */
const WEEKS_WIDE = 53;
const WEEKS_PHONE = 26;
// Contribution data changes daily at most; the page's own revalidation is
// shorter, but this fetch can stay cached for an hour on its own.
const REVALIDATE_SECONDS = 60 * 60;

// One grid size, swapped between two windows with CSS so the page ships no
// JavaScript for it. `fluid` scales the grid to fill its column, so the cells
// grow or shrink with the width instead of leaving half the row empty.
const SIZE = { blockSize: 14, blockMargin: 4, fontSize: 12 };

interface ContributionGraphProps {
  username?: string;
}

/**
 * Server component: public GitHub contributions rendered into HTML with the
 * page. Wide screens get the last year; phones get the last six months so the
 * cells stay big enough to read. Most of the work happens on a private GitHub
 * Enterprise that never reaches this graph.
 */
export default async function ContributionGraph({
  username = "brignano",
}: ContributionGraphProps) {
  const recent = await fetchRecentContributions(username, WEEKS_WIDE, {
    next: { revalidate: REVALIDATE_SECONDS },
  }).catch(() => null);

  let body: ReactNode;
  if (recent) {
    const year = new Date().getUTCFullYear();
    const wide = { year, total: recent.total, days: recent.days };
    // The phone window is the newest 26 week columns of the same data.
    const lastDay = recent.days[recent.days.length - 1]?.date ?? "";
    const last = Date.parse(lastDay);
    const sunday = last - new Date(last).getUTCDay() * 86_400_000;
    const cutoff = new Date(sunday - (WEEKS_PHONE - 1) * 7 * 86_400_000)
      .toISOString()
      .slice(0, 10);
    const phoneDays = recent.days.filter((d) => d.date >= cutoff);
    const phone = {
      year,
      total: phoneDays.reduce((sum, d) => sum + d.count, 0),
      days: phoneDays,
    };
    body = (
      <>
        <div className="sm:hidden">
          <ContributionCalendar
            data={phone}
            {...SIZE}
            maxWeeks={WEEKS_PHONE}
            fluid
            showLegend={false}
            totalLabel="{{count}} contributions in the last 6 months"
          />
        </div>
        <div className="hidden sm:block">
          <ContributionCalendar
            data={wide}
            {...SIZE}
            fluid
            totalLabel="{{count}} contributions in the last year"
          />
        </div>
      </>
    );
  } else {
    body = (
      <p className="text-sm text-slate italic">
        Couldn&apos;t load contributions from GitHub just now.
      </p>
    );
  }

  return <div className="min-h-[120px]">{body}</div>;
}
