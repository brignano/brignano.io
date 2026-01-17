"use client";

import { useState, useEffect } from "react";
import { MoonIcon, SunIcon, ArrowDownTrayIcon } from "@heroicons/react/24/outline";
  // Get homepage URL from env or default
  const HOMEPAGE_URL = process.env.NEXT_PUBLIC_HOMEPAGE_URL || "https://brignano.io";

export default function Header() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [faviconError, setFaviconError] = useState(false);

  // Helper to get cookie value
  function getCookie(name: string) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift();
    return undefined;
  }

  useEffect(() => {
    // 1. Try cookie
    const cookieTheme = getCookie('theme');
    let isDarkDefault = false;
    if (cookieTheme === 'dark') isDarkDefault = true;
    else if (cookieTheme === 'light') isDarkDefault = false;
    else {
      // 2. Fallback to localStorage
      if (localStorage.theme === "dark") isDarkDefault = true;
      else if (localStorage.theme === "light") isDarkDefault = false;
      else {
        // 3. Fallback to system
        isDarkDefault = window.matchMedia("(prefers-color-scheme: dark)").matches;
      }
    }
    document.documentElement.classList.toggle("dark", isDarkDefault);
    setIsDarkMode(isDarkDefault);
  }, []);

  const toggleTheme = () => {
    const newDark = !isDarkMode;
    document.documentElement.classList.toggle("dark");
    setIsDarkMode(newDark);
    // Set cookie for .brignano.io, expires in 1 year
    document.cookie = `theme=${newDark ? "dark" : "light"}; domain=.brignano.io; path=/; max-age=31536000; SameSite=Lax`;
  };

  useEffect(() => {
    localStorage.setItem("theme", isDarkMode ? "dark" : "light");
    // Also update cookie if theme changes (for manual sync)
    document.cookie = `theme=${isDarkMode ? "dark" : "light"}; domain=.brignano.io; path=/; max-age=31536000; SameSite=Lax`;
  }, [isDarkMode]);

  const handleDownloadPDF = () => {
    window.print();
  };

  return (
    <header className="text-sm py-6 md:px-16 px-6 border-b dark:border-zinc-800 border-zinc-200 z-30 md:mb-28 mb-10">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div className="flex items-center">
          <a href={HOMEPAGE_URL} className="flex items-center group" tabIndex={0} aria-label="Homepage">
            {!faviconError ? (
              <img
                src={isDarkMode ? "/favicon-dark.svg" : "/favicon.svg"}
                alt="Resume Logo"
                className="h-8 w-8 mr-2 align-middle group-hover:opacity-80 transition-opacity"
                onError={() => setFaviconError(true)}
              />
            ) : (
              <span className="text-xl font-semibold align-middle group-hover:underline">Resume</span>
            )}
          </a>
        </div>
        <div className="flex items-center gap-x-4">
          <button
            aria-label="Download PDF"
            onClick={handleDownloadPDF}
            className="dark:bg-primary-bg hover:text-zinc-500 dark:text-primary-color bg-zinc-100 text-zinc-500 border dark:border-zinc-700 border-zinc-200 rounded-full p-2 transition-transform rotate-0"
          >
            <ArrowDownTrayIcon className="size-5 hover:text-primary-color duration-400 cursor-pointer" />
          </button>
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
        </div>
      </div>
    </header>
  );
}
