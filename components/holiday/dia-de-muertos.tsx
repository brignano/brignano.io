import { ORANGE, PINK, PURPLE, SKY, t, vars } from "./shared";

// Cut-paper banners hang across the top corners and candles burn in a row along the bottom.

const COLORS = [PINK, ORANGE, PURPLE, SKY, t("success"), t("attention")];

function Banner({ side }: { side: "l" | "r" }) {
  return (
    <div className={`hx hx-dm-banner hx-dm-${side}`}>
      <svg viewBox="0 0 250 70" fill="none">
        <path d="M0 4Q125 14 250 4" stroke={t("n-500")} strokeWidth="1.5" />
        {Array.from({ length: 6 }, (_, i) => {
          const x = 6 + i * 40;
          return (
            <g key={i} className="hx-dm-flag" style={vars({ "--l": `${-i * 0.6}s` })}>
              <path d={`M${x} 8h34v44l-5-7-6 7-6-7-6 7-5-7-6 7z`} fill={COLORS[(i + (side === "r" ? 2 : 0)) % COLORS.length]} />
              <circle cx={x + 17} cy="22" r="5" fill={t("bg")} />
              <path d={`M${x + 6} 36l4 4-4 4zM${x + 28} 36l-4 4 4 4zM${x + 17} 32l4 4-4 4-4-4z`} fill={t("bg")} />
            </g>
          );
        })}
      </svg>
    </div>
  );
}

export default function DiaDeMuertos() {
  return (
    <>
      <Banner side="l" />
      <Banner side="r" />
      <div className="hx hx-dm-candles">
        <svg viewBox="0 0 160 64" fill="none">
          {[14, 62, 108].map((x, i) => (
            <g key={x}>
              <rect x={x} y={26 + i * 3} width="14" height={38 - i * 3} rx="2" fill={t("card")} stroke={t("n-400")} strokeWidth="1.5" />
              <path className="hx-dm-flame" d={`M${x + 7} ${24 + i * 3}c-5-6-4-11 0-16 4 5 5 10 0 16z`} fill={t("attention")} />
            </g>
          ))}
          {[36, 84, 134].map((x) => (
            <g key={x}>
              <circle cx={x} cy="54" r="8" fill={t("attention")} />
              <circle cx={x - 6} cy="50" r="5" fill={ORANGE} />
              <circle cx={x + 6} cy="50" r="5" fill={t("attention")} />
            </g>
          ))}
        </svg>
      </div>
    </>
  );
}
