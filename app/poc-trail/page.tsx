"use client";

/**
 * THROWAWAY POC v3 — signature "Trail" experience (TSD P0 taste gate).
 * Not production code. v3 adds:
 *  - per-zone BIOME scenery (flat silhouette horizons) + color wash together
 *  - distinct figure PROPS: hiker (hat/pack/camera), climber (helmet/harness/rope),
 *    snowboarder (board/goggles)
 *  - figure pose stays tied to ZONE (not scroll direction) — intentional.
 *  - reduced-motion -> static complete trail, no idle bob
 */

import { useEffect, useRef, useState } from "react";

// Option 2 (expedition day): approach -> crux -> descent.
const ZONES = [
  {
    key: "approach", sport: "Hike", label: "The approach",
    heading: "About",
    body: "Platform engineer who likes hard problems and clean abstractions. The work — and the mountains — both start with the approach.",
    accent: "#6f9e6f", bg: "#0a120d", sky: "#0f1d14",
  },
  {
    key: "crux", sport: "Climb", label: "The crux",
    heading: "The work",
    body: "Internal developer platforms for thousands of engineers — CI/CD, DevOps intelligence, and AI-native tooling. The crux: make shipping safe and fast.",
    accent: "#9b7cff", bg: "#120e1c", sky: "#1b1430",
  },
  {
    key: "descent", sport: "Snowboard", label: "The descent",
    heading: "Off the clock",
    body: "Homelab, local-LLM routing, AI-native tooling with Claude Code — and when the screens are off, snowboarding through the woods.",
    accent: "#6fa8d6", bg: "#0a1019", sky: "#101b2b",
  },
] as const;

// Flat silhouette horizons (viewBox 1440x400, stretched full-width, bottom-anchored)
const SCENERY = {
  far: "M0 400 L0 230 L260 130 L520 210 L780 110 L1040 200 L1300 120 L1440 180 L1440 400 Z",
  // forest: low hill + jagged treeline
  approach:
    "M0 400 L0 320 L40 270 L70 312 L110 255 L150 306 L195 250 L235 300 L280 246 L320 300 L370 256 L410 305 L460 260 L500 305 L555 250 L600 300 L650 260 L700 305 L760 250 L810 300 L860 258 L910 302 L965 250 L1010 300 L1065 258 L1110 302 L1165 252 L1210 300 L1265 258 L1310 300 L1365 255 L1410 300 L1440 282 L1440 400 Z",
  // rock: tall sharp alpine spires
  crux:
    "M0 400 L0 260 L120 90 L200 205 L300 60 L400 195 L520 42 L640 205 L760 80 L880 210 L1000 70 L1120 205 L1240 100 L1360 210 L1440 150 L1440 400 Z",
  // snow: smooth rolling ridge
  descent:
    "M0 400 L0 300 C 240 250, 420 232, 620 262 C 760 282, 820 182, 980 202 C 1140 222, 1260 300, 1440 290 L1440 400 Z",
};

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

function Figure({ zone, color }: { zone: number; color: string }) {
  const s = { stroke: color, strokeWidth: 1.5, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, fill: "none" };
  const cap = { fill: color, stroke: "none" };
  if (zone === 0) {
    // hiker: hat, daypack, camera, trekking pole
    return (
      <g {...s}>
        <circle cx={0} cy={-11} r={2.3} {...cap} />
        <path d="M-4 -13 L4 -13" /> {/* hat brim */}
        <path d="M-2.5 -13 Q0 -17 2.5 -13" {...cap} /> {/* hat crown */}
        <rect x={-6.5} y={-9} width={4} height={8} rx={1.5} fill={color} fillOpacity={0.5} stroke="none" /> {/* pack */}
        <rect x={1.2} y={-5} width={3} height={2.3} rx={0.5} /> {/* camera */}
        <path d="M0 -8 L0 0" />
        <path d="M0 0 L-4 7" />
        <path d="M0 0 L4 6" />
        <path d="M0 -6 L5 -3" />
        <path d="M5 -3 L6 8" /> {/* pole */}
      </g>
    );
  }
  if (zone === 1) {
    // climber: helmet, harness, trailing rope, reaching pose, rock edge
    return (
      <g {...s}>
        <path d="M9 -16 L9 10" strokeOpacity={0.3} /> {/* rock edge */}
        <circle cx={0} cy={-11} r={2.3} {...cap} />
        <path d="M-3 -11 Q0 -15.5 3 -11 Z" {...cap} /> {/* helmet */}
        <path d="M0 -8 L-1 0" />
        <path d="M0 -7 L5 -14" /> {/* reaching arm */}
        <path d="M-1 -5 L-5 -2" /> {/* low arm */}
        <rect x={-3.5} y={-1} width={7} height={2} rx={0.7} fill={color} fillOpacity={0.6} stroke="none" /> {/* harness */}
        <path d="M-1 0 L-4 8" />
        <path d="M-1 0 L3 6" />
        <path d="M0 1 C 6 6, -2 13, 4 21" strokeOpacity={0.7} /> {/* rope */}
      </g>
    );
  }
  // snowboarder: board, goggles, arms out
  return (
    <g {...s}>
      <path d="M-9 8 L9 6" strokeWidth={2.4} />
      <path d="M-3 7 L-1 0" />
      <path d="M4 6 L1 0" />
      <path d="M0 0 L1 -7" />
      <circle cx={1} cy={-10} r={2.3} {...cap} />
      <path d="M-1 -10.5 L3.2 -10.7" strokeWidth={1.4} /> {/* goggles */}
      <path d="M0 -4 L-7 -6" />
      <path d="M0 -4 L8 -3" />
    </g>
  );
}

function Horizon({ d, fill, opacity, z }: { d: string; fill: string; opacity: number; z: number }) {
  return (
    <svg className="poc-horizon" viewBox="0 0 1440 400" preserveAspectRatio="none" aria-hidden style={{ zIndex: z }}>
      <path d={d} fill={fill} style={{ transition: "opacity 700ms ease" }} opacity={opacity} />
    </svg>
  );
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

      {/* sky/color wash */}
      <div className="poc-bg" style={{ background: `linear-gradient(180deg, ${z.sky} 0%, ${z.bg} 45%, #05060a 100%)` }} aria-hidden />

      {/* biome scenery — color + scenery together */}
      <div className="poc-scenery" aria-hidden>
        <Horizon d={SCENERY.far} fill="#ffffff" opacity={0.035} z={1} />
        <Horizon d={SCENERY.approach} fill="#0e1f16" opacity={zone === 0 ? 1 : 0} z={2} />
        <Horizon d={SCENERY.crux} fill="#1a1330" opacity={zone === 1 ? 1 : 0} z={2} />
        <Horizon d={SCENERY.descent} fill="#152233" opacity={zone === 2 ? 1 : 0} z={2} />
      </div>

      <svg className="poc-trail" width={dims.w} height={dims.h} viewBox={`0 0 ${dims.w} ${dims.h}`} fill="none" aria-hidden>
        <path d={d} stroke="#ffffff" strokeOpacity={0.06} strokeWidth={2.5} />
        <path ref={pathRef} d={d} stroke={z.accent} strokeWidth={3} strokeLinecap="round" style={{ transition: "stroke 600ms ease" }} />
        <g ref={markerRef} style={{ opacity: 0 }}>
          <circle r={15} fill={z.accent} fillOpacity={0.12} />
          <g className={reduced ? "" : "poc-fig"}>
            <g transform="scale(1.3)"><Figure zone={zone} color={z.accent} /></g>
          </g>
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
.poc-scenery { position: fixed; left: 0; right: 0; bottom: 0; height: 46vh; z-index: 1; pointer-events: none; }
.poc-horizon { position: absolute; left: 0; bottom: 0; width: 100%; height: 100%; }
.poc-fig { animation: bob 2.4s ease-in-out infinite; transform-box: fill-box; transform-origin: center; }
@keyframes bob { 0%,100%{ transform: translateY(0);} 50%{ transform: translateY(-3px);} }

.poc-nav { position: fixed; top: 0; left: 0; right: 0; z-index: 10; display: flex; align-items: center; justify-content: space-between; padding: 16px 28px; background: rgba(8,9,13,.5); backdrop-filter: blur(10px); border-bottom: 1px solid rgba(255,255,255,.06); }
.poc-mono { font-family: var(--font-silkscreen, monospace); font-size: 18px; color: #fff; text-decoration: none; letter-spacing: .05em; }
.poc-mono span { opacity: .5; margin: 0 1px; }
.poc-links { display: flex; align-items: center; gap: 22px; }
.poc-links a { color: #c8c8d0; text-decoration: none; font-size: 14px; transition: color .2s; }
.poc-links a:hover { color: #fff; }
.poc-kbd { font-size: 11px; color: #9a9aa6; border: 1px solid rgba(255,255,255,.15); border-radius: 6px; padding: 3px 7px; }

.poc-content { position: relative; z-index: 3; max-width: 720px; margin: 0 auto; padding: 0 24px; }
.poc-trail { position: absolute; top: 0; left: 50%; transform: translateX(-50%); z-index: 2; pointer-events: none; }
.poc-hero { min-height: 100vh; display: flex; flex-direction: column; justify-content: center; }
.poc-eyebrow { font-family: var(--font-silkscreen, monospace); text-transform: uppercase; letter-spacing: .15em; font-size: 12px; opacity: .85; margin: 0 0 16px; }
.poc-hero h1 { font-size: clamp(38px, 7vw, 72px); line-height: 1.02; margin: 0 0 20px; font-weight: 600; letter-spacing: -.02em; }
.poc-lede { font-size: clamp(16px, 2.2vw, 20px); color: #c8c8d0; max-width: 40ch; }
.poc-scrollcue { margin-top: 48px; font-size: 13px; letter-spacing: .3em; text-transform: uppercase; opacity: .5; animation: cue 1.8s ease-in-out infinite; }
@keyframes cue { 0%,100%{ transform: translateY(0);} 50%{ transform: translateY(8px);} }
.poc-zone { min-height: 100vh; display: flex; align-items: center; }
.poc-zone:nth-child(odd) .poc-card { margin-left: auto; }
.poc-card { background: rgba(12,14,20,.62); backdrop-filter: blur(8px); border: 1px solid; border-radius: 16px; padding: 28px 30px; max-width: 380px; box-shadow: 0 20px 60px rgba(0,0,0,.4); }
.poc-card h2 { font-size: clamp(26px, 4vw, 38px); margin: 0 0 12px; font-weight: 600; letter-spacing: -.01em; }
.poc-card p { margin: 0; color: #c2c2cc; line-height: 1.5; }
.poc-summit { min-height: 100vh; display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; }
.poc-summit h2 { font-size: clamp(34px, 6vw, 60px); margin: 0 0 16px; font-weight: 600; letter-spacing: -.02em; }
@media (prefers-reduced-motion: reduce) { .poc-scrollcue, .poc-fig { animation: none; } }
`;
