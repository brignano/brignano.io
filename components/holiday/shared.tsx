import type { CSSProperties, ReactNode } from "react";

// Shared helpers for the holiday scenes. Colours are design tokens only, so a
// scene follows light and dark for free.

export const t = (v: string) => `var(--${v})`;
export const mix = (a: string, pct: number, b: string) =>
  `color-mix(in srgb, var(--${a}) ${pct}%, var(--${b}))`;

export const PURPLE = mix("i", 60, "danger");
export const ORANGE = mix("danger", 45, "attention");
export const PINK = mix("danger", 45, "n-0");
export const SKY = mix("i", 55, "n-0");

export const HEART = "M12 21C-6 8 4-2 12 6c8-8 18 2 0 15z";

/** Typed CSS custom properties for inline styles. */
export const vars = (o: Record<string, string | number>) => o as CSSProperties;

/** A soft full-screen colour wash; its look lives in holiday.css. */
export function Glow({ className }: { className: string }) {
  return <div className={`hx hx-glow ${className}`} />;
}

/**
 * Things that drift down (or float up) the whole viewport: snow, leaves,
 * petals, hearts. Positions, speeds and sizes are spread deterministically so
 * server and client agree. Hidden under prefers-reduced-motion.
 */
export function Field({
  n,
  dir = "fall",
  className = "",
  wind = 1,
  children,
}: {
  n: number;
  dir?: "fall" | "rise";
  className?: string;
  wind?: number;
  children: (i: number) => ReactNode;
}) {
  return (
    <div className={`hx hx-field hx-${dir} ${className}`}>
      {Array.from({ length: n }, (_, i) => (
        <span
          key={i}
          style={vars({
            "--x": `${(i * 37 + 9) % 96}%`,
            "--d": `${16 + ((i * 7) % 14)}s`,
            "--l": `${-((i * 5) % 24)}s`,
            "--s": 0.7 + ((i * 13) % 7) / 10,
            "--w": `${(i % 2 ? 1 : -1) * wind * (20 + ((i * 11) % 40))}px`,
          })}
        >
          {children(i)}
        </span>
      ))}
    </div>
  );
}

/** A four-point sparkle, for twinkling. */
export function Sparkle({
  className = "",
  style,
  color = "attention",
}: {
  className?: string;
  style?: CSSProperties;
  color?: string;
}) {
  return (
    <svg className={`hx hx-sparkle ${className}`} style={style} viewBox="0 0 24 24" fill={t(color)}>
      <path d="M12 0c1 7 5 11 12 12-7 1-11 5-12 12-1-7-5-11-12-12C7 11 11 7 12 0z" />
    </svg>
  );
}
