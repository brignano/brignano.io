/**
 * Theme application — the one place that knows what "dark" means to the DOM.
 *
 * Three things have to move together or the page renders one theme's tokens
 * under another theme's chrome:
 *   1. `.dark` on <html>   — what Tailwind's `dark:` variant reads
 *   2. `data-theme`        — what @brignano/design's tokens read
 *   3. <meta name="theme-color"> — what the *browser* paints outside the page
 *
 * (3) is the one that is easy to forget and only shows up on a phone. iOS
 * Safari and Android Chrome paint their toolbars and the rubber-band overscroll
 * gutter with `theme-color`, and that gutter is exactly what you expose when
 * you scroll to the bottom of the page. Declared with a `prefers-color-scheme`
 * media attribute alone it tracks the *system* theme, so a visitor who used the
 * in-page toggle to go against their OS got a dark page with light browser
 * chrome — colours that appear to change as you scroll into the gutter.
 * Resolving it in JS, off the same boolean as the class, keeps it honest.
 *
 * The pre-paint inline script in app/layout.tsx duplicates this logic on
 * purpose — it has to run before hydration, so it cannot import. THEME_COLORS
 * is interpolated into it so the hexes still live in exactly one place.
 */

/** The `--bg` token in each theme (tokens.css: --n-25 / --n-0). A <meta> tag
 *  cannot read a CSS custom property, so these are literals and must move with
 *  the tokens. */
export const THEME_COLORS = {
  light: "#fafafa",
  dark: "#0d0d0f",
} as const;

/** Point every theme-color <meta> at the resolved theme. The `media` attribute
 *  is dropped as well as the content rewritten: the browser uses the first tag
 *  whose media matches, so leaving a system-scoped tag in place would let it
 *  win over the toggle it is meant to follow. */
export function syncThemeColor(dark: boolean): void {
  const color = dark ? THEME_COLORS.dark : THEME_COLORS.light;
  document
    .querySelectorAll<HTMLMetaElement>('meta[name="theme-color"]')
    .forEach((meta) => {
      meta.removeAttribute("media");
      meta.setAttribute("content", color);
    });
}

/** Apply a theme to the document: class, data attribute, and browser chrome. */
export function applyTheme(dark: boolean): void {
  const root = document.documentElement;
  root.classList.toggle("dark", dark);
  root.setAttribute("data-theme", dark ? "dark" : "light");
  syncThemeColor(dark);
}

/** The theme the visitor should get: their stored choice, else the OS.
 *  Deliberately the same expression as the inline script's — if the two ever
 *  disagree, the difference is a flash of the wrong theme at hydration. */
export function resolveTheme(): boolean {
  let stored: string | null = null;
  try {
    stored = localStorage.theme ?? null;
  } catch {
    /* Private mode / storage disabled — fall back to the OS preference. */
  }
  return (
    stored === "dark" ||
    (!stored && window.matchMedia("(prefers-color-scheme: dark)").matches)
  );
}
