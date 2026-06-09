"use client";

import { useEffect, useState } from "react";
import { fetchLatestPublicCommit, type LatestCommit as LC } from "@/lib/github";

function timeAgo(iso?: string | null): string {
  if (!iso) return "";
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.round(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.round(h / 24)}d ago`;
}

/**
 * Subtle "actively building" signal — latest commit from public repos only
 * (the day-job platform work is private). Fetched client-side for freshness;
 * renders nothing if the GitHub call fails so it never breaks the layout.
 */
export default function LatestCommit() {
  const [commit, setCommit] = useState<LC | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const c = await fetchLatestPublicCommit();
      if (!c) return;
      // The events API often omits commit messages; enrich from the commit endpoint.
      let message = (c.message || "").trim();
      if (!message && c.repo && c.sha) {
        try {
          const res = await fetch(
            `https://api.github.com/repos/${c.repo}/commits/${c.sha}`
          );
          if (res.ok) {
            const d = await res.json();
            message = (d?.commit?.message || "").trim();
          }
        } catch {
          /* keep empty; render falls back gracefully */
        }
      }
      if (mounted) setCommit({ ...c, message });
    })();
    return () => {
      mounted = false;
    };
  }, []);

  if (!commit) return null;

  const message = (commit.message || "").split("\n")[0];
  const short =
    message.length > 64
      ? `${message.slice(0, 64)}…`
      : message || "view commit";
  const repo = commit.repo?.split("/")[1] ?? commit.repo;

  return (
    <p className="mt-4 text-sm dark:text-zinc-500 text-zinc-500">
      Latest commit:{" "}
      <a
        href={commit.url ?? "#"}
        target="_blank"
        rel="noopener noreferrer"
        className="text-primary-color hover:underline"
      >
        {short}
      </a>{" "}
      <span className="dark:text-zinc-600 text-zinc-400">
        in {repo}
        {commit.date ? ` · ${timeAgo(commit.date)}` : ""}
      </span>
    </p>
  );
}
