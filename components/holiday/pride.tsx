import { Glow, ORANGE, PURPLE, t } from "./shared";

// No sprites at all: soft rainbow light spills in along both edges and pools in
// the corners. A modern wash rather than an illustration.

const RAINBOW = [t("danger"), ORANGE, t("attention"), t("success"), t("i-ink"), PURPLE];

export default function Pride() {
  const stops = RAINBOW.join(", ");
  return (
    <>
      <Glow className="hx-g-pride" />
      <div className="hx hx-pr-edge hx-pr-edge-l" style={{ backgroundImage: `linear-gradient(180deg, ${stops}, ${RAINBOW[0]})` }} />
      <div className="hx hx-pr-edge hx-pr-edge-r" style={{ backgroundImage: `linear-gradient(0deg, ${stops}, ${RAINBOW[0]})` }} />
    </>
  );
}
