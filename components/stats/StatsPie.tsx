"use client";
import { useState } from "react";
import { PieChart, Pie, ResponsiveContainer, Cell, Sector } from "recharts";
import type { StatsData } from "@/types/wakatime";

interface StatsPieProps {
  data: StatsData[];
  title?: string;
  description?: string;
}

interface ChartDataItem {
  name: string;
  value: number;
  seconds: number;
}

// Fixed palette ensures slices render with color
const COLORS = [
  "#4f46e5",
  "#ef4444",
  "#10b981",
  "#f59e0b",
  "#06b6d4",
  "#a78bfa",
  "#f97316",
  "#ef9aa3",
  "#60a5fa",
  "#34d399",
];

export default function StatsPie({ data, title, description }: StatsPieProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const displayIndex = selectedIndex ?? activeIndex;

  const filtered = (data || []).filter((d) => d.seconds > 0);

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

  const chartDataSecs = [
    ...top.map((d) => ({ name: d.name, seconds: d.seconds })),
    ...(others > 0 ? [{ name: "Other", seconds: others }] : []),
  ];

  const chartData: ChartDataItem[] = chartDataSecs.map((d) => ({
    name: d.name,
    value: toHours(d.seconds),
    seconds: d.seconds,
  }));

  const totalHours = chartData.reduce((s, d) => s + d.value, 0) || 1;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const renderActiveShape = (props: any) => {
    const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, payload } =
      props;
    const idx = chartDataSecs.findIndex((d) => d.name === payload?.name);
    const color = COLORS[idx >= 0 ? idx % COLORS.length : 0];

    return (
      <g>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={color}
        />
        <Sector
          cx={cx}
          cy={cy}
          startAngle={startAngle}
          endAngle={endAngle}
          innerRadius={(outerRadius ?? 0) + 6}
          outerRadius={(outerRadius ?? 0) + 12}
          fill={color}
          opacity={0.9}
        />
      </g>
    );
  };

  return (
    <div className="w-full pb-6 md:pb-0 overflow-auto">
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
      <div className="flex flex-col md:flex-row items-start gap-4">
        <div className="flex-1 md:max-w-md min-w-0">
          <ul className="space-y-3">
            {chartData.map((d, idx) => {
              const pct = totalHours > 0 ? (d.value / totalHours) * 100 : 0;
              const isActive = displayIndex === idx;
              const dim = displayIndex !== null && !isActive;

              return (
                <li
                  key={`${d.name}-${idx}`}
                  className={`flex items-center transition-opacity max-w-sm ${
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
                    } else if (
                      e.key === "ArrowRight" ||
                      e.key === "ArrowDown"
                    ) {
                      e.preventDefault();
                      setActiveIndex((prev) => {
                        const next = (prev ?? idx) + 1;
                        return next >= chartData.length ? 0 : next;
                      });
                    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
                      e.preventDefault();
                      setActiveIndex((prev) => {
                        const next = (prev ?? idx) - 1;
                        return next < 0 ? chartData.length - 1 : next;
                      });
                    } else if (e.key === "Escape") {
                      e.preventDefault();
                      setSelectedIndex(null);
                      setActiveIndex(null);
                    }
                  }}
                >
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <span
                      className={`inline-block rounded-sm transition-all duration-100 ${
                        isActive ? "w-[14px] h-[14px]" : "w-3 h-3"
                      }`}
                      style={{ background: COLORS[idx % COLORS.length] }}
                    />
                    <span
                      className={`text-sm ${
                        isActive ? "font-semibold" : "font-medium"
                      } truncate text-left`}
                    >
                      {d.name}
                    </span>
                  </div>
                  <div className="text-sm text-zinc-500 dark:text-zinc-400 text-right w-32">
                    {d.value} hours
                    <span className="hidden sm:inline">
                      {" "}
                      ({pct.toFixed(1)}%)
                    </span>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        <div
          className="w-full md:w-80 lg:w-96 flex-shrink-0 flex items-center justify-center h-60 relative mt-6 md:mt-0 mx-auto cursor-pointer"
          onMouseDown={(e) => e.preventDefault()}
          tabIndex={0}
          role="group"
          aria-label={`${title} chart`}
          onKeyDown={(e) => {
            if (e.key === "ArrowRight" || e.key === "ArrowDown") {
              e.preventDefault();
              setActiveIndex((prev) => {
                const next = (prev ?? -1) + 1;
                return next >= chartDataSecs.length ? 0 : next;
              });
            } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
              e.preventDefault();
              setActiveIndex((prev) => {
                const next = (prev ?? chartDataSecs.length) - 1;
                return next < 0 ? chartDataSecs.length - 1 : next;
              });
            } else if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              setSelectedIndex((prev) => {
                const idx = activeIndex ?? 0;
                return idx === prev ? null : idx;
              });
            } else if (e.key === "Escape") {
              e.preventDefault();
              setSelectedIndex(null);
              setActiveIndex(null);
            }
          }}
        >
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartDataSecs}
                dataKey="seconds"
                nameKey="name"
                cursor="pointer"
                outerRadius={100}
                innerRadius={48}
                paddingAngle={2}
                activeIndex={displayIndex ?? undefined}
                activeShape={renderActiveShape}
                onMouseEnter={(_, idx) => setActiveIndex(idx)}
                onMouseLeave={() => setActiveIndex(null)}
                onClick={(_, idx) =>
                  setSelectedIndex(idx === selectedIndex ? null : idx)
                }
              >
                {chartDataSecs.map((_, idx) => (
                  <Cell
                    key={`cell-${idx}`}
                    fill={COLORS[idx % COLORS.length] as string}
                    style={{ cursor: "pointer" }}
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
