import { Sparkle, t } from "./shared";

// A faint rainbow rises out of the bottom of the page and lands in a pot of
// gold.

const BANDS = ["danger", "attention", "success", "i"];

export default function StPatricks() {
  return (
    <>
      <svg className="hx hx-sp-rainbow" viewBox="0 0 1000 500" preserveAspectRatio="none" fill="none">
        {BANDS.map((c, i) => (
          <path key={c} d={`M${60 + i * 26} 500A${440 - i * 26} ${440 - i * 26} 0 0 1 ${940 - i * 26} 500`} stroke={t(c)} strokeWidth="22" strokeOpacity=".16" />
        ))}
      </svg>
      <div className="hx hx-sp-pot">
        <svg viewBox="0 0 90 80" fill="none">
          <ellipse cx="45" cy="30" rx="30" ry="10" fill={t("attention")} />
          <circle cx="30" cy="26" r="7" fill={t("attention")} stroke={t("attention-ink")} strokeWidth="1.5" />
          <circle cx="46" cy="22" r="8" fill={t("attention")} stroke={t("attention-ink")} strokeWidth="1.5" />
          <circle cx="60" cy="27" r="7" fill={t("attention")} stroke={t("attention-ink")} strokeWidth="1.5" />
          <path d="M12 32h66c4 22-8 44-33 44S8 54 12 32z" fill={t("n-900")} />
          <path d="M14 40h62" stroke={t("n-600")} strokeWidth="2" opacity=".6" />
        </svg>
        <Sparkle className="hx-sp-glint" style={{ left: "6%", top: "-10%" }} />
        <Sparkle className="hx-sp-glint" style={{ left: "72%", top: "-24%", animationDelay: "-1.1s" }} />
      </div>
    </>
  );
}
