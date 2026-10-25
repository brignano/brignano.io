"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import ContributionCalendar, {
  weeksThatFit,
} from "@/components/contribution-calendar";
import { fetchContributions, type ContributionYear } from "@/lib/contributions";
import { useNearViewport } from "@/lib/use-near-viewport";

const SIZES = { blockSize: 11, blockMargin: 4, fontSize: 12 };

type State =
  | { status: "idle" | "loading" }
  | { status: "ready"; data: ContributionYear }
  | { status: "error" };

/**
 * Calm, restrained contribution preview for the homepage. Uses the **current
 * calendar year** (matching the full /coding calendar) rather than a trailing
 * 12-month window, so it never leads with last year's empty months (work
 * commits live on a private GitHub Enterprise that never reaches this public
 * graph). The grid is cut to as many of the latest weeks as fit the card, so
 * the most recent activity is always in view with no sideways scroll; the full
 * year, year selector, and color legend live on /coding.
 *
 * The homepage is a client component, so the data is fetched in the browser —
 * but only once the section scrolls near the viewport, and rendered by the same
 * dependency-free SVG calendar the server uses on /coding.
 */
export default function HomeContributions({
  username = "brignano",
}: {
  username?: string;
}) {
  const [ref, near] = useNearViewport<HTMLDivElement>();
  const [state, setState] = useState<State>({ status: "idle" });
  const boxRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState<number | null>(null);

  // Track the card's inner width so the grid can be cut to what fits.
  useLayoutEffect(() => {
    const el = boxRef.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(([entry]) =>
      setWidth(Math.floor(entry.contentRect.width))
    );
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Fallback for browsers without ResizeObserver: the grid overflows, so open
  // the scroller at its right end, where the latest weeks are.
  useLayoutEffect(() => {
    const el = boxRef.current;
    if (el && state.status === "ready") el.scrollLeft = el.scrollWidth;
  }, [state.status, width]);

  useEffect(() => {
    // `near` only ever flips false → true, so this runs the fetch once. Don't
    // depend on `state.status`: the "loading" update would re-run the effect
    // and its cleanup would abort the request it just started.
    if (!near) return;
    const controller = new AbortController();
    // eslint-disable-next-line react-hooks/set-state-in-effect -- kicks off the one fetch, once the section is near
    setState({ status: "loading" });
    fetchContributions(username, new Date().getFullYear(), {
      signal: controller.signal,
    })
      .then((data) => setState({ status: "ready", data }))
      .catch((err) => {
        if (err?.name !== "AbortError") setState({ status: "error" });
      });
    return () => controller.abort();
  }, [near, username]);

  return (
    <div ref={boxRef} className="overflow-x-auto py-1">
      <div ref={ref} className="min-h-[140px]">
        {state.status === "ready" && (
          <ContributionCalendar
            data={withoutFutureDays(state.data)}
            {...SIZES}
            showLegend={false}
            maxWeeks={width ? weeksThatFit(width, SIZES) : undefined}
          />
        )}
        {state.status === "error" && (
          <p className="text-sm text-slate italic">
            Couldn&apos;t load the contribution graph from GitHub just now.
          </p>
        )}
      </div>
    </div>
  );
}

/** Today's date as YYYY-MM-DD in the visitor's time zone. */
function localToday() {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

/**
 * The API can return the rest of the year as empty days; drop them so the
 * right edge of the grid is this week, not December.
 */
function withoutFutureDays(data: ContributionYear): ContributionYear {
  const today = localToday();
  return { ...data, days: data.days.filter((d) => d.date <= today) };
}
