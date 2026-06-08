"use client";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

interface RecentActivityDatum {
  date: string;
  hours: number;
}

interface RecentActivityProps {
  data: RecentActivityDatum[];
  title?: string;
  description?: string;
}

const BAR_COLOR = "#10b981";

function shortDate(date: string): string {
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return date;
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}

function fmtHours(hours: number): string {
  if (hours <= 0) return "0";
  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);
  if (h > 0 && m > 0) return `${h}h ${m}m`;
  if (h > 0) return `${h}h`;
  return `${m}m`;
}

function CustomTooltip(props: unknown) {
  if (!props || typeof props !== "object") return null;
  const { active, payload } = props as {
    active?: boolean;
    payload?: { payload: RecentActivityDatum }[];
  };
  if (!active || !payload || payload.length === 0) return null;
  const datum = payload[0].payload;
  return (
    <div className="rounded-md border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-xs shadow-sm">
      <div className="font-semibold">{shortDate(datum.date)}</div>
      <div className="text-zinc-500 dark:text-zinc-400">
        {fmtHours(datum.hours)} coding
      </div>
    </div>
  );
}

// Last-14-days daily activity. Vertical bars over dates is the correct idiom
// for a short time series (distinct from StatsBar's ranked horizontal bars).
export default function RecentActivity({
  data,
  title,
  description,
}: RecentActivityProps) {
  const total = (data || []).reduce((s, d) => s + (d.hours || 0), 0);
  if (!data || data.length === 0 || total <= 0) return null;

  const chartData = data.map((d) => ({ ...d, label: shortDate(d.date) }));

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
      <div className="h-56 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 8, right: 8, left: -20, bottom: 0 }}
          >
            <XAxis
              dataKey="label"
              tick={{ fontSize: 11, fill: "currentColor" }}
              tickLine={false}
              axisLine={false}
              interval="preserveStartEnd"
              className="text-zinc-500 dark:text-zinc-400"
            />
            <YAxis
              tick={{ fontSize: 11, fill: "currentColor" }}
              tickLine={false}
              axisLine={false}
              width={36}
              allowDecimals={false}
              className="text-zinc-500 dark:text-zinc-400"
            />
            <Tooltip
              cursor={{ fill: "rgba(16, 185, 129, 0.1)" }}
              content={<CustomTooltip />}
            />
            <Bar dataKey="hours" radius={[3, 3, 0, 0]}>
              {chartData.map((_, idx) => (
                <Cell key={`cell-${idx}`} fill={BAR_COLOR} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
