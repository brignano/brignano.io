import { MetadataRoute } from "next";

export const dynamic = "force-static";

// No `lastModified`: it used to be stamped with the build time, so every
// deploy (including dependency bumps) told search engines all four pages had
// just changed. A date that is always "now" carries no information; leaving
// it out lets crawlers use their own change detection instead.
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://brignano.io";

  return [
    { url: baseUrl, changeFrequency: "monthly", priority: 1 },
    { url: `${baseUrl}/projects`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/resume`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/coding`, changeFrequency: "monthly", priority: 0.8 },
  ];
}
