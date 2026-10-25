import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

export const metadata: Metadata = {
  title: "Page not found | Anthony Brignano",
  robots: { index: false, follow: false },
};

// Where a lost visitor most likely meant to go. Same destinations as the
// header, so this page never offers a route the nav does not.
const DESTINATIONS = [
  { href: "/work", label: "Work", blurb: "Two case studies" },
  { href: "/projects", label: "Projects", blurb: "Things I build for myself" },
  { href: "/resume", label: "Resume", blurb: "Full career history, with a PDF" },
  { href: "/coding", label: "Coding", blurb: "What I've been working on lately" },
];

// Replaces Next's unstyled default. The root layout still wraps this in the
// site header and footer, so the only job here is a calm, on-brand dead end
// that points back to the content.
export default function NotFound() {
  return (
    <main className="max-w-7xl mx-auto md:px-16 px-6 lg:mt-24 mt-16">
      <section className="fold-fit flex flex-col justify-center">
        <p className="font-display uppercase tracking-[0.18em] text-[11px] sm:text-xs text-slate mb-3 sm:mb-5">
          404 · Page not found
        </p>
        <h1 className="font-sans font-bold tracking-tight text-4xl sm:text-5xl lg:text-6xl mb-3 sm:mb-6 leading-[1.05] max-w-2xl">
          This trail doesn&apos;t go anywhere.
        </h1>
        <p className="text-base sm:text-lg text-ink-soft mb-8 max-w-xl leading-relaxed">
          The page you&apos;re looking for has moved, never existed, or the link
          that brought you here has a typo. Everything on the site is one of
          the five pages below.
        </p>
        <div className="flex flex-wrap gap-3 sm:gap-4 items-center mb-10">
          <Link
            href="/"
            className="inline-flex items-center px-4 sm:px-6 py-3 bg-interactive hover:bg-interactive-hover text-on-interactive font-semibold rounded-lg transition-colors duration-200"
          >
            <ArrowLeftIcon className="mr-2 w-4 h-4" aria-hidden="true" />
            Back to home
          </Link>
        </div>
        {/* `pr-14` below `sm` keeps the stacked cards out of the chat
            launcher's column, as the hero CTA row does on the homepage. */}
        <ul className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl pr-14 sm:pr-0">
          {DESTINATIONS.map((d) => (
            <li key={d.href}>
              <Link
                href={d.href}
                className="block h-full bg-card/70 backdrop-blur-sm border border-line rounded-xl px-5 py-4 transition-colors hover:border-line-strong"
              >
                <span className="block font-semibold text-ink">{d.label}</span>
                <span className="block text-sm text-slate mt-1">{d.blurb}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
