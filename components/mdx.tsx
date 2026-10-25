import Link from "next/link";
import type { MDXRemoteProps } from "next-mdx-remote/rsc";

// What a post's MDX can render beyond plain Markdown. Kept to what a post
// actually uses; add a component here when one needs it, not before.

function Anchor({ href = "", ...props }: React.ComponentProps<"a">) {
  // Internal links go through next/link so they prefetch and route
  // client-side; everything else opens in a new tab like the rest of the site.
  if (href.startsWith("/") || href.startsWith("#")) {
    return <Link href={href} {...props} />;
  }
  return <a href={href} target="_blank" rel="noopener noreferrer" {...props} />;
}

/** An aside set off from the body. `title` is optional. */
function Callout({
  title,
  children,
}: {
  title?: string;
  children: React.ReactNode;
}) {
  return (
    <aside className="not-prose my-8 rounded-xl border border-line bg-card px-5 py-4 text-base text-ink-soft leading-relaxed">
      {title && <p className="font-semibold text-ink mb-1">{title}</p>}
      <div className="space-y-3">{children}</div>
    </aside>
  );
}

export const mdxComponents: MDXRemoteProps["components"] = {
  a: Anchor,
  Callout,
};
