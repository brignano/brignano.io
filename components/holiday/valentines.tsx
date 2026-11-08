import { HEART, Glow, PINK, mix, t, vars } from "./shared";

// Vertical, not scattered: a string of hearts hangs down each side of the page,
// with a rose glow below.

const SHADES = [t("danger"), PINK, mix("danger", 75, "n-0"), t("danger-ink")];

function Garland({ side }: { side: "l" | "r" }) {
  const sizes = [20, 14, 24, 16, 22, 13, 19, 15];
  return (
    <div className={`hx hx-vl-garland hx-vl-${side}`}>
      {sizes.map((s, i) => (
        <svg
          key={i}
          viewBox="0 0 24 24"
          width={s}
          height={s}
          style={vars({ "--l": `${-(i * 0.45 + (side === "r" ? 0.7 : 0))}s`, marginLeft: i % 2 ? 8 : -6 })}
          fill={SHADES[(i + (side === "r" ? 1 : 0)) % SHADES.length]}
        >
          <path d={HEART} />
        </svg>
      ))}
    </div>
  );
}

export default function Valentines() {
  return (
    <>
      <Glow className="hx-g-valentines" />
      <Garland side="l" />
      <Garland side="r" />
    </>
  );
}
