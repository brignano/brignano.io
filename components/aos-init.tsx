"use client";

import { useEffect } from "react";
import AOS from "aos";

export default function AOSInit() {
  useEffect(() => {
    try {
      AOS.init({ once: true });
    } catch (e) {
      // noop - fail safe
    }
  }, []);

  return null;
}
