# Wireframes

Where brignano.io keeps the wireframes the fleet rule asks for. The rule itself
(what counts as substantial, what a wireframe shows, the approval gate) is
"Wireframes before build" in brignano/ai-tools
[`fleet/README.md`](https://github.com/brignano/ai-tools/blob/main/fleet/README.md).
This file only covers how it works here.

- **One file per change:** `proposals/wireframes/<slug>.html`, named after the
  issue or proposal. Nothing here is built or deployed by Next.js, so
  unreleased designs never reach the live site.
- **Start from design's template**,
  [`previews/wireframes/_template.html`](https://github.com/brignano/design/blob/main/previews/wireframes/_template.html):
  the same markup in a phone frame and a desktop frame, laid out with
  `@container` queries so one set of rules shows both widths.
- **Make it self-contained.** Inline `tokens.css` (and `components.css` once
  the site uses it) from `node_modules/@brignano/design/` into a `<style>`
  block, so the file works on its own wherever it is opened.
- **How Anthony sees it.** There's no Vercel preview for these files, so
  publish the file as a private Artifact and share that link the way the fleet
  rule says.
- **Then build.** Commit the approved file here with the implementation PR.
  It stays as the record of what was agreed.
