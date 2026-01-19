"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Dialog, DialogPanel } from "@headlessui/react";
import {
  XMarkIcon,
  MoonIcon,
  SunIcon,
  ArrowDownTrayIcon,
  ShareIcon,
} from "@heroicons/react/24/outline";
import { Bars3Icon } from "@heroicons/react/24/solid";
import Link from "next/link";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const pathname = usePathname();
  const isResumePage = pathname === "/resume";

  const pages: string[] = []; // ['home', 'resume', 'coding'];

  useEffect(() => {
    // Check localStorage first, then fallback to system preference
    let isDarkDefault = false;
    if (localStorage.theme === "dark") isDarkDefault = true;
    else if (localStorage.theme === "light") isDarkDefault = false;
    else {
      // Fallback to system preference
      isDarkDefault = window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    document.documentElement.classList.toggle("dark", isDarkDefault);
    setIsDarkMode(isDarkDefault);
  }, []);

  const toggleTheme = () => {
    const newDark = !isDarkMode;
    document.documentElement.classList.toggle("dark", newDark);
    setIsDarkMode(newDark);
  };

  const handleDownloadPDF = () => {
    window.print();
  };

  const handleShare = async () => {
    const url = window?.location.href ?? "/resume";
    try {
      if ((navigator as any)?.share) {
        await (navigator as any).share({
          title: "Anthony Brignano — Resume",
          url,
        });
      } else if (navigator?.clipboard) {
        await navigator.clipboard.writeText(url);
        // small fallback feedback
        // eslint-disable-next-line no-alert
        alert("Resume link copied to clipboard");
      } else {
        // last resort
        // eslint-disable-next-line no-alert
        alert(url);
      }
    } catch (err) {
      // swallow share errors silently
      // eslint-disable-next-line no-console
      console.error("Share failed", err);
    }
  };

  useEffect(() => {
    localStorage.setItem("theme", isDarkMode ? "dark" : "light");
  }, [isDarkMode]);

  return (
    <header className="text-sm py-6 md:px-16 px-6 border-b dark:border-zinc-800 border-zinc-200 z-30 lg:mb-28 mb-10">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <Link href="/" className="cursor-pointer">
          <span className="sr-only">Anthony Brignano</span>
          <Image
            alt="icon"
            src="favicon.svg"
            className="h-8 w-auto invert-0 dark:invert"
            width={35}
            height={35}
          />
        </Link>
        <nav className="md:block hidden">
          <ul className="flex items-center gap-x-8">
            {pages?.map((page) => (
              <li key={page}>
                <Link
                  href={page === 'home' ? '/' : `/${page}`}
                  className="text-zinc-600 dark:text-white hover:text-zinc-900 dark:hover:text-primary-color text-base cursor-pointer"
                >
                  {page.charAt(0).toUpperCase() + page.slice(1)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex items-center gap-x-4">
          {isResumePage && (
            <button
              aria-label="Share Resume"
              onClick={handleShare}
              className="print:hidden dark:bg-primary-bg bg-zinc-100 text-zinc-500 border dark:border-zinc-700 border-zinc-200 rounded-full p-2 transition-transform transform hover:scale-105 hover:shadow-sm hover:bg-zinc-200 dark:hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-primary-color/20"
            >
              <ShareIcon className="h-5 w-5 transition-colors duration-200 text-zinc-600 dark:text-zinc-300" />
            </button>
          )}
          {isResumePage && (
            <button
              aria-label="Download PDF"
              onClick={handleDownloadPDF}
              className="dark:bg-primary-bg bg-zinc-100 text-zinc-500 border dark:border-zinc-700 border-zinc-200 rounded-full p-2 transition-transform transform hover:scale-105 hover:shadow-sm hover:bg-zinc-200 dark:hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-primary-color/20"
            >
              <ArrowDownTrayIcon className="h-5 w-5 transition-colors duration-200 text-zinc-600 dark:text-zinc-300" />
            </button>
          )}
          <button
            aria-label="Toggle Theme"
            onClick={() => toggleTheme()}
            className="dark:bg-primary-bg hover:text-zinc-500 dark:text-primary-color bg-zinc-100 text-zinc-500 border dark:border-zinc-700 border-zinc-200 rounded-full p-2 transition-transform rotate-0"
          >
            {isDarkMode ? (
              <MoonIcon className="size-5 text-primary-color hover:text-white duration-400 cursor-pointer" />
            ) : (
              <SunIcon className="size-5 text-yellow-600 hover:text-zinc-500 duration-400 cursor-pointer" />
            )}
          </button>
          {pages.length > 0 && (
            <button
              aria-label="Toggle Menu"
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden dark:focus:text-primary-color dark:bg-primary-bg dark:hover:text-primary-color bg-zinc-100 border dark:border-zinc-700 border-zinc-200 rounded-md p-2 hover:text-zinc-900 duration-300 cursor-pointer"
            >
              <span className="sr-only">Open main menu</span>
              <Bars3Icon aria-hidden="true" className="size-5" />
            </button>
          )}
        </div>
      </div>
      <Dialog
        open={mobileMenuOpen}
        onClose={setMobileMenuOpen}
        className="lg:hidden"
      >
        <div className="fixed inset-0 z-10" />
        <DialogPanel className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto dark:bg-zinc-900 bg-zinc-100 px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          <div className="flex items-center justify-between">
            <Link href="/" className="-m-1.5 p-1.5 cursor-pointer">
              <span className="sr-only">Anthony Brignano</span>
              <Image
                alt="icon"
                src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600"
                className="h-8 w-auto"
                width={35}
                height={35}
              />
            </Link>
            <button
              aria-label="Close menu"
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="dark:bg-primary-bg dark:hover:text-primary-color bg-zinc-100 border dark:border-zinc-700 border-zinc-200 rounded-full p-2 hover:text-zinc-900"
            >
              <span className="sr-only">Close menu</span>
              <XMarkIcon aria-hidden="true" className="size-5" />
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-500/10">
              <div className="space-y-2 py-6">
                {pages?.map((page) => (
                  <Link
                    key={page}
                    href={`/${page}`}
                    className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold hover:bg-white hover:text-zinc-900 dark:hover:text-primary-color dark:hover:bg-zinc-800 dark:text-white duration-300 cursor-pointer"
                  >
                    {page.charAt(0).toUpperCase() + page.slice(1)}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </DialogPanel>
      </Dialog>
    </header>
  );
}
