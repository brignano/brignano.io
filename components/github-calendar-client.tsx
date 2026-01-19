"use client";

import { useState } from "react";
import { GitHubCalendar } from "react-github-calendar";
import { event } from "@/lib/gtag";

interface GitHubCalendarClientProps {
  username?: string;
  initialYear?: number | string;
  colorScheme?: "light" | "dark";
  title?: string;
  description?: string;
  buttonSize?: "small" | "large";
  showDisclaimer?: boolean;
}

export default function GitHubCalendarClient({
  username = "brignano",
  initialYear = "last",
  colorScheme = "light",
  title,
  description,
  buttonSize = "small",
  showDisclaimer = false,
}: GitHubCalendarClientProps) {
  const [year, setYear] = useState<number | string>(initialYear);

  const handleYearClick = (y: number) => {
    setYear(y);
    try {
      event("contribution_graph_year_changed", { year: y });
    } catch (e) {
      // noop
    }
  };

  return (
    <>
      <div className="flex xl:flex-row flex-col gap-4 items-center">
      <div className="dark:bg-primary-bg bg-secondary-bg border dark:border-zinc-800 border-zinc-200 p-6 sm:p-8 rounded-lg w-full overflow-hidden">
        {title && (
          <h3 className="font-incognito text-2xl font-bold tracking-tight mb-2">
            {title}
          </h3>
        )}
        {description && (
          <p className="text-sm dark:text-zinc-500 text-zinc-500 mb-4">
            {description}
          </p>
        )}
        <div className="overflow-x-auto -mx-6 sm:-mx-8 px-6 sm:px-8 py-2">
          <div className="min-w-[320px]">
            <GitHubCalendar
              username={username}
              year={Number(year)}
              colorScheme={colorScheme}
            />
          </div>
        </div>
          {showDisclaimer && (
            <div className="w-full mt-3 text-sm text-zinc-500 dark:text-zinc-500">
              View more information on{' '}
              <a
                href="https://github.com/brignano"
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
                onClick={() => {
                  try {
                    event("click_github_disclaimer", {
                      category: "outbound",
                      label: "https://github.com/brignano",
                    });
                  } catch (e) {
                    // noop
                  }
                }}
              >
                GitHub
              </a>
              .
            </div>
          )}
      </div>

      <div className="flex justify-center xl:justify-start xl:flex-col flex-row flex-wrap gap-2">
        {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map(
          (y) => (
            <button
              key={y}
              title={`View graph for the year ${y}`}
              onClick={() => handleYearClick(y)}
              className={
                "cursor-pointer inline-flex items-center text-sm" +
                " " +
                (buttonSize === "large"
                  ? "px-4 py-2 md:px-6 md:py-4"
                  : "px-4 py-2") +
                " border-2 font-semibold rounded-lg transition-all duration-200" +
                " " +
                (y === year
                  ? "bg-secondary-color dark:bg-secondary-color text-white border-transparent hover:border-transparent"
                  : "dark:border-zinc-700 border-zinc-300 dark:hover:border-zinc-500 hover:border-zinc-400 dark:bg-transparent bg-transparent dark:text-zinc-300 text-zinc-700")
              }
            >
              {y}
            </button>
          )
        )}
      </div>
      </div>
    </>
  );
}
