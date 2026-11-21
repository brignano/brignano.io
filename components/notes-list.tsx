"use client";

import { useState, useSyncExternalStore } from "react";
import Link from "next/link";
import type { NoteEntry, NoteKind } from "@/lib/notes";

// The list on /notes with its All / Case studies / Posts filter. The page is
// prerendered with everything showing; the filter is read from `?show=` after
// hydration, so a link like /notes?show=case-studies (the one to send a
// recruiter) opens on the case studies alone. Picking a tab rewrites the
// address in place rather than navigating, so it never adds history entries.
// Wireframe: proposals/wireframes/work-and-posts.html.

const FILTERS = [
  { value: "all", label: "All", kind: null },
  { value: "case-studies", label: "Case studies", kind: "case-study" },
  { value: "posts", label: "Posts", kind: "post" },
] as const satisfies readonly {
  value: string;
  label: string;
  kind: NoteKind | null;
}[];
type Filter = (typeof FILTERS)[number]["value"];

const isFilter = (v: string | null): v is Filter =>
  FILTERS.some((f) => f.value === v);

const subscribeToHistory = (onChange: () => void) => {
  window.addEventListener("popstate", onChange);
  return () => window.removeEventListener("popstate", onChange);
};
const filterFromUrl = (): Filter => {
  const show = new URLSearchParams(window.location.search).get("show");
  return isFilter(show) ? show : "all";
};

const TAG_LABEL: Record<NoteKind, string> = {
  "case-study": "Case study",
  post: "Post",
};

export default function NotesList({ entries }: { entries: NoteEntry[] }) {
  const fromUrl = useSyncExternalStore(
    subscribeToHistory,
    filterFromUrl,
    () => "all" as const
  );
  // What the visitor picked on this visit. It wins over the address until
  // back/forward changes the address, which clears it.
  const [picked, setPicked] = useState<{ value: Filter; from: Filter } | null>(
    null
  );
  const filter = picked && picked.from === fromUrl ? picked.value : fromUrl;

  const choose = (value: Filter) => {
    const url = new URL(window.location.href);
    if (value === "all") url.searchParams.delete("show");
    else url.searchParams.set("show", value);
    window.history.replaceState(window.history.state, "", url);
    setPicked({ value, from: fromUrl });
  };

  const kind = FILTERS.find((f) => f.value === filter)?.kind ?? null;
  const shown = kind ? entries.filter((e) => e.kind === kind) : entries;
  const count = (k: NoteKind | null) =>
    k ? entries.filter((e) => e.kind === k).length : entries.length;

  return (
    <>
      <div
        role="group"
        aria-label="Show"
        className="flex gap-x-6 border-b border-line"
      >
        {FILTERS.map((f) => {
          const on = f.value === filter;
          return (
            <button
              key={f.value}
              type="button"
              aria-pressed={on}
              onClick={() => choose(f.value)}
              className={`-mb-px min-h-11 border-b-2 pb-2.5 pt-2 text-[15px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-interactive-ink rounded-t-sm cursor-pointer ${
                on
                  ? "border-ink text-ink font-semibold"
                  : "border-transparent text-ink-soft hover:text-ink"
              }`}
            >
              {f.label}
              <span className="ml-1 text-[13px] font-normal text-slate tabular-nums">
                {count(f.kind)}
              </span>
            </button>
          );
        })}
      </div>

      {/* The entry titles are h3s; headings must descend in order. */}
      <h2 className="sr-only">
        {filter === "all"
          ? "Case studies and posts"
          : FILTERS.find((f) => f.value === filter)?.label}
      </h2>
      <ol>
        {shown.map((entry) => (
          <li key={entry.slug} className="border-b border-line">
            <Link
              href={entry.href}
              className="group grid gap-y-1.5 py-5 md:grid-cols-[10rem_1fr] md:gap-x-8 md:py-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-interactive-ink rounded-sm"
            >
              <p className="flex flex-wrap items-center gap-x-2.5 gap-y-1.5 text-sm text-slate md:row-span-2 md:flex-col md:items-start md:pt-1">
                <span className="pill">
                  {TAG_LABEL[entry.kind]}
                </span>
                {entry.kind === "case-study" ? (
                  <span>The Hartford</span>
                ) : (
                  <span>
                    <time dateTime={entry.date}>{entry.dateLabel}</time> ·{" "}
                    {entry.readingTime} min
                    {entry.draft && (
                      <span className="ml-2 text-attention-ink">Draft</span>
                    )}
                  </span>
                )}
              </p>
              <h3 className="text-xl sm:text-[22px] font-semibold tracking-tight leading-snug text-ink group-hover:text-interactive-ink transition-colors">
                {entry.title}
              </h3>
              <p className="text-ink-soft leading-relaxed">{entry.summary}</p>
            </Link>
          </li>
        ))}
      </ol>
    </>
  );
}
