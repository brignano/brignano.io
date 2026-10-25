import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import BreadcrumbSchema from "@/components/breadcrumb-schema";
import { caseStudies, getCaseStudy } from "@/lib/work";

type Params = Promise<{ slug: string }>;

export function generateStaticParams() {
  return caseStudies.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const study = getCaseStudy((await params).slug);
  if (!study) return {};
  const title = `${study.title} — Anthony Brignano`;
  const url = `https://brignano.io/work/${study.slug}`;
  return {
    title,
    description: study.description,
    alternates: { canonical: `/work/${study.slug}` },
    openGraph: { title, description: study.description, url, type: "article" },
    twitter: { card: "summary_large_image", title, description: study.description },
  };
}

export default async function CaseStudyPage({ params }: { params: Params }) {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  if (!study) notFound();

  const index = caseStudies.findIndex((c) => c.slug === slug);
  const next = caseStudies[(index + 1) % caseStudies.length];

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "https://brignano.io" },
          { name: "Work", url: "https://brignano.io/work" },
          { name: study.title, url: `https://brignano.io/work/${study.slug}` },
        ]}
      />
      <main className="max-w-7xl mx-auto md:px-16 px-6 lg:mt-24 mt-16 pb-12">
        <article className="max-w-3xl">
          <p className="font-display uppercase tracking-[0.18em] text-[11px] sm:text-xs text-slate mb-3 sm:mb-5">
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
                  className="text-xs px-2.5 py-1 rounded-full border border-line-strong text-ink-soft"
                >
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <footer className="border-t border-line pt-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <p className="text-sm text-slate max-w-md">
              Want the longer version, or the parts that do not belong on a
              public page?{" "}
              <a
                href="mailto:hi@brignano.io"
                className="underline text-interactive-ink"
              >
                hi@brignano.io
              </a>
            </p>
            <Link
              href={`/work/${next.slug}`}
              className="text-sm text-interactive-ink hover:underline shrink-0"
            >
              Next: {next.title} →
            </Link>
          </footer>
        </article>
      </main>
    </>
  );
}
