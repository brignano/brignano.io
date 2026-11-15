import { NOTES_LEAD } from "@/lib/constants";
import { NOTES_LABEL, NOTES_PATH } from "@/lib/notes-path";
import { OG_CONTENT_TYPE, OG_SIZE, ogCard } from "@/lib/og-card";

// /notes share card: the page's heading and lead line. See lib/og-card.tsx.
export const dynamic = "force-static";
export const alt = `${NOTES_LABEL} by Anthony Brignano: ${NOTES_LEAD}`;
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return ogCard({ path: NOTES_PATH, eyebrow: NOTES_LABEL, title: NOTES_LEAD });
}
