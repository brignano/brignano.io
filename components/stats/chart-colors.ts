import { readTokens, readToken } from "@/lib/design-tokens";

/**
 * Categorical chart palette — see design/tokens.chart.css and DECISIONS.md
 * ADR-0002 for why these values and this order.
 *
 * Two rules this module enforces:
 *
 *  1. FIXED ORDER, NEVER CYCLED. No `COLORS[i % COLORS.length]` — that
 *     silently reuses hues past the end of the palette, drawing two different
 *     series identically. There is no 9th colour; past slot 8 is "Other".
 *
 *  2. COLOUR FOLLOWS THE ENTITY, NOT ITS RANK. Slots are assigned from the
 *     chart's own full series list, so hiding or reordering series leaves
 *     every survivor's colour alone.
 *
 * Slots are assigned PER CHART. An earlier version kept one module-level map
 * shared by every chart on the page; the first chart consumed all 8 slots and
 * every chart below it rendered entirely in the neutral "Other" grey.
 */

/** SSR fallbacks. Must match design/tokens.chart.css (the light side of each
 *  light-dark() pair). */
const SLOT_TOKENS = [
  ["--chart-1", "#2a78d6"],
  ["--chart-2", "#eb6834"],
  ["--chart-3", "#1baf7a"],
  ["--chart-4", "#eda100"],
  ["--chart-5", "#e87ba4"],
  ["--chart-6", "#008300"],
  ["--chart-7", "#4a3aa7"],
  ["--chart-8", "#e34948"],
] as const;

export const SLOT_COUNT = SLOT_TOKENS.length;

/** SSR fallback for "Other": --chart-other is --slate, light side. */
const OTHER_FALLBACK = "#6b6b73";

/** Resolved slot colours for the current theme. `resolve: false` returns the
 *  SSR fallbacks, so the hydrating render matches the server's markup. */
export function chartColors(resolve = true): string[] {
  return resolve ? readTokens(SLOT_TOKENS) : SLOT_TOKENS.map(([, f]) => f);
}

/** The aggregate bucket. Neutral on purpose — "Other" is not an entity. */
export function chartOther(resolve = true): string {
  return resolve ? readToken("--chart-other", OTHER_FALLBACK) : OTHER_FALLBACK;
}

export type ChartPalette = (name: string) => string;

/**
 * Build a colour lookup for ONE chart.
 *
 * `names` should be the chart's complete series list (before any display
 * filtering), so the mapping stays put when the visible set changes. Names
 * past slot 8, and the literal "Other" bucket, get the neutral.
 *
 * Pass `resolve: false` while hydrating (no theme known yet) to get the same
 * fallbacks the server rendered; resolve once the theme is known.
 */
export function buildPalette(
  names: readonly string[],
  resolve = true,
): ChartPalette {
  const colors = chartColors(resolve);
  const other = chartOther(resolve);
  const slots = new Map<string, number>();
  for (const n of names) {
    if (n === "Other" || slots.has(n)) continue;
    if (slots.size >= SLOT_COUNT) break;
    slots.set(n, slots.size);
  }
  return (name: string) => {
    const i = slots.get(name);
    return i === undefined ? other : colors[i];
  };
}
