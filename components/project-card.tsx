"use client";

import Link from "next/link";
import type { Project, ProjectStatus } from "@/lib/constants";
import { event } from "@/lib/gtag";

// Status reuses the design system's state layer rather than inventing a fourth
// palette: shipped work reads as success, unfinished work as attention. Every
// pill carries its word, so the colour is reinforcement and never the only
// signal (DESIGN.md — state colour always ships with an icon or a word).
const STATUS_STYLES: Record<ProjectStatus, string> = {
  live: "bg-success-surface text-success-ink",
  active: "bg-interactive-surface text-interactive-ink",
  "proof of concept": "bg-attention-surface text-attention-ink",
};

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="flex flex-col bg-card/70 backdrop-blur-sm border border-line rounded-xl px-6 py-4 shadow-sm transition-colors hover:border-line-strong">
      <div className="flex items-start justify-between gap-3 mb-3">
        <h3 className="text-xl font-semibold text-ink">{project.title}</h3>
        <span
          className={`shrink-0 text-xs px-2.5 py-1 rounded-full font-medium ${STATUS_STYLES[project.status]}`}
        >
          {project.status}
        </span>
      </div>

      <p className="text-ink-soft mb-4">{project.description}</p>

      <div className="flex flex-wrap gap-2 mb-4">
        {project.tech.map((tech) => (
          <span
            key={tech}
            className="text-xs px-2.5 py-1 rounded-full border border-line-strong text-ink-soft"
          >
            {tech}
          </span>
        ))}
      </div>

      {/* Pinned to the bottom so links line up across a row of uneven cards. */}
      {project.links && project.links.length > 0 && (
        <div className="flex flex-wrap gap-4 mt-auto pt-1">
          {project.links.map((link) => (
            <Link
              key={link.url}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() =>
                event("project_link_clicked", {
                  project: project.slug,
                  link: link.label,
                })
              }
              className="text-sm text-interactive-ink hover:underline"
            >
              {link.label} →
            </Link>
          ))}
        </div>
      )}
    </article>
  );
}
