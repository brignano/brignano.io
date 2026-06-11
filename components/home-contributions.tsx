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
 * Calm, restrained contribution preview for the homepage. Uses a **trailing
 * 12-month window** (`year="last"`) rather than the calendar year so the grid
 * ends on the most recent activity instead of trailing into empty future
 * months — keeps the section feeling current for bursty / mid-year activity.
 * Real data only; the year selector, legend, and color legend chrome live on
 * the full /coding calendar this funnels to.
 */
export default function HomeContributions({
  username = "brignano",
}: {
  username?: string;
}) {
  const [mounted, setMounted] = useState(false);
  const [colorScheme, setColorScheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    setMounted(true);

    const root = document.documentElement;
    setColorScheme(root.classList.contains("dark") ? "dark" : "light");
    const observer = new MutationObserver(() => {
      setColorScheme(root.classList.contains("dark") ? "dark" : "light");
    });
    observer.observe(root, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  return (
    <div className="overflow-x-auto -mx-1 px-1 py-1">
      <div className="min-w-[320px]">
        {mounted && (
          <GitHubCalendar
            username={username}
            year="last"
            colorScheme={colorScheme}
            theme={CALENDAR_THEME}
            blockSize={11}
            blockMargin={4}
            fontSize={12}
            showColorLegend={false}
            labels={{ totalCount: "{{count}} contributions in the last year" }}
          />
        )}
      </div>
    </div>
  );
}
