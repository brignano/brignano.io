"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Signature "trail thread" — the page's directional spine. An abstract violet
 * line threads the left gutter, weaving through every section and drawing as you
 * scroll, with a marker that rides it. Each section has a **station** that lights
 * and pulses as the scroll focus line passes it (tactile feedback weaving into
 * and out of sections), and the trail **terminates at a summit node** on the
 * final contact CTA — the journey has an ending.
 *
 * Decorative only (`aria-hidden`): lives in the margin, never behind text; themes
 * via `.text-primary-color` (currentColor); renders fully-drawn + all stations lit
 * and static under `prefers-reduced-motion`; hidden on narrow viewports (no gutter).
 *
 * Stations come from `[data-trail]` elements in the page; `data-trail="summit"`
 * marks the terminus. Compositor-only props (stroke-dashoffset / transform /
 * opacity) keep it off the main thread.
 */
type TrailNode = { x: number; y: number; summit: boolean };

function buildTrail(
  ys: { y: number; summit: boolean }[],
  ax: number,
  amp: number
) {
  const pts: TrailNode[] = ys.map((w, i) => ({
    x: i === 0 ? ax : ax + (i % 2 ? amp : -amp),
    y: w.y,
    summit: w.summit,
  }));
  let d = `M ${pts[0].x.toFixed(1)} ${pts[0].y.toFixed(1)}`;
  for (let i = 1; i < pts.length; i++) {
    const a = pts[i - 1];
    const b = pts[i];
    const midY = (a.y + b.y) / 2;
    d += ` C ${a.x.toFixed(1)} ${midY.toFixed(1)}, ${b.x.toFixed(1)} ${midY.toFixed(1)}, ${b.x.toFixed(1)} ${b.y.toFixed(1)}`;
  }
  return { d, pts };
}

export default function TrailThread() {
  const pathRef = useRef<SVGPathElement>(null);
  const markerRef = useRef<SVGGElement>(null);
  const nodeRefs = useRef<(SVGGElement | null)[]>([]);
  const activeRef = useRef<boolean[]>([]);
  const [w, setW] = useState(0);
  const [h, setH] = useState(0);
  const [d, setD] = useState("");
  const [pts, setPts] = useState<TrailNode[]>([]);
  const [reduced, setReduced] = useState(false);

  // Measure sections and build the weaving path that threads through them.
  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    const measure = () => {
      const vw = window.innerWidth;
      setW(vw);
      setH(document.documentElement.scrollHeight);
      if (vw < 768) return;

      const marks = Array.from(
        document.querySelectorAll<HTMLElement>("[data-trail]")
      );
      if (!marks.length) return;

      // Sit the spine in the gutter, scaling with the viewport so it reads as a
      // side-rail near the content rather than hugging the window edge. Stays
      // left of the content column's text at every width.
      const gutter = Math.max(0, (vw - 1280) / 2);
      // Sit ~60% of the way into the gutter (closer to the content, off the
      // window edge) while always staying left of the text column.
      const ax = gutter > 100 ? Math.round(gutter * 0.6 + 26) : 32;
      const amp = gutter > 100 ? Math.min(Math.round(gutter * 0.2), 44) : 16;

      const ys = marks.map((el) => {
        const r = el.getBoundingClientRect();
        return {
          y: r.top + window.scrollY + Math.min(72, r.height * 0.22),
          summit: el.dataset.trail === "summit",
        };
      });
      ys[0].y = Math.min(ys[0].y, 140); // clean origin just below the header

      const built = buildTrail(ys, ax, amp);
      setD(built.d);
      setPts(built.pts);
    };

    measure();
    window.addEventListener("resize", measure);
    // Re-measure after async content (e.g. the GitHub calendar) grows the page.
    const t1 = setTimeout(measure, 700);
    const t2 = setTimeout(measure, 1800);
    return () => {
      window.removeEventListener("resize", measure);
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  // Draw on scroll, ride the marker, and light each station as the focus passes.
  useEffect(() => {
    const path = pathRef.current;
    if (!path || !d || pts.length < 2) return;
    const total = path.getTotalLength();
    path.style.strokeDasharray = `${total}`;

    if (reduced) {
      path.style.strokeDashoffset = "0";
      nodeRefs.current.forEach((n) => n?.classList.add("on"));
      if (markerRef.current) markerRef.current.style.opacity = "0";
      return;
    }

    path.style.strokeDashoffset = `${total}`;
    activeRef.current = pts.map(() => false);
    const y0 = pts[0].y;
    const ySummit = pts[pts.length - 1].y;
    let raf = 0;

    const update = () => {
      raf = 0;
      const el = document.scrollingElement || document.documentElement;
      // The "focus line" sits a little below mid-viewport — the trail resolves
      // at the summit as the contact CTA comes into view, not at page bottom.
      const focus = el.scrollTop + el.clientHeight * 0.55;
      const p = Math.min(Math.max((focus - y0) / Math.max(1, ySummit - y0), 0), 1);
      path.style.strokeDashoffset = `${total * (1 - p)}`;

      const pt = path.getPointAtLength(p * total);
      if (markerRef.current) {
        markerRef.current.setAttribute(
          "transform",
          `translate(${pt.x} ${pt.y})`
        );
        // Hand off to the glowing summit node once the journey completes.
        markerRef.current.style.opacity = p >= 0.999 ? "0" : "1";
      }

      pts.forEach((node, i) => {
        const on = focus >= node.y;
        if (on !== activeRef.current[i]) {
          activeRef.current[i] = on;
          const g = nodeRefs.current[i];
          if (!g) return;
          g.classList.toggle("on", on);
          if (on) {
            g.classList.remove("pulse");
            void g.getBoundingClientRect(); // restart the pulse animation
            g.classList.add("pulse");
          }
        }
      });
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [d, pts, reduced]);

  if (w && w < 768) return null; // no gutter on mobile
  if (!d || pts.length < 2) return null;

  return (
    <svg
      aria-hidden
      className="absolute top-0 left-0 z-0 pointer-events-none text-primary-color"
      width={w}
      height={h}
      viewBox={`0 0 ${w} ${h}`}
      fill="none"
    >
      {/* the route ahead, faint */}
      <path d={d} stroke="currentColor" strokeOpacity={0.1} strokeWidth={2} />
      {/* drawn-on-scroll bright trail */}
      <path
        ref={pathRef}
        d={d}
        stroke="currentColor"
        strokeWidth={2.5}
        strokeLinecap="round"
      />
      {/* stations at each section; the last is the summit */}
      {pts.map((node, i) => (
        <g
          key={i}
          ref={(el) => {
            nodeRefs.current[i] = el;
          }}
          className={`trail-node${node.summit ? " trail-node--summit" : ""}`}
          transform={`translate(${node.x} ${node.y})`}
        >
          <circle
            className="trail-node__pulse"
            r={node.summit ? 11 : 7}
            fill="currentColor"
          />
          <circle
            className="trail-node__ring"
            r={node.summit ? 8 : 4.5}
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
          />
          <circle
            className="trail-node__dot"
            r={node.summit ? 4 : 2.5}
            fill="currentColor"
          />
        </g>
      ))}
      {/* the rider — "you are here" */}
      <g ref={markerRef} style={{ opacity: 0 }}>
        <circle r={9} fill="currentColor" fillOpacity={0.15} />
        <circle r={4} fill="currentColor" />
      </g>
    </svg>
  );
}
