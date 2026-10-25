"use client";
import { useState, useMemo, useSyncExternalStore } from "react";
import type { StatsData } from "@/types/wakatime";
import { buildPalette } from "./chart-colors";

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

// viewBox is square; the centre, radii and the +12 emphasis ring all fit.
const SIZE = 240;
const CENTER = SIZE / 2;
const OUTER = 100;
const INNER = 48;
// Gap between sectors, in degrees.
const PAD_ANGLE = 2;

// Point on a circle, angles in degrees clockwise from 12 o'clock.
function polar(r: number, deg: number): [number, number] {
  const rad = ((deg - 90) * Math.PI) / 180;
  return [CENTER + r * Math.cos(rad), CENTER + r * Math.sin(rad)];
}

// Annular sector from `start` to `end` degrees. A full ring (one sector, no
// gap) is drawn as two half-arcs, since an arc whose ends coincide is empty.
function ringPath(r0: number, r1: number, start: number, end: number): string {
  if (end - start >= 360) {
    const mid = start + 180;
    return ringPath(r0, r1, start, mid) + " " + ringPath(r0, r1, mid, end);
  }
  const large = end - start > 180 ? 1 : 0;
  const [x1, y1] = polar(r1, start);
  const [x2, y2] = polar(r1, end);
  const [x3, y3] = polar(r0, end);
  const [x4, y4] = polar(r0, start);
  return [
    `M${x1.toFixed(2)} ${y1.toFixed(2)}`,
    `A${r1} ${r1} 0 ${large} 1 ${x2.toFixed(2)} ${y2.toFixed(2)}`,
    `L${x3.toFixed(2)} ${y3.toFixed(2)}`,
    `A${r0} ${r0} 0 ${large} 0 ${x4.toFixed(2)} ${y4.toFixed(2)}`,
    "Z",
  ].join(" ");
}

// True once React has hydrated on the client, false on the server and during
// hydration. A hydration gate that never calls setState in an effect.
const useHydrated = () =>
  useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

export default function StatsPie({ data, title, description }: StatsPieProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const displayIndex = selectedIndex ?? activeIndex;
  // Resolve the palette from the design tokens after hydration. The server has
  // no document, so chartColors() returns the light-mode fallbacks there; the
  // gate keeps the first client render identical before swapping to the real
  // (theme-aware) values.
  const tokensReady = useHydrated();
  // Built from THIS chart's own series list, so slots are not shared with any
  // other chart on the page and the visible subset can change without
  // repainting survivors.
  const palette = useMemo(
    () => buildPalette((data || []).map((d) => d.name)),
    // eslint-disable-next-line react-hooks/exhaustive-deps -- re-read once mounted
    [tokensReady, data],
  );


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

  // Donut geometry. Hand-rolled SVG instead of a chart library: this is the
  // only chart on the site that was not already plain markup, and it cost the
  // /coding page the whole of recharts (plus d3 and decimal.js underneath) at
  // load. A ring of arcs is a few lines of trigonometry.
  const totalSecs = chartDataSecs.reduce((s, d) => s + d.seconds, 0) || 1;
  const sectors = (() => {
    const n = chartDataSecs.length;
    const pad = n > 1 ? PAD_ANGLE : 0;
    const sweep = 360 - pad * n;
    let angle = 0;
    return chartDataSecs.map((d) => {
      const start = angle;
      const end = start + (d.seconds / totalSecs) * sweep;
      angle = end + pad;
      return { name: d.name, start, end };
    });
  })();

  return (
    <div className="w-full pb-6 md:pb-0 overflow-auto">
      {title && (
        <h3 className="font-sans text-2xl font-bold tracking-tight mb-2">
          {title}
        </h3>
      )}
      {description && (
        <p className="text-sm text-slate mb-4">
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
                      style={{ background: palette(d.name) }}
                    />
                    <span
                      className={`text-sm ${
                        isActive ? "font-semibold" : "font-medium"
                      } truncate text-left`}
                    >
                      {d.name}
                    </span>
                  </div>
                  <div className="text-sm text-slate text-right w-32">
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
          <svg
            viewBox={`0 0 ${SIZE} ${SIZE}`}
            className="h-full w-full"
            role="img"
            aria-label={`${title ?? "Breakdown"}: ${chartData
              .map((d) => `${d.name} ${d.value} hours`)
              .join(", ")}`}
          >
            {sectors.map((sec, idx) => {
              const color = palette(sec.name);
              const isActive = idx === displayIndex;
              return (
                <g
                  key={`${sec.name}-${idx}`}
                  className="cursor-pointer"
                  onMouseEnter={() => setActiveIndex(idx)}
                  onMouseLeave={() => setActiveIndex(null)}
                  onClick={() =>
                    setSelectedIndex(idx === selectedIndex ? null : idx)
                  }
                >
                  <path
                    d={ringPath(INNER, OUTER, sec.start, sec.end)}
                    fill={color}
                  />
                  {isActive && (
                    <path
                      d={ringPath(OUTER + 6, OUTER + 12, sec.start, sec.end)}
                      fill={color}
                      opacity={0.9}
                    />
                  )}
                </g>
              );
            })}
          </svg>
        </div>
      </div>
    </div>
  );
}
