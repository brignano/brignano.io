# ADR-0003: Case studies and posts share one list at /notes

**Status:** accepted · 2026-11-15 · PR #348 · wireframe `proposals/wireframes/work-and-posts.html`

## Context

Case studies lived at /work and posts at /blog: two thin lists, two nav links.

## Decision

Both are entries in one list at /notes, each tagged "Case study" or "Post",
with an All / Case studies / Posts filter kept in `?show=` so a link can open
on case studies alone. Every entry lives at `/notes/<slug>`; /work, /blog and
their pages redirect permanently. The label and path live in
`lib/notes-path.ts` so the name can change in one place.

## Consequences

The nav has four links. A new post or case study ships as a /notes entry;
links to /work/... or /blog/... are old paths.
