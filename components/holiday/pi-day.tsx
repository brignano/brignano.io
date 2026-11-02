import { t } from "./shared";

// For the engineer: the digits of pi scroll along the bottom in the site's mono
// face, a radius sweeps a circle in the corner, and a giant pi sits faint behind
// the page.

const DIGITS =
  "3.14159265358979323846264338327950288419716939937510582097494459230781640628620899862803482534211706798214808651328230664709384460955058223172535940812848111745028410270193852110555964462294895493038196";

export default function PiDay() {
  return (
    <>
      <div className="hx hx-pi-mark" aria-hidden="true">
        π
      </div>
      <svg className="hx hx-pi-dial" viewBox="0 0 80 80" fill="none">
        <circle cx="40" cy="40" r="30" stroke={t("i")} strokeWidth="2" />
        <g className="hx-pi-sweep">
          <line x1="40" y1="40" x2="70" y2="40" stroke={t("i")} strokeWidth="2" strokeLinecap="round" />
          <circle cx="70" cy="40" r="3.5" fill={t("i")} />
        </g>
        <circle cx="40" cy="40" r="2.5" fill={t("i")} />
      </svg>
      <div className="hx hx-pi-ticker">
        <div>
          <span>{DIGITS}</span>
          <span>{DIGITS}</span>
        </div>
      </div>
    </>
  );
}
