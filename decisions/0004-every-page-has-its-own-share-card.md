# ADR-0004: Every page has its own share card, drawn from its own data

**Status:** accepted · 2026-11-15 · PR #349

## Context

The home share card was a hand-drawn copy of the first screen and fell out of
date when the hero changed. Other pages had no card at all, because a page's
own `openGraph` metadata replaces the inherited image.

## Decision

- One renderer, `lib/og-card.tsx`, with colours read from
  `@brignano/design`'s `tokens.css` at build time, never retyped.
- Each page has its own `opengraph-image.tsx` and `twitter-image.tsx`, fed
  the same constants and data the page renders.
- `npm run check:og` runs in CI and fails when a page has no card of its own.

## Consequences

A new page ships with its two card files, or CI fails.
