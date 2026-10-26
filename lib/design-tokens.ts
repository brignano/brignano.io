/**
 * Runtime access to the design-system CSS custom properties.
 *
 * Some consumers (the chart palette) take colours as JS strings
 * and cannot read `var(--token)`. Rather than hardcode hexes next to them —
 * which is exactly how this codebase ended up with three unrelated palettes —
 * these helpers resolve the token to a colour at runtime.
 *
 * Since @brignano/design 0.3.0 every colour token is a single
 * `light-dark(<light>, <dark>)` declaration (DESIGN.md §11), so
 * `getPropertyValue("--chart-1")` returns that declaration text, not a colour.
 * The token is resolved instead by painting it onto a probe element and reading
 * the computed `color`, which is where `color-scheme` picks the side. Values
 * depend on the theme, so re-read them whenever it changes (`subscribeTheme`).
 *
 * The fallbacks are only for SSR and the pre-hydration frame. They MUST stay in
 * sync with `design/tokens.chart.css` (light side); that file is the source of
 * truth.
 */

/** Resolve several colour tokens with one probe element. SSR-safe. */
export function readTokens(
  entries: readonly (readonly [string, string])[],
): string[] {
  if (typeof document === "undefined" || !document.body) {
    return entries.map(([, f]) => f);
  }
  const probe = document.createElement("span");
  probe.style.display = "none";
  document.body.appendChild(probe);
  try {
    return entries.map(([name, fallback]) => {
      probe.style.color = `var(${name}, ${fallback})`;
      return getComputedStyle(probe).color || fallback;
    });
  } finally {
    probe.remove();
  }
}

/** Resolve one colour token. SSR-safe. */
export function readToken(name: string, fallback: string): string {
  return readTokens([[name, fallback]])[0];
}

/**
 * Subscribe to theme changes: `data-theme` / `.dark` on <html> (what
 * `applyTheme` sets) and the OS preference behind them. Shaped for
 * `useSyncExternalStore`, with `themeSnapshot` / `serverThemeSnapshot`, so
 * token reads re-run when the theme flips.
 */
export function subscribeTheme(onChange: () => void): () => void {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-theme", "class"],
  });
  const mq = window.matchMedia("(prefers-color-scheme: dark)");
  mq.addEventListener("change", onChange);
  return () => {
    observer.disconnect();
    mq.removeEventListener("change", onChange);
  };
}

/** The current theme as a string key (client snapshot). */
export function themeSnapshot(): string {
  return (
    document.documentElement.getAttribute("data-theme") ??
    (window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "os-dark"
      : "os-light")
  );
}

/** Server snapshot: no document, so no theme — the fallbacks are used. */
export function serverThemeSnapshot(): string {
  return "";
}
