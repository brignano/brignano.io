import { readFile } from "node:fs/promises";
import path from "node:path";
import { load as parseYaml } from "js-yaml";
import type { ResumeData } from "@/types/resume";

// public/resume.yml is the single source for the resume page, the generated
// PDF and the chat assistant. Server-only: it reads from disk, so it never
// ships to the browser (the page gets the parsed data as props instead).
export const RESUME_PATH = path.join(process.cwd(), "public", "resume.yml");

export async function loadResume(): Promise<ResumeData> {
  const yamlText = await readFile(RESUME_PATH, "utf8");
  return parseYaml(yamlText) as ResumeData;
}
