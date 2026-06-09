"use client";

/**
 * THROWAWAY POC — signature "Trail" experience (TSD P0 taste gate).
 * Not production code. Self-contained on purpose so it's easy to delete.
 * Demonstrates: scroll-drawn switchback trail (SVG stroke-dashoffset),
 * a marker that rides the path, three altitude zones with ambient hue
 * shifts, waypoints, and reduced-motion -> static complete trail.
 */

import { useEffect, useRef, useState } from "react";

// Option 1 (Ascent): approach -> slopes -> summit. Climb = apex.
const ZONES = [
  {
    key: "approach",
    sport: "Hike",
    label: "The approach",
    sub: "Foundations — showing up, the grind before the reward.",
    accent: "#6f9e6f", // moss
    bg: "#0a120d",
  },
  {
    key: "slopes",
    sport: "Snowboard",
    label: "The slopes",
    sub: "Momentum — flow, speed, reading the terrain.",
    accent: "#6fa8d6", // ice
    bg: "#0a1019",
  },
  {
    key: "summit",
    sport: "Climb",
    label: "The summit",
    sub: "The crux — focus, commitment, the move that matters.",
    accent: "#9b7cff", // violet (summit accent)
    bg: "#120e1c",
  },
] as const;

function buildSwitchbackPath(h: number, w: number) {
  const cx = w / 2;
  const amp = w / 2 - 18;
  const seg = 260;
  const n = Math.max(6, Math.round(h / seg));
  const step = h / n;
  let xprev = cx;
  let d = `M ${cx} 0`;
  for (let i = 1; i <= n; i++) {
    const ny = i * step;
    const x = i % 2 ? cx + amp : cx - amp;
    const c1y = (i - 1) * step + step * 0.5;
    const c2y = ny - step * 0.5;
    d += ` C ${xprev} ${c1y}, ${x} ${c2y}, ${x} ${ny}`;
    xprev = x;
  }
  return d;
}

export default function PocTrail() {
  const pathRef = useRef<SVGPathElement>(null);
  const markerRef = useRef<SVGGElement>(null);
  const [dims, setDims] = useState({ h: 0, w: 320 });
  const [d, setD] = useState("");
  const [zone, setZone] = useState(0);
  const [reduced, setReduced] = useState(false);

  // Measure + build path
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const measure = () => {
      const h = document.documentElement.scrollHeight;
      const w = Math.min(Math.max(window.innerWidth * 0.5, 220), 380);
      setDims({ h, w });
      setD(buildSwitchbackPath(h, w));
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  // Drive draw + marker + zone on scroll
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
      const pt = path.getPointAtLength(p * total);
      if (markerRef.current) {
        markerRef.current.setAttribute("transform", `translate(${pt.x} ${pt.y})`);
        markerRef.current.style.opacity = reduced ? "0" : "1";
      }
      const z = p < 1 / 3 ? 0 : p < 2 / 3 ? 1 : 2;
      setZone(z);
      document.documentElement.style.setProperty("--p", `${p}`);
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
  }, [d, reduced]);

  const z = ZONES[zone];

  return (
    <div className="poc-root">
      <style>{css}</style>

      {/* Ambient background that shifts per zone */}
      <div
        className="poc-bg"
        style={{
          background: `radial-gradient(120% 80% at 50% 0%, ${z.bg} 0%, #05060a 70%)`,
        }}
        aria-hidden
      />

      {/* The trail */}
      <svg
        className="poc-trail"
        width={dims.w}
        height={dims.h}
        viewBox={`0 0 ${dims.w} ${dims.h}`}
        fill="none"
        aria-hidden
      >
        {/* faint full path (the trail ahead) */}
        <path d={d} stroke="#ffffff" strokeOpacity={0.06} strokeWidth={2.5} />
        {/* drawn path (where you've been) */}
        <path
          ref={pathRef}
          d={d}
          stroke={z.accent}
          strokeWidth={3}
          strokeLinecap="round"
          style={{ transition: "stroke 600ms ease" }}
        />
        {/* moving marker */}
        <g ref={markerRef} style={{ transition: "opacity 300ms" }}>
          <circle r={11} fill={z.accent} fillOpacity={0.2} />
          <circle r={5} fill={z.accent} />
        </g>
      </svg>

      {/* Content */}
      <div className="poc-content">
        <section className="poc-hero">
          <p className="poc-eyebrow">Trailhead</p>
          <h1>
            I build the platforms
            <br />
            engineers ship on.
          </h1>
          <p className="poc-lede">
            Every route starts at the trailhead. Scroll to follow the climb.
          </p>
          <p className="poc-scrollcue">↓ scroll</p>
        </section>

        {ZONES.map((zone, i) => (
          <section key={zone.key} className="poc-zone">
            <div className="poc-card" style={{ borderColor: zone.accent }}>
              <p className="poc-eyebrow" style={{ color: zone.accent }}>
                {String(i + 1).padStart(2, "0")} · {zone.sport}
              </p>
              <h2>{zone.label}</h2>
              <p>{zone.sub}</p>
            </div>
          </section>
        ))}

        <section className="poc-summit">
          <p className="poc-eyebrow" style={{ color: ZONES[2].accent }}>
            The peak
          </p>
          <h2>Let&apos;s build something.</h2>
          <p className="poc-lede">The summit is just the next trailhead.</p>
        </section>
      </div>
    </div>
  );
}

const css = `
.poc-root { position: relative; color: #f2f2f5; font-family: var(--font-geist, ui-sans-serif, system-ui); }
.poc-bg { position: fixed; inset: 0; z-index: 0; transition: background 700ms ease; }
.poc-trail { position: absolute; top: 0; left: 50%; transform: translateX(-50%); z-index: 1; pointer-events: none; }
.poc-content { position: relative; z-index: 2; max-width: 720px; margin: 0 auto; padding: 0 24px; }
.poc-hero { min-height: 100vh; display: flex; flex-direction: column; justify-content: center; }
.poc-eyebrow { font-family: var(--font-silkscreen, monospace); text-transform: uppercase; letter-spacing: .15em; font-size: 12px; opacity: .8; margin: 0 0 16px; }
.poc-hero h1 { font-size: clamp(38px, 7vw, 72px); line-height: 1.02; margin: 0 0 20px; font-weight: 600; letter-spacing: -.02em; }
.poc-lede { font-size: clamp(16px, 2.2vw, 20px); color: #c8c8d0; max-width: 38ch; }
.poc-scrollcue { margin-top: 48px; font-size: 13px; letter-spacing: .3em; text-transform: uppercase; opacity: .5; animation: bob 1.8s ease-in-out infinite; }
@keyframes bob { 0%,100%{ transform: translateY(0);} 50%{ transform: translateY(8px);} }
.poc-zone { min-height: 100vh; display: flex; align-items: center; }
.poc-zone:nth-child(odd) .poc-card { margin-left: auto; }
.poc-card { background: rgba(12,14,20,.55); backdrop-filter: blur(8px); border: 1px solid; border-radius: 16px; padding: 28px 30px; max-width: 380px; box-shadow: 0 20px 60px rgba(0,0,0,.4); }
.poc-card h2 { font-size: clamp(26px, 4vw, 38px); margin: 0 0 12px; font-weight: 600; letter-spacing: -.01em; }
.poc-card p { margin: 0; color: #c2c2cc; line-height: 1.5; }
.poc-summit { min-height: 100vh; display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; }
.poc-summit h2 { font-size: clamp(34px, 6vw, 60px); margin: 0 0 16px; font-weight: 600; letter-spacing: -.02em; }
@media (prefers-reduced-motion: reduce) { .poc-scrollcue { animation: none; } }
`;
