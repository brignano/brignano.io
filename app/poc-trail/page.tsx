"use client";

/**
 * THROWAWAY POC v5 — signature scroll experience over REAL content.
 * Decoupled from the mountain theme (user: "too themed").
 *  - YOUR actual homepage sections & copy (from lib/constants.ts), unrestructured
 *  - signature = abstract trail thread that draws on scroll (no zone labels/theme)
 *    + scroll-reveal choreography + hero metric count-up + sticky nav + ⌘K
 *  - trail line evolves through a cohesive cool palette (aesthetic only, not "zones")
 *  - reduced-motion -> everything visible, trail fully drawn, no count-up
 */

import { useEffect, useRef, useState } from "react";

const METRICS = [
  { value: "8,000+", label: "enterprise developers" },
  { value: "1,000+", label: "active in 90 days" },
  { value: "10,000+", label: "repos migrated" },
];

const ACHIEVEMENTS = [
  { outcome: "A unified developer platform for 8,000+ engineers", skills: ["GitHub Enterprise", "Custom CLI", "IDE Extensions"] },
  { outcome: "1,000+ engineers active in the first 90 days", skills: ["Desktop App", "CLI", "Self-service onboarding"] },
  { outcome: "One build command, any stack — local, CI, or fully remote", skills: ["CI/CD", "Base-image registry", "Containers"] },
  { outcome: "Real-time DevOps intelligence for engineers and AI agents", skills: ["MCP", "AWS", "DynamoDB", "Snowflake"] },
];

const NOW = [
  { label: "Homelab", detail: "Proxmox · Docker · Tailscale" },
  { label: "Local-LLM routing", detail: "Ollama · Open WebUI" },
  { label: "AI-native tooling", detail: "Claude Code" },
];

const ACCENT = ["#6d8cff", "#9b7cff", "#56b6c2"]; // cohesive cool palette, aesthetic only

function buildSwitchbackPath(h: number, w: number) {
  const cx = w / 2, amp = w / 2 - 18, seg = 300;
  const n = Math.max(6, Math.round(h / seg)), step = h / n;
  let xprev = cx, d = `M ${cx} 0`;
  for (let i = 1; i <= n; i++) {
    const ny = i * step, x = i % 2 ? cx + amp : cx - amp;
    d += ` C ${xprev} ${(i - 1) * step + step * 0.5}, ${x} ${ny - step * 0.5}, ${x} ${ny}`;
    xprev = x;
  }
  return d;
}

function Metric({ value, label }: { value: string; label: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [disp, setDisp] = useState(value);
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;
    const num = parseInt(value.replace(/[^0-9]/g, ""), 10);
    const suffix = value.replace(/[0-9,]/g, "");
    setDisp("0" + suffix);
    const el = ref.current;
    if (!el || !num) return;
    let done = false;
    const io = new IntersectionObserver((entries) => {
      if (!entries[0].isIntersecting || done) return;
      done = true;
      const start = performance.now(), dur = 1200;
      const tick = (t: number) => {
        const p = Math.min((t - start) / dur, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        setDisp(Math.round(num * eased).toLocaleString() + suffix);
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }, { threshold: 0.6 });
    io.observe(el);
    return () => io.disconnect();
  }, [value]);
  return (
    <div className="m-metric">
      <span ref={ref} className="m-num">{disp}</span>
      <span className="m-label">{label}</span>
    </div>
  );
}

export default function PocTrail() {
  const pathRef = useRef<SVGPathElement>(null);
  const markerRef = useRef<SVGGElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const [dims, setDims] = useState({ h: 0, w: 300 });
  const [d, setD] = useState("");
  const [accent, setAccent] = useState(ACCENT[0]);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    const measure = () => {
      const h = document.documentElement.scrollHeight;
      const w = Math.min(Math.max(window.innerWidth * 0.45, 200), 340);
      setDims({ h, w });
      setD(buildSwitchbackPath(h, w));
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  // scroll-reveal choreography
  useEffect(() => {
    if (reduced) {
      rootRef.current?.querySelectorAll(".reveal").forEach((e) => e.classList.add("in"));
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("in"); });
    }, { threshold: 0.18 });
    rootRef.current?.querySelectorAll(".reveal").forEach((e) => io.observe(e));
    return () => io.disconnect();
  }, [reduced, d]);

  // trail draw + marker + accent evolution
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
      setAccent(ACCENT[p < 0.4 ? 0 : p < 0.72 ? 1 : 2]);
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => { window.removeEventListener("scroll", onScroll); if (raf) cancelAnimationFrame(raf); };
  }, [d, reduced]);

  return (
    <div className="poc-root" ref={rootRef}>
      <style>{css}</style>

      <nav className="poc-nav" aria-label="Primary">
        <a className="poc-mono" href="#">A<span>|</span>B</a>
        <div className="poc-links">
          <a href="#about">About</a><a href="#work">Work</a><a href="#">Coding</a>
          <a href="#">Blog</a><a href="#contact">Contact</a>
          <span className="poc-kbd">⌘K</span>
        </div>
      </nav>

      <div className="poc-bg" aria-hidden />

      <svg className="poc-trail" width={dims.w} height={dims.h} viewBox={`0 0 ${dims.w} ${dims.h}`} fill="none" aria-hidden>
        <path d={d} stroke="#ffffff" strokeOpacity={0.055} strokeWidth={2.5} />
        <path ref={pathRef} d={d} stroke={accent} strokeWidth={2.5} strokeLinecap="round" style={{ transition: "stroke 800ms ease" }} />
        <g ref={markerRef} style={{ opacity: 0 }}>
          <circle r={10} fill={accent} fillOpacity={0.18} />
          <circle r={4.5} fill={accent} />
        </g>
      </svg>

      <div className="poc-content">
        {/* HERO */}
        <section className="poc-hero">
          <p className="poc-eyebrow reveal">Anthony Brignano</p>
          <h1 className="reveal">I build the platforms<br />engineers ship on.</h1>
          <p className="poc-lede reveal">Internal developer platforms for 8,000+ engineers — CI/CD, DevOps intelligence, and AI-native tooling that makes onboarding self-service and delivery faster and safer.</p>
          <div className="poc-metrics reveal">
            {METRICS.map((m) => <Metric key={m.label} value={m.value} label={m.label} />)}
          </div>
          <div className="poc-cta reveal">
            <a className="btn primary" style={{ background: accent }} href="#">Résumé</a>
            <a className="btn ghost" href="#">Coding activity</a>
          </div>
        </section>

        {/* ABOUT */}
        <section id="about" className="poc-sec">
          <h2 className="reveal">About</h2>
          <p className="poc-prose reveal">I lead the internal developer platform thousands of engineers build on — chasing clean abstractions, fast feedback loops, and making the right thing the easy thing. Off the clock: homelab tinkering, local-LLM experiments, and time on rock, snow, and trail.</p>
        </section>

        {/* WORK / HIGHLIGHTS */}
        <section id="work" className="poc-sec">
          <h2 className="reveal">Highlights</h2>
          <div className="poc-grid">
            {ACHIEVEMENTS.map((a, i) => (
              <div className="poc-ach reveal" key={i} style={{ transitionDelay: `${i * 70}ms` }}>
                <p className="ach-outcome">{a.outcome}</p>
                <div className="ach-skills">{a.skills.map((s) => <span key={s} className="pill">{s}</span>)}</div>
              </div>
            ))}
          </div>
          <div className="poc-now reveal">
            <span className="now-eyebrow">Now building</span>
            {NOW.map((n) => (
              <span key={n.label} className="now-item"><strong>{n.label}</strong> {n.detail}</span>
            ))}
          </div>
        </section>

        {/* CURRENT ROLE */}
        <section className="poc-sec">
          <h2 className="reveal">Current role</h2>
          <ul className="poc-bullets">
            <li className="reveal">A single pane of glass for 8,000+ engineers — custom CLI, desktop app, and IDE extensions.</li>
            <li className="reveal">&ldquo;One build command, any stack&rdquo; — context-aware builds that run the same locally, in CI, or fully remote.</li>
            <li className="reveal">Real-time DevOps intelligence streaming telemetry into AWS, DynamoDB, and Snowflake; native AI tooling via MCP.</li>
            <li className="reveal">Operating the enterprise CI/CD + DevSecOps toolchain end to end across thousands of pipelines.</li>
          </ul>
        </section>

        {/* OPEN SOURCE */}
        <section className="poc-sec">
          <h2 className="reveal">Open-source activity</h2>
          <div className="poc-cal reveal" aria-hidden>
            {Array.from({ length: 120 }).map((_, i) => (
              <span key={i} className="cell" style={{ opacity: 0.12 + ((i * 37) % 7) / 9 }} />
            ))}
          </div>
        </section>

        {/* CONTACT */}
        <section id="contact" className="poc-contact">
          <h2 className="reveal">Let&apos;s build something.</h2>
          <p className="poc-lede reveal">Always up for a good problem.</p>
          <a className="btn primary reveal" style={{ background: accent }} href="#">hi@brignano.io</a>
        </section>
      </div>
    </div>
  );
}

const css = `
header, footer { display: none !important; }
.poc-root { position: relative; color: #f2f2f5; font-family: var(--font-geist, ui-sans-serif, system-ui); }
.poc-bg { position: fixed; inset: 0; z-index: 0; background: radial-gradient(120% 80% at 50% -10%, #0c0d13 0%, #050609 70%); }

.poc-nav { position: fixed; top: 0; left: 0; right: 0; z-index: 10; display: flex; align-items: center; justify-content: space-between; padding: 16px 28px; background: rgba(8,9,13,.5); backdrop-filter: blur(10px); border-bottom: 1px solid rgba(255,255,255,.06); }
.poc-mono { font-family: var(--font-silkscreen, monospace); font-size: 18px; color: #fff; text-decoration: none; letter-spacing: .05em; }
.poc-mono span { opacity: .5; margin: 0 1px; }
.poc-links { display: flex; align-items: center; gap: 22px; }
.poc-links a { color: #c8c8d0; text-decoration: none; font-size: 14px; transition: color .2s; }
.poc-links a:hover { color: #fff; }
.poc-kbd { font-size: 11px; color: #9a9aa6; border: 1px solid rgba(255,255,255,.15); border-radius: 6px; padding: 3px 7px; }

.poc-trail { position: absolute; top: 0; left: 50%; transform: translateX(-50%); z-index: 1; pointer-events: none; }
.poc-content { position: relative; z-index: 2; max-width: 880px; margin: 0 auto; padding: 0 24px; }

.reveal { opacity: 0; transform: translateY(22px); transition: opacity .7s cubic-bezier(.2,.7,.2,1), transform .7s cubic-bezier(.2,.7,.2,1); }
.reveal.in { opacity: 1; transform: none; }

.poc-eyebrow { font-family: var(--font-silkscreen, monospace); text-transform: uppercase; letter-spacing: .15em; font-size: 12px; opacity: .85; margin: 0 0 16px; }
.poc-hero { min-height: 100vh; display: flex; flex-direction: column; justify-content: center; }
.poc-hero h1 { font-size: clamp(38px, 7vw, 72px); line-height: 1.02; margin: 0 0 20px; font-weight: 600; letter-spacing: -.02em; }
.poc-lede { font-size: clamp(16px, 2.1vw, 20px); color: #c8c8d0; max-width: 54ch; line-height: 1.5; }
.poc-metrics { display: flex; gap: 40px; margin: 36px 0 32px; flex-wrap: wrap; }
.m-metric { display: flex; flex-direction: column; }
.m-num { font-size: clamp(26px, 4vw, 38px); font-weight: 600; letter-spacing: -.01em; }
.m-label { font-size: 13px; color: #9a9aa6; margin-top: 4px; }
.poc-cta { display: flex; gap: 14px; flex-wrap: wrap; }
.btn { display: inline-block; padding: 11px 20px; border-radius: 10px; font-size: 14px; font-weight: 500; text-decoration: none; transition: transform .15s ease, filter .15s ease; }
.btn:hover { transform: translateY(-2px); }
.btn.primary { color: #0a0a0f; }
.btn.primary:hover { filter: brightness(1.08); }
.btn.ghost { color: #e6e6ea; border: 1px solid rgba(255,255,255,.2); }

.poc-sec { padding: 12vh 0; }
.poc-sec h2 { font-size: clamp(24px, 3.5vw, 34px); font-weight: 600; letter-spacing: -.01em; margin: 0 0 24px; }
.poc-prose { font-size: clamp(16px, 2vw, 19px); color: #c8c8d0; max-width: 60ch; line-height: 1.6; }
.poc-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; }
.poc-ach { background: rgba(14,16,22,.55); border: 1px solid rgba(255,255,255,.08); border-radius: 14px; padding: 20px 22px; backdrop-filter: blur(6px); }
.ach-outcome { margin: 0 0 14px; font-size: 16px; line-height: 1.4; }
.ach-skills { display: flex; flex-wrap: wrap; gap: 7px; }
.pill { font-size: 11.5px; color: #b9b9c4; border: 1px solid rgba(255,255,255,.14); border-radius: 999px; padding: 3px 10px; }
.poc-now { display: flex; flex-wrap: wrap; align-items: center; gap: 18px; margin-top: 22px; padding-top: 20px; border-top: 1px solid rgba(255,255,255,.08); }
.now-eyebrow { font-family: var(--font-silkscreen, monospace); text-transform: uppercase; letter-spacing: .12em; font-size: 11px; color: #8a8a96; }
.now-item { font-size: 13.5px; color: #b9b9c4; }
.now-item strong { color: #ededf2; font-weight: 600; }
.poc-bullets { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 16px; max-width: 64ch; }
.poc-bullets li { position: relative; padding-left: 20px; color: #c8c8d0; line-height: 1.5; }
.poc-bullets li::before { content: "—"; position: absolute; left: 0; color: #7b7b88; }
.poc-cal { display: grid; grid-template-columns: repeat(20, 1fr); gap: 5px; max-width: 540px; }
.cell { aspect-ratio: 1; border-radius: 3px; background: #8b9bff; }
.poc-contact { min-height: 80vh; display: flex; flex-direction: column; justify-content: center; align-items: flex-start; }
.poc-contact h2 { font-size: clamp(34px, 6vw, 58px); font-weight: 600; letter-spacing: -.02em; margin: 0 0 14px; }
.poc-contact .btn { margin-top: 22px; }
@media (max-width: 640px) { .poc-grid { grid-template-columns: 1fr; } }
@media (prefers-reduced-motion: reduce) { .reveal { opacity: 1; transform: none; transition: none; } }
`;
