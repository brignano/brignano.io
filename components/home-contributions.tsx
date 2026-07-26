"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";

const GitHubCalendar = dynamic(
  () => import("react-github-calendar").then((mod) => mod.GitHubCalendar),
  { ssr: false }
);

// Same violet intensity ramp as the full /coding calendar, so the homepage
// preview and the detailed page read as one system.
const CALENDAR_THEME = {
  light: ["#e4e4e7", "#ddd6fe", "#a78bfa", "#7c3aed", "#5b21b6"],
  dark: ["#27272a", "#4c1d95", "#6d28d9", "#8b5cf6", "#a78bfa"],
};

/**
 * Calm, restrained contribution preview for the homepage. Uses the **current
 * calendar year** (matching the full /coding calendar) rather than a trailing
 * 12-month window: most public activity lands in the current year, so this puts
 * the active months on the left where the overflow container shows them first,
 * instead of leading with last year's empty months (work commits live on a
 * private GitHub Enterprise that never reaches this public graph). Real data
 * only; the year selector, legend, and color legend chrome live on /coding.
 */
export default function HomeContributions({
  username = "brignano",
}: {
  username?: string;
}) {
  const [mounted, setMounted] = useState(false);
  const [year, setYear] = useState<number | null>(null);
  const [colorScheme, setColorScheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect --
       client-only mount gate + theme sync, same as github-calendar-client */
    setMounted(true);
    // Resolve the year from the browser clock after mount so server and client
    // markup match (the calendar is client-only via the mounted gate anyway).
    setYear(new Date().getFullYear());

    const root = document.documentElement;
    setColorScheme(root.classList.contains("dark") ? "dark" : "light");
    /* eslint-enable react-hooks/set-state-in-effect */
    const observer = new MutationObserver(() => {
      setColorScheme(root.classList.contains("dark") ? "dark" : "light");
    });
    observer.observe(root, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  return (
    <div className="overflow-x-auto -mx-1 px-1 py-1">
      <div className="min-w-[320px]">
        {mounted && year !== null && (
          <GitHubCalendar
            username={username}
            year={year}
            colorScheme={colorScheme}
            theme={CALENDAR_THEME}
            blockSize={11}
            blockMargin={4}
            fontSize={12}
            showColorLegend={false}
            labels={{ totalCount: "{{count}} contributions in {{year}}" }}
          />
        )}
      </div>
    </div>
  );
}
