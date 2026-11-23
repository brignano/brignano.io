# ADR-0006: The bar under the header is for holidays only

**Status:** accepted · 2026-11-23
**Amends:** [ADR-0005](0005-holiday-is-a-greeting.md)

## Context

The mono line under the header showed Connecticut time, the last public
commit and what Anthony is building, plus the holiday greeting. Most visitors
aren't technical, and to them those facts meant little: a permanent strip of
noise above the first thing they read.

## Decision

- The bar shows only while a holiday is on, and holds just the greeting.
- The whole bar has a close button. Closing it is remembered per holiday, so
  the next holiday still greets.
- The greeting's popover keeps what the holiday is and a link; the "Hide this
  greeting" link moves to the bar's close button.
- The bar is laid over a slot that is always there, so it appearing after
  hydration or being closed never moves the page.
- `/api/now` (the last-commit lookup) goes, since nothing reads it.

## Consequences

The rest of the year the header sits directly above the page. "What I'm
building" still lives on /coding.
