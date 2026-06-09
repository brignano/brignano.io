"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Signature "trail thread" — an abstract violet line in the left gutter that
 * draws as you scroll, with a marker that rides it. Decorative only: lives in
 * the margin (never behind text), themes via .text-primary-color (currentColor),
 * and renders fully-drawn + static under prefers-reduced-motion. Hidden on
 * narrow viewports where there's no gutter.
 */
function buildPath(h: number) {
  const ax = 24, amp = 14, top = 104;
  const rest = h - top, n = Math.max(4, Math.round(rest / 360)), step = rest / n;
  let xprev = ax, y = top, d = `M ${ax} ${top}`;
  for (let i = 1; i <= n; i++) {
    const ny = top + i * step, x = i % 2 ? ax + amp : ax - amp;
    d += ` C ${xprev} ${y + step * 0.5}, ${x} ${ny - step * 0.5}, ${x} ${ny}`;
    xprev = x; y = ny;
  }
  return d;
}

export default function TrailThread() {
  const pathRef = useRef<SVGPathElement>(null);
  const markerRef = useRef<SVGGElement>(null);
  const [dims, setDims] = useState({ h: 0, w: 0 });
  const [d, setD] = useState("");
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    const measure = () => {
      const h = document.documentElement.scrollHeight;
      setDims({ h, w: window.innerWidth });
      setD(buildPath(h));
    };
    measure();
    window.addEventListener("resize", measure);
    // re-measure after async content (e.g. the GitHub calendar) grows the page
    const t1 = setTimeout(measure, 700);
    const t2 = setTimeout(measure, 1800);
    return () => {
      window.removeEventListener("resize", measure);
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  useEffect(() => {
    const path = pathRef.current;
    if (!path || !d) return;
    const total = path.getTotalLength();
    path.style.strokeDasharray = `${total}`;
    path.style.strokeDashoffset = reduced ? "0" : `${total}`;
    let raf = 0;
    const update = () => {
      raf = 0;
      const el = document.scrollingElement || document.documentElement;
      const max = el.scrollHeight - el.clientHeight;
      const p = max > 0 ? Math.min(Math.max(el.scrollTop / max, 0), 1) : 0;
      if (!reduced) path.style.strokeDashoffset = `${total * (1 - p)}`;
      const pt = path.getPointAtLength((reduced ? 1 : p) * total);
      if (markerRef.current) {
        markerRef.current.setAttribute("transform", `translate(${pt.x} ${pt.y})`);
        markerRef.current.style.opacity = reduced ? "0" : "1";
      }
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => { window.removeEventListener("scroll", onScroll); if (raf) cancelAnimationFrame(raf); };
  }, [d, reduced]);

  if (dims.w < 768) return null; // no gutter on mobile

  return (
    <svg
      aria-hidden
      className="absolute top-0 left-0 z-0 pointer-events-none text-primary-color"
      width={dims.w}
      height={dims.h}
      viewBox={`0 0 ${dims.w} ${dims.h}`}
      fill="none"
    >
      <path d={d} stroke="currentColor" strokeOpacity={0.12} strokeWidth={2} />
      <path ref={pathRef} d={d} stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" />
      <g ref={markerRef} style={{ opacity: 0 }}>
        <circle r={9} fill="currentColor" fillOpacity={0.15} />
        <circle r={4} fill="currentColor" />
      </g>
    </svg>
  );
}
