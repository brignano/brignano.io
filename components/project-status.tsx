import type { Project } from "@/lib/constants";

// Status reads at a glance, on design's .pill: live is success (you can use
// it today), beta attention (it works but is still changing, so expect
// edges), proof of concept the neutral pill (early, not for relying on yet).
// The word always ships with the colour, so it is never the only signal
// (DESIGN.md §3). Shared by the project cards and the home page list.
const STATUS: Record<Project["status"], string> = {
  live: "pill pill-success",
  beta: "pill pill-attention",
  "proof of concept": "pill",
};

export default function ProjectStatus({ status }: { status: Project["status"] }) {
  return <span className={`shrink-0 ${STATUS[status]}`}>{status}</span>;
}
