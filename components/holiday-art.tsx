import type { CSSProperties, ReactNode } from "react";

// Decorative scenes for each holiday (see lib/holidays.ts). Everything here is
// aria-hidden, fixed and pointer-events:none (app/globals.css), built from
// design tokens, and any motion is switched off under prefers-reduced-motion.

const t = (v: string) => `var(--${v})`;

/** A spiderweb filling the top-right corner of a 120×120 box. */
function webPaths() {
  const cx = 120;
  const cy = 0;
  const pt = (deg: number, r: number) => {
    const a = (deg * Math.PI) / 180;
    return [cx + r * Math.cos(a), cy + r * Math.sin(a)] as const;
  };
  const rays = [90, 112, 135, 157, 180];
  const spokes = rays
    .map((d) => {
      const [x, y] = pt(d, 118);
      return `M${cx} ${cy}L${x.toFixed(1)} ${y.toFixed(1)}`;
    })
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
const WEB = webPaths();

function Web({ className }: { className: string }) {
  return (
    <svg className={className} viewBox="0 0 120 120" fill="none">
      <path
        d={WEB}
        stroke={t("n-500")}
        strokeWidth="1"
        strokeLinecap="round"
        opacity=".75"
      />
    </svg>
  );
}

function Spider() {
  return (
    <div className="hx hx-spider">
      <svg viewBox="0 0 40 150" fill="none">
        <line x1="20" y1="0" x2="20" y2="112" stroke={t("n-500")} />
        <g stroke={t("ink")} strokeWidth="1.6" strokeLinecap="round">
          <path d="M20 118 L7 108 L3 116 M20 118 L6 120 L3 130 M20 124 L8 134 L6 144 M20 124 L10 140" />
          <path d="M20 118 L33 108 L37 116 M20 118 L34 120 L37 130 M20 124 L32 134 L34 144 M20 124 L30 140" />
        </g>
        <circle cx="20" cy="124" r="8" fill={t("ink")} />
        <circle cx="20" cy="116" r="5" fill={t("ink")} />
        <circle cx="18" cy="115" r="1.2" fill={t("card")} />
        <circle cx="22" cy="115" r="1.2" fill={t("card")} />
      </svg>
    </div>
  );
}

function Ghost() {
  return (
    <div className="hx hx-ghost">
      <svg viewBox="0 0 80 96" fill="none">
        <path
          d="M8 92V40a32 32 0 0 1 64 0v52l-11-9-10 9-11-9-11 9-10-9z"
          fill={t("card")}
          stroke={t("n-400")}
          strokeWidth="2"
        />
        <ellipse cx="29" cy="40" rx="5" ry="7" fill={t("ink")} />
        <ellipse cx="51" cy="40" rx="5" ry="7" fill={t("ink")} />
        <ellipse cx="40" cy="58" rx="4" ry="5" fill={t("ink")} opacity=".8" />
      </svg>
    </div>
  );
}

function Skeleton() {
  // A skull peeking over the bottom edge, fingers hooked on it.
  return (
    <div className="hx hx-skeleton">
      <svg viewBox="0 0 140 90" fill="none">
        <g fill={t("card")} stroke={t("n-500")} strokeWidth="2" strokeLinejoin="round">
          <path d="M30 90V70l-4-30q-2-9 4-9t5 9l2 14V24q0-9 5-9t5 9v18V20q0-9 5-9t5 9v22V26q0-8 5-8t4 8v34l4-12q3-8 8-5t0 12l-8 24v13z" transform="translate(-14 12) scale(.62)" />
          <path d="M30 90V70l-4-30q-2-9 4-9t5 9l2 14V24q0-9 5-9t5 9v18V20q0-9 5-9t5 9v22V26q0-8 5-8t4 8v34l4-12q3-8 8-5t0 12l-8 24v13z" transform="translate(150 12) scale(-.62 .62)" />
          <path d="M36 90V50c0-26 14-42 34-42s34 16 34 42v40z" />
        </g>
        <ellipse cx="55" cy="52" rx="9" ry="11" fill={t("ink")} />
        <ellipse cx="85" cy="52" rx="9" ry="11" fill={t("ink")} />
        <path d="M70 64l-4 9h8z" fill={t("ink")} />
        <path d="M48 82h44M55 82v8M63 82v8M71 82v8M79 82v8M87 82v8" stroke={t("ink")} strokeWidth="2" />
      </svg>
    </div>
  );
}

function Broom() {
  return (
    <div className="hx hx-broom">
      <svg viewBox="0 0 60 200" fill="none">
        <line x1="40" y1="2" x2="30" y2="128" stroke={t("attention-ink")} strokeWidth="5" strokeLinecap="round" />
        <path d="M18 122h26l8 74H8z" fill={t("attention")} stroke={t("n-500")} strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M16 140h30M13 160h36" stroke={t("n-500")} strokeWidth="2" />
        <path d="M22 140l-3 56M30 140v56M38 140l3 56" stroke={t("attention-ink")} strokeWidth="1.5" />
      </svg>
    </div>
  );
}

const LEAF =
  "M20 2C34 10 38 24 32 36c-3 5-8 8-12 8s-9-3-12-8C2 24 6 10 20 2zM20 8v34";

function Leaf({ color, style }: { color: string; style?: CSSProperties }) {
  return (
    <svg viewBox="0 0 40 46" fill="none" style={style}>
      <path d={LEAF} fill={t(color)} />
      <path d="M20 8v34" stroke={t("bg")} strokeWidth="1.4" opacity=".5" />
    </svg>
  );
}

const LEAF_COLORS = ["attention", "danger", "larch-deep", "attention", "danger"];

function Turkey() {
  // Tail fan and head peeking over the bottom edge.
  return (
    <div className="hx hx-turkey">
      <svg viewBox="0 0 160 90" fill="none">
        {[-60, -30, 0, 30, 60].map((r, i) => (
          <ellipse
            key={r}
            cx="80"
            cy="86"
            rx="13"
            ry="52"
            transform={`rotate(${r} 80 86)`}
            fill={t(["danger", "attention", "success", "attention", "danger"][i])}
            stroke={t("bg")}
            strokeWidth="2"
          />
        ))}
        <circle cx="80" cy="82" r="22" fill={t("n-600")} />
        <circle cx="72" cy="76" r="3" fill={t("card")} />
        <circle cx="88" cy="76" r="3" fill={t("card")} />
        <circle cx="72" cy="76" r="1.4" fill={t("ink")} />
        <circle cx="88" cy="76" r="1.4" fill={t("ink")} />
        <path d="M76 82l4 7 4-7z" fill={t("attention")} />
        <path d="M80 88q0 8 4 9t-1-9z" fill={t("danger")} />
      </svg>
    </div>
  );
}

const BULB_COLORS = ["danger", "attention", "success", "i"];

function Lights() {
  return (
    <div className="hx hx-lights">
      {Array.from({ length: 28 }, (_, i) => (
        <svg key={i} viewBox="0 0 96 30" fill="none" className={`hx-bulb-${i % 4}`}>
          <path d="M0 3Q48 20 96 3" stroke={t("n-500")} strokeWidth="1.5" />
          <rect x="45" y="12.5" width="6" height="4" rx="1" fill={t("n-500")} />
          <path
            d="M48 15.5c-5 0-6 6-3 9 1.4 1.5 4.6 1.5 6 0 3-3 2-9-3-9z"
            fill={t(BULB_COLORS[i % 4])}
          />
        </svg>
      ))}
    </div>
  );
}

function Snow() {
  return (
    <div className="hx hx-snow">
      {Array.from({ length: 16 }, (_, i) => (
        <i
          key={i}
          style={
            {
              left: `${(i * 37 + 6) % 100}%`,
              "--s": `${4 + ((i * 3) % 6)}px`,
              "--d": `${14 + ((i * 5) % 12)}s`,
              "--l": `${-((i * 7) % 20)}s`,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}

function Burst({ className, a, b }: { className: string; a: string; b: string }) {
  const rays = Array.from({ length: 14 }, (_, i) => {
    const ang = (i / 14) * Math.PI * 2;
    const c = Math.cos(ang);
    const s = Math.sin(ang);
    return (
      <g key={i}>
        <line x1={60 + c * 14} y1={60 + s * 14} x2={60 + c * 38} y2={60 + s * 38} stroke={t(i % 2 ? a : b)} strokeWidth="2.5" strokeLinecap="round" />
        <circle cx={60 + c * 48} cy={60 + s * 48} r="2.6" fill={t(i % 2 ? b : a)} />
      </g>
    );
  });
  return (
    <svg className={`hx hx-burst ${className}`} viewBox="0 0 120 120" fill="none">
      {rays}
    </svg>
  );
}

const CONFETTI = [
  ["3%", "22%", "attention", 20], ["5%", "38%", "i", -30], ["2%", "54%", "danger", 50],
  ["97%", "20%", "i", 35], ["95%", "36%", "attention", -20], ["98%", "52%", "success", 60],
  ["22%", "5%", "danger", 15], ["78%", "6%", "attention", -50],
] as const;

function Confetti() {
  return (
    <>
      {CONFETTI.map(([x, y, c, r], i) => (
        <i key={i} className="hx hx-confetti" style={{ left: x, top: y, background: t(c), transform: `rotate(${r}deg)` }} />
      ))}
    </>
  );
}

const HEART = "M12 21C-6 8 4-2 12 6c8-8 18 2 0 15z";

function Heart({ className, style, color = "danger" }: { className?: string; style?: CSSProperties; color?: string }) {
  return (
    <svg className={className} style={style} viewBox="0 0 24 24" fill={t(color)}>
      <path d={HEART} />
    </svg>
  );
}

function Hearts() {
  return (
    <>
      <div className="hx hx-hearts">
        {Array.from({ length: 9 }, (_, i) => (
          <Heart
            key={i}
            color={i % 3 === 0 ? "danger-ink" : "danger"}
            style={
              {
                left: `${(i * 41 + 8) % 100}%`,
                "--s": `${12 + ((i * 5) % 14)}px`,
                "--d": `${16 + ((i * 3) % 10)}s`,
                "--l": `${-((i * 5) % 18)}s`,
              } as CSSProperties
            }
          />
        ))}
      </div>
      <div className="hx hx-cupid">
        <svg viewBox="0 0 120 70" fill="none">
          <path d="M60 64C14 30 40 4 60 22c20-18 46 8 0 42z" fill={t("danger")} />
          <line x1="2" y1="12" x2="118" y2="58" stroke={t("n-600")} strokeWidth="3" strokeLinecap="round" />
          <path d="M2 12l9-1-3 8zM6 6l10 4M10 14l-1 10" stroke={t("n-600")} strokeWidth="2.5" strokeLinecap="round" />
          <path d="M118 58l-10-1 4 9z" fill={t("n-600")} />
        </svg>
      </div>
    </>
  );
}

function Bunting({ className }: { className: string }) {
  const flags = [0, 1, 2, 3, 4, 5].map((i) => {
    const x = 18 + i * 40;
    const y = 6 + 22 * Math.sin((x / 260) * Math.PI);
    const c = ["danger", "card", "i"][i % 3];
    return (
      <path
        key={i}
        d={`M${x - 14} ${y.toFixed(1)}L${x + 14} ${y.toFixed(1)}L${x} ${(y + 30).toFixed(1)}z`}
        fill={t(c)}
        stroke={t("n-400")}
        strokeWidth="1"
      />
    );
  });
  return (
    <svg className={`hx hx-bunting ${className}`} viewBox="0 0 260 60" fill="none">
      <path d="M0 6Q130 50 260 6" stroke={t("n-500")} strokeWidth="1.5" />
      {flags}
    </svg>
  );
}

export default function HolidayArt({ id }: { id: string }): ReactNode {
  switch (id) {
    case "halloween":
      return (
        <>
          <Web className="hx hx-web hx-web-r" />
          <Web className="hx hx-web hx-web-l" />
          <Spider />
          <Ghost />
          <Skeleton />
          <Broom />
        </>
      );
    case "thanksgiving":
      return (
        <>
          <div className="hx hx-leaves-corner hx-leaves-l">
            <Leaf color="danger" style={{ transform: "rotate(-30deg)" }} />
            <Leaf color="attention" style={{ transform: "rotate(20deg)" }} />
            <Leaf color="larch-deep" style={{ transform: "rotate(60deg)" }} />
          </div>
          <div className="hx hx-leaves-corner hx-leaves-r">
            <Leaf color="attention" style={{ transform: "rotate(30deg)" }} />
            <Leaf color="danger" style={{ transform: "rotate(-20deg)" }} />
            <Leaf color="larch-deep" style={{ transform: "rotate(-60deg)" }} />
          </div>
          <div className="hx hx-falling">
            {LEAF_COLORS.map((c, i) => (
              <Leaf
                key={i}
                color={c}
                style={
                  {
                    left: `${12 + i * 19}%`,
                    "--d": `${22 + i * 4}s`,
                    "--l": `${-i * 6}s`,
                  } as CSSProperties
                }
              />
            ))}
          </div>
          <Turkey />
        </>
      );
    case "winter":
      return (
        <>
          <Lights />
          <Snow />
        </>
      );
    case "new-year":
      return (
        <>
          <Burst className="hx-burst-l" a="attention" b="i" />
          <Burst className="hx-burst-r" a="i" b="attention" />
          <Confetti />
        </>
      );
    case "valentines":
      return <Hearts />;
    case "independence-day":
      return (
        <>
          <Bunting className="hx-bunting-l" />
          <Bunting className="hx-bunting-r" />
          <Burst className="hx-burst-l hx-burst-small" a="danger" b="i" />
          <Burst className="hx-burst-r hx-burst-small" a="i" b="danger" />
        </>
      );
    default:
      return null;
  }
}
