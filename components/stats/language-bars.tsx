import type { StatsData } from "@/types/wakatime";

const TOP = 5;
/** Languages under six minutes are noise (a stray config file). */
const MIN_SECONDS = 360;

function hoursText(seconds: number) {
  const h = seconds / 3600;
  return `${h >= 10 ? Math.round(h).toLocaleString("en-US") : h.toFixed(1)} hrs`;
}

function Bar({ name, seconds, max }: StatsData & { max: number }) {
  const pct = Math.max(1, (seconds / max) * 100);
  return (
    <li className="grid grid-cols-[minmax(0,1fr)_auto] gap-x-3 gap-y-1">
      <span className="truncate">{name}</span>
      <span className="text-sm text-slate tabular-nums">{hoursText(seconds)}</span>
      <span
        className="col-span-2 h-2 overflow-hidden rounded-full"
        style={{ background: "var(--seq-0)" }}
        aria-hidden="true"
      >
        <span
          className="block h-full rounded-full"
          style={{ width: `${pct}%`, background: "var(--seq-3)" }}
        />
      </span>
    </li>
  );
}

/**
 * Hours per language, all time: the top five as bars, the rest behind a
 * native <details> toggle, so it renders on the server and ships no script.
 * WakaTime's own "Other" bucket always sits last.
 */
export default function LanguageBars({ data }: { data: StatsData[] }) {
  const merged = new Map<string, number>();
  for (const d of data) {
    if (d.seconds < MIN_SECONDS) continue;
    merged.set(d.name, (merged.get(d.name) ?? 0) + d.seconds);
  }
  const other = merged.get("Other") ?? 0;
  merged.delete("Other");
  const sorted = [...merged.entries()]
    .map(([name, seconds]) => ({ name, seconds }))
    .sort((a, b) => b.seconds - a.seconds);
  if (other > 0) sorted.push({ name: "Other", seconds: other });
  if (sorted.length === 0) return null;

  const max = Math.max(...sorted.map((d) => d.seconds));
  const top = sorted.slice(0, TOP);
  const rest = sorted.slice(TOP);

  return (
    <div>
      <ul className="flex flex-col gap-3">
        {top.map((d) => (
          <Bar key={d.name} {...d} max={max} />
        ))}
      </ul>
      {rest.length > 0 && (
        <details className="group mt-3">
          <summary className="inline-flex min-h-10 cursor-pointer list-none items-center gap-1.5 text-[0.95rem] text-interactive-ink [&::-webkit-details-marker]:hidden">
            <span className="group-open:hidden">
              Show all {sorted.length} languages
            </span>
            <span className="hidden group-open:inline">Show top five</span>
            <span aria-hidden="true" className="transition-transform group-open:rotate-180">
              ▾
            </span>
          </summary>
          <ul className="mt-2 flex flex-col gap-3">
            {rest.map((d) => (
              <Bar key={d.name} {...d} max={max} />
            ))}
          </ul>
        </details>
      )}
    </div>
  );
}
