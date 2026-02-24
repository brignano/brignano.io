"use client";

import { useEffect } from "react";

export default function AOSInit() {
  useEffect(() => {
    // Dynamically import AOS only on client-side
    const initAOS = async () => {
      try {
        const AOS = (await import("aos")).default;
        AOS.init({
          once: true,
          duration: 800,
          disable: () =>
            typeof window !== "undefined" &&
            window.matchMedia("(prefers-reduced-motion: reduce)").matches,
        });
      } catch (e) {
        // noop - fail safe
      }
    };
    initAOS();
  }, []);

  return null;
}
