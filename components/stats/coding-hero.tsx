import type { NowItem } from "@/lib/constants";

interface CodingHeroProps {
  /** Whole hours tracked, or null when only the text total is known. */
  totalHours: number | null;
  totalTimeText: string;
  dailyAverageText: string;
  trackingSince?: string | null;
  bestDay?: { date: string; text: string } | null;
  nowBuilding: NowItem[];
}

function formatDate(date?: string | null): string | null {
  if (!date) return null;
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return date;
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}

/** "Dec 11 2020" -> "Dec 2020" for the one-line lede. */
function monthYear(text: string) {
  const parts = text.split(/\s+/);
  return parts.length >= 3 ? `${parts[0]} ${parts[parts.length - 1]}` : text;
}

function NowBuilding({ items }: { items: NowItem[] }) {
  if (items.length === 0) return null;
  return (
    <div className="flex flex-col gap-1.5 border-t border-line pt-4 text-[0.95rem] lg:border-t-0 lg:pt-0">
      <p className="eyebrow">
        Now building
      </p>
      <ul className="flex flex-col gap-1.5">
        {items.map((item) => (
          <li key={item.label}>
            {item.href ? (
              <a
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-ink underline decoration-dotted decoration-line-strong underline-offset-4 hover:decoration-interactive-ink"
              >
                {item.label}
              </a>
            ) : (
              <span className="font-semibold text-ink">{item.label}</span>
            )}{" "}
            <span className="text-slate">{item.detail}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

// The page opens on one number: editor time WakaTime has tracked. One line
// says what it covers, one line of facts backs it up, and "Now building" sits
// beside it so the page says what Anthony is working on before any chart.
export default function CodingHero({
  totalHours,
  totalTimeText,
  dailyAverageText,
  trackingSince,
  bestDay,
  nowBuilding,
}: CodingHeroProps) {
  const bestDayDate = formatDate(bestDay?.date);

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-end lg:gap-16">
      <div className="flex flex-col gap-3">
        <div className="font-sans font-bold tracking-tight leading-none tabular-nums text-[3.25rem] md:text-7xl">
          {totalHours !== null ? (
            <>
              {totalHours.toLocaleString("en-US")}
              <span className="ml-2 text-xl md:text-2xl font-semibold tracking-normal text-ink-soft">
                hours
              </span>
            </>
          ) : (
            totalTimeText
          )}
        </div>
        <p className="mt-2 max-w-[58ch] text-base md:text-lg text-ink-soft">
          Tracked by WakaTime
          {trackingSince ? ` since ${monthYear(trackingSince)}` : ""}, across
          every machine. Most of it is private work that never reaches GitHub.
        </p>
        {/* Says why the recent stretch is flatter, so it doesn't read as less
            coding. Kept on Anthony's call; it can go if the page reads
            better without it. */}
        <p className="max-w-[58ch] text-sm text-slate">
          These days much of my coding happens alongside AI agents like Claude
          Code, so editor hours tell less of the story than they used to.
        </p>
        <p className="flex flex-wrap gap-x-6 gap-y-1 text-[0.95rem] text-ink-soft">
          <span>
            <b className="font-semibold text-ink">{dailyAverageText}</b> a day
            on average
          </span>
          {bestDay?.text && (
            <span>
              Best day <b className="font-semibold text-ink">{bestDay.text}</b>
              {bestDayDate && ` (${bestDayDate})`}
            </span>
          )}
        </p>
      </div>
      <NowBuilding items={nowBuilding} />
    </div>
  );
}

// Shown in the number's place when WakaTime did not answer (API down, token
// rotated, rate limited). A "0 hours" headline would read as not coding at
// all, so this says plainly that the stats are missing for now.
export function CodingHeroUnavailable({ nowBuilding }: { nowBuilding: NowItem[] }) {
  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-end lg:gap-16">
      <div className="flex flex-col gap-3">
        <div className="font-sans text-2xl md:text-3xl font-bold tracking-tight">
          WakaTime isn&apos;t answering right now.
        </div>
        <p className="max-w-[58ch] text-base md:text-lg text-ink-soft">
          This is where the editor time WakaTime has tracked since 2020 usually
          goes. Check back shortly; the GitHub activity below is live.
        </p>
      </div>
      <NowBuilding items={nowBuilding} />
    </div>
  );
}
