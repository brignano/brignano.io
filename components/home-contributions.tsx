"use client";

import { useEffect, useState } from "react";
import ContributionCalendar from "@/components/contribution-calendar";
import { fetchContributions, type ContributionYear } from "@/lib/contributions";
import { useNearViewport } from "@/lib/use-near-viewport";

type State =
  | { status: "idle" | "loading" }
  | { status: "ready"; data: ContributionYear }
  | { status: "error" };

/**
 * Calm, restrained contribution preview for the homepage. Uses the **current
 * calendar year** (matching the full /coding calendar) rather than a trailing
 * 12-month window: most public activity lands in the current year, so this puts
 * the active months on the left where the overflow container shows them first,
 * instead of leading with last year's empty months (work commits live on a
 * private GitHub Enterprise that never reaches this public graph). Real data
 * only; the year selector, legend, and color legend chrome live on /coding.
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

  useEffect(() => {
    if (!near || state.status !== "idle") return;
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
  }, [near, state.status, username]);

  return (
    <div className="overflow-x-auto -mx-1 px-1 py-1">
      <div ref={ref} className="min-w-[320px] min-h-[140px]">
        {state.status === "ready" && (
          <ContributionCalendar
            data={state.data}
            blockSize={11}
            blockMargin={4}
            fontSize={12}
            showLegend={false}
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
