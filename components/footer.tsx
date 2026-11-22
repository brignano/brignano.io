"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { socialLinks } from "@/lib/constants";
import { NOTES_LABEL, NOTES_PATH } from "@/lib/notes-path";
import { OPEN_SHORTCUTS_EVENT } from "@/lib/shortcuts";

// The footer is a small sitemap, so a visitor who landed deep in the site (a
// case study from a search, the resume from a recruiter's link) can see every
// page from wherever they are and which one they're on. It used to be social
// icons and a copyright line only, which left the header as the one way around.
const SITE = [
  { href: "/", label: "Home" },
  { href: "/projects", label: "Projects" },
  { href: "/resume", label: "Resume" },
  { href: "/coding", label: "Coding" },
  { href: NOTES_PATH, label: NOTES_LABEL },
] as const;

const ELSEWHERE = [
  ...socialLinks
    .filter((l) => !l.href.startsWith("mailto:"))
    .map((l) => ({ href: l.href, label: l.name })),
  { href: "/rss.xml", label: "RSS" },
];

const linkClass =
  "text-ink-soft hover:text-ink transition-colors py-1 pointer-coarse:py-2.5 inline-block";

export default function Footer() {
  const pathname = usePathname() ?? "/";
  // A page under a section (a case study under /notes) counts as that section.
  const isCurrent = (href: string) =>
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <footer className="border-t border-line mt-10 sm:mt-32 lg:mt-24 relative">
      {/* The extra bottom padding below `sm` is clearance for <ScrollToTop>,
          which is fixed 24px off the bottom-right corner. */}
      <div className="max-w-7xl mx-auto md:px-16 px-6 pt-10 pb-24 sm:pb-10 lg:pt-16 lg:pb-12 flex flex-col gap-10">
        <div className="grid grid-cols-2 sm:grid-cols-[12rem_12rem] gap-8">
          <nav aria-label="Site">
            <p className="eyebrow mb-3">Site</p>
            <ul>
              {SITE.map(({ href, label }) => {
                const current = isCurrent(href);
                return (
                  <li key={href}>
                    <Link
                      href={href}
                      aria-current={current ? "page" : undefined}
                      className={
                        current
                          ? `${linkClass} text-ink! font-medium`
                          : linkClass
                      }
                    >
                      {label}
                      {current && (
                        <span
                          aria-hidden="true"
                          className="inline-block w-0.5 h-[0.9em] ml-1 align-[-0.1em] bg-[var(--mark-current)] rounded-[1px]"
                        />
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
          <div>
            <p className="eyebrow mb-3">Elsewhere</p>
            <ul>
              {ELSEWHERE.map(({ href, label }) => {
                const external = href.startsWith("http");
                return (
                  <li key={href}>
                    <a
                      href={href}
                      {...(external
                        ? { target: "_blank", rel: "noopener noreferrer" }
                        : {})}
                      className={linkClass}
                    >
                      {label}
                      {external && (
                        <span aria-hidden="true" className="ml-1 text-slate">
                          ↗
                        </span>
                      )}
                    </a>
                  </li>
                );
              })}
              <li className="text-ink-soft py-1 select-all">hi@brignano.io</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-line pt-6 flex flex-wrap items-center justify-between gap-4">
          <small className="text-slate">
            © {new Date().getFullYear()} Anthony Brignano
          </small>
          {/* Only where there is a keyboard to press: a phone has no use for it. */}
          <button
            type="button"
            onClick={() =>
              window.dispatchEvent(new Event(OPEN_SHORTCUTS_EVENT))
            }
            className="hidden pointer-fine:inline-flex items-center gap-1.5 text-xs text-slate hover:text-ink cursor-pointer transition-colors focus-visible:ring-2 focus-visible:ring-interactive-ink rounded-sm"
          >
            Keyboard shortcuts
            <kbd className="font-mono text-ink bg-bg border border-line rounded-md px-1.5 py-0.5">
              ?
            </kbd>
          </button>
        </div>
      </div>
    </footer>
  );
}
