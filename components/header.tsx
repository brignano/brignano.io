"use client";

import { useState, useEffect, useRef, useSyncExternalStore } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Bars3Icon,
  MoonIcon,
  SunIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { applyTheme } from "@/lib/theme";

// Nav is inline from `sm` up. Below that, five words plus the monogram and the
// theme toggle measured 371px even at gap-x-2.5: the page scrolled sideways on
// a 360px Android and the toggle sat flush against a 375px iPhone's edge. So
// phones get a menu button that drops the links into the header itself, not a
// slide-in drawer with an overlay. "Home" is not a link here: the monogram is.
const PAGES = ["work", "projects", "blog", "resume", "coding"] as const;

// Don't start hiding until the header has scrolled its own height away, and
// ignore deltas smaller than this so momentum jitter and iOS rubber-band
// overscroll don't flap the header open and shut.
const HIDE_AFTER_PX = 80;
const MIN_DELTA_PX = 6;

// The `dark` class on <html> is the source of truth — an inline script in
// <head> sets it before paint. Subscribing to it rather than mirroring it into
// state keeps the toggle in sync with anything else that changes the class, and
// avoids a setState-in-effect on mount. The server snapshot is light; the class
// the script picked wins on the first client render after hydration.
const subscribeToTheme = (onChange: () => void) => {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  });
  return () => observer.disconnect();
};

export default function Header() {
  const isDarkMode = useSyncExternalStore(
    subscribeToTheme,
    () => document.documentElement.classList.contains("dark"),
    () => false
  );
  const [animateHeader, setAnimateHeader] = useState(false);
  const [hidden, setHidden] = useState(false);
  // The path the menu was opened on. Navigating changes the path, which closes
  // the menu without an effect to reset it.
  const [menuOpenOn, setMenuOpenOn] = useState<string | null>(null);
  const lastScrollY = useRef(0);
  const ticking = useRef(false);
  const pathname = usePathname();
  const currentPage = (() => {
    if (!pathname || pathname === "/") return "home";
    const seg = pathname.split("/")[1];
    return seg || "home";
  })();
  const menuOpen = menuOpenOn !== null && menuOpenOn === pathname;
  const closeMenu = () => setMenuOpenOn(null);

  const toggleTheme = () => {
    const newDark = !isDarkMode;
    // Flipping the class notifies the store above, which re-renders the icon.
    // `applyTheme` moves the three things that must never drift together:
    // `.dark` (Tailwind's variant), `data-theme` (the design tokens), and
    // <meta name="theme-color"> (the browser's own chrome and overscroll
    // gutter). If these drift, the page renders one theme's tokens under
    // another theme's utilities — or, for the meta tag, inside another theme's
    // browser chrome.
    applyTheme(newDark);
    try {
      localStorage.setItem("theme", newDark ? "dark" : "light");
    } catch {
      // ignore (e.g. storage disabled)
    }
  };

  useEffect(() => {
    // run header drop animation on mount
    requestAnimationFrame(() => setAnimateHeader(true));
  }, []);

  // Hide on scroll down, reveal on scroll up: the content gets the full screen
  // while reading, and nav is one flick away instead of a scroll to the top.
  useEffect(() => {
    const onScroll = () => {
      if (ticking.current) return;
      ticking.current = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        const delta = y - lastScrollY.current;
        if (Math.abs(delta) > MIN_DELTA_PX) {
          setHidden(delta > 0 && y > HIDE_AFTER_PX);
          lastScrollY.current = y;
        }
        ticking.current = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpenOn(null);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [menuOpen]);

  const links = (variant: "inline" | "menu") =>
    PAGES.map((page) => {
      const isActive = currentPage === page;
      const label = page.charAt(0).toUpperCase() + page.slice(1);
      // In the menu each link is a full-width row, a 44px tap target.
      const shape =
        variant === "menu"
          ? "block py-3 text-base border-l-2 pl-3"
          : "text-sm sm:text-base border-b-2 pb-1";
      return (
        <li key={page}>
          {isActive ? (
            <span
              className={`${shape} text-ink font-medium cursor-default border-interactive`}
              aria-current="page"
              onClick={closeMenu}
            >
              {label}
            </span>
          ) : (
            <Link
              href={`/${page}`}
              onClick={closeMenu}
              className={`${shape} text-ink-soft hover:text-ink cursor-pointer border-transparent transition-colors`}
            >
              {label}
            </Link>
          )}
        </li>
      );
    });

  return (
    <header
      className={`sticky top-0 z-30 text-sm py-6 md:px-16 px-6 border-b border-line bg-bg/80 backdrop-blur-md lg:mb-28 mb-10 transition-transform duration-300 ease-out motion-reduce:transition-none motion-reduce:translate-y-0 ${hidden && !menuOpen ? "-translate-y-full" : "translate-y-0"}`}
    >
      <div
        className={`max-w-6xl mx-auto flex items-center justify-between gap-x-4 relative transform transition-all duration-500 ease-out ${animateHeader ? "translate-y-0 opacity-100" : "-translate-y-3 opacity-0"}`}
      >
        <Link href="/" className="cursor-pointer shrink-0">
          <span className="sr-only">Anthony Brignano</span>
          {/* Absolute path: a relative `favicon.svg` resolved against the
              current directory, so it 404ed on the first nested route
              (/work/<slug>). */}
          <Image
            alt="icon"
            src="/favicon.svg"
            className="h-8 w-auto invert-0 dark:invert"
            width={35}
            height={35}
          />
        </Link>
        {/* Centered on large screens via absolute positioning; between `sm`
            and `lg` it sits in the flex row between the logo and the toggles. */}
        <nav
          aria-label="Main"
          className="hidden sm:block lg:absolute lg:left-1/2 lg:-translate-x-1/2 lg:transform"
        >
          <ul className="flex items-center gap-x-8">{links("inline")}</ul>
        </nav>
        <div className="flex items-center gap-x-2 shrink-0">
          <button
            aria-label="Toggle Theme"
            onClick={() => toggleTheme()}
            className="shrink-0 bg-card text-ink-soft hover:bg-surface-hover hover:text-interactive-ink border border-line rounded-full p-2 transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-interactive-ink"
          >
            {isDarkMode ? (
              <MoonIcon className="size-5 cursor-pointer" />
            ) : (
              <SunIcon className="size-5 cursor-pointer" />
            )}
          </button>
          <button
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            onClick={() => setMenuOpenOn(menuOpen ? null : pathname)}
            className="sm:hidden bg-card text-ink-soft hover:bg-surface-hover hover:text-interactive-ink border border-line rounded-full p-2 transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-interactive-ink"
          >
            {menuOpen ? (
              <XMarkIcon className="size-5" />
            ) : (
              <Bars3Icon className="size-5" />
            )}
          </button>
        </div>
      </div>
      {menuOpen && (
        <nav
          id="mobile-nav"
          aria-label="Main"
          className="sm:hidden max-w-6xl mx-auto pt-4"
        >
          <ul className="flex flex-col">{links("menu")}</ul>
        </nav>
      )}
    </header>
  );
}
