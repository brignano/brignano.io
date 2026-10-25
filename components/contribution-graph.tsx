import ContributionCalendar from "@/components/contribution-calendar";
import ContributionYears, {
  type ContributionPanel,
} from "@/components/contribution-years";
import DisclaimerLink from "@/components/github-disclaimer-link";
import { fetchContributions } from "@/lib/contributions";

const YEARS_SHOWN = 5;
// Contribution data changes daily at most; the page's own revalidation is
// shorter, but this fetch can stay cached for an hour on its own.
const REVALIDATE_SECONDS = 60 * 60;

interface ContributionGraphProps {
  username?: string;
  title?: string;
  description?: string;
  buttonSize?: "small" | "large";
  showDisclaimer?: boolean;
}

/**
 * Server component: fetches the last five years of contributions in parallel
 * and renders each calendar into HTML, so the graph arrives with the page and
 * costs the visitor no JavaScript beyond the year buttons.
 */
export default async function ContributionGraph({
  username = "brignano",
  title,
  description,
  buttonSize = "small",
  showDisclaimer = false,
}: ContributionGraphProps) {
  const currentYear = new Date().getUTCFullYear();
  const years = Array.from({ length: YEARS_SHOWN }, (_, i) => currentYear - i);

  const results = await Promise.allSettled(
    years.map((year) =>
      fetchContributions(username, year, {
        next: { revalidate: REVALIDATE_SECONDS },
      })
    )
  );

  const panels: ContributionPanel[] = years.map((year, i) => {
    const result = results[i];
    return {
      year,
      node:
        result.status === "fulfilled" ? (
          <ContributionCalendar data={result.value} />
        ) : (
          <p className="text-sm text-slate italic">
            Couldn&apos;t load {year} from GitHub just now.
          </p>
        ),
    };
  });

  // The link carries a click handler, so it lives in its own client file.
  const footer = showDisclaimer ? (
    <div className="w-full mt-3 text-sm text-slate italic">
      View more information on <DisclaimerLink />.
    </div>
  ) : null;

  return (
    <ContributionYears
      panels={panels}
      title={title}
      description={description}
      footer={footer}
      buttonSize={buttonSize}
    />
  );
}
