"use client";

import { useEffect } from "react";

export default function AOSInit() {
  useEffect(() => {
    // Dynamically import AOS only on client-side
    const initAOS = async () => {
      try {
        const AOS = (await import("aos")).default;
        AOS.init({ once: true, duration: 800 });
      } catch (e) {
        // noop - fail safe
      }
    };
    initAOS();
  }, []);

  return null;
}
