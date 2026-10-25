import type { Metadata } from "next";
import Link from "next/link";
import BreadcrumbSchema from "@/components/breadcrumb-schema";
import { formatPostDate, getAllPosts } from "@/lib/blog";

const TITLE = "Blog — Anthony Brignano";
const DESCRIPTION =
  "Writing on platform engineering, developer experience and the homelab: what I built, what broke, and what I would do differently.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: {
    canonical: "/blog",
    types: { "application/rss+xml": "/rss.xml" },
  },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "https://brignano.io/blog",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
};

const BLOG_BREADCRUMBS = [
  { name: "Home", url: "https://brignano.io" },
  { name: "Blog", url: "https://brignano.io/blog" },
];

export default async function Blog() {
  const posts = await getAllPosts();

  return (
    <>
      <BreadcrumbSchema items={BLOG_BREADCRUMBS} />
      <main className="max-w-6xl mx-auto md:px-16 px-6 lg:mt-24 mt-16 pb-12">
        <header className="mb-12 md:mb-16 max-w-3xl">
          <h1 className="font-sans text-4xl sm:text-5xl font-bold tracking-tight mb-4">
            Blog
          </h1>
          <p className="text-ink-soft text-lg">
            Longer notes on the things the rest of this site only lists:
            platform engineering, developer experience, and the homelab where I
            try ideas before they are anyone else&apos;s problem.{" "}
            <a href="/rss.xml" className="underline text-interactive-ink">
              RSS
            </a>
            .
          </p>
        </header>

        {posts.length === 0 ? (
          <p className="text-slate">Writing soon.</p>
        ) : (
          <>
            {/* The post titles are h3s; headings must descend in order. */}
            <h2 className="sr-only">Posts</h2>
            <ol className="max-w-3xl divide-y divide-line border-y border-line">
              {posts.map((post) => (
                <li key={post.slug}>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="group block py-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-interactive-ink rounded-sm"
                  >
                    <p className="text-sm text-slate mb-2">
                      <time dateTime={post.date}>
                        {formatPostDate(post.date)}
                      </time>{" "}
                      · {post.readingTime} min read
                      {!post.published && (
                        <span className="ml-2 text-attention-ink">Draft</span>
                      )}
                    </p>
                    <h3 className="text-xl sm:text-2xl font-semibold tracking-tight text-ink mb-2 group-hover:text-interactive-ink transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-ink-soft">{post.description}</p>
                  </Link>
                </li>
              ))}
            </ol>
          </>
        )}
      </main>
    </>
  );
}
