import { formatPostDate, getPostBySlug } from "@/lib/blog";
import { getNotes, noteHref, NOTES_PATH } from "@/lib/notes";
import { OG_CONTENT_TYPE, OG_SIZE, ogCard } from "@/lib/og-card";
import { getCaseStudy } from "@/lib/work";

// One share card per note, from the note itself: a case study's eyebrow and
// title from lib/work.ts, a post's date and title from its front matter.
// Retitling a note retitles its card on the next build. See lib/og-card.tsx.
type Params = Promise<{ slug: string }>;

export const dynamicParams = false;
// Static alt, because a per-note alt (generateImageMetadata) would move the
// card to /opengraph-image/<id>. The headline is in og:title beside it anyway.
export const alt = "A note by Anthony Brignano";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export async function generateStaticParams() {
  return (await getNotes()).map((n) => ({ slug: n.slug }));
}

async function card(slug: string) {
  const study = getCaseStudy(slug);
  if (study) return { eyebrow: study.eyebrow, title: study.title };
  const post = await getPostBySlug(slug);
  if (!post) throw new Error(`og: no note at ${noteHref(slug)}`);
  return { eyebrow: `Note · ${formatPostDate(post.date)}`, title: post.title };
}

export default async function Image({ params }: { params: Params }) {
  const slug = (await params).slug;
  // The section, not the slug: a long slug crowded the header lockup.
  return ogCard({ path: NOTES_PATH, ...(await card(slug)) });
}
