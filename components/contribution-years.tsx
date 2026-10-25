"use client";

import { useState, type ReactNode } from "react";
import { event } from "@/lib/gtag";

export interface ContributionPanel {
  year: number;
  /** Server-rendered calendar (or its error state) for that year. */
  node: ReactNode;
}

interface ContributionYearsProps {
  panels: ContributionPanel[];
  title?: string;
  description?: string;
  footer?: ReactNode;
  buttonSize?: "small" | "large";
}

/**
 * The year switcher around the /coding contribution graph. Every year's
 * calendar arrives already rendered from the server; the only JavaScript here
 * is which one is showing. No fetch, no library, nothing to hydrate but five
 * buttons.
 */
export default function ContributionYears({
  panels,
  title,
  description,
  footer,
  buttonSize = "small",
}: ContributionYearsProps) {
  const [year, setYear] = useState(panels[0]?.year);
  const current = panels.find((p) => p.year === year) ?? panels[0];

  const handleYearClick = (y: number) => {
    setYear(y);
    try {
      event("contribution_graph_year_changed", { year: y });
    } catch {
      // noop
    }
  };

  return (
    <div className="flex xl:flex-row flex-col gap-4 items-center">
      <div className="bg-card border border-line p-6 sm:p-8 rounded-lg w-full overflow-hidden">
        {title && (
          <h3 className="font-sans text-2xl font-bold tracking-tight mb-2">
            {title}
          </h3>
        )}
        {description && (
          <p className="text-sm text-slate mb-4">{description}</p>
        )}
        <div className="overflow-x-auto -mx-6 sm:-mx-8 px-6 sm:px-8 py-2">
          <div className="min-w-[320px] min-h-[164px]">{current?.node}</div>
        </div>
        {footer}
      </div>

      <div className="flex justify-center xl:justify-start xl:flex-col flex-row flex-wrap gap-2">
        {panels.map(({ year: y }) => (
          <button
            key={y}
            type="button"
            title={`View graph for the year ${y}`}
            aria-pressed={y === year}
            onClick={() => handleYearClick(y)}
            className={
              "cursor-pointer inline-flex items-center text-sm" +
              " " +
              (buttonSize === "large"
                ? "px-4 py-2 md:px-6 md:py-4"
                : "px-4 py-2") +
              " border-2 font-semibold rounded-lg transition-all duration-200 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-interactive-ink" +
              " " +
              (y === year
                ? "bg-interactive text-on-interactive border-transparent hover:border-transparent"
                : "border-line-strong hover:border-interactive bg-transparent text-ink-soft")
            }
          >
            {y}
          </button>
        ))}
      </div>
    </div>
  );
}
