/**
 * Runtime access to the design-system CSS custom properties.
 *
 * Some libraries (Recharts, react-github-calendar) take colours as JS strings
 * and cannot read `var(--token)`. Rather than hardcode hexes next to them —
 * which is exactly how this codebase ended up with three unrelated palettes —
 * these helpers read the resolved value off `<html>` at runtime.
 *
 * The fallbacks are only for SSR and the pre-hydration frame. They MUST stay in
 * sync with `design/tokens.chart.css`; that file is the source of truth.
 */

/** Read one custom property off the document root. SSR-safe. */
export function readToken(name: string, fallback: string): string {
  if (typeof document === "undefined") return fallback;
  const v = getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim();
  return v || fallback;
}

/** Read several at once — one getComputedStyle call instead of N. */
export function readTokens(
  entries: readonly (readonly [string, string])[],
): string[] {
  if (typeof document === "undefined") return entries.map(([, f]) => f);
  const cs = getComputedStyle(document.documentElement);
  return entries.map(([n, f]) => cs.getPropertyValue(n).trim() || f);
}
