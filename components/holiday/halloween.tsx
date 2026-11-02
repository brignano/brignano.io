import { Glow, t } from "./shared";

// Creatures at the edges of the page, with bats crossing the top now and then
// and a candle-flicker glow along the bottom.

function webPath() {
  const pt = (deg: number, r: number) => {
    const a = (deg * Math.PI) / 180;
    return [120 + r * Math.cos(a), r * Math.sin(a)] as const;
  };
  const rays = [90, 112, 135, 157, 180];
  const spokes = rays
    .map((d) => `M120 0L${pt(d, 118).map((n) => n.toFixed(1)).join(" ")}`)
    .join("");
  const rings = [28, 52, 78, 104]
    .map((r) => {
      let d = "";
      for (let i = 0; i < rays.length - 1; i++) {
        const [x1, y1] = pt(rays[i], r);
        const [x2, y2] = pt(rays[i + 1], r);
        const [qx, qy] = pt((rays[i] + rays[i + 1]) / 2, r * 0.86);
        d += `${i === 0 ? `M${x1.toFixed(1)} ${y1.toFixed(1)}` : ""}Q${qx.toFixed(1)} ${qy.toFixed(1)} ${x2.toFixed(1)} ${y2.toFixed(1)}`;
      }
      return d;
    })
    .join("");
  return spokes + rings;
}
const WEB = webPath();

const Web = ({ cls }: { cls: string }) => (
  <svg className={`hx hx-hw-web ${cls}`} viewBox="0 0 120 120" fill="none">
    <path d={WEB} stroke={t("n-500")} strokeWidth="1" strokeLinecap="round" opacity=".75" />
  </svg>
);

const Bat = ({ n }: { n: number }) => (
  <div className={`hx hx-hw-bat hx-hw-bat-${n}`}>
    <svg viewBox="0 0 60 26" fill={t("n-900")}>
      <path className="hx-hw-wing" d="M30 14C26 4 14 0 0 6c5 2 6 6 6 10 5-3 9-2 12 2 2-3 6-4 12-4s10 1 12 4c3-4 7-5 12-2 0-4 1-8 6-10C46 0 34 4 30 14z" />
    </svg>
  </div>
);

export default function Halloween() {
  return (
    <>
      <Glow className="hx-g-halloween" />
      <Web cls="hx-hw-web-r" />
      <Web cls="hx-hw-web-l" />
      <div className="hx hx-hw-spider">
        <svg viewBox="0 0 40 150" fill="none">
          <line x1="20" y1="0" x2="20" y2="112" stroke={t("n-500")} />
          <g stroke={t("ink")} strokeWidth="1.6" strokeLinecap="round">
            <path d="M20 118L7 108L3 116M20 118L6 120L3 130M20 124L8 134L6 144M20 124L10 140" />
            <path d="M20 118L33 108L37 116M20 118L34 120L37 130M20 124L32 134L34 144M20 124L30 140" />
          </g>
          <circle cx="20" cy="124" r="8" fill={t("ink")} />
          <circle cx="20" cy="116" r="5" fill={t("ink")} />
          <circle cx="18" cy="115" r="1.2" fill={t("card")} />
          <circle cx="22" cy="115" r="1.2" fill={t("card")} />
        </svg>
      </div>
      <div className="hx hx-hw-ghost">
        <svg viewBox="0 0 80 96" fill="none">
          <path d="M8 92V40a32 32 0 0 1 64 0v52l-11-9-10 9-11-9-11 9-10-9z" fill={t("card")} stroke={t("n-400")} strokeWidth="2" />
          <ellipse cx="29" cy="40" rx="5" ry="7" fill={t("ink")} />
          <ellipse cx="51" cy="40" rx="5" ry="7" fill={t("ink")} />
          <ellipse cx="40" cy="58" rx="4" ry="5" fill={t("ink")} opacity=".8" />
        </svg>
      </div>
      <div className="hx hx-hw-skull">
        <svg viewBox="0 0 140 90" fill="none">
          <g fill={t("card")} stroke={t("n-500")} strokeWidth="2" strokeLinejoin="round">
            <path d="M36 90V50c0-26 14-42 34-42s34 16 34 42v40z" />
            <path d="M30 90V70l-4-30q-2-9 4-9t5 9l2 14V24q0-9 5-9t5 9v18V20q0-9 5-9t5 9v22V26q0-8 5-8t4 8v34" transform="translate(-14 14) scale(.62)" />
            <path d="M30 90V70l-4-30q-2-9 4-9t5 9l2 14V24q0-9 5-9t5 9v18V20q0-9 5-9t5 9v22V26q0-8 5-8t4 8v34" transform="translate(154 14) scale(-.62 .62)" />
          </g>
          <ellipse cx="55" cy="52" rx="9" ry="11" fill={t("ink")} />
          <ellipse cx="85" cy="52" rx="9" ry="11" fill={t("ink")} />
          <path d="M70 64l-4 9h8z" fill={t("ink")} />
          <path d="M48 82h44M55 82v8M63 82v8M71 82v8M79 82v8M87 82v8" stroke={t("ink")} strokeWidth="2" />
        </svg>
      </div>
      <div className="hx hx-hw-broom">
        <svg viewBox="0 0 60 200" fill="none">
          <line x1="40" y1="2" x2="30" y2="128" stroke={t("attention-ink")} strokeWidth="5" strokeLinecap="round" />
          <path d="M18 122h26l8 74H8z" fill={t("attention")} stroke={t("n-500")} strokeWidth="1.5" strokeLinejoin="round" />
          <path d="M16 140h30M13 160h36" stroke={t("n-500")} strokeWidth="2" />
        </svg>
      </div>
      <Bat n={1} />
      <Bat n={2} />
      <Bat n={3} />
    </>
  );
}
