import { getAllPosts } from "@/lib/blog";

// Built once at build time, like the sitemap. A new post reaches the feed on
// the deploy that publishes it.
export const dynamic = "force-static";

const escapeXml = (s: string) =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

const rfc822 = (date: string) => new Date(`${date}T00:00:00Z`).toUTCString();

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://brignano.io";
  const posts = (await getAllPosts()).filter((p) => p.published);

  const items = posts
    .map((post) => {
      const url = `${baseUrl}/blog/${post.slug}`;
      return `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${rfc822(post.date)}</pubDate>
      <description>${escapeXml(post.description)}</description>
${(post.tags ?? []).map((t) => `      <category>${escapeXml(t)}</category>`).join("\n")}
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Anthony Brignano — Blog</title>
    <link>${baseUrl}/blog</link>
    <description>Writing on platform engineering, developer experience and the homelab.</description>
    <language>en-us</language>
    <atom:link href="${baseUrl}/rss.xml" rel="self" type="application/rss+xml" />
${posts[0] ? `    <lastBuildDate>${rfc822(posts[0].updated ?? posts[0].date)}</lastBuildDate>\n` : ""}${items}
  </channel>
</rss>
`;

  return new Response(xml, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
}
