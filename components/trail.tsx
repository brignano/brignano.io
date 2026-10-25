"use client";

import { useEffect, useRef, useState } from "react";

/**
 * The Trail — the homepage's one signature (docs/tsd-signature-experience.md).
 *
 * A single line runs down the page's left gutter from the hero (trailhead) to
 * the contact section (summit) and draws itself as the visitor scrolls. It is
 * measured from the real sections, so each waypoint sits exactly beside the
 * section it names and the line doubles as scroll progress. On desktop the
 * waypoints are links: nav is the trail.
 *
 * Contract (TSD §5.3–5.5):
 * - SVG + CSS + one rAF-throttled scroll listener. No library, no scroll-jack.
 * - Decorative: the SVG is aria-hidden and pointer-events: none. The waypoint
 *   links are real HTML, so removing the SVG removes nothing a reader needs.
 * - prefers-reduced-motion: the line renders fully drawn and static (CSS pins
 *   --trail-progress to 1; the listener is never attached).
 * - Inked with --mark, the identity colour the design system reserves for
 *   exactly this (DESIGN.md §3 "identity is not a fill").
 * - Mobile: thinner, closer to the edge, no labels. It never touches layout:
 *   it is absolutely positioned inside <main>, so the fold is unchanged.
 */

interface Waypoint {
  id: string;
  label: string;
  /** y in <main> coordinates. */
  y: number;
  /** 0–1 along the page, for the CSS reveal. */
  at: number;
}

interface Geometry {
  width: number;
  height: number;
  path: string;
  summit: { x: number; y: number };
  waypoints: Waypoint[];
  /** x of the spine, for positioning the HTML labels. */
  spineX: number;
}

// How far down the viewport the "pen" sits: the line is drawn to the point
// three quarters of the way down the screen, so it leads the eye slightly.
const PEN = 0.75;

// Catmull-Rom through the points, emitted as cubic Béziers.
function smoothPath(pts: { x: number; y: number }[]): string {
  if (pts.length < 2) return "";
  let d = `M${pts[0].x.toFixed(1)} ${pts[0].y.toFixed(1)}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(i - 1, 0)];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[Math.min(i + 2, pts.length - 1)];
    const c1x = p1.x + (p2.x - p0.x) / 6;
    const c1y = p1.y + (p2.y - p0.y) / 6;
    const c2x = p2.x - (p3.x - p1.x) / 6;
    const c2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C${c1x.toFixed(1)} ${c1y.toFixed(1)} ${c2x.toFixed(1)} ${c2y.toFixed(1)} ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
  }
  return d;
}

function measure(main: HTMLElement): Geometry | null {
  const sections = Array.from(
    main.querySelectorAll<HTMLElement>("section[data-trail]")
  );
  if (sections.length < 2) return null;

  const width = main.clientWidth;
  const height = main.scrollHeight;
  const mainTop = main.getBoundingClientRect().top + window.scrollY;
  const wide = width >= 1024;
  // The line lives in <main>'s own horizontal padding (px-6 / md:px-16), so
  // it never competes with content for width.
  const spineX = wide ? 28 : 7;
  const amp = wide ? 11 : 3;

  const stops = sections.map((el, i) => {
    const top = el.getBoundingClientRect().top + window.scrollY - mainTop;
    // Beside the heading, not the section's padded top edge.
    const heading = el.querySelector<HTMLElement>("h1, h2");
    const y = heading
      ? heading.getBoundingClientRect().top +
        window.scrollY -
        mainTop +
        heading.offsetHeight / 2
      : top;
    return {
      id: el.id,
      label: el.dataset.trail ?? el.id,
      y,
      zone: el.dataset.trailZone ?? (i === 0 ? "base" : "mid"),
    };
  });

  // Build the line: between consecutive waypoints the trail wanders. The
  // base is a gentle meander, the middle zone switchbacks, and the summit
  // zone straightens and climbs to the peak.
  const pts: { x: number; y: number }[] = [];
  pts.push({ x: spineX, y: stops[0].y });
  for (let i = 0; i < stops.length - 1; i++) {
    const a = stops[i];
    const b = stops[i + 1];
    const span = b.y - a.y;
    const zone = b.zone;
    const bends = zone === "mid" ? 3 : zone === "summit" ? 1 : 2;
    for (let k = 1; k <= bends; k++) {
      const t = k / (bends + 1);
      const side = k % 2 === 0 ? 1 : -1;
      const scale = zone === "mid" ? 1.4 : zone === "summit" ? 0.5 : 1;
      pts.push({ x: spineX + side * amp * scale, y: a.y + span * t });
    }
    pts.push({ x: spineX, y: b.y });
  }

  const last = stops[stops.length - 1];
  return {
    width,
    height,
    path: smoothPath(pts),
    summit: { x: spineX, y: last.y },
    waypoints: stops.map((s) => ({
      id: s.id,
      label: s.label,
      y: s.y,
      at: Math.min(1, Math.max(0, s.y / height)),
    })),
    spineX,
  };
}

export default function Trail() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const [geo, setGeo] = useState<Geometry | null>(null);

  // Measure once mounted and again whenever <main> changes size (fonts,
  // images, the contribution graph arriving, a window resize).
  useEffect(() => {
    const main = wrapRef.current?.parentElement;
    if (!main) return;
    let frame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => setGeo(measure(main)));
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(main);
    window.addEventListener("resize", update, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      ro.disconnect();
      window.removeEventListener("resize", update);
    };
  }, []);

  // Path length feeds the dash animation; progress feeds the CSS variable the
  // stylesheet draws from. Written straight to style, never through React
  // state, so scrolling re-renders nothing.
  useEffect(() => {
    const wrap = wrapRef.current;
    const path = pathRef.current;
    const main = wrap?.parentElement;
    if (!wrap || !path || !main || !geo) return;
    wrap.style.setProperty("--trail-length", String(path.getTotalLength()));

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      wrap.style.setProperty("--trail-progress", "1");
      return;
    }

    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        const mainTop = main.getBoundingClientRect().top + window.scrollY;
        const pen = window.scrollY + window.innerHeight * PEN - mainTop;
        const progress = Math.min(1, Math.max(0, pen / geo.height));
        wrap.style.setProperty("--trail-progress", progress.toFixed(4));
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [geo]);

  return (
    <div
      ref={wrapRef}
      className="trail pointer-events-none absolute inset-0 -z-10"
      style={{ "--trail-progress": 0 } as React.CSSProperties}
    >
      {geo && (
        <>
          <svg
            aria-hidden="true"
            width={geo.width}
            height={geo.height}
            viewBox={`0 0 ${geo.width} ${geo.height}`}
            className="absolute inset-0 overflow-visible"
          >
            <path
              ref={pathRef}
              d={geo.path}
              className="trail-path"
              fill="none"
              stroke="var(--mark)"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {geo.waypoints.map((w, i) => (
              <circle
                key={w.id}
                cx={geo.spineX}
                cy={w.y}
                r={geo.spineX > 10 ? 4 : 2.5}
                className="trail-waypoint"
                style={{ "--wp-at": w.at } as React.CSSProperties}
                fill="var(--bg)"
                stroke="var(--mark)"
                strokeWidth={i === geo.waypoints.length - 1 ? 0 : undefined}
              />
            ))}
            {/* The summit: a small peak where the line ends. */}
            <path
              d={`M${geo.summit.x - 7} ${geo.summit.y + 5} L${geo.summit.x} ${geo.summit.y - 6} L${geo.summit.x + 7} ${geo.summit.y + 5}`}
              className="trail-waypoint"
              style={{ "--wp-at": geo.waypoints[geo.waypoints.length - 1].at } as React.CSSProperties}
              fill="var(--bg)"
              stroke="var(--mark)"
              strokeLinejoin="round"
            />
          </svg>
          {/* Waypoints as links, desktop only: a generous hit area centred on
              each dot, with the section name appearing beside it on hover or
              focus. Calm by default, informative on intent. Nav is the trail. */}
          <nav
            aria-label="Sections"
            className="pointer-events-auto hidden lg:block"
          >
            {geo.waypoints.slice(1).map((w) => (
              <a
                key={w.id}
                href={`#${w.id}`}
                className="trail-wp group absolute flex h-7 w-7 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full focus-visible:outline-none"
                style={{ left: geo.spineX, top: w.y }}
              >
                {/* Above the dot, centred on the spine: the one place on the
                    line that is never over a heading. */}
                <span className="trail-wp-label pointer-events-none absolute bottom-full mb-2 whitespace-nowrap font-display text-[10px] uppercase tracking-[0.18em] text-mark-ink opacity-0 transition-opacity duration-150 group-hover:opacity-100 group-focus-visible:opacity-100">
                  {w.label}
                </span>
              </a>
            ))}
          </nav>
        </>
      )}
    </div>
  );
}
