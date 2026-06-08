/**
 * Paved Road hero motif (TSD §5.3 / decision §10.2).
 *
 * Restrained, low-contrast perspective guide-lines receding to a vanishing
 * point — a literal nod to the "paved road" platform metaphor used in the
 * site copy. Purely decorative: anchored to the accent color, masked so it
 * dissolves toward the text, and hidden on small screens so it can never
 * crowd the H1 or push the primary CTA below the fold.
 */
export default function HeroMotif() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-y-0 right-0 hidden w-[58%] opacity-50 md:block dark:opacity-90"
    >
      <svg
        viewBox="0 0 700 460"
        preserveAspectRatio="xMaxYMid slice"
        fill="none"
        className="h-full w-full"
      >
        <defs>
          <linearGradient
            id="hm-road"
            x1="560"
            y1="150"
            x2="120"
            y2="360"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#a78bfa" stopOpacity="0.9" />
            <stop offset="0.6" stopColor="#8b5cf6" stopOpacity="0.4" />
            <stop offset="1" stopColor="#8b5cf6" stopOpacity="0" />
          </linearGradient>
          <radialGradient id="hm-fade" cx="80%" cy="36%" r="64%">
            <stop offset="0" stopColor="#fff" stopOpacity="1" />
            <stop offset="1" stopColor="#fff" stopOpacity="0" />
          </radialGradient>
          <mask id="hm-mask">
            <rect width="700" height="460" fill="url(#hm-fade)" />
          </mask>
        </defs>
        <g mask="url(#hm-mask)" stroke="url(#hm-road)">
          {/* road edges fanning out from the vanishing point (560,150) */}
          <g strokeWidth="1.4" strokeOpacity="0.55">
            <path d="M560 150 L720 -10" />
            <path d="M560 150 L720 90" />
            <path d="M560 150 L720 210" />
            <path d="M560 150 L720 340" />
            <path d="M560 150 L720 470" />
            <path d="M560 150 L360 440" />
            <path d="M560 150 L120 400" />
            <path d="M560 150 L-40 320" />
          </g>
          {/* perpendicular rungs of the receding road */}
          <g strokeWidth="1" strokeOpacity="0.28">
            <path d="M80 270 L690 110" />
            <path d="M150 330 L700 170" />
            <path d="M300 400 L700 240" />
          </g>
        </g>
        <circle cx="560" cy="150" r="3.5" fill="#a78bfa" />
        <circle
          cx="560"
          cy="150"
          r="9"
          fill="none"
          stroke="#a78bfa"
          strokeOpacity="0.4"
        />
      </svg>
    </div>
  );
}
