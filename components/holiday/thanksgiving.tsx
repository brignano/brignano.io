import { Garland, Glow, t } from "./shared";

// Autumn leaves strung along the top, a low row of pumpkins and wheat along
// the bottom, and a warm sunset glow behind them.

const LEAVES = ["attention", "danger", "larch-deep"];

function Pumpkin({ x, s = 1, c = "attention" }: { x: number; s?: number; c?: string }) {
  return (
    <g transform={`translate(${x} ${60 - 38 * s}) scale(${s})`}>
      <ellipse cx="25" cy="24" rx="23" ry="19" fill={t(c)} />
      <path d="M25 6c-8 6-8 30 0 36M25 6c8 6 8 30 0 36M12 10c-6 8-5 24 1 30M38 10c6 8 5 24-1 30" stroke={t("bg")} strokeWidth="1.4" opacity=".45" />
      <path d="M25 6c0-5 1-7 5-8" stroke={t("success-ink")} strokeWidth="3" strokeLinecap="round" />
    </g>
  );
}

function Wheat({ x, h = 54 }: { x: number; h?: number }) {
  return (
    <g transform={`translate(${x} 60)`} stroke={t("attention-ink")} fill={t("attention")}>
      {[-9, 0, 9].map((dx, i) => (
        <g key={i} transform={`rotate(${dx * 1.4})`}>
          <line x1="0" y1="0" x2="0" y2={-h + i * 4} strokeWidth="1.6" />
          {[0, 1, 2, 3, 4].map((k) => (
            <g key={k}>
              <ellipse cx="-3.5" cy={-h + i * 4 + k * 6 + 4} rx="2.4" ry="4.2" transform={`rotate(-28 -3.5 ${-h + i * 4 + k * 6 + 4})`} strokeWidth=".6" />
              <ellipse cx="3.5" cy={-h + i * 4 + k * 6 + 4} rx="2.4" ry="4.2" transform={`rotate(28 3.5 ${-h + i * 4 + k * 6 + 4})`} strokeWidth=".6" />
            </g>
          ))}
        </g>
      ))}
    </g>
  );
}

export default function Thanksgiving() {
  return (
    <>
      <Glow className="hx-g-thanksgiving" />
      <Garland
        unit={(i) => (
          <g transform={`translate(48 8) scale(0.95) rotate(${i % 2 ? 14 : -12})`}>
            <path d="M0 0C9 5 12 14 8 21c-2 3-5 5-8 5s-6-2-8-5C-12 14-9 5 0 0z" fill={t(LEAVES[i % 3])} />
            <path d="M0 2v22" stroke={t("bg")} strokeWidth="1.2" opacity=".5" />
          </g>
        )}
      />
      <div className="hx hx-tg-row hx-tg-row-l">
        <svg viewBox="0 0 260 64" fill="none">
          <Wheat x={22} />
          <Pumpkin x={48} s={1.05} />
          <Pumpkin x={108} s={0.62} c="danger" />
          <Wheat x={150} h={44} />
          <Pumpkin x={176} s={0.8} c="larch-deep" />
        </svg>
      </div>
      <div className="hx hx-tg-row hx-tg-row-r">
        <svg viewBox="0 0 260 64" fill="none">
          <Pumpkin x={10} s={0.8} c="danger" />
          <Wheat x={86} h={46} />
          <Pumpkin x={110} s={1.1} />
          <Wheat x={190} />
          <Wheat x={206} h={40} />
        </svg>
      </div>
    </>
  );
}
