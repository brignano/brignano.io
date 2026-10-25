import { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/blog";
import { caseStudies } from "@/lib/work";

export const dynamic = "force-static";

// No `lastModified`: it used to be stamped with the build time, so every
// deploy (including dependency bumps) told search engines all four pages had
// just changed. A date that is always "now" carries no information; leaving
// it out lets crawlers use their own change detection instead.
//
// Posts are the exception: their frontmatter carries a real date, so they
// say when they last changed.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://brignano.io";

  return [
    { url: baseUrl, changeFrequency: "monthly", priority: 1 },
    { url: `${baseUrl}/work`, changeFrequency: "monthly", priority: 0.9 },
    ...caseStudies.map((c) => ({
      url: `${baseUrl}/work/${c.slug}`,
      changeFrequency: "yearly" as const,
      priority: 0.8,
    })),
    { url: `${baseUrl}/blog`, changeFrequency: "weekly", priority: 0.8 },
    ...(await getAllPosts())
      .filter((p) => p.published)
      .map((p) => ({
        url: `${baseUrl}/blog/${p.slug}`,
        lastModified: p.updated ?? p.date,
        changeFrequency: "yearly" as const,
        priority: 0.7,
      })),
    { url: `${baseUrl}/projects`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/resume`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/coding`, changeFrequency: "monthly", priority: 0.8 },
  ];
}
