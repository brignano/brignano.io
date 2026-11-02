import { Glow, Sparkle, t } from "./shared";

// Red and gold: lanterns hang down the gutters, sway, and glow; gold sparks
// twinkle between them and a red wash warms the top edge.

function Lantern({ drop, size = 40 }: { drop: number; size?: number }) {
  return (
    <svg viewBox={`0 0 40 ${drop + 70}`} width={size} fill="none">
      <line x1="20" y1="0" x2="20" y2={drop} stroke={t("n-500")} />
      <rect x="14" y={drop} width="12" height="5" rx="1.5" fill={t("attention")} />
      <ellipse className="hx-ln-body" cx="20" cy={drop + 24} rx="17" ry="19" fill={t("danger")} />
      <path d={`M20 ${drop + 5}c-9 8-9 30 0 38M20 ${drop + 5}c9 8 9 30 0 38`} stroke={t("attention")} strokeWidth="1.3" opacity=".7" />
      <rect x="14" y={drop + 41} width="12" height="5" rx="1.5" fill={t("attention")} />
      <path d={`M16 ${drop + 46}v14M20 ${drop + 46}v18M24 ${drop + 46}v14`} stroke={t("attention")} strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

export default function LunarNewYear() {
  return (
    <>
      <Glow className="hx-g-lunar" />
      <div className="hx hx-ln-row hx-ln-l">
        <Lantern drop={6} />
        <Lantern drop={36} size={32} />
        <Lantern drop={16} size={28} />
      </div>
      <div className="hx hx-ln-row hx-ln-r">
        <Lantern drop={16} size={28} />
        <Lantern drop={36} size={32} />
        <Lantern drop={6} />
      </div>
      {[["6%", "40%"], ["12%", "62%"], ["94%", "38%"], ["88%", "60%"], ["5%", "78%"], ["95%", "76%"]].map(([x, y], i) => (
        <Sparkle key={i} className="hx-ln-spark" style={{ left: x, top: y, animationDelay: `${-i * 0.9}s` }} />
      ))}
    </>
  );
}
