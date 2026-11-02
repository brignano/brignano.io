import { Field, Glow, t } from "./shared";

// Growing things: a vine draws itself up each side of the page, leaf by leaf,
// and dandelion seeds drift up on the breeze.

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
      <Field n={9} dir="rise" wind={1.8} className="hx-ed-seeds">
        {() => (
          <svg viewBox="0 0 30 40" fill="none">
            <path d="M15 38V14" stroke={t("n-500")} strokeWidth="1.5" />
            {[-60, -30, 0, 30, 60].map((r) => (
              <line key={r} x1="15" y1="14" x2="15" y2="3" stroke={t("n-500")} strokeWidth="1.2" transform={`rotate(${r} 15 14)`} />
            ))}
            <circle cx="15" cy="14" r="2" fill={t("n-500")} />
          </svg>
        )}
      </Field>
    </>
  );
}
