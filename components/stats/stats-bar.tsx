"use client";
import { useState } from "react";
import type { StatsData } from "@/types/wakatime";
import { CHART_COLORS as COLORS } from "./chart-colors";

interface StatsBarProps {
  data: StatsData[];
  title?: string;
  description?: string;
}

// Horizontal-bar counterpart to StatsPie. Same StatsData[] contract and the
// same top-8 + "Other" data prep, but renders a ranked list of CSS-width bars
// (better than a donut for many-item lists like languages/editors/projects).
export default function StatsBar({ data, title, description }: StatsBarProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const displayIndex = selectedIndex ?? activeIndex;

  const MIN_HOURS = 0.1;
  const filtered = (data || []).filter((d) => d.seconds >= MIN_HOURS * 3600);

  // Merge any duplicate names so we don't end up with duplicate buckets.
  const agg = new Map<string, number>();
  filtered.forEach((d) => {
    const name = (d.name || "Unknown") as string;
    agg.set(name, (agg.get(name) || 0) + d.seconds);
  });

  const aggregated = Array.from(agg.entries()).map(([name, seconds]) => ({
    name,
    seconds,
  }));
  const totalSeconds = aggregated.reduce((s, d) => s + d.seconds, 0) || 1;

  const AGG_NAME = "Other";
  const withoutApiOther = aggregated.filter((a) => a.name !== AGG_NAME);
  const sorted = withoutApiOther.sort((a, b) => b.seconds - a.seconds);
  const top = sorted.slice(0, 8);
  const others = totalSeconds - top.reduce((s, d) => s + d.seconds, 0);

  const toHours = (s: number) => Number((s / 3600).toFixed(1));

  const rows = [
    ...top.map((d) => ({ name: d.name, seconds: d.seconds })),
    ...(others > 0 ? [{ name: "Other", seconds: others }] : []),
  ].map((d) => ({
    name: d.name,
    hours: toHours(d.seconds),
    seconds: d.seconds,
    pct: (d.seconds / totalSeconds) * 100,
  }));

  if (rows.length === 0) return null;

  // Bar width is relative to the largest item so the top bar fills the row.
  const maxSeconds = rows.reduce((m, d) => Math.max(m, d.seconds), 0) || 1;

  const move = (delta: number) =>
    setActiveIndex((prev) => {
      const next = (prev ?? (delta > 0 ? -1 : 0)) + delta;
      if (next >= rows.length) return 0;
      if (next < 0) return rows.length - 1;
      return next;
    });

  return (
    <div className="w-full">
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
      <ul className="space-y-3">
        {rows.map((d, idx) => {
          const isActive = displayIndex === idx;
          const dim = displayIndex !== null && !isActive;
          const color = COLORS[idx % COLORS.length];
          const barWidth = Math.max((d.seconds / maxSeconds) * 100, 2);

          return (
            <li
              key={`${d.name}-${idx}`}
              className={`transition-opacity ${
                dim ? "opacity-60" : "opacity-100"
              } cursor-pointer`}
              onMouseDown={(e) => e.preventDefault()}
              onMouseEnter={() => setActiveIndex(idx)}
              onMouseLeave={() => setActiveIndex(null)}
              onClick={() =>
                setSelectedIndex(idx === selectedIndex ? null : idx)
              }
              tabIndex={0}
              role="button"
              aria-pressed={selectedIndex === idx}
              onFocus={() => setActiveIndex(idx)}
              onBlur={() => setActiveIndex(null)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setSelectedIndex(idx === selectedIndex ? null : idx);
                } else if (e.key === "ArrowRight" || e.key === "ArrowDown") {
                  e.preventDefault();
                  move(1);
                } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
                  e.preventDefault();
                  move(-1);
                } else if (e.key === "Escape") {
                  e.preventDefault();
                  setSelectedIndex(null);
                  setActiveIndex(null);
                }
              }}
            >
              <div className="flex items-center justify-between gap-3 mb-1">
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    className={`inline-block rounded-sm transition-all duration-100 ${
                      isActive ? "w-[14px] h-[14px]" : "w-3 h-3"
                    }`}
                    style={{ background: color }}
                  />
                  <span
                    className={`text-sm ${
                      isActive ? "font-semibold" : "font-medium"
                    } truncate text-left`}
                  >
                    {d.name}
                  </span>
                </div>
                <div className="text-sm text-zinc-500 dark:text-zinc-400 text-right whitespace-nowrap">
                  {d.hours} hours
                  <span className="hidden sm:inline">
                    {" "}
                    ({d.pct.toFixed(1)}%)
                  </span>
                </div>
              </div>
              <div className="h-2 w-full rounded-full bg-zinc-200 dark:bg-zinc-800 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-300"
                  style={{ width: `${barWidth}%`, background: color }}
                />
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
