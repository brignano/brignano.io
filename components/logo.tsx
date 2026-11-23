import { MARK } from "@brignano/design/logo/paths.mjs";

/**
 * The ab logo from @brignano/design (DESIGN.md §5, "The logo"), inlined so
 * it follows the site theme: the letters take --ink and the cursor takes the
 * mark in force. The cursor blinks three times on load, then rests solid,
 * and stays still under reduced motion (`.cursor-blink`, ADR-0022 in the
 * design system). Size it by height; the width follows.
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
      <path
        d={MARK.bar}
        className="cursor-blink"
        style={{ fill: "var(--mark-current)" }}
      />
    </svg>
  );
}
