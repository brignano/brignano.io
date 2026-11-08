import { Glow, t } from "./shared";

// Growing things: a leafy vine climbs each side of the page.

function Vine({ side }: { side: "l" | "r" }) {
  const leaves: [number, number, number][] = [
    [20, 330, -40], [78, 270, 40], [24, 210, -35], [80, 150, 35], [26, 90, -30], [74, 36, 30],
  ];
  return (
    <svg className={`hx hx-ed-vine hx-ed-vine-${side}`} viewBox="0 0 100 360" fill="none">
      <path className="hx-ed-stem" pathLength="1" d="M50 360C30 320 70 290 50 250S30 190 50 150 70 90 50 40" stroke={t("success-ink")} strokeWidth="3" strokeLinecap="round" />
      {leaves.map(([x, y, r], i) => (
        <g key={i} transform={`translate(${x} ${y}) rotate(${r})`}>
          <path
            className="hx-ed-leaf"
            style={{ animationDelay: `${i * 0.7}s` }}
            d="M0 0C8-14 22-14 28 0 22 14 8 14 0 0z"
            fill={t(i % 2 ? "success" : "success-ink")}
          />
        </g>
      ))}
    </svg>
  );
}

export default function EarthDay() {
  return (
    <>
      <Glow className="hx-g-earth" />
      <Vine side="l" />
      <Vine side="r" />
    </>
  );
}
