import { Sparkle, t } from "./shared";

// Night-sky flavour: striped sashes cut across the top corners, and a couple
// of stars.

const Sash = ({ cls }: { cls: string }) => (
  <svg className={`hx hx-id-sash ${cls}`} viewBox="0 0 120 120" fill="none">
    <path d="M0 0h60L0 60z" fill={t("danger")} />
    <path d="M60 0h20L0 80V60z" fill={t("n-0")} />
    <path d="M80 0h24L0 104V80z" fill={t("i")} />
  </svg>
);

export default function IndependenceDay() {
  return (
    <>
      <Sash cls="hx-id-sash-l" />
      <Sash cls="hx-id-sash-r" />
      <Sparkle className="hx-id-spark" color="i" style={{ left: "14%", top: "24%" }} />
      <Sparkle className="hx-id-spark" color="danger" style={{ left: "86%", top: "30%", animationDelay: "-1.3s" }} />
    </>
  );
}
