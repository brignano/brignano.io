import { createElement, type ReactElement } from "react";
import { renderToBuffer, type DocumentProps } from "@react-pdf/renderer";
import ResumePDF from "@/components/resume-pdf";
import { loadResume } from "@/lib/resume";

// Rendered once at build time (force-static) into a static /resume.pdf.
// Generating the PDF here instead of in the browser keeps @react-pdf/renderer
// out of the client bundle and makes the download a plain file request, which
// works in mobile browsers and in-app webviews that block blob: downloads.
export const dynamic = "force-static";

export async function GET() {
  const data = await loadResume();
  const buffer = await renderToBuffer(
    createElement(ResumePDF, { data }) as ReactElement<DocumentProps>
  );

  return new Response(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      // Quoted filename covers spaces for every current browser; filename*
      // is the RFC 6266 percent-encoded form for clients that prefer it.
      "Content-Disposition":
        "attachment; filename=\"Anthony Brignano Resume.pdf\"; filename*=UTF-8''Anthony%20Brignano%20Resume.pdf",
    },
  });
}
