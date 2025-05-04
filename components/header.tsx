"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  Dialog,
  DialogPanel
} from "@headlessui/react";
import {
  XMarkIcon,
  MoonIcon,
  SunIcon,
} from "@heroicons/react/24/outline";
import {
  Bars3Icon,
} from "@heroicons/react/24/solid";
import Link from "next/link";



export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const pages: string[] = [];//['about', 'skills'];

  useEffect(() => {
    const theme = localStorage.getItem('theme');
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      setIsDarkMode(true);
    }
  }, []);

  const toggleTheme = () => {
    document.documentElement.classList.toggle('dark')
    setIsDarkMode(!isDarkMode);
  }

  useEffect(() => {
    localStorage.setItem("theme", isDarkMode ? "light" : "dark");
  }, [isDarkMode]);

  return (
    <header className="text-sm py-6 md:px-16 px-6 border-b dark:border-zinc-800 border-zinc-200 z-30 md:mb-28 mb-10">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <Link href="/" className="cursor-pointer">
          <span className="sr-only">Anthony Brignano</span>
          <Image
            alt="icon"
            src="favicon.svg"
            className="h-8 w-auto invert dark:invert-0"
            width={35}
            height={35}
          />
        </Link>
        <nav className="md:block hidden">
          <ul className="flex items-center gap-x-8">
            {pages?.map((page) => (
              <li key={page}>
                <Link
                  href={`/${page}`}
                  className="text-zinc-600 dark:text-white hover:text-zinc-900 dark:hover:text-primary-color text-base cursor-pointer"
                >
                  {page.charAt(0).toUpperCase() + page.slice(1)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex items-center gap-x-4">
          <button
            aria-label="Toggle Theme"
            onClick={() => toggleTheme()}
            className="dark:bg-primary-bg hover:text-zinc-500 dark:text-primary-color bg-zinc-100 text-zinc-500 border dark:border-zinc-700 border-zinc-200 rounded-full p-2 transition-transform rotate-0"
          >
            {isDarkMode ? (
              <MoonIcon className="size-5 text-primary-color hover:text-white duration-300 cursor-pointer" />
            ) : (
              <SunIcon className="size-5 text-yellow-600 hover:text-zinc-500 duration-300 cursor-pointer" />
            )}
          </button>
          {pages.length > 0 && (
            <button
              araia-label="Toggle Menu"
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
