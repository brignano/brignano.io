"use client";

import { event } from "@/lib/gtag";

export default function DisclaimerLink() {
  return (
    <a
      href="https://github.com/brignano"
      target="_blank"
      rel="noopener noreferrer"
      className="underline"
      onClick={() => {
        try {
          event("click_github_disclaimer", {
            category: "outbound",
            label: "https://github.com/brignano",
          });
        } catch {
          // noop
        }
      }}
    >
      GitHub
    </a>
  );
}
