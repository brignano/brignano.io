import ResumeView from "@/components/resume-view";
import { loadResume } from "@/lib/resume";

// Rendered once at build time: the resume is read from public/resume.yml on
// the server and handed to the client view as props, so the HTML already
// contains the full resume. The page used to fetch and parse the YAML in the
// browser after mount, which showed every visitor a "Loading resume..." screen
// first and gave crawlers and link previews an empty page.
export const dynamic = "force-static";

export default async function ResumePage() {
  const data = await loadResume();
  return <ResumeView data={data} />;
}
