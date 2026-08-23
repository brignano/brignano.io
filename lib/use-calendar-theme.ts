"use client";

import { useMemo } from "react";
import { readTokens } from "@/lib/design-tokens";

/**
 * The contribution-graph intensity ramp, resolved from the design tokens.
 *
 * Contribution intensity is a SEQUENTIAL scale — "how much", not "which one" —
 * so it is one hue, light to dark (design/tokens.chart.css, --seq-0..4). Level 0
 * is neutral on purpose: no contributions is the absence of a value, not a small
 * amount of the hue.
 *
 * react-github-calendar takes plain strings, so the values are read off <html>
 * at runtime rather than hardcoded beside the component. The literals below are
 * SSR / pre-hydration fallbacks and MUST match design/tokens.chart.css.
 */
const SEQ_TOKENS = [
  ["--seq-0", "#ececea"],
  ["--seq-1", "#c7dcfb"],
  ["--seq-2", "#8ab4f4"],
  ["--seq-3", "#3b82f6"],
  ["--seq-4", "#1d4ed8"],
] as const;

const LIGHT_FALLBACK = SEQ_TOKENS.map(([, hex]) => hex);
const DARK_FALLBACK = ["#202024", "#1e3a8a", "#1d4ed8", "#3b82f6", "#93c5fd"];

export function useCalendarTheme(
  mounted: boolean,
  colorScheme: "light" | "dark",
) {
  return useMemo(() => {
    if (!mounted) return { light: LIGHT_FALLBACK, dark: DARK_FALLBACK };
    // The tokens resolve to whichever theme is currently active, and the
    // library only reads the ramp matching `colorScheme` — so put the resolved
    // values in that slot and leave the other on its fallback.
    const active = readTokens(SEQ_TOKENS);
    return colorScheme === "dark"
      ? { light: LIGHT_FALLBACK, dark: active }
      : { light: active, dark: DARK_FALLBACK };
  }, [mounted, colorScheme]);
}
