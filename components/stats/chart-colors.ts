import { readTokens, readToken } from "@/lib/design-tokens";

/**
 * Categorical chart palette — see design/tokens.chart.css and DECISIONS.md
 * ADR-0002 for why these specific values and this specific order.
 *
 * Two rules this module exists to enforce, both of which the previous
 * implementation broke:
 *
 *  1. FIXED ORDER, NEVER CYCLED. The old code did `COLORS[i % COLORS.length]`,
 *     which silently reuses hues once you pass the end of the palette — two
 *     different series rendered identically. There is no 9th colour: anything
 *     past slot 8 is "Other".
 *
 *  2. COLOUR FOLLOWS THE ENTITY, NOT ITS RANK. The old index came from the
 *     sorted position, so any data shift — a new week, a filter — repainted
 *     every series and the chart appeared to change meaning. Slots are now
 *     assigned per entity name on first sight and held for the session.
 */

/** SSR fallbacks. Must match design/tokens.chart.css (light mode). */
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

/** Resolved slot colours for the current theme. */
export function chartColors(): string[] {
  return readTokens(SLOT_TOKENS);
}

/** The aggregate bucket. Neutral on purpose — "Other" is not an entity. */
export function chartOther(): string {
  return readToken("--chart-other", "#8a8a8f");
}

/**
 * Stable entity -> slot assignment, first-seen order, held for the session.
 * A filter that drops a series therefore leaves every survivor's colour alone.
 */
const slots = new Map<string, number>();

export function slotFor(name: string): number | null {
  if (name === "Other") return null;
  const existing = slots.get(name);
  if (existing !== undefined) return existing;
  if (slots.size >= SLOT_COUNT) return null; // past slot 8 -> Other
  const next = slots.size;
  slots.set(name, next);
  return next;
}

/** Colour for a named series. Anything unslotted gets the neutral bucket. */
export function colorFor(name: string, palette?: string[]): string {
  const p = palette ?? chartColors();
  const i = slotFor(name);
  return i === null ? chartOther() : p[i];
}

/** @deprecated Use colorFor(name) — indexing by position repaints on filter. */
export const CHART_COLORS = SLOT_TOKENS.map(([, hex]) => hex);
