@AGENTS.md

# Working on brignano.io

## Wireframes before UI work

Any substantial UI or UX change starts with wireframes, and waits for
Anthony's explicit OK before any implementation code. This is the rule in
`@brignano/design` DESIGN.md §16 ([on GitHub](https://github.com/brignano/design/blob/main/DESIGN.md#16-wireframes-before-building));
the short version:

- **Substantial:** a new page, route, section, component or email; a new flow
  or interaction (form, dialog, menu, popover, empty or error state, motion
  that tells the user something changed); or a change to the layout or
  structure of an existing page or component (sections added, removed or
  moved, header, footer, navigation, how it rearranges between phone and
  desktop).
- **Exempt:** copy edits, bug fixes that restore the intended design, small
  spacing or colour nudges, accessibility fixes that don't move anything,
  dependency bumps. When in doubt, wireframe.
- **What to make:** phone (390px) and desktop (1280px) widths. Static by
  default; an interactive prototype when flow, state or motion is the point.
  Real design tokens and real copy, demo data only.
- **How to share it:** see [`proposals/wireframes/README.md`](proposals/wireframes/README.md).
  A link Anthony can tap on his phone, plus phone and desktop screenshots and
  the options you rejected, one line each. Add `needs:anthony` and stop.
- **Then build** what was approved. The PR links the wireframe; its
  before/after screenshots are checked against it, and anything that departs
  from it is called out or goes back for approval first.
