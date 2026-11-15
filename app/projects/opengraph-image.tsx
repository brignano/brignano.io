import { PROJECTS_LEAD, projects } from "@/lib/constants";
import { OG_CONTENT_TYPE, OG_SIZE, ogCard } from "@/lib/og-card";

// /projects share card: the page's lead line, then the products it lists, in
// its order, straight from `projects`. See lib/og-card.tsx.
export const dynamic = "force-static";
export const alt = `Projects by Anthony Brignano: ${PROJECTS_LEAD}`;
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return ogCard({
    path: "/projects",
    eyebrow: "Projects",
    title: PROJECTS_LEAD,
    subtitle: projects
      .filter((p) => p.kind === "product")
      .map((p) => p.title)
      .join(" · "),
  });
}
