import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { cache } from "react";
import { load as parseYaml } from "js-yaml";
import type { Post, PostFrontmatter } from "@/types/blog";

// The content source for /blog (docs/tsd-blog.md §5.6). Pages, the sitemap
// and the RSS feed only ever call getAllPosts() and getPostBySlug(); nothing
// else knows where posts live. That is what lets the source move to the
// private brignano/blog repo later as a change to this file alone.
//
// Until that repo exists, posts are read from content/blog/posts/ in this
// repo, laid out the same way the blog repo will be (posts/ is built; an
// ideas/ catalog beside it never is). BLOG_CONTENT_DIR points at a different
// checkout with the same layout, for previewing against a local clone.
const CONTENT_DIR =
  process.env.BLOG_CONTENT_DIR ?? path.join(process.cwd(), "content", "blog");
const POSTS_DIR = path.join(CONTENT_DIR, "posts");

const SHOW_DRAFTS = process.env.NODE_ENV !== "production";
const WORDS_PER_MINUTE = 230;
const FRONTMATTER = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/;
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

// js-yaml reads an unquoted 2026-10-25 as a Date. Normalize back to the
// string the author wrote so "date" means one thing everywhere downstream.
function toIsoDate(value: unknown): string | undefined {
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  if (typeof value === "string" && ISO_DATE.test(value)) return value;
  return undefined;
}

// Malformed frontmatter fails the build instead of shipping a post with no
// title or an "Invalid Date" (TSD §7).
function parseFrontmatter(file: string, raw: unknown): PostFrontmatter {
  const data = (raw ?? {}) as Record<string, unknown>;
  const fail = (why: string): never => {
    throw new Error(`Blog post ${file}: ${why}`);
  };

  if (typeof data.title !== "string" || !data.title.trim()) {
    fail("`title` is required");
  }
  if (typeof data.description !== "string" || !data.description.trim()) {
    fail("`description` is required");
  }
  const date = toIsoDate(data.date) ?? fail("`date` must be YYYY-MM-DD");
  const updated =
    data.updated === undefined
      ? undefined
      : (toIsoDate(data.updated) ?? fail("`updated` must be YYYY-MM-DD"));
  if (typeof data.published !== "boolean") {
    fail("`published` must be true or false");
  }
  const tags = data.tags ?? [];
  if (!Array.isArray(tags) || tags.some((t) => typeof t !== "string")) {
    fail("`tags` must be a list of strings");
  }

  return {
    title: data.title as string,
    description: data.description as string,
    date,
    updated,
    tags: tags as string[],
    published: data.published as boolean,
  };
}

function readingTime(body: string): number {
  const words = body.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE));
}

async function readPost(file: string): Promise<Post> {
  const source = await readFile(path.join(POSTS_DIR, file), "utf8");
  const match = source.match(FRONTMATTER);
  if (!match) throw new Error(`Blog post ${file}: missing frontmatter`);
  const body = source.slice(match[0].length);
  return {
    ...parseFrontmatter(file, parseYaml(match[1])),
    slug: file.replace(/\.mdx$/, ""),
    readingTime: readingTime(body),
    body,
  };
}

/** Every post that should be built, newest first. Drafts only outside production. */
export const getAllPosts = cache(async (): Promise<Post[]> => {
  let files: string[];
  try {
    files = await readdir(POSTS_DIR);
  } catch (error) {
    // No posts directory is a valid empty blog; anything else is a real error.
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw error;
  }

  const posts = await Promise.all(
    files.filter((f) => f.endsWith(".mdx")).map(readPost)
  );
  return posts
    .filter((p) => p.published || SHOW_DRAFTS)
    .sort((a, b) => b.date.localeCompare(a.date));
});

export async function getPostBySlug(slug: string): Promise<Post | undefined> {
  return (await getAllPosts()).find((p) => p.slug === slug);
}

/** "October 25, 2026". Parsed as UTC so the day never shifts by time zone. */
export function formatPostDate(date: string): string {
  return new Date(`${date}T00:00:00Z`).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}
