"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NOTES_PATH } from "@/lib/notes-path";

// One link at the end of each top-level page to the next useful one, so no
// page is a dead end. Home doesn't need one (it links everywhere already), and
// a case study or post ends with its own next story.
const NEXT: Record<string, { href: string; kicker: string; title: string }> = {
  "/projects": { href: "/coding", kicker: "Next: Coding", title: "What I'm building right now" },
  "/resume": { href: NOTES_PATH, kicker: "Next: Notes", title: "The stories behind these roles" },
  "/coding": { href: "/projects", kicker: "Next: Projects", title: "The things that came out of it" },
  [NOTES_PATH]: { href: "/#contact", kicker: "Next: Say hello", title: "Questions about any of these? Get in touch" },
};

export default function KeepGoing() {
  const next = NEXT[usePathname() ?? ""];
  if (!next) return null;
  return (
    <nav
      aria-label="Keep going"
      className="max-w-7xl mx-auto md:px-16 px-6 mt-10 sm:mt-16"
    >
      <Link
        href={next.href}
        className="group grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-4 gap-y-1 rounded-xl border border-line bg-card px-5 py-4 sm:px-6 sm:py-5 hover:border-line-strong transition-colors focus-visible:ring-2 focus-visible:ring-interactive-ink"
      >
        <span className="eyebrow">{next.kicker}</span>
        <span className="col-start-1 text-ink font-semibold text-lg tracking-tight group-hover:underline underline-offset-4 decoration-1">
          {next.title}
        </span>
        <span
          aria-hidden="true"
          className="col-start-2 row-span-2 row-start-1 text-interactive-ink text-xl"
        >
          →
        </span>
      </Link>
    </nav>
  );
}
