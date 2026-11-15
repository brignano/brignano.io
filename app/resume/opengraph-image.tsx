import { loadResume } from "@/lib/resume";
import { OG_CONTENT_TYPE, OG_SIZE, ogCard } from "@/lib/og-card";

// /resume share card: the name and title from public/resume.yml, the same
// file the page and resume.pdf render. See lib/og-card.tsx.
export const dynamic = "force-static";
export const alt = "Resume, Anthony Brignano";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image() {
  const { personalInfo, experience } = await loadResume();
  // The current role's company, picked the way the page picks it.
  const company = experience?.find(
    (job) => String(job.endDate).toLowerCase() === "present"
  )?.company;
  return ogCard({
    path: "/resume",
    eyebrow: "Resume",
    title: personalInfo.name,
    subtitle: [personalInfo.title, company].filter(Boolean).join(" · "),
  });
}
