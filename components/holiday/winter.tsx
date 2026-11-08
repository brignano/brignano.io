import { Glow, t } from "./shared";

// Deliberately generic: no tree, cross or other symbol. Lights twinkle along
// the top and the corners frost over with a pale blue wash.

const BULBS = ["danger", "attention", "success", "i"];

export default function Winter() {
  return (
    <>
      <Glow className="hx-g-winter" />
      <div className="hx hx-wn-lights">
        {Array.from({ length: 28 }, (_, i) => (
          <svg key={i} viewBox="0 0 96 30" fill="none" style={{ animationDelay: `${-i * 0.35}s` }}>
            <path d="M0 3Q48 20 96 3" stroke={t("n-500")} strokeWidth="1.5" />
            <rect x="45" y="12.5" width="6" height="4" rx="1" fill={t("n-500")} />
            <path className="hx-wn-bulb" d="M48 15.5c-5 0-6 6-3 9 1.4 1.5 4.6 1.5 6 0 3-3 2-9-3-9z" fill={t(BULBS[i % 4])} />
          </svg>
        ))}
      </div>
    </>
  );
}
