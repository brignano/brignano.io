import { CODING_HEADING, nowBuilding } from "@/lib/constants";
import { OG_CONTENT_TYPE, OG_SIZE, ogCard } from "@/lib/og-card";

// /coding share card: the page's heading and its "Now building" strip. The
// live WakaTime numbers are left off on purpose: the card is built once per
// deploy and would show stale hours within the day. See lib/og-card.tsx.
export const dynamic = "force-static";
export const alt = `${CODING_HEADING}, Anthony Brignano`;
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return ogCard({
    path: "/coding",
    eyebrow: "Coding",
    title: CODING_HEADING,
    subtitle: `Now building: ${nowBuilding.map((n) => n.label).join(" · ")}`,
  });
}
