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

function Bunting({ className, colors = ["danger", "card", "i"] }: { className: string; colors?: string[] }) {
  const flags = [0, 1, 2, 3, 4, 5].map((i) => {
    const x = 18 + i * 40;
    const y = 6 + 22 * Math.sin((x / 260) * Math.PI);
    const c = colors[i % colors.length];
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


const mix = (a: string, pct: number, b: string) =>
  `color-mix(in srgb, var(--${a}) ${pct}%, var(--${b}))`;
const PURPLE = mix("i", 60, "danger");
const ORANGE = mix("danger", 45, "attention");
const PINK = mix("danger", 45, "n-0");

function Lantern({ drop, size = 40 }: { drop: number; size?: number }) {
  return (
    <svg viewBox={`0 0 40 ${drop + 66}`} width={size} fill="none">
      <line x1="20" y1="0" x2="20" y2={drop} stroke={t("n-500")} />
      <rect x="14" y={drop} width="12" height="5" rx="1.5" fill={t("attention")} />
      <ellipse cx="20" cy={drop + 24} rx="17" ry="19" fill={t("danger")} />
      <path d={`M20 ${drop + 5}c-9 8-9 30 0 38M20 ${drop + 5}c9 8 9 30 0 38`} stroke={t("attention")} strokeWidth="1.3" opacity=".7" />
      <rect x="14" y={drop + 41} width="12" height="5" rx="1.5" fill={t("attention")} />
      <path d={`M16 ${drop + 46}v14M20 ${drop + 46}v18M24 ${drop + 46}v14`} stroke={t("attention")} strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function Lanterns() {
  return (
    <>
      <div className="hx hx-lanterns hx-lanterns-l">
        <Lantern drop={8} />
        <Lantern drop={34} size={34} />
        <Lantern drop={12} size={30} />
      </div>
      <div className="hx hx-lanterns hx-lanterns-r">
        <Lantern drop={12} size={30} />
        <Lantern drop={34} size={34} />
        <Lantern drop={8} />
      </div>
    </>
  );
}

function Powder({ className, items }: { className: string; items: [number, number, number, string][] }) {
  return (
    <svg className={`hx hx-powder ${className}`} viewBox="0 0 140 140" fill="none">
      {items.map(([x, y, r, c], i) => (
        <circle key={i} cx={x} cy={y} r={r} fill={c} opacity=".55" />
      ))}
    </svg>
  );
}

function Holi() {
  const a: [number, number, number, string][] = [[10, 10, 52, t("danger")], [58, 18, 30, ORANGE], [24, 62, 28, PURPLE], [70, 60, 16, t("i")], [100, 12, 14, t("success")]];
  const b: [number, number, number, string][] = [[130, 10, 54, t("i")], [84, 22, 28, PINK], [112, 66, 26, t("attention")], [66, 64, 14, t("success")], [40, 10, 12, t("danger")]];
  const c: [number, number, number, string][] = [[10, 130, 50, t("success")], [56, 124, 28, t("attention")], [22, 78, 24, PINK], [78, 100, 14, t("i")]];
  const d: [number, number, number, string][] = [[130, 130, 46, PURPLE], [86, 124, 26, t("danger")], [118, 80, 22, ORANGE]];
  return (
    <>
      <Powder className="hx-powder-tl" items={a} />
      <Powder className="hx-powder-tr" items={b} />
      <Powder className="hx-powder-bl" items={c} />
      <Powder className="hx-powder-br" items={d} />
    </>
  );
}

function Shamrock({ style, className }: { style?: CSSProperties; className?: string }) {
  return (
    <svg className={className} style={style} viewBox="0 0 48 52" fill="none">
      {[0, 120, 240].map((r) => (
        <path key={r} d={HEART} transform={`rotate(${r} 24 24) translate(12 3)`} fill={t("success")} />
      ))}
      <path d="M24 24q2 14 8 24" stroke={t("success-ink")} strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

function Leprechaun() {
  // A top hat peeking over the bottom edge.
  return (
    <div className="hx hx-hat">
      <svg viewBox="0 0 100 80" fill="none">
        <rect x="26" y="6" width="48" height="52" rx="4" fill={t("success-ink")} />
        <rect x="26" y="40" width="48" height="10" fill={t("n-900")} />
        <rect x="42" y="38" width="16" height="14" rx="2" fill={t("attention")} stroke={t("n-900")} strokeWidth="2" />
        <ellipse cx="50" cy="60" rx="46" ry="10" fill={t("success-ink")} />
      </svg>
    </div>
  );
}

function Easter() {
  const egg = (x: number, c: string, i: number) => (
    <g key={i} transform={`translate(${x} 0)`}>
      <path d="M20 4C32 4 38 26 38 40c0 12-8 20-18 20S2 52 2 40C2 26 8 4 20 4z" fill={mix(c, 45, "n-0")} stroke={t("n-400")} strokeWidth="1.5" />
      <path d="M3 34l7-6 6 6 7-6 6 6 7-6 5 5" stroke={t(c)} strokeWidth="3" strokeLinejoin="round" />
      <circle cx="20" cy="48" r="3" fill={t(c)} />
    </g>
  );
  return (
    <>
      <div className="hx hx-eggs">
        <svg viewBox="0 0 150 64" fill="none">
          {[egg(0, "attention", 0), egg(52, "i", 1), egg(104, "danger", 2)]}
        </svg>
      </div>
      <div className="hx hx-bunny">
        <svg viewBox="0 0 90 120" fill="none">
          <ellipse cx="28" cy="34" rx="10" ry="32" fill={t("card")} stroke={t("n-400")} strokeWidth="2" />
          <ellipse cx="62" cy="34" rx="10" ry="32" fill={t("card")} stroke={t("n-400")} strokeWidth="2" />
          <ellipse cx="28" cy="36" rx="4.5" ry="24" fill={PINK} />
          <ellipse cx="62" cy="36" rx="4.5" ry="24" fill={PINK} />
          <circle cx="45" cy="88" r="32" fill={t("card")} stroke={t("n-400")} strokeWidth="2" />
          <circle cx="34" cy="82" r="3.2" fill={t("ink")} />
          <circle cx="56" cy="82" r="3.2" fill={t("ink")} />
          <ellipse cx="45" cy="92" rx="4" ry="3" fill={mix("danger", 60, "n-0")} />
        </svg>
      </div>
    </>
  );
}

function Rainbow({ className }: { className: string }) {
  const bands = [t("danger"), ORANGE, t("attention"), t("success"), t("i"), PURPLE];
  return (
    <svg className={`hx hx-rainbow ${className}`} viewBox="0 0 120 120" fill="none">
      {bands.map((c, i) => {
        const r = 100 - i * 11;
        return <path key={c + i} d={`M${120 - r} 0A${r} ${r} 0 0 0 120 ${r}`} stroke={c} strokeWidth="11" opacity=".8" />;
      })}
    </svg>
  );
}

function Star({ className }: { className: string }) {
  return (
    <svg className={`hx hx-bigstar ${className}`} viewBox="0 0 60 60" fill="none">
      <path d="M30 4l7.6 17.6 19 1.8-14.4 12.6 4.3 18.6L30 44.4 13.5 54.6l4.3-18.6L3.4 23.4l19-1.8z" fill={t("card")} stroke={t("danger")} strokeWidth="3" strokeLinejoin="round" />
    </svg>
  );
}

function Flame({ x, y, color = "attention" }: { x: number; y: number; color?: string }) {
  return (
    <path
      className="hx-flame"
      d={`M${x} ${y}c-4-5-3-9 0-13 3 4 4 8 0 13z`}
      fill={t(color)}
    />
  );
}

function Diwali() {
  const diya = (x: number, i: number) => (
    <g key={i} transform={`translate(${x} 0)`}>
      <path d="M2 30h40c0 12-9 18-20 18S2 42 2 30z" fill={t("danger")} stroke={t("attention")} strokeWidth="2" />
      <path d="M2 30c10-6 30-6 40 0" stroke={t("attention")} strokeWidth="2" />
      <Flame x={22} y={28} />
    </g>
  );
  const petals = Array.from({ length: 12 }, (_, i) => (
    <ellipse key={i} cx="120" cy="38" rx="7" ry="16" transform={`rotate(${i * 30} 120 0)`} fill={t(i % 2 ? "attention" : "danger")} opacity=".8" />
  ));
  const rangoli = (
    <svg viewBox="0 0 120 120" fill="none">
      {petals}
      <circle cx="120" cy="0" r="62" stroke={t("i")} strokeWidth="3" strokeDasharray="2 7" strokeLinecap="round" />
      <circle cx="120" cy="0" r="92" stroke={t("attention")} strokeWidth="3" strokeDasharray="1 8" strokeLinecap="round" />
      <circle cx="120" cy="0" r="14" fill={t("i")} />
    </svg>
  );
  return (
    <>
      <div className="hx hx-rangoli hx-rangoli-r">{rangoli}</div>
      <div className="hx hx-rangoli hx-rangoli-l">{rangoli}</div>
      <div className="hx hx-diyas">
        <svg viewBox="0 0 270 56" fill="none">
          {[0, 56, 112, 168, 224].map(diya)}
        </svg>
      </div>
    </>
  );
}

function Menorah() {
  const xs = [10, 22.5, 35, 47.5, 72.5, 85, 97.5, 110];
  return (
    <div className="hx hx-menorah">
      <svg viewBox="0 0 120 120" fill="none">
        <g stroke={t("attention")} strokeWidth="3.5" strokeLinecap="round">
          {[0, 1, 2, 3].map((i) => {
            const a = 10 + i * 12.5;
            const b = 110 - i * 12.5;
            const y = 96 - i * 6;
            return <path key={i} d={`M${a} 60V78Q${a} ${y} 60 ${y}Q${b} ${y} ${b} 78V60`} />;
          })}
          <path d="M60 48V108" />
          <path d="M36 110h48" />
        </g>
        {[...xs, 60].map((x, i) => {
          const tall = x === 60;
          const top = tall ? 36 : 52;
          return (
            <g key={i}>
              <rect x={x - 3} y={top} width="6" height={tall ? 18 : 14} fill={t("i")} />
              <Flame x={x} y={top - 1} />
            </g>
          );
        })}
      </svg>
    </div>
  );
}

function Davids({ className }: { className: string }) {
  return (
    <svg className={`hx hx-david ${className}`} viewBox="0 0 60 90" fill="none">
      <line x1="30" y1="0" x2="30" y2="30" stroke={t("n-500")} />
      <g stroke={t("i")} strokeWidth="3" strokeLinejoin="round">
        <path d="M30 34l17 30H13z" />
        <path d="M30 70L13 40h34z" />
      </g>
    </svg>
  );
}

function Kinara() {
  const candles: [number, string][] = [
    [8, "danger"], [24, "danger"], [40, "danger"], [60, "n-900"],
    [80, "success"], [96, "success"], [112, "success"],
  ];
  return (
    <div className="hx hx-kinara">
      <svg viewBox="0 0 120 100" fill="none">
        <path d="M8 40v22q0 10 8 10h88q8 0 8-10V40" stroke={t("attention-ink")} strokeWidth="3" />
        <path d="M60 40v42M40 90h40" stroke={t("attention-ink")} strokeWidth="5" strokeLinecap="round" />
        {candles.map(([x, c], i) => {
          const tall = x === 60;
          const top = tall ? 14 : 24 + Math.abs(i - 3) * 2;
          return (
            <g key={i}>
              <rect x={x - 4} y={top} width="8" height={40 - top + 2} fill={t(c)} />
              <Flame x={x} y={top - 1} color="attention" />
            </g>
          );
        })}
      </svg>
    </div>
  );
}

function Crescent({ className }: { className: string }) {
  return (
    <svg className={`hx hx-crescent ${className}`} viewBox="0 0 80 130" fill="none">
      <line x1="40" y1="0" x2="40" y2="34" stroke={t("n-500")} />
      <path d="M52 34a30 30 0 1 0 0 58 24 24 0 1 1 0-58z" fill={t("attention")} />
      <path d="M58 98l3 8 8 .5-6.200 5 2.200 8L58 115l-7 4.500 2.200-8-6.200-5 8-.5z" fill={t("attention")} />
    </svg>
  );
}

function Fanous({ drop = 10 }: { drop?: number }) {
  return (
    <svg viewBox="0 0 50 110" width="38" fill="none">
      <line x1="25" y1="0" x2="25" y2={drop} stroke={t("n-500")} />
      <path d={`M25 ${drop}l10 12H15z`} fill={t("attention")} />
      <path d={`M15 ${drop + 12}h20l6 40H9z`} fill={mix("success", 70, "n-0")} stroke={t("success-ink")} strokeWidth="2" />
      <path d={`M25 ${drop + 12}v40M17 ${drop + 12}l-3 40M33 ${drop + 12}l3 40`} stroke={t("success-ink")} strokeWidth="1.5" />
      <path d={`M9 ${drop + 52}h32l-4 8H13z`} fill={t("attention")} />
      <circle cx="25" cy={drop + 34} r="5" fill={t("attention")} />
    </svg>
  );
}

function Eid() {
  return (
    <>
      <div className="hx hx-lanterns hx-lanterns-l">
        <Crescent className="hx-crescent-inline" />
      </div>
      <div className="hx hx-lanterns hx-lanterns-r">
        <Fanous drop={14} />
        <Fanous drop={40} />
        <Fanous drop={10} />
      </div>
    </>
  );
}

function Shamrocks() {
  return (
    <>
      <div className="hx hx-leaves-corner hx-leaves-l">
        <Shamrock style={{ transform: "rotate(-25deg)" }} />
        <Shamrock style={{ transform: "rotate(15deg)" }} />
      </div>
      <div className="hx hx-leaves-corner hx-leaves-r">
        <Shamrock style={{ transform: "rotate(25deg)" }} />
        <Shamrock style={{ transform: "rotate(-15deg)" }} />
      </div>
      <div className="hx hx-falling">
        {[0, 1, 2, 3, 4].map((i) => (
          <Shamrock
            key={i}
            style={{ left: `${12 + i * 19}%`, "--d": `${22 + i * 4}s`, "--l": `${-i * 6}s` } as CSSProperties}
          />
        ))}
      </div>
      <Leprechaun />
    </>
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
    case "lunar-new-year":
      return <Lanterns />;
    case "holi":
      return <Holi />;
    case "st-patricks":
      return <Shamrocks />;
    case "easter":
      return <Easter />;
    case "pride":
      return (
        <>
          <Rainbow className="hx-rainbow-r" />
          <Rainbow className="hx-rainbow-l" />
        </>
      );
    case "juneteenth":
      return (
        <>
          <Bunting className="hx-bunting-l" />
          <Bunting className="hx-bunting-r" />
          <Star className="hx-bigstar-l" />
          <Star className="hx-bigstar-r" />
        </>
      );
    case "eid-al-fitr":
    case "eid-al-adha":
      return <Eid />;
    case "diwali":
      return <Diwali />;
    case "hanukkah":
      return (
        <>
          <Davids className="hx-david-l" />
          <Davids className="hx-david-r" />
          <Menorah />
        </>
      );
    case "kwanzaa":
      return (
        <>
          <Bunting className="hx-bunting-l" colors={["danger", "n-900", "success"]} />
          <Bunting className="hx-bunting-r" colors={["success", "n-900", "danger"]} />
          <Kinara />
        </>
      );
    default:
      return null;
  }
}
