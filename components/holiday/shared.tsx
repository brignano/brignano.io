import type { CSSProperties, ReactNode } from "react";

// Shared helpers for the holiday scenes. Colours are design tokens only, so a
// scene follows light and dark for free.

export const t = (v: string) => `var(--${v})`;
export const mix = (a: string, pct: number, b: string) =>
  `color-mix(in srgb, var(--${a}) ${pct}%, var(--${b}))`;

export const PURPLE = mix("i-ink", 60, "danger");
export const ORANGE = mix("danger", 45, "attention");
export const PINK = mix("danger", 45, "n-0");
export const SKY = mix("i-ink", 55, "n-0");

export const HEART = "M12 21C-6 8 4-2 12 6c8-8 18 2 0 15z";

/** Typed CSS custom properties for inline styles. */
export const vars = (o: Record<string, string | number>) => o as CSSProperties;

/** A soft full-screen colour wash; its look lives in holiday.css. */
export function Glow({ className }: { className: string }) {
  return <div className={`hx hx-glow ${className}`} />;
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

/**
 * A string hung along the top edge, just under the header: the same place for
 * every theme, so it reads as decoration and never sits over the words. `unit`
 * draws one 96×34 swag; it repeats across the width.
 */
export function Garland({ unit, n = 28 }: { unit: (i: number) => ReactNode; n?: number }) {
  return (
    <div className="hx hx-garland">
      {Array.from({ length: n }, (_, i) => (
        <svg key={i} viewBox="0 0 96 34" fill="none">
          <path d="M0 3Q48 20 96 3" stroke={t("n-500")} strokeWidth="1.5" />
          {unit(i)}
        </svg>
      ))}
    </div>
  );
}
