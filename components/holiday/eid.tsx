import { Glow, Sparkle, mix, t } from "./shared";

// Evening sky: a dusk wash over the top of the page, a crescent with a star
// near it, twinkling stars, and lanterns that glow where they hang.

function Fanous({ drop, w = 38 }: { drop: number; w?: number }) {
  return (
    <svg viewBox="0 0 50 118" width={w} fill="none">
      <line x1="25" y1="0" x2="25" y2={drop} stroke={t("n-500")} />
      <path d={`M25 ${drop}l10 12H15z`} fill={t("attention")} />
      <path d={`M15 ${drop + 12}h20l6 40H9z`} fill={mix("success", 70, "n-0")} stroke={t("success-ink")} strokeWidth="2" />
      <path d={`M25 ${drop + 12}v40M17 ${drop + 12}l-3 40M33 ${drop + 12}l3 40`} stroke={t("success-ink")} strokeWidth="1.5" />
      <path d={`M9 ${drop + 52}h32l-4 8H13z`} fill={t("attention")} />
      <circle className="hx-ei-glow" cx="25" cy={drop + 34} r="6" fill={t("attention")} />
    </svg>
  );
}

const STARS: [string, string, number, number][] = [
  ["10%", "8%", 14, 0], ["22%", "20%", 10, -1], ["76%", "6%", 12, -2], ["92%", "24%", 10, -0.5],
  ["6%", "36%", 9, -1.5], ["84%", "42%", 11, -2.4], ["34%", "4%", 9, -1.2],
];

export default function Eid() {
  return (
    <>
      <Glow className="hx-g-eid" />
      <div className="hx hx-ei-moon">
        <svg viewBox="0 0 100 100" fill="none">
          <path d="M62 6A44 44 0 0 0 62 94A52 52 0 0 1 62 6Z" fill={t("attention")} />
          <path d="M78 36l3.600 9 9.400.6-7.300 6 2.500 9.300L78 56l-8.200 5 2.500-9.300-7.300-6 9.400-.6z" fill={t("attention")} />
        </svg>
      </div>
      <div className="hx hx-ei-lamps">
        <Fanous drop={10} />
        <Fanous drop={40} w={32} />
        <Fanous drop={18} w={28} />
      </div>
      {STARS.map(([x, y, s, d], i) => (
        <Sparkle key={i} className="hx-ei-star" color={i % 2 ? "i-ink" : "attention"} style={{ left: x, top: y, width: s, height: s, animationDelay: `${d}s` }} />
      ))}
    </>
  );
}
