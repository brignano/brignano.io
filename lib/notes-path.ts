// /notes: the case studies (lib/work.ts) and the posts (lib/blog.ts) in one
// list. They used to be two pages, /work and /blog, that both read like long
// write-ups. next.config.ts redirects the old addresses here.
//
// The page name is still being decided, so the visible label lives here
// alone. Renaming the address too means moving app/notes/ and updating the
// redirects in next.config.ts, PAGES in lib/pages.ts and the scripts
// that list routes (fold-check, lighthouserc).
//
// No server-only imports here, so client components (the home page) can use
// it. The list itself is built in lib/notes.ts.
export const NOTES_LABEL = "Notes";
export const NOTES_PATH = "/notes";

export const noteHref = (slug: string) => `${NOTES_PATH}/${slug}`;
