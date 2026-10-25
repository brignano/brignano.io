import type { ContributionYear } from "@/lib/contributions";

/**
 * A GitHub-style contribution calendar as plain SVG.
 *
 * Replaces react-github-calendar, which cost the /coding page ~500 ms of
 * main-thread time on a phone for a grid of 371 squares. This has no state,
 * no effects and no dependencies, so it renders on the server (app/coding)
 * and in the browser (the homepage preview) from the same data, and themes
 * itself through the `--seq-*` design tokens with no JavaScript at all.
 */

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const WEEKDAY_LABELS: Record<number, string> = { 1: "Mon", 3: "Wed", 5: "Fri" };
const DAY_MS = 86_400_000;

interface ContributionCalendarProps {
  data: ContributionYear;
  /** Square size in px. */
  blockSize?: number;
  /** Gap between squares in px. */
  blockMargin?: number;
  fontSize?: number;
  /** The "Less … More" ramp under the grid. */
  showLegend?: boolean;
  /** Footer line; `{{count}}` and `{{year}}` are substituted. */
  totalLabel?: string;
  /** Keep only the most recent N week columns (see `weeksThatFit`). */
  maxWeeks?: number;
}

function parseDate(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  return Date.UTC(y, m - 1, d);
}

/** Width of the Mon/Wed/Fri label gutter; shared with `weeksThatFit`. */
function weekdayLabelWidth(fontSize: number) {
  return Math.round(fontSize * 2.4);
}

/**
 * How many week columns fit in `width` px at the given sizes, so a caller can
 * pass the result as `maxWeeks` and show the latest weeks without scrolling.
 */
export function weeksThatFit(
  width: number,
  { blockSize = 12, blockMargin = 4, fontSize = 14 } = {}
) {
  const step = blockSize + blockMargin;
  return Math.max(1, Math.floor((width - weekdayLabelWidth(fontSize) + blockMargin) / step));
}

export default function ContributionCalendar({
  data,
  blockSize = 12,
  blockMargin = 4,
  fontSize = 14,
  showLegend = true,
  totalLabel = "{{count}} contributions in {{year}}",
  maxWeeks,
}: ContributionCalendarProps) {
  const { days, year, total } = data;
  if (days.length === 0) return null;

  // Columns are weeks starting on Sunday, like GitHub's own graph. The first
  // column begins on the Sunday on or before the first day of data.
  const firstDay = parseDate(days[0].date);
  const firstSunday = firstDay - new Date(firstDay).getUTCDay() * DAY_MS;
  const step = blockSize + blockMargin;
  const labelWidth = weekdayLabelWidth(fontSize);
  const monthHeight = fontSize + 6;

  const allCells = days.map((day) => {
    const t = parseDate(day.date);
    const index = Math.round((t - firstSunday) / DAY_MS);
    return {
      ...day,
      col: Math.floor(index / 7),
      row: index % 7,
      month: new Date(t).getUTCMonth(),
    };
  });
  const allColumns = allCells.reduce((max, c) => Math.max(max, c.col + 1), 0);
  // Drop the oldest weeks when only the latest N should show.
  const skip = maxWeeks ? Math.max(0, allColumns - maxWeeks) : 0;
  const cells = skip
    ? allCells.filter((c) => c.col >= skip).map((c) => ({ ...c, col: c.col - skip }))
    : allCells;
  const columns = allColumns - skip;

  // One label where each month starts, unless it would crowd the previous one.
  // A trimmed grid can open on the tail of a month; when the next month starts
  // within three columns, label that one instead of the stub.
  const monthStarts: { col: number; month: number }[] = [];
  for (const cell of cells) {
    if (monthStarts[monthStarts.length - 1]?.month !== cell.month) {
      monthStarts.push({ col: cell.col, month: cell.month });
    }
  }
  if (skip && monthStarts.length > 1 && monthStarts[1].col < 3) {
    monthStarts.shift();
  }
  const monthLabels: { col: number; label: string }[] = [];
  let lastLabelCol = -10;
  for (const { col, month } of monthStarts) {
    if (col - lastLabelCol < 3) continue;
    monthLabels.push({ col, label: MONTHS[month] });
    lastLabelCol = col;
  }

  const width = labelWidth + columns * step - blockMargin;
  const height = monthHeight + 7 * step - blockMargin;
  const footer = totalLabel
    .replace("{{count}}", total.toLocaleString("en-US"))
    .replace("{{year}}", String(year));

  return (
    <div className="text-ink-soft" style={{ fontSize }}>
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        role="img"
        aria-label={footer}
        className="block max-w-none"
      >
        {monthLabels.map(({ col, label }) => (
          <text
            key={`${label}-${col}`}
            x={labelWidth + col * step}
            y={fontSize}
            fill="currentColor"
            fontSize={fontSize}
          >
            {label}
          </text>
        ))}
        {Object.entries(WEEKDAY_LABELS).map(([row, label]) => (
          <text
            key={label}
            x={0}
            y={monthHeight + Number(row) * step + blockSize * 0.8}
            fill="currentColor"
            fontSize={fontSize}
          >
            {label}
          </text>
        ))}
        {cells.map((cell) => (
          <rect
            key={cell.date}
            x={labelWidth + cell.col * step}
            y={monthHeight + cell.row * step}
            width={blockSize}
            height={blockSize}
            rx={2}
            style={{ fill: `var(--seq-${cell.level})` }}
          >
            <title>{`${cell.count} contributions on ${cell.date}`}</title>
          </rect>
        ))}
      </svg>
      <div className="mt-2 flex items-center justify-between gap-4">
        <span>{footer}</span>
        {showLegend && (
          <span className="inline-flex items-center gap-1" aria-hidden="true">
            Less
            {[0, 1, 2, 3, 4].map((level) => (
              <span
                key={level}
                className="inline-block rounded-[2px]"
                style={{
                  width: blockSize,
                  height: blockSize,
                  background: `var(--seq-${level})`,
                }}
              />
            ))}
            More
          </span>
        )}
      </div>
    </div>
  );
}
