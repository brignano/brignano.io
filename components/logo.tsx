import { MARK } from "@brignano/design/logo/paths.mjs";

/**
 * The A|B logo from @brignano/design (DESIGN.md §5, "The logo"), inlined so
 * it follows the site theme: the letters take --ink and the bar takes the
 * mark in force. Size it by height; the width follows.
 */
export default function Logo({ className }: { className?: string }) {
  return (
    <svg
      viewBox={MARK.viewBox}
      className={className}
      role="img"
      aria-label="Anthony Brignano"
    >
      <path d={MARK.letters} style={{ fill: "var(--ink)" }} />
      <path d={MARK.bar} style={{ fill: "var(--mark-current)" }} />
    </svg>
  );
}
