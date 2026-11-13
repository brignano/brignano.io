import { Glow, ORANGE, PINK, PURPLE, t, vars } from "./shared";

// Colour thrown, not hung: splashes burst out of the corners and edges one
// after another, on top of a haze of every colour along the bottom.

type Dot = [number, number, number, string];

const SPLASHES: { cls: string; delay: number; dots: Dot[] }[] = [
  { cls: "hx-hl-tl", delay: 0, dots: [[16, 16, 54, t("danger")], [64, 22, 26, ORANGE], [30, 70, 24, PURPLE], [84, 70, 12, t("i-ink")]] },
  { cls: "hx-hl-tr", delay: 2.2, dots: [[124, 14, 52, t("i-ink")], [78, 24, 26, PINK], [112, 70, 22, t("attention")], [60, 66, 10, t("success")]] },
  { cls: "hx-hl-bl", delay: 4.4, dots: [[16, 124, 52, t("success")], [66, 116, 26, t("attention")], [28, 70, 20, PINK], [80, 90, 10, t("i-ink")]] },
  { cls: "hx-hl-br", delay: 6.6, dots: [[124, 124, 50, PURPLE], [74, 120, 26, t("danger")], [118, 70, 20, ORANGE], [90, 96, 10, t("success")]] },
];

export default function Holi() {
  return (
    <>
      <Glow className="hx-g-holi" />
      {SPLASHES.map((s) => (
        <svg key={s.cls} className={`hx hx-hl ${s.cls}`} viewBox="0 0 140 140" fill="none" style={vars({ "--l": `${-s.delay}s` })}>
          {s.dots.map(([x, y, r, c], i) => (
            <circle key={i} cx={x} cy={y} r={r} fill={c} opacity=".6" />
          ))}
        </svg>
      ))}
    </>
  );
}
