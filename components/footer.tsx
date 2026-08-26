"use client";

import Link from "next/link";
import { socialLinks } from "@/lib/constants";

export default function Footer() {
  return (
    <footer className="border-t border-line mt-10 sm:mt-32 lg:mt-24 lg:min-h-[250px] min-h-0 relative">
      {/* The extra bottom padding below `sm` is clearance for <ScrollToTop>,
          which is fixed 24px off the bottom-right corner. At the end of the
          page the copyright line lands right under it — on a phone it runs the
          full width and centred, so it was reading as "…All rights Re" with the
          button sitting on top of the rest. Above `sm` the line is short enough
          and far enough left that it never reaches the button. */}
      <div className="max-w-7xl mx-auto flex lg:flex-row flex-col items-center lg:justify-between justify-center gap-y-4 md:px-16 px-6 pt-10 pb-24 sm:pb-10 lg:pt-16 lg:pb-16">
        <div className="order-1 lg:order-2 flex items-center gap-x-4">
          {socialLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={link.name}
              className="group text-slate hover:text-ink transition-colors duration-200"
            >
              {link.icon}
            </Link>
          ))}
        </div>

        <div className="order-2 lg:order-1 flex flex-col lg:items-start items-center lg:text-start text-center">
          <small className="text-ink-soft">
            Copyright © Anthony Brignano {new Date().getFullYear()} All rights
            Reserved
          </small>
        </div>
      </div>
    </footer>
  );
}
