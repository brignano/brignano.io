/** What a post's frontmatter must say. Mirrors docs/tsd-blog.md §5.1. */
export interface PostFrontmatter {
  title: string;
  /** Used for <meta name="description"> and the index excerpt. */
  description: string;
  /** ISO date (YYYY-MM-DD). Drives ordering and display. */
  date: string;
  updated?: string;
  tags?: string[];
  /** false = draft: previewable in dev, never in a production build. */
  published: boolean;
}

export interface Post extends PostFrontmatter {
  /** The filename without its extension. */
  slug: string;
  /** Whole minutes at a reading pace, never less than 1. */
  readingTime: number;
  /** The raw MDX body, frontmatter stripped. */
  body: string;
}
