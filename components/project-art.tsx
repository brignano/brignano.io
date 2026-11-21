import type { ReactNode } from "react";

// One small drawing per product on /projects: a picture of what it does, not
// a screenshot. Screenshots go stale and are unreadable at card size on a
// phone; these stay sharp, follow light and dark, and show the one idea.
// Colours come from the classes in globals.css ("Project cards"), which draw
// in the card's mark. The numbers and labels inside are illustrative.
const ART: Record<string, ReactNode> = {
  // A shop's site on a phone, with the Edit button owners use.
  sites: (
    <>
      <rect x="80" y="6" width="80" height="140" rx="12" className="a-card" strokeWidth="1.5" />
      <rect x="90" y="20" width="60" height="8" rx="2" className="a-mark" />
      <rect x="90" y="34" width="60" height="34" rx="3" className="a-soft" />
      <rect x="90" y="74" width="40" height="5" rx="2" className="a-soft" />
      <text x="90" y="92" className="a-t">Open 9–5</text>
      <rect x="90" y="100" width="34" height="12" rx="3" className="a-mark" opacity=".35" />
      <rect x="150" y="56" width="58" height="22" rx="11" className="a-card" strokeWidth="1.5" />
      <text x="160" y="71" className="a-tm">✎ Edit</text>
    </>
  ),
  // A web page with one button ringed and the step's tip beside it.
  guidebook: (
    <>
      <rect x="20" y="12" width="200" height="110" rx="8" className="a-card" strokeWidth="1.5" />
      <line x1="20" y1="28" x2="220" y2="28" className="a-line" strokeWidth="1.5" />
      <circle cx="32" cy="20" r="3" className="a-soft" />
      <circle cx="42" cy="20" r="3" className="a-soft" />
      <rect x="34" y="40" width="80" height="6" rx="2" className="a-soft" />
      <rect x="34" y="52" width="110" height="6" rx="2" className="a-soft" />
      <rect x="34" y="78" width="46" height="18" rx="4" className="a-soft" />
      <rect x="30" y="74" width="54" height="26" rx="7" className="a-mark-stroke" strokeWidth="2.5" />
      <rect x="96" y="70" width="104" height="34" rx="6" className="a-mark" />
      <text x="104" y="84" className="a-on" style={{ fontSize: 9 }}>Step 2 of 4</text>
      <text x="104" y="97" className="a-on" style={{ fontSize: 9, fontWeight: 600 }}>Click Save</text>
    </>
  ),
  // The model and the real thing side by side; the difference becomes a PR.
  driftwood: (
    <>
      <text x="22" y="20" className="a-t">model</text>
      <rect x="22" y="28" width="30" height="20" rx="4" className="a-card" strokeWidth="1.5" />
      <rect x="70" y="28" width="30" height="20" rx="4" className="a-card" strokeWidth="1.5" />
      <rect x="46" y="66" width="30" height="20" rx="4" className="a-card" strokeWidth="1.5" />
      <path d="M52 38h18M37 48l18 18M85 48l-18 18" className="a-line" strokeWidth="1.5" />
      <text x="140" y="20" className="a-t">real</text>
      <rect x="140" y="28" width="30" height="20" rx="4" className="a-card" strokeWidth="1.5" />
      <rect x="188" y="28" width="30" height="20" rx="4" className="a-card" strokeWidth="1.5" />
      <rect x="164" y="66" width="30" height="20" rx="4" className="a-mark" />
      <path d="M170 38h18M155 48l18 18" className="a-line" strokeWidth="1.5" />
      <path d="M203 48l-18 18" className="a-mark-stroke" strokeWidth="2" strokeDasharray="3 3" />
      <rect x="70" y="100" width="100" height="22" rx="11" className="a-card" strokeWidth="1.5" />
      <text x="82" y="115" className="a-tm">⇄ pull request</text>
    </>
  ),
  // A terminal running the card.
  card: (
    <>
      <rect x="20" y="14" width="200" height="104" rx="8" className="a-term" />
      <circle cx="32" cy="24" r="3" className="a-soft" />
      <circle cx="42" cy="24" r="3" className="a-soft" />
      <circle cx="52" cy="24" r="3" className="a-soft" />
      <text x="32" y="48" className="a-on-term">$ npx brignano</text>
      <rect x="32" y="58" width="120" height="10" rx="2" className="a-mark" />
      <rect x="32" y="72" width="90" height="10" rx="2" className="a-mark" opacity=".6" />
      <text x="32" y="100" className="a-on-term" opacity=".75">› Copy email   › Save vCard</text>
    </>
  ),
  // Two hole cards, the equity needed against the equity held, a verdict.
  breakeven: (
    <>
      <g transform="rotate(-8 50 60)">
        <rect x="26" y="22" width="44" height="62" rx="5" className="a-card" strokeWidth="1.5" />
        <text x="34" y="42" className="a-tm" style={{ fontSize: 14 }}>A♠</text>
      </g>
      <g transform="rotate(6 90 60)">
        <rect x="62" y="24" width="44" height="62" rx="5" className="a-card" strokeWidth="1.5" />
        <text x="70" y="44" className="a-tm" style={{ fontSize: 14 }}>K♠</text>
      </g>
      <text x="128" y="34" className="a-t">need</text>
      <rect x="128" y="40" width="90" height="8" rx="4" className="a-soft" />
      <rect x="128" y="40" width="26" height="8" rx="4" className="a-slate" />
      <text x="128" y="66" className="a-t">have</text>
      <rect x="128" y="72" width="90" height="8" rx="4" className="a-soft" />
      <rect x="128" y="72" width="44" height="8" rx="4" className="a-mark" />
      <rect x="128" y="94" width="50" height="22" rx="11" className="a-mark" />
      <text x="141" y="109" className="a-on" style={{ fontWeight: 600 }}>Call</text>
    </>
  ),
  // A month-by-month earnings chart.
  hoststats: (
    <>
      <rect x="20" y="12" width="200" height="108" rx="8" className="a-card" strokeWidth="1.5" />
      <text x="34" y="32" className="a-t">Earnings by month</text>
      <line x1="34" y1="104" x2="206" y2="104" className="a-line" strokeWidth="1.5" />
      {[
        [40, 26],
        [62, 38],
        [84, 46],
        [106, 34],
        [128, 54],
        [150, 60],
        [172, 42],
      ].map(([x, h]) => (
        <rect
          key={x}
          x={x}
          y={104 - h}
          width="14"
          height={h}
          rx="2"
          className="a-mark"
          opacity={x === 150 ? 1 : 0.45}
        />
      ))}
    </>
  ),
};

export default function ProjectArt({ slug }: { slug: string }) {
  const art = ART[slug];
  if (!art) return null;
  return (
    <svg
      viewBox="0 0 240 130"
      className="project-art block w-[82%] max-w-[300px] h-auto max-h-[86%] p-0"
      aria-hidden="true"
      focusable="false"
    >
      {art}
    </svg>
  );
}
