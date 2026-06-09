"use client";

/**
 * THROWAWAY POC v7 — signature scroll over REAL content.
 *  - trail now ANCHORED to the A|B monogram (origin = brand)
 *  - working ⌘K command palette (open via ⌘K / Ctrl+K or the chip)
 *  - working light/dark theme toggle (CSS variables)
 *  - smart header, staggered hero, metric count-up, scroll reveals
 *  - violet accent (#a78bfa / #7c3aed), reduced-motion safe
 *  (Page-to-page View Transitions are a multi-route feature -> TSD, not POC.)
 */

import { useEffect, useRef, useState, useCallback } from "react";

const VIOLET = "#7c3aed";

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

// Trail lives in the LEFT GUTTER (never behind text), a gentle serpentine
// that starts below the header (no overlap with the fixed nav).
function buildPath(h: number, vw: number) {
  const contentLeft = Math.max(24, (vw - 880) / 2);
  const wide = contentLeft > 150;
  const ax = wide ? Math.round(contentLeft * 0.5) : 20; // spine x within the gutter
  const amp = wide ? Math.min(Math.round(contentLeft * 0.22), 44) : 7;
  const top = 88; // start below the header
  const rest = h - top, n = Math.max(4, Math.round(rest / 360)), step = rest / n;
  let xprev = ax, y = top, d = `M ${ax} ${top}`;
  for (let i = 1; i <= n; i++) {
    const ny = top + i * step, x = i % 2 ? ax + amp : ax - amp;
    d += ` C ${xprev} ${y + step * 0.5}, ${x} ${ny - step * 0.5}, ${x} ${ny}`;
    xprev = x; y = ny;
  }
  return d;
}

function Metric({ value, label }: { value: string; label: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [disp, setDisp] = useState(value);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const num = parseInt(value.replace(/[^0-9]/g, ""), 10);
    const suffix = value.replace(/[0-9,]/g, "");
    setDisp("0" + suffix);
    const el = ref.current;
    if (!el || !num) return;
    let done = false;
    const io = new IntersectionObserver((es) => {
      if (!es[0].isIntersecting || done) return;
      done = true;
      const start = performance.now();
      const tick = (t: number) => {
        const p = Math.min((t - start) / 1200, 1);
        setDisp(Math.round(num * (1 - Math.pow(1 - p, 3))).toLocaleString() + suffix);
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }, { threshold: 0.6 });
    io.observe(el);
    return () => io.disconnect();
  }, [value]);
  return <div className="m-metric"><span ref={ref} className="m-num">{disp}</span><span className="m-label">{label}</span></div>;
}

export default function PocTrail() {
  const pathRef = useRef<SVGPathElement>(null);
  const markerRef = useRef<SVGGElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const lastY = useRef(0);
  const [dims, setDims] = useState({ h: 0, w: 1200 });
  const [d, setD] = useState("");
  const [nav, setNav] = useState({ hidden: false, atTop: true });
  const [reduced, setReduced] = useState(false);
  const [light, setLight] = useState(false);
  const [palette, setPalette] = useState(false);
  const [q, setQ] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const go = useCallback((id?: string) => {
    setPalette(false);
    if (id) document.getElementById(id)?.scrollIntoView({ behavior: reduced ? "auto" : "smooth" });
  }, [reduced]);

  const commands = [
    { label: "About", hint: "section", run: () => go("about") },
    { label: "Work / Highlights", hint: "section", run: () => go("work") },
    { label: "Coding activity", hint: "page", run: () => go() },
    { label: "Blog", hint: "page", run: () => go() },
    { label: "Contact", hint: "section", run: () => go("contact") },
    { label: "Resume", hint: "page", run: () => go() },
    { label: light ? "Switch to dark" : "Switch to light", hint: "theme", run: () => { setLight((v) => !v); setPalette(false); } },
  ];
  const filtered = commands.filter((c) => c.label.toLowerCase().includes(q.toLowerCase()));

  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    const measure = () => {
      const h = document.documentElement.scrollHeight;
      setDims({ h, w: window.innerWidth });
      setD(buildPath(h, window.innerWidth));
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  // ⌘K / Ctrl+K + Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); setPalette((v) => !v); }
      else if (e.key === "Escape") setPalette(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
  useEffect(() => { if (palette) { setQ(""); setTimeout(() => inputRef.current?.focus(), 30); } }, [palette]);

  useEffect(() => {
    if (reduced) { rootRef.current?.querySelectorAll(".reveal").forEach((e) => e.classList.add("in")); return; }
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) e.target.classList.add("in"); }), { threshold: 0.18 });
    rootRef.current?.querySelectorAll(".reveal").forEach((e) => io.observe(e));
    return () => io.disconnect();
  }, [reduced, d]);

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
      const y = el.scrollTop, max = el.scrollHeight - el.clientHeight;
      const p = max > 0 ? Math.min(Math.max(y / max, 0), 1) : 0;
      if (!reduced) path.style.strokeDashoffset = `${total * (1 - p)}`;
      const pt = path.getPointAtLength((reduced ? 1 : p) * total);
      if (markerRef.current) {
        markerRef.current.setAttribute("transform", `translate(${pt.x} ${pt.y})`);
        markerRef.current.style.opacity = reduced ? "0" : "1";
      }
      const atTop = y < 40;
      const hidden = !atTop && y > lastY.current && y > 90;
      setNav((s) => (s.hidden === hidden && s.atTop === atTop ? s : { hidden, atTop }));
      lastY.current = y;
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => { window.removeEventListener("scroll", onScroll); if (raf) cancelAnimationFrame(raf); };
  }, [d, reduced]);

  return (
    <div className="poc-root" ref={rootRef} data-light={light ? "" : undefined}>
      <style>{css}</style>

      <nav className={`poc-nav${nav.atTop ? " attop" : ""}${nav.hidden ? " hidden" : ""}`} aria-label="Primary">
        <a className="poc-mono" href="#">A<span>|</span>B</a>
        <div className="poc-links">
          <a href="#about">About</a><a href="#work">Work</a><a href="#">Coding</a>
          <a href="#">Blog</a><a href="#contact">Contact</a>
          <button className="poc-theme" onClick={() => setLight((v) => !v)} aria-label="Toggle theme">{light ? "☾" : "☀"}</button>
          <button className="poc-kbd" onClick={() => setPalette(true)} aria-label="Open command palette">⌘K</button>
        </div>
      </nav>

      <div className="poc-bg" aria-hidden />

      <svg className="poc-trail" width={dims.w} height={dims.h} viewBox={`0 0 ${dims.w} ${dims.h}`} fill="none" aria-hidden>
        <path className="trail-faint" d={d} strokeWidth={2.5} />
        <path ref={pathRef} d={d} stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" />
        <g ref={markerRef} style={{ opacity: 0 }}>
          <circle r={10} fill="currentColor" fillOpacity={0.18} />
          <circle r={4.5} fill="currentColor" />
        </g>
      </svg>

      <div className="poc-content">
        <section className="poc-hero">
          <p className="poc-eyebrow reveal">Anthony Brignano</p>
          <h1>
            <span className="reveal" style={{ transitionDelay: "60ms" }}>I build the platforms</span>
            <span className="reveal" style={{ transitionDelay: "160ms" }}>engineers ship on.</span>
          </h1>
          <p className="poc-lede reveal" style={{ transitionDelay: "240ms" }}>Internal developer platforms for 8,000+ engineers — CI/CD, DevOps intelligence, and AI-native tooling that makes onboarding self-service and delivery faster and safer.</p>
          <div className="poc-metrics reveal" style={{ transitionDelay: "320ms" }}>{METRICS.map((m) => <Metric key={m.label} {...m} />)}</div>
          <div className="poc-cta reveal" style={{ transitionDelay: "400ms" }}>
            <a className="btn primary" href="#">Resume</a>
            <a className="btn ghost" href="#">Coding activity</a>
          </div>
        </section>

        <section id="about" className="poc-sec">
          <h2 className="reveal">About</h2>
          <p className="poc-prose reveal">I lead the internal developer platform thousands of engineers build on — chasing clean abstractions, fast feedback loops, and making the right thing the easy thing. Off the clock: homelab tinkering, local-LLM experiments, and time on rock, snow, and trail.</p>
        </section>

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
            {NOW.map((n) => <span key={n.label} className="now-item"><strong>{n.label}</strong> {n.detail}</span>)}
          </div>
        </section>

        <section className="poc-sec">
          <h2 className="reveal">Current role</h2>
          <ul className="poc-bullets">
            <li className="reveal">A single pane of glass for 8,000+ engineers — custom CLI, desktop app, and IDE extensions.</li>
            <li className="reveal">&ldquo;One build command, any stack&rdquo; — context-aware builds that run the same locally, in CI, or fully remote.</li>
            <li className="reveal">Real-time DevOps intelligence streaming telemetry into AWS, DynamoDB, and Snowflake; native AI tooling via MCP.</li>
            <li className="reveal">Operating the enterprise CI/CD + DevSecOps toolchain end to end across thousands of pipelines.</li>
          </ul>
          <p className="poc-inline reveal">For my full career history, see <a href="#">my resume</a>.</p>
        </section>

        <section className="poc-sec">
          <h2 className="reveal">Open-source activity</h2>
          <div className="poc-cal reveal" aria-hidden>{Array.from({ length: 120 }).map((_, i) => <span key={i} className="cell" style={{ opacity: 0.12 + ((i * 37) % 7) / 9 }} />)}</div>
          <p className="poc-inline reveal">For more detailed information, see <a href="#">my coding activity</a>.</p>
        </section>

        <section id="contact" className="poc-contact">
          <h2 className="reveal">Let&apos;s build something.</h2>
          <p className="poc-lede reveal">Always up for a good problem.</p>
          <a className="btn primary reveal" href="#">hi@brignano.io</a>
        </section>
      </div>

      {palette && (
        <div className="cmdk-overlay" onClick={() => setPalette(false)}>
          <div className="cmdk" onClick={(e) => e.stopPropagation()} role="dialog" aria-label="Command palette">
            <input ref={inputRef} value={q} onChange={(e) => setQ(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && filtered[0]) filtered[0].run(); }}
              placeholder="Type a command or search…" />
            <ul>
              {filtered.length === 0 && <li className="cmdk-empty">No results</li>}
              {filtered.map((c) => (
                <li key={c.label} onClick={c.run}><span>{c.label}</span><span className="cmdk-hint">{c.hint}</span></li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

const css = `
header, footer { display: none !important; }
.poc-root {
  --bg1:#0c0d13; --bg2:#050609; --fg:#f2f2f5; --muted:#c8c8d0; --muted2:#9a9aa6;
  --card:rgba(14,16,22,.55); --card-solid:#14161d; --border:rgba(255,255,255,.08);
  --nav:rgba(8,9,13,.6); --navborder:rgba(255,255,255,.07); --faint:rgba(255,255,255,.06);
  --pill:rgba(255,255,255,.14); --hover:rgba(255,255,255,.06); --trail:#a78bfa;
  position: relative; color: var(--fg); font-family: var(--font-geist, ui-sans-serif, system-ui);
}
.poc-root[data-light] {
  --bg1:#f4f4f7; --bg2:#e9e9ee; --fg:#16161a; --muted:#3c3c44; --muted2:#6a6a74;
  --card:rgba(255,255,255,.72); --card-solid:#ffffff; --border:rgba(0,0,0,.1);
  --nav:rgba(255,255,255,.65); --navborder:rgba(0,0,0,.08); --faint:rgba(0,0,0,.07);
  --pill:rgba(0,0,0,.14); --hover:rgba(0,0,0,.05); --trail:#7c3aed;
}
.poc-bg { position: fixed; inset: 0; z-index: 0; background: radial-gradient(120% 80% at 50% -10%, var(--bg1) 0%, var(--bg2) 70%); transition: background .4s ease; }

.poc-nav { position: fixed; top: 0; left: 0; right: 0; z-index: 10; display: flex; align-items: center; justify-content: space-between; padding: 16px 28px; background: var(--nav); backdrop-filter: blur(10px); border-bottom: 1px solid var(--navborder); transition: transform .35s ease, background .35s ease, border-color .35s ease, backdrop-filter .35s ease; }
.poc-nav.attop { background: transparent; border-color: transparent; backdrop-filter: none; }
.poc-nav.hidden { transform: translateY(-100%); }
.poc-mono { font-family: var(--font-silkscreen, monospace); font-size: 18px; color: var(--fg); text-decoration: none; letter-spacing: .05em; }
.poc-mono span { opacity: .5; margin: 0 1px; }
.poc-links { display: flex; align-items: center; gap: 20px; }
.poc-links a { color: var(--muted); text-decoration: none; font-size: 14px; transition: color .2s; }
.poc-links a:hover { color: var(--fg); }
.poc-theme { background: none; border: none; color: var(--muted); font-size: 15px; cursor: pointer; line-height: 1; padding: 2px; }
.poc-theme:hover { color: var(--fg); }
.poc-kbd { font-size: 11px; color: var(--muted2); border: 1px solid var(--pill); border-radius: 6px; padding: 3px 7px; background: none; cursor: pointer; }
.poc-kbd:hover { color: var(--fg); }

.poc-trail { position: absolute; top: 0; left: 0; z-index: 1; pointer-events: none; color: var(--trail); }
.trail-faint { stroke: var(--faint); }
.poc-content { position: relative; z-index: 2; max-width: 880px; margin: 0 auto; padding: 0 24px; }

.reveal { opacity: 0; transform: translateY(22px); transition: opacity .7s cubic-bezier(.2,.7,.2,1), transform .7s cubic-bezier(.2,.7,.2,1); }
.reveal.in { opacity: 1; transform: none; }

.poc-eyebrow { font-family: var(--font-silkscreen, monospace); text-transform: uppercase; letter-spacing: .15em; font-size: 12px; opacity: .85; margin: 0 0 16px; }
.poc-hero { min-height: 100vh; display: flex; flex-direction: column; justify-content: center; }
.poc-hero h1 { font-size: clamp(38px, 7vw, 72px); line-height: 1.02; margin: 0 0 20px; font-weight: 600; letter-spacing: -.02em; }
.poc-hero h1 span { display: block; }
.poc-lede { font-size: clamp(16px, 2.1vw, 20px); color: var(--muted); max-width: 54ch; line-height: 1.5; }
.poc-metrics { display: flex; gap: 40px; margin: 36px 0 32px; flex-wrap: wrap; }
.m-metric { display: flex; flex-direction: column; }
.m-num { font-size: clamp(26px, 4vw, 38px); font-weight: 600; letter-spacing: -.01em; }
.m-label { font-size: 13px; color: var(--muted2); margin-top: 4px; }
.poc-cta { display: flex; gap: 14px; flex-wrap: wrap; }
.btn { display: inline-block; padding: 11px 20px; border-radius: 10px; font-size: 14px; font-weight: 500; text-decoration: none; transition: transform .15s ease, filter .15s ease; }
.btn:hover { transform: translateY(-2px); }
.btn.primary { background: ${VIOLET}; color: #fff; }
.btn.primary:hover { filter: brightness(1.1); }
.btn.ghost { color: var(--fg); border: 1px solid var(--pill); }

.poc-sec { padding: 12vh 0; }
.poc-sec h2 { font-size: clamp(24px, 3.5vw, 34px); font-weight: 600; letter-spacing: -.01em; margin: 0 0 24px; }
.poc-prose { font-size: clamp(16px, 2vw, 19px); color: var(--muted); max-width: 60ch; line-height: 1.6; }
.poc-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; }
.poc-ach { background: var(--card); border: 1px solid var(--border); border-radius: 14px; padding: 20px 22px; backdrop-filter: blur(6px); }
.ach-outcome { margin: 0 0 14px; font-size: 16px; line-height: 1.4; }
.ach-skills { display: flex; flex-wrap: wrap; gap: 7px; }
.pill { font-size: 11.5px; color: var(--muted); border: 1px solid var(--pill); border-radius: 999px; padding: 3px 10px; }
.poc-now { display: flex; flex-wrap: wrap; align-items: center; gap: 18px; margin-top: 22px; padding-top: 20px; border-top: 1px solid var(--border); }
.now-eyebrow { font-family: var(--font-silkscreen, monospace); text-transform: uppercase; letter-spacing: .12em; font-size: 11px; color: var(--muted2); }
.now-item { font-size: 13.5px; color: var(--muted); }
.now-item strong { color: var(--fg); font-weight: 600; }
.poc-bullets { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 16px; max-width: 64ch; }
.poc-bullets li { position: relative; padding-left: 20px; color: var(--muted); line-height: 1.5; }
.poc-bullets li::before { content: "—"; position: absolute; left: 0; color: var(--muted2); }
.poc-inline { margin-top: 22px; font-size: 14px; color: var(--muted2); }
.poc-inline a { color: var(--trail); text-decoration: underline; text-underline-offset: 3px; }
.poc-cal { display: grid; grid-template-columns: repeat(20, 1fr); gap: 5px; max-width: 540px; }
.cell { aspect-ratio: 1; border-radius: 3px; background: var(--trail); }
.poc-contact { min-height: 80vh; display: flex; flex-direction: column; justify-content: center; align-items: flex-start; }
.poc-contact h2 { font-size: clamp(34px, 6vw, 58px); font-weight: 600; letter-spacing: -.02em; margin: 0 0 14px; }
.poc-contact .btn { margin-top: 22px; }

.cmdk-overlay { position: fixed; inset: 0; z-index: 50; display: flex; align-items: flex-start; justify-content: center; padding-top: 16vh; background: rgba(0,0,0,.5); backdrop-filter: blur(3px); }
.cmdk { width: min(540px, 92vw); background: var(--card-solid); border: 1px solid var(--border); border-radius: 14px; overflow: hidden; box-shadow: 0 30px 80px rgba(0,0,0,.5); }
.cmdk input { width: 100%; padding: 16px 18px; background: transparent; border: none; outline: none; color: var(--fg); font-size: 15px; border-bottom: 1px solid var(--border); box-sizing: border-box; }
.cmdk ul { list-style: none; margin: 0; padding: 6px; max-height: 320px; overflow: auto; }
.cmdk li { padding: 11px 14px; border-radius: 9px; font-size: 14px; color: var(--muted); cursor: pointer; display: flex; justify-content: space-between; align-items: center; }
.cmdk li:hover { background: var(--hover); color: var(--fg); }
.cmdk-hint { font-size: 11px; color: var(--muted2); }
.cmdk-empty { color: var(--muted2); cursor: default; }

@media (max-width: 640px) { .poc-grid { grid-template-columns: 1fr; } }
@media (prefers-reduced-motion: reduce) { .reveal { opacity: 1; transform: none; transition: none; } }
`;
