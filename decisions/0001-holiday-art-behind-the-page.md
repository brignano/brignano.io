# ADR-0001: Holiday art sits behind the page and nothing floats

**Status:** superseded by [ADR-0005](0005-holiday-is-a-greeting.md) · accepted 2026-11-08 · PR #328

## Context

The holiday themes first drew drifting and falling pieces (leaves, snow, bats)
over the page, a first-visit banner and a popover that opened on its own. All
of them covered the landing content and made the text hard to read.

## Decision

- The art layer sits behind the content and is anchored to the screen edges:
  a garland along the top under the header, pieces at the bottom and corners.
- Nothing travels across the page. Only slow in-place twinkle or flicker is
  allowed, and it stops under reduced motion.
- Once the visitor scrolls in to read, the layer fades to a trace.
- Nothing opens on its own. The holiday controls live in a header button
  next to the theme toggle, marked with a dot until it is first opened.

## Consequences

A new holiday scene is static edge or corner pieces only. Banners, toasts and
auto-opened popovers for themes are out.
