import { Field, Sparkle, t, vars } from "./shared";

// Fireworks that actually go off: each burst blooms, hangs, fades, and the next
// one fires somewhere else. Gold confetti drifts down between them.

const BURSTS: [string, string, number, string, string][] = [
  ["4%", "16%", 0, "attention", "i"],
  ["88%", "10%", 2.4, "i", "attention"],
  ["9%", "52%", 4.8, "i", "danger"],
  ["91%", "46%", 1.2, "attention", "success"],
  ["24%", "2%", 3.6, "attention", "i"],
];

function Burst({ a, b }: { a: string; b: string }) {
  return (
    <svg viewBox="0 0 120 120" fill="none">
      {Array.from({ length: 16 }, (_, i) => {
        const ang = (i / 16) * Math.PI * 2;
        const c = Math.cos(ang);
        const s = Math.sin(ang);
        return (
          <g key={i}>
            <line x1={60 + c * 12} y1={60 + s * 12} x2={60 + c * 36} y2={60 + s * 36} stroke={t(i % 2 ? a : b)} strokeWidth="2.5" strokeLinecap="round" />
            <circle cx={60 + c * 48} cy={60 + s * 48} r="2.6" fill={t(i % 2 ? b : a)} />
          </g>
        );
      })}
    </svg>
  );
}

export default function NewYear() {
  return (
    <>
      {BURSTS.map(([x, y, delay, a, b], i) => (
        <div key={i} className="hx hx-ny-burst" style={vars({ left: x, top: y, "--l": `${delay}s` })}>
          <Burst a={a} b={b} />
        </div>
      ))}
      <Sparkle className="hx-ny-spark" style={{ left: "13%", top: "30%" }} />
      <Sparkle className="hx-ny-spark" style={{ left: "84%", top: "26%", animationDelay: "-1.5s" }} color="i" />
      <Field n={14} wind={1.2} className="hx-ny-confetti">
        {(i) => <i style={{ background: t(["attention", "i", "attention", "success", "danger"][i % 5]) }} />}
      </Field>
    </>
  );
}
