import { Field, Glow, t } from "./shared";

// The menorah lights up as the holiday goes on: one candle the first night, one
// more each night after, with the shamash (the helper candle) always lit.
// Silver-blue stars fall slowly and hang in the corners.

const XS = [10, 22.5, 35, 47.5, 72.5, 85, 97.5, 110];

function Flame({ x, y }: { x: number; y: number }) {
  return <path className="hx-hk-flame" d={`M${x} ${y}c-4-5-3-9 0-13 3 4 4 8 0 13z`} fill={t("attention")} />;
}

const Star = () => (
  <g stroke={t("i")} strokeWidth="3" strokeLinejoin="round" fill="none">
    <path d="M30 34l17 30H13z" />
    <path d="M30 70L13 40h34z" />
  </g>
);

export default function Hanukkah({ day }: { day: number }) {
  // Night 1 is day 0. Candles go in from the right, so the rightmost light first.
  const lit = Math.min(day + 1, 8);
  const on = new Set(XS.slice(8 - lit));
  return (
    <>
      <Glow className="hx-g-hanukkah" />
      {["l", "r"].map((s) => (
        <svg key={s} className={`hx hx-hk-star hx-hk-star-${s}`} viewBox="0 0 60 90" fill="none">
          <line x1="30" y1="0" x2="30" y2="30" stroke={t("n-500")} />
          <Star />
        </svg>
      ))}
      <div className="hx hx-hk-menorah">
        <svg viewBox="0 0 120 120" fill="none">
          <g stroke={t("attention")} strokeWidth="3.5" strokeLinecap="round">
            {[0, 1, 2, 3].map((i) => {
              const a = 10 + i * 12.5;
              const b = 110 - i * 12.5;
              const y = 96 - i * 6;
              return <path key={i} d={`M${a} 60V78Q${a} ${y} 60 ${y}Q${b} ${y} ${b} 78V60`} />;
            })}
            <path d="M60 48V108M36 110h48" />
          </g>
          {[...XS, 60].map((x) => {
            const tall = x === 60;
            const top = tall ? 36 : 52;
            const isOn = tall || on.has(x);
            return (
              <g key={x}>
                <rect x={x - 3} y={top} width="6" height={tall ? 18 : 14} fill={t("i")} />
                {isOn ? <Flame x={x} y={top - 1} /> : null}
              </g>
            );
          })}
        </svg>
      </div>
      <Field n={9} wind={0.8} className="hx-hk-fall">
        {() => (
          <svg viewBox="0 0 60 70" fill="none">
            <Star />
          </svg>
        )}
      </Field>
    </>
  );
}
