import { Glow, t } from "./shared";

// The kinara lights as the week goes on, in the traditional order: the black
// centre candle on the first day, then alternating red (left) and green
// (right) outward. A woven-mat strip runs along the bottom edge.

const CANDLES: { x: number; c: string; day: number }[] = [
  { x: 8, c: "danger", day: 1 },
  { x: 24, c: "danger", day: 3 },
  { x: 40, c: "danger", day: 5 },
  { x: 60, c: "n-900", day: 0 },
  { x: 80, c: "success", day: 2 },
  { x: 96, c: "success", day: 4 },
  { x: 112, c: "success", day: 6 },
];

export default function Kwanzaa({ day }: { day: number }) {
  return (
    <>
      <Glow className="hx-g-kwanzaa" />
      <svg className="hx hx-kw-mat" height="12" fill="none">
        <defs>
          <pattern id="hx-mat" width="24" height="12" patternUnits="userSpaceOnUse">
            <rect width="12" height="6" fill={t("danger")} />
            <rect x="12" width="12" height="6" fill={t("n-900")} />
            <rect y="6" width="12" height="6" fill={t("success")} />
            <rect x="12" y="6" width="12" height="6" fill={t("danger")} />
          </pattern>
        </defs>
        <rect width="100%" height="12" fill="url(#hx-mat)" />
      </svg>
      <div className="hx hx-kw-kinara">
        <svg viewBox="0 0 120 100" fill="none">
          <path d="M8 40v22q0 10 8 10h88q8 0 8-10V40" stroke={t("attention-ink")} strokeWidth="3" />
          <path d="M60 40v42M40 90h40" stroke={t("attention-ink")} strokeWidth="5" strokeLinecap="round" />
          {CANDLES.map(({ x, c, day: d }) => {
            const top = x === 60 ? 14 : 24 + Math.abs(x - 60) / 10;
            return (
              <g key={x}>
                <rect x={x - 4} y={top} width="8" height={42 - top} fill={t(c)} />
                {d <= day ? (
                  <path className="hx-kw-flame" d={`M${x} ${top - 1}c-4-5-3-9 0-13 3 4 4 8 0 13z`} fill={t("attention")} />
                ) : null}
              </g>
            );
          })}
        </svg>
      </div>
    </>
  );
}
