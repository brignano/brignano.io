# design/ — vendored, temporary

Copied from [`brignano/design`](https://github.com/brignano/design), the canonical
source. **Do not edit these files here** — change them there and re-sync, or the
drift this system exists to prevent comes straight back.

This directory exists only because `brignano/design` is currently **private**,
which blocks both the git-dependency install and jsDelivr. The moment it is
public this becomes:

```jsonc
"dependencies": { "@brignano/design": "github:brignano/design#v1.0.0" }
```

```css
@import "@brignano/design/tokens.css";
```

…and this directory is deleted. Same temporary arrangement exists in `life`.
