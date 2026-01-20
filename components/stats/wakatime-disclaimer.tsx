"use client";

import * as gtag from "@/lib/gtag";

interface WakaTimeDisclaimerProps {
  url?: string | null;
}

export default function WakaTimeDisclaimer({ url }: WakaTimeDisclaimerProps) {
  const href = url ?? "https://wakatime.com";

  const handleClick = () => {
    try {
      gtag.event("click_wakatime_profile", {
        category: "outbound",
        label: href,
      });
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        console.error("Failed to send WakaTime analytics event", error);
      }
    }
  };

  return (
    <>
      <span className="leading-none">🚀&nbsp;</span>
      <span>
        Powered by{" "}
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleClick}
          className="inline-flex items-center gap-2 underline"
        >
          WakaTime
        </a>
        .
      </span>
    </>
  );
}
