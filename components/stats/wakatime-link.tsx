"use client";

import * as gtag from "@/lib/gtag";

/** Outbound link to the WakaTime profile, tracked like the GitHub one. */
export default function WakaTimeLink({ url }: { url?: string | null }) {
  const href = url ?? "https://wakatime.com";
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="underline"
      onClick={() => {
        try {
          gtag.event("click_wakatime_profile", {
            category: "outbound",
            label: href,
          });
        } catch {
          // noop
        }
      }}
    >
      WakaTime
    </a>
  );
}
