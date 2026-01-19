"use client";

import { useEffect, useState } from "react";
import { event } from "@/lib/gtag";

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > 300);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleClick = () => {
    try {
      event("scroll_to_top_clicked");
    } catch (e) {
      // noop
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!visible) return null;

  return (
    <button
      id="scroll-to-top"
      aria-label="Scroll to top"
      onClick={handleClick}
      className="fixed bottom-6 right-6 z-50 cursor-pointer inline-flex items-center justify-center p-3 border-2 rounded-full shadow-lg transition-all duration-200 bg-secondary-bg dark:bg-primary-bg border-zinc-300 dark:border-zinc-700 hover:scale-105"
    >
      <svg
        className="w-5 h-5 text-zinc-800 dark:text-white"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5 15l7-7 7 7"
        />
      </svg>
    </button>
  );
}
