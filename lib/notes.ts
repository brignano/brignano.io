// The /notes list: case studies, then posts. Naming and paths are in
// lib/notes-path.ts.
import { formatPostDate, getAllPosts } from "@/lib/blog";
import { noteHref } from "@/lib/notes-path";
import { caseStudies } from "@/lib/work";

export { NOTES_LABEL, NOTES_PATH, noteHref } from "@/lib/notes-path";

export type NoteKind = "case-study" | "post";

export interface NoteEntry {
  kind: NoteKind;
  slug: string;
  href: string;
  title: string;
  summary: string;
  /** Posts only: ISO date, its display form, and whole minutes. */
  date?: string;
  dateLabel?: string;
  readingTime?: number;
  draft?: boolean;
}

/**
 * Case studies first (they have no dates, and they are what a recruiter came
 * for), then posts newest first. Case studies and posts share one address
 * space, so a post can never reuse a case study's slug.
 */
export async function getNotes(): Promise<NoteEntry[]> {
  const posts = await getAllPosts();
  const studySlugs = new Set(caseStudies.map((c) => c.slug));
  const clash = posts.find((p) => studySlugs.has(p.slug));
  if (clash) {
    throw new Error(
      `Post "${clash.slug}" has the same slug as a case study; both would live at ${noteHref(clash.slug)}.`
    );
  }

  return [
    ...caseStudies.map((c): NoteEntry => ({
      kind: "case-study",
      slug: c.slug,
      href: noteHref(c.slug),
      title: c.title,
      summary: c.lede,
    })),
    ...posts.map((p): NoteEntry => ({
      kind: "post",
      slug: p.slug,
      href: noteHref(p.slug),
      title: p.title,
      summary: p.description,
      date: p.date,
      dateLabel: formatPostDate(p.date),
      readingTime: p.readingTime,
      draft: !p.published,
    })),
  ];
}
