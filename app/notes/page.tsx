import type { Metadata } from "next";
import Link from "next/link";
import BreadcrumbSchema from "@/components/breadcrumb-schema";
import NotesList from "@/components/notes-list";
import { getNotes, NOTES_LABEL, NOTES_PATH } from "@/lib/notes";

const TITLE = `${NOTES_LABEL} — Anthony Brignano`;
const DESCRIPTION =
  "Case studies from building The Hartford's developer platform, and posts on platform engineering, developer experience and the homelab.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: {
    canonical: NOTES_PATH,
    types: { "application/rss+xml": "/rss.xml" },
  },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: `https://brignano.io${NOTES_PATH}`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
};

const BREADCRUMBS = [
  { name: "Home", url: "https://brignano.io" },
  { name: NOTES_LABEL, url: `https://brignano.io${NOTES_PATH}` },
];

export default async function Notes() {
  const entries = await getNotes();

  return (
    <>
      <BreadcrumbSchema items={BREADCRUMBS} />
      <main className="max-w-6xl mx-auto md:px-16 px-6 lg:mt-24 mt-16 pb-12">
        <header className="mb-8 md:mb-10 max-w-3xl">
          <h1 className="font-sans text-4xl sm:text-5xl font-bold tracking-tight mb-4">
            {NOTES_LABEL}
          </h1>
          <p className="text-ink-soft text-lg">
            Case studies from my job building a developer platform, and posts
            about what I build on the side. Nothing here is stated that
            isn&apos;t documented.{" "}
            <a href="/rss.xml" className="underline text-interactive-ink">
              RSS
            </a>
          </p>
        </header>

        <div className="max-w-3xl">
          <NotesList entries={entries} />
        </div>

        <p className="mt-10 text-sm text-slate max-w-2xl">
          The short version of each case study is on{" "}
          <Link href="/resume" className="underline text-interactive-ink">
            my resume
          </Link>
          . The long version is a conversation:{" "}
          <a
            href="mailto:hi@brignano.io"
            className="underline text-interactive-ink"
          >
            hi@brignano.io
          </a>
          .
        </p>
      </main>
    </>
  );
}
