import Link from "next/link";
import type { CaseStudy } from "@/lib/work";

// Shared by /work and the homepage. The facts chips carry the two headline
// numbers so the card makes its claim before the visitor clicks.
export default function CaseStudyCard({ study }: { study: CaseStudy }) {
  return (
    <Link
      href={`/work/${study.slug}`}
      className="group flex flex-col bg-card/70 backdrop-blur-sm border border-line rounded-xl px-6 py-5 shadow-sm transition-colors hover:border-line-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-interactive-ink"
    >
      <p className="font-display uppercase tracking-[0.18em] text-[10px] text-slate mb-3">
        {study.eyebrow}
      </p>
      <h3 className="text-xl font-semibold text-ink mb-2 group-hover:text-interactive-ink transition-colors">
        {study.title}
      </h3>
      <p className="text-ink-soft mb-5">{study.lede}</p>
      <dl className="mt-auto flex flex-wrap gap-x-6 gap-y-2 text-sm">
        {study.facts.slice(0, 2).map((fact) => (
          <div key={fact.label}>
            <dd className="font-semibold text-ink inline">{fact.value}</dd>{" "}
            <dt className="text-slate inline">{fact.label.toLowerCase()}</dt>
          </div>
        ))}
      </dl>
      <span className="mt-4 text-sm text-interactive-ink">
        Read the case study →
      </span>
    </Link>
  );
}
