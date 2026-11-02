import { t } from "./shared";

// Quiet and graphic: a large star-and-arc, drawn faint, sits behind the page
// the way it sits at the centre of the flag, with a thin red, white and blue
// ribbon along the top.

const STAR = "M30 4l7.6 17.6 19 1.8-14.4 12.6 4.3 18.6L30 44.4 13.5 54.6l4.3-18.6L3.4 23.4l19-1.8z";

export default function Juneteenth() {
  return (
    <>
      <svg className="hx hx-jt-mark" viewBox="0 0 300 300" fill="none">
        <path d="M20 250C20 120 110 30 250 30" stroke={t("danger")} strokeWidth="10" strokeLinecap="round" />
        <path d={STAR} transform="translate(60 60) scale(3.2)" fill={t("i")} />
      </svg>
      <div className="hx hx-jt-ribbon">
        <i style={{ background: t("danger") }} />
        <i style={{ background: t("n-300") }} />
        <i style={{ background: t("i") }} />
      </div>
      <svg className="hx hx-jt-star" viewBox="0 0 60 60" fill={t("danger")}>
        <path d={STAR} />
      </svg>
    </>
  );
}
