import type { ReactNode } from "react";
import ContributionCalendar from "@/components/contribution-calendar";
import { fetchRecentContributions } from "@/lib/contributions";

/** About six months: 26 week columns, the newest ending today. */
const WEEKS_SHOWN = 26;
const WINDOW_LABEL = "the last 6 months";
// Contribution data changes daily at most; the page's own revalidation is
// shorter, but this fetch can stay cached for an hour on its own.
const REVALIDATE_SECONDS = 60 * 60;

// Two sizes of the same grid, swapped with CSS so the page ships no
// JavaScript for it. The phone grid is 282px wide and the wide one 493px;
// `fluid` shrinks either to its column when that is narrower, so the graph
// never scrolls sideways.
const PHONE = { blockSize: 8, blockMargin: 2, fontSize: 10 };
const WIDE = { blockSize: 14, blockMargin: 4, fontSize: 12 };

interface ContributionGraphProps {
  username?: string;
}

/**
 * Server component: the last six months of public GitHub contributions as a
 * rolling window, rendered into HTML with the page. Earlier years used to sit
 * behind a year switcher; they said little (most of the work happens on a
 * private GitHub Enterprise that never reaches this graph), and a full year
 * made the grid scroll sideways on a phone.
 */
export default async function ContributionGraph({
  username = "brignano",
}: ContributionGraphProps) {
  const recent = await fetchRecentContributions(username, WEEKS_SHOWN, {
    next: { revalidate: REVALIDATE_SECONDS },
  }).catch(() => null);
  const data = recent && {
    year: new Date().getUTCFullYear(),
    total: recent.total,
    days: recent.days,
  };
  const totalLabel = `{{count}} contributions in ${WINDOW_LABEL}`;

  const body: ReactNode = data ? (
    <>
      <div className="sm:hidden">
        <ContributionCalendar
          data={data}
          {...PHONE}
          fluid
          showLegend={false}
          totalLabel={totalLabel}
        />
      </div>
      <div className="hidden sm:block max-w-[493px]">
        <ContributionCalendar
          data={data}
          {...WIDE}
          fluid
          totalLabel={totalLabel}
        />
      </div>
    </>
  ) : (
    <p className="text-sm text-slate italic">
      Couldn&apos;t load contributions from GitHub just now.
    </p>
  );

  return <div className="min-h-[120px]">{body}</div>;
}
