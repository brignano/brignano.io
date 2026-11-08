import { PINK, mix, t } from "./shared";

// A little meadow along the bottom: grass, tulips, eggs tucked in the blades, and a
// bunny looking over the top.

const egg = (x: number, c: string, i: number) => (
  <g key={i} transform={`translate(${x} 0)`}>
    <path d="M20 4C32 4 38 26 38 40c0 12-8 20-18 20S2 52 2 40C2 26 8 4 20 4z" fill={mix(c, 45, "n-0")} stroke={t("n-400")} strokeWidth="1.5" />
    <path d="M3 34l7-6 6 6 7-6 6 6 7-6 5 5" stroke={t(c)} strokeWidth="3" strokeLinejoin="round" />
  </g>
);

const Tulip = ({ x, c }: { x: number; c: string }) => (
  <g transform={`translate(${x} 0)`}>
    <path d="M10 60V22" stroke={t("success-ink")} strokeWidth="3" />
    <path d="M10 40q-12-4-14-18 8 2 14 10M10 40q12-4 14-18-8 2-14 10" fill={t("success")} opacity=".9" />
    <path d="M10 26C0 24 0 8 10 2c10 6 10 22 0 24z" fill={t(c)} />
  </g>
);

export default function Easter() {
  return (
    <>
      <div className="hx hx-ea-bunny">
        <svg viewBox="0 0 90 120" fill="none">
          <ellipse cx="28" cy="34" rx="10" ry="32" fill={t("card")} stroke={t("n-400")} strokeWidth="2" />
          <ellipse cx="62" cy="34" rx="10" ry="32" fill={t("card")} stroke={t("n-400")} strokeWidth="2" />
          <ellipse cx="28" cy="36" rx="4.5" ry="24" fill={PINK} />
          <ellipse cx="62" cy="36" rx="4.5" ry="24" fill={PINK} />
          <circle cx="45" cy="88" r="32" fill={t("card")} stroke={t("n-400")} strokeWidth="2" />
          <circle cx="34" cy="82" r="3.2" fill={t("ink")} />
          <circle cx="56" cy="82" r="3.2" fill={t("ink")} />
          <ellipse cx="45" cy="92" rx="4" ry="3" fill={mix("danger", 60, "n-0")} />
        </svg>
      </div>
      <div className="hx hx-ea-eggs">
        <svg viewBox="0 0 170 64" fill="none">
          {[egg(0, "attention", 0), egg(66, "i", 1), egg(128, "danger", 2)]}
        </svg>
      </div>
      <div className="hx hx-ea-tulips">
        <svg viewBox="0 0 200 64" fill="none">
          <Tulip x={4} c="danger" />
          <Tulip x={56} c="attention" />
          <Tulip x={110} c="danger" />
          <Tulip x={164} c="i" />
        </svg>
      </div>
      <svg className="hx hx-ea-grass" height="26" fill="none">
        <defs>
          <pattern id="hx-grass" width="34" height="26" patternUnits="userSpaceOnUse">
            <path d="M2 26C3 14 6 8 8 2c2 8 3 14 4 24zM14 26c0-9 2-14 6-20 1 7 1 14 1 20zM24 26c1-8 3-12 6-17 0 6 1 11 1 17z" fill={t("success")} />
          </pattern>
        </defs>
        <rect width="100%" height="26" fill="url(#hx-grass)" />
      </svg>
    </>
  );
}
