"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Counts a metric up from 0 to its value when it scrolls into view.
 * Preserves the "+" / formatting suffix. Renders the final value immediately
 * under prefers-reduced-motion (and never on the server, to avoid mismatch).
 */
export default function CountUp({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [disp, setDisp] = useState(value);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const num = parseInt(value.replace(/[^0-9]/g, ""), 10);
    if (!num) return;
    const suffix = value.replace(/[0-9,]/g, "");
    setDisp("0" + suffix);
    const el = ref.current;
    if (!el) return;
    let done = false;
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting || done) return;
        done = true;
        const start = performance.now();
        const tick = (t: number) => {
          const p = Math.min((t - start) / 1200, 1);
          setDisp(Math.round(num * (1 - Math.pow(1 - p, 3))).toLocaleString() + suffix);
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      },
      { threshold: 0.6 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [value]);

  return <span ref={ref}>{disp}</span>;
}
