import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CaseStudyArticle, {
  caseStudyMetadata,
} from "@/components/case-study-article";
import PostArticle, { postMetadata } from "@/components/post-article";
import { getPostBySlug } from "@/lib/blog";
import { getNotes } from "@/lib/notes";
import { getCaseStudy } from "@/lib/work";

type Params = Promise<{ slug: string }>;

// Case studies and posts share this one address space (getNotes refuses a
// clash). Everything is prerendered; an unknown slug is a 404, not a
// request-time render, because the post files are not shipped with the server.
export const dynamicParams = false;

export async function generateStaticParams() {
  return (await getNotes()).map((n) => ({ slug: n.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  if (study) return caseStudyMetadata(study);
  const post = await getPostBySlug(slug);
  return post ? postMetadata(post) : {};
}

export default async function NotePage({ params }: { params: Params }) {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  if (study) return <CaseStudyArticle study={study} />;
  const post = await getPostBySlug(slug);
  if (!post) notFound();
  return <PostArticle post={post} />;
}
