import { NOTES_LABEL, NOTES_PATH } from "@/lib/notes-path";

// The top-level pages, in the order the header shows them. The header's links
// and the "Next" card at the bottom of each page both read this list, so the
// card always walks the pages in the same order as the nav. Reordering the
// nav is a change here and nowhere else.
//
// `teaser` is the line the "Next" card shows when this page is the one coming
// up. The last page's card points at the contact section on the home page.
export type SitePage = { path: string; label: string; teaser: string };

export const PAGES: readonly SitePage[] = [
  { path: "/projects", label: "Projects", teaser: "The things I've built" },
  { path: "/resume", label: "Resume", teaser: "Where I've worked and what I led" },
  { path: "/coding", label: "Coding", teaser: "What I'm building right now" },
  { path: NOTES_PATH, label: NOTES_LABEL, teaser: "The stories behind the work" },
];

const AFTER_LAST = {
  href: "/#contact",
  kicker: "Next: Say hello",
  title: "Questions about any of these? Get in touch",
};

/** The page after `pathname` in nav order, or null off the top-level pages. */
export function nextPage(pathname: string) {
  const i = PAGES.findIndex((p) => p.path === pathname);
  if (i === -1) return null;
  const next = PAGES[i + 1];
  if (!next) return AFTER_LAST;
  return { href: next.path, kicker: `Next: ${next.label}`, title: next.teaser };
}
