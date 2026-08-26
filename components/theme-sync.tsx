"use client";

import { useEffect, useLayoutEffect } from "react";
import { applyTheme, resolveTheme } from "@/lib/theme";

// `useLayoutEffect` runs after React's DOM mutations but *before* the browser
// paints, so restoring the class here never shows a light frame. It warns when
// called during SSR, hence the swap — this component renders nothing either way.
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

/**
 * Re-applies the theme after hydration.
 *
 * The inline <head> script sets `.dark` and `data-theme` before first paint, but
 * React reconciles `<html>`'s className while hydrating and drops the class the
 * script added — `suppressHydrationWarning` silences the warning without
 * stopping the patch. The visible result was a system-dark visitor getting light
 * chrome: `@brignano/design` flips its tokens off `prefers-color-scheme` on its
 * own, so the cards went dark while everything driven by Tailwind's `dark:`
 * variant stayed light.
 *
 * This must stay in sync with the inline script in `app/layout.tsx` — that one
 * prevents the flash, this one survives hydration. Neither is redundant. Both
 * go through `applyTheme`, which also repoints <meta name="theme-color"> at the
 * resolved theme so the browser's own chrome matches the page (lib/theme.ts).
 */
export default function ThemeSync() {
  useIsomorphicLayoutEffect(() => {
    applyTheme(resolveTheme());
  }, []);

  return null;
}
