# Wireframes

Wireframes for substantial UI changes to brignano.io, made and approved
before the real work starts. The rule is in [`CLAUDE.md`](../../CLAUDE.md) and
[design DESIGN.md §16](https://github.com/brignano/design/blob/main/DESIGN.md#16-wireframes-before-building).

- **One file per change:** `proposals/wireframes/<slug>.html`, named after the
  issue or proposal. Nothing here is built or deployed by Next.js, so
  unreleased designs never reach the live site.
- **Start from design's template**,
  [`previews/wireframes/_template.html`](https://github.com/brignano/design/blob/main/previews/wireframes/_template.html):
  the same markup in a 390px phone frame and a 1280px desktop frame, laid out
  with `@container` queries so one set of rules shows both widths.
- **Make it self-contained.** Inline `tokens.css` (and `components.css` once
  the site uses it) from `node_modules/@brignano/design/` into a `<style>`
  block, so the file works on its own wherever it is opened.
- **Interactive when it matters.** A flow, state change or motion gets wired
  up in the file: buttons that open the dialog, steps that advance, the
  animation at real speed.
- **How Anthony sees it.** Publish the file as a private Artifact and post the
  link, with phone and desktop screenshots (light and dark if the change
  touches colour) in the thread. Add `needs:anthony` to the issue and stop
  until he says OK.
- **Then build.** Commit the approved file here with the implementation PR
  and link it from the PR body. It stays as the record of what was agreed.
