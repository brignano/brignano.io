"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { nextPage } from "@/lib/pages";

// One link at the end of each top-level page to the next one in nav order, so
// no page is a dead end. Home doesn't need one (it links everywhere already),
// and a case study or post ends with its own next story.
export default function KeepGoing() {
  const next = nextPage(usePathname() ?? "");
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
