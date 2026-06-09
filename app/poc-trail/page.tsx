"use client";

/**
 * THROWAWAY POC v4 — signature "Trail" experience (TSD P0 taste gate).
 * Back to the clean v1 aesthetic (user verdict: scenery/figure read childish).
 *  - abstract glowing-dot marker rides the drawn switchback trail
 *  - color wash per zone (mood), meaning carried by TYPOGRAPHY (copy/labels)
 *  - kept the clean structural wins: sticky nav + real content cards
 *  - NO scenery, NO figure. Restraint = senior.
 *  - reduced-motion -> static complete trail
 */

import { useEffect, useRef, useState } from "react";

// Option 2 (expedition day) — order still open; meaning is in the words.
const ZONES = [
  {
    key: "approach", sport: "Hike", label: "The approach",
    heading: "About",
    body: "Platform engineer who likes hard problems and clean abstractions. The work — and the mountains — both start with the approach.",
    accent: "#6f9e6f", bg: "#0a120d",
  },
  {
    key: "crux", sport: "Climb", label: "The crux",
    heading: "The work",
    body: "Internal developer platforms for thousands of engineers — CI/CD, DevOps intelligence, and AI-native tooling. The crux: make shipping safe and fast.",
    accent: "#9b7cff", bg: "#120e1c",
  },
  {
    key: "descent", sport: "Snowboard", label: "The descent",
    heading: "Off the clock",
    body: "Homelab, local-LLM routing, AI-native tooling with Claude Code — and when the screens are off, snowboarding through the woods.",
    accent: "#6fa8d6", bg: "#0a1019",
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
        markerRef.current.style.opacity = "1";
      }
      setZone(p < 1 / 3 ? 0 : p < 2 / 3 ? 1 : 2);
      document.documentElement.style.setProperty("--p", `${p}`);
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => { window.removeEventListener("scroll", onScroll); if (raf) cancelAnimationFrame(raf); };
  }, [d, reduced]);

  const z = ZONES[zone];

  return (
    <div className="poc-root">
      <style>{css}</style>

      <nav className="poc-nav" aria-label="Primary">
        <a className="poc-mono" href="#">A<span>|</span>B</a>
        <div className="poc-links">
          <a href="#">About</a><a href="#">Work</a><a href="#">Coding</a>
          <a href="#">Blog</a><a href="#">Contact</a>
          <span className="poc-kbd">⌘K</span>
        </div>
      </nav>

      <div className="poc-bg" style={{ background: `radial-gradient(120% 80% at 50% 0%, ${z.bg} 0%, #05060a 70%)` }} aria-hidden />

      <svg className="poc-trail" width={dims.w} height={dims.h} viewBox={`0 0 ${dims.w} ${dims.h}`} fill="none" aria-hidden>
        <path d={d} stroke="#ffffff" strokeOpacity={0.06} strokeWidth={2.5} />
        <path ref={pathRef} d={d} stroke={z.accent} strokeWidth={3} strokeLinecap="round" style={{ transition: "stroke 600ms ease" }} />
        <g ref={markerRef} style={{ opacity: 0 }}>
          <circle r={11} fill={z.accent} fillOpacity={0.2} />
          <circle r={5} fill={z.accent} />
        </g>
      </svg>

      <div className="poc-content">
        <section className="poc-hero">
          <p className="poc-eyebrow">Trailhead</p>
          <h1>I build the platforms<br />engineers ship on.</h1>
          <p className="poc-lede">Walk the approach. Climb the crux. Ride it out.</p>
          <p className="poc-scrollcue">↓ scroll</p>
        </section>

        {ZONES.map((zn, i) => (
          <section key={zn.key} className="poc-zone">
            <div className="poc-card" style={{ borderColor: zn.accent }}>
              <p className="poc-eyebrow" style={{ color: zn.accent }}>{String(i + 1).padStart(2, "0")} · {zn.sport} — {zn.label}</p>
              <h2>{zn.heading}</h2>
              <p>{zn.body}</p>
            </div>
          </section>
        ))}

        <section className="poc-summit">
          <p className="poc-eyebrow" style={{ color: ZONES[1].accent }}>The ride out</p>
          <h2>Let&apos;s build something.</h2>
          <p className="poc-lede">Every summit is just the next trailhead.</p>
        </section>
      </div>
    </div>
  );
}

const css = `
header, footer { display: none !important; }
.poc-root { position: relative; color: #f2f2f5; font-family: var(--font-geist, ui-sans-serif, system-ui); }
.poc-bg { position: fixed; inset: 0; z-index: 0; transition: background 700ms ease; }

.poc-nav { position: fixed; top: 0; left: 0; right: 0; z-index: 10; display: flex; align-items: center; justify-content: space-between; padding: 16px 28px; background: rgba(8,9,13,.5); backdrop-filter: blur(10px); border-bottom: 1px solid rgba(255,255,255,.06); }
.poc-mono { font-family: var(--font-silkscreen, monospace); font-size: 18px; color: #fff; text-decoration: none; letter-spacing: .05em; }
.poc-mono span { opacity: .5; margin: 0 1px; }
.poc-links { display: flex; align-items: center; gap: 22px; }
.poc-links a { color: #c8c8d0; text-decoration: none; font-size: 14px; transition: color .2s; }
.poc-links a:hover { color: #fff; }
.poc-kbd { font-size: 11px; color: #9a9aa6; border: 1px solid rgba(255,255,255,.15); border-radius: 6px; padding: 3px 7px; }

.poc-content { position: relative; z-index: 2; max-width: 720px; margin: 0 auto; padding: 0 24px; }
.poc-trail { position: absolute; top: 0; left: 50%; transform: translateX(-50%); z-index: 1; pointer-events: none; }
.poc-hero { min-height: 100vh; display: flex; flex-direction: column; justify-content: center; }
.poc-eyebrow { font-family: var(--font-silkscreen, monospace); text-transform: uppercase; letter-spacing: .15em; font-size: 12px; opacity: .85; margin: 0 0 16px; }
.poc-hero h1 { font-size: clamp(38px, 7vw, 72px); line-height: 1.02; margin: 0 0 20px; font-weight: 600; letter-spacing: -.02em; }
.poc-lede { font-size: clamp(16px, 2.2vw, 20px); color: #c8c8d0; max-width: 40ch; }
.poc-scrollcue { margin-top: 48px; font-size: 13px; letter-spacing: .3em; text-transform: uppercase; opacity: .5; animation: cue 1.8s ease-in-out infinite; }
@keyframes cue { 0%,100%{ transform: translateY(0);} 50%{ transform: translateY(8px);} }
.poc-zone { min-height: 100vh; display: flex; align-items: center; }
.poc-zone:nth-child(odd) .poc-card { margin-left: auto; }
.poc-card { background: rgba(12,14,20,.55); backdrop-filter: blur(8px); border: 1px solid; border-radius: 16px; padding: 28px 30px; max-width: 380px; box-shadow: 0 20px 60px rgba(0,0,0,.4); }
.poc-card h2 { font-size: clamp(26px, 4vw, 38px); margin: 0 0 12px; font-weight: 600; letter-spacing: -.01em; }
.poc-card p { margin: 0; color: #c2c2cc; line-height: 1.5; }
.poc-summit { min-height: 100vh; display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; }
.poc-summit h2 { font-size: clamp(34px, 6vw, 60px); margin: 0 0 16px; font-weight: 600; letter-spacing: -.02em; }
@media (prefers-reduced-motion: reduce) { .poc-scrollcue { animation: none; } }
`;
