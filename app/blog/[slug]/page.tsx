import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import rehypePrettyCode from "rehype-pretty-code";
import BreadcrumbSchema from "@/components/breadcrumb-schema";
import { mdxComponents } from "@/components/mdx";
import { formatPostDate, getAllPosts, getPostBySlug } from "@/lib/blog";

type Params = Promise<{ slug: string }>;

// Every post is prerendered. An unknown slug is a 404, not a request-time
// render: the post files are not shipped with the server.
export const dynamicParams = false;

export async function generateStaticParams() {
  return (await getAllPosts()).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const post = await getPostBySlug((await params).slug);
  if (!post) return {};
  const title = `${post.title} — Anthony Brignano`;
  const url = `https://brignano.io/blog/${post.slug}`;
  return {
    title,
    description: post.description,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      title,
      description: post.description,
      url,
      type: "article",
      publishedTime: post.date,
      modifiedTime: post.updated,
      tags: post.tags,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: post.description,
    },
  };
}

export default async function PostPage({ params }: { params: Params }) {
  const post = await getPostBySlug((await params).slug);
  if (!post) notFound();

  const url = `https://brignano.io/blog/${post.slug}`;
  const blogPosting = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.updated ?? post.date,
    url,
    mainEntityOfPage: url,
    keywords: post.tags,
    author: {
      "@type": "Person",
      name: "Anthony Brignano",
      url: "https://brignano.io",
    },
  };

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "https://brignano.io" },
          { name: "Blog", url: "https://brignano.io/blog" },
          { name: post.title, url },
        ]}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          // Escape "<" so the JSON can never close the script tag early.
          __html: JSON.stringify(blogPosting).replace(/</g, "\\u003c"),
        }}
      />
      <main className="max-w-7xl mx-auto md:px-16 px-6 lg:mt-24 mt-16 pb-12">
        <article className="max-w-3xl">
          <header className="mb-10">
            <p className="text-sm text-slate mb-4">
              <time dateTime={post.date}>{formatPostDate(post.date)}</time> ·{" "}
              {post.readingTime} min read
              {post.updated && (
                <>
                  {" "}
                  · Updated{" "}
                  <time dateTime={post.updated}>
                    {formatPostDate(post.updated)}
                  </time>
                </>
              )}
            </p>
            <h1 className="font-sans font-bold tracking-tight text-4xl sm:text-5xl mb-5 leading-[1.05]">
              {post.title}
            </h1>
            <p className="text-lg sm:text-xl text-ink-soft leading-relaxed">
              {post.description}
            </p>
            {post.tags && post.tags.length > 0 && (
              <ul className="flex flex-wrap gap-2 mt-6">
                {post.tags.map((tag) => (
                  <li
                    key={tag}
                    className="text-xs px-2.5 py-1 rounded-full border border-line-strong text-ink-soft"
                  >
                    {tag}
                  </li>
                ))}
              </ul>
            )}
          </header>

          <div className="prose prose-post border-t border-line pt-10">
            <MDXRemote
              source={post.body}
              components={mdxComponents}
              options={{
                mdxOptions: {
                  // Highlighting runs here, at build: the page ships
                  // highlighted markup and no highlighter JS. Both themes are
                  // emitted as CSS variables; globals.css picks one per theme.
                  rehypePlugins: [
                    [
                      rehypePrettyCode,
                      {
                        theme: { light: "github-light", dark: "github-dark" },
                        keepBackground: false,
                      },
                    ],
                  ],
                },
              }}
            />
          </div>

          <footer className="border-t border-line mt-12 pt-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <p className="text-sm text-slate max-w-md">
              Questions, corrections, or a war story of your own?{" "}
              <a
                href="mailto:hi@brignano.io"
                className="underline text-interactive-ink"
              >
                hi@brignano.io
              </a>
            </p>
            <Link
              href="/blog"
              className="text-sm text-interactive-ink hover:underline shrink-0"
            >
              ← All posts
            </Link>
          </footer>
        </article>
      </main>
    </>
  );
}
