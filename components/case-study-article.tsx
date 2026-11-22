import type { Metadata } from "next";
import Link from "next/link";
import BreadcrumbSchema from "@/components/breadcrumb-schema";
import { NOTES_LABEL, NOTES_PATH, noteHref } from "@/lib/notes-path";
import { caseStudies, type CaseStudy } from "@/lib/work";

// One case study at /notes/<slug>. app/notes/[slug]/page.tsx decides whether
// a slug is a case study or a post.

export function caseStudyMetadata(study: CaseStudy): Metadata {
  const title = `${study.title} — Anthony Brignano`;
  const url = `https://brignano.io${noteHref(study.slug)}`;
  return {
    title,
    description: study.description,
    alternates: { canonical: noteHref(study.slug) },
    openGraph: { title, description: study.description, url, type: "article" },
    twitter: {
      card: "summary_large_image",
      title,
      description: study.description,
    },
  };
}

export default function CaseStudyArticle({ study }: { study: CaseStudy }) {
  const index = caseStudies.findIndex((c) => c.slug === study.slug);
  const next = caseStudies[(index + 1) % caseStudies.length];

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "https://brignano.io" },
          { name: NOTES_LABEL, url: `https://brignano.io${NOTES_PATH}` },
          {
            name: study.title,
            url: `https://brignano.io${noteHref(study.slug)}`,
          },
        ]}
      />
      <main className="max-w-7xl mx-auto md:px-16 px-6 lg:mt-24 mt-16 pb-12">
        <article className="max-w-3xl">
          <nav aria-label="Breadcrumb" className="mb-6 text-sm">
            <ol className="flex items-center gap-2 font-mono text-slate">
              <li>
                <Link
                  href={NOTES_PATH}
                  className="text-interactive-ink hover:underline inline-block pointer-coarse:py-2.5"
                >
                  ← {NOTES_LABEL}
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li aria-current="page">Case study</li>
            </ol>
          </nav>
          <p className="eyebrow mb-3 sm:mb-5">
            {study.eyebrow}
          </p>
          <h1 className="font-sans font-bold tracking-tight text-4xl sm:text-5xl mb-5 leading-[1.05]">
            {study.title}
          </h1>
          <p className="text-lg sm:text-xl text-ink-soft leading-relaxed mb-10">
            {study.lede}
          </p>

          {/* At a glance. Same shape as the hero's proof panel, so the
              numbers read as the same numbers. */}
          <dl className="grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-6 border-y border-line py-6 mb-12">
            {study.facts.map((fact) => (
              <div key={fact.label}>
                <dd className="text-lg sm:text-xl font-bold tracking-tight text-ink">
                  {fact.value}
                </dd>
                <dt className="text-xs sm:text-sm text-slate mt-1">
                  {fact.label}
                </dt>
              </div>
            ))}
          </dl>

          {study.sections.map((section) => (
            <section key={section.heading} className="mb-10">
              <h2 className="font-sans text-2xl sm:text-3xl font-bold tracking-tight mb-4">
                {section.heading}
              </h2>
              <div className="space-y-4 text-base sm:text-lg text-ink-soft leading-relaxed">
                {section.paragraphs.map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}
              </div>
            </section>
          ))}

          <section className="mb-12">
            <h2 className="font-sans text-xl font-bold tracking-tight mb-3">
              Stack
            </h2>
            <ul className="flex flex-wrap gap-2">
              {study.stack.map((item) => (
                <li
                  key={item}
                  className="pill"
                >
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <footer className="border-t border-line pt-8 flex flex-col gap-6">
            <Link
              href={noteHref(next.slug)}
              className="group grid gap-1 rounded-xl border border-line bg-card px-5 py-4 sm:px-6 sm:py-5 hover:border-line-strong transition-colors focus-visible:ring-2 focus-visible:ring-interactive-ink"
            >
              <span className="eyebrow">Next story</span>
              <span className="text-ink font-semibold text-lg tracking-tight group-hover:underline underline-offset-4 decoration-1">
                {next.title} →
              </span>
            </Link>
            <p className="text-sm text-slate flex flex-wrap gap-x-4 gap-y-2">
              <Link
                href={NOTES_PATH}
                className="text-interactive-ink hover:underline"
              >
                ← All {NOTES_LABEL.toLowerCase()}
              </Link>
              <span>
                Want the longer version, or the parts that do not belong on a
                public page?{" "}
                <a
                  href="mailto:hi@brignano.io"
                  className="underline text-interactive-ink"
                >
                  hi@brignano.io
                </a>
              </span>
            </p>
          </footer>
        </article>
      </main>
    </>
  );
}
