import { readFile } from "node:fs/promises";
import path from "node:path";
import { createElement, type ReactElement } from "react";
import yaml from "js-yaml";
import { renderToBuffer, type DocumentProps } from "@react-pdf/renderer";
import ResumePDF from "@/components/resume-pdf";
import type { ResumeData } from "@/types/resume";

// Rendered once at build time (output: "export") into a static /resume.pdf.
// Generating the PDF here instead of in the browser keeps @react-pdf/renderer
// out of the client bundle and makes the download a plain file request, which
// works in mobile browsers and in-app webviews that block blob: downloads.
export const dynamic = "force-static";

export async function GET() {
  const yamlText = await readFile(
    path.join(process.cwd(), "public", "resume.yml"),
    "utf8"
  );
  const data = yaml.load(yamlText) as ResumeData;
  const buffer = await renderToBuffer(
    createElement(ResumePDF, { data }) as ReactElement<DocumentProps>
  );

  return new Response(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": 'attachment; filename="Anthony_Brignano_Resume.pdf"',
    },
  });
}
