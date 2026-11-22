# ADR-0005: A holiday is a greeting, not decorations

**Status:** accepted · 2026-11-22 · wireframe #358
**Supersedes:** [ADR-0001](0001-holiday-art-behind-the-page.md)

## Context

Even after ADR-0001 moved the art behind the page and stopped it moving,
Anthony wasn't sure he liked the holiday theme. The garland and the pumpkin
row read as a seasonal add-on to a site that had no look of its own, and the
holiday button took the best spot in the header for something people use
once. The idea was still the most human thing on the site.

## Decision

- While a holiday is on, the now bar under the header shows one greeting
  ("Happy Thanksgiving", or the holiday's own `greeting` in lib/holidays.ts).
- The greeting opens a popover: what the holiday is, a link to read more, and
  "Hide this greeting", remembered per holiday.
- No art, garland, glow or header button. Nothing opens or moves on its own.

## Consequences

Adding a holiday is a date window, a line in lib/holiday-info.ts and,
if "Happy <label>" doesn't fit, a greeting. No drawing.
