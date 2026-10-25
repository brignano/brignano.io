import type { Metadata } from "next";
import Link from "next/link";
import BreadcrumbSchema from "@/components/breadcrumb-schema";
import CaseStudyCard from "@/components/case-study-card";
import { caseStudies } from "@/lib/work";

const TITLE = "Work — Anthony Brignano";
const DESCRIPTION =
  "Three case studies from building The Hartford's developer platform: ATLAS itself, making developer onboarding self-service, and migrating 10,000+ repositories to GitHub Enterprise Cloud.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/work" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "https://brignano.io/work",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
};

const WORK_BREADCRUMBS = [
  { name: "Home", url: "https://brignano.io" },
  { name: "Work", url: "https://brignano.io/work" },
];

export default function Work() {
  return (
    <>
      <BreadcrumbSchema items={WORK_BREADCRUMBS} />
      <main className="max-w-6xl mx-auto md:px-16 px-6 lg:mt-24 mt-16 pb-12">
        <header className="mb-12 md:mb-16 max-w-3xl">
          <h1 className="font-sans text-4xl sm:text-5xl font-bold tracking-tight mb-4">
            Work
          </h1>
          <p className="text-ink-soft text-lg">
            Three pieces of work in enough detail to judge how I think: the
            problem, what constrained it, what I built, and what changed.
            Written under the same rule as the numbers on this site. Nothing
            here is stated that is not documented and current, and where a
            figure does not exist yet, the write-up says so.
          </p>
        </header>

        {/* The cards are h3s; headings must descend in order. */}
        <h2 className="sr-only">Case studies</h2>
        <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-6">
          {caseStudies.map((study) => (
            <CaseStudyCard key={study.slug} study={study} />
          ))}
        </div>

        <p className="mt-12 text-sm text-slate max-w-2xl">
          The short version of each is a few lines on{" "}
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
