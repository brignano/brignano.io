import { Glow, t } from "./shared";

// Light, glowing up: a warm glow along the bottom, diyas flickering in a row,
// and rangoli in the top corners.

function Flame({ x, y }: { x: number; y: number }) {
  return <path className="hx-dw-flame" d={`M${x} ${y}c-4-5-3-9 0-13 3 4 4 8 0 13z`} fill={t("attention")} />;
}

export default function Diwali() {
  const petals = Array.from({ length: 12 }, (_, i) => (
    <ellipse key={i} cx="120" cy="38" rx="7" ry="16" transform={`rotate(${i * 30} 120 0)`} fill={t(i % 2 ? "attention" : "danger")} opacity=".8" />
  ));
  const rangoli = (
    <svg viewBox="0 0 120 120" fill="none">
      {petals}
      <circle cx="120" cy="0" r="62" stroke={t("i-ink")} strokeWidth="3" strokeDasharray="2 7" strokeLinecap="round" />
      <circle cx="120" cy="0" r="92" stroke={t("attention")} strokeWidth="3" strokeDasharray="1 8" strokeLinecap="round" />
      <circle cx="120" cy="0" r="14" fill={t("i-ink")} />
    </svg>
  );
  return (
    <>
      <Glow className="hx-g-diwali" />
      <div className="hx hx-dw-rangoli hx-dw-r">{rangoli}</div>
      <div className="hx hx-dw-rangoli hx-dw-l">{rangoli}</div>
      <div className="hx hx-dw-diyas">
        <svg viewBox="0 0 280 56" fill="none">
          {[0, 58, 116, 174, 232].map((x) => (
            <g key={x} transform={`translate(${x} 0)`}>
              <path d="M2 30h40c0 12-9 18-20 18S2 42 2 30z" fill={t("danger")} stroke={t("attention")} strokeWidth="2" />
              <path d="M2 30c10-6 30-6 40 0" stroke={t("attention")} strokeWidth="2" />
              <Flame x={22} y={28} />
            </g>
          ))}
        </svg>
      </div>
    </>
  );
}
