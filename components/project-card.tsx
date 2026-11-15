"use client";

import { useId, useState } from "react";
import {
  ArrowUpRightIcon,
  ChevronDownIcon,
  CommandLineIcon,
  CubeIcon,
  ServerStackIcon,
  SwatchIcon,
} from "@heroicons/react/24/outline";
import type { Project } from "@/lib/constants";
import { event } from "@/lib/gtag";
import ProjectArt from "@/components/project-art";

// Scannable first, detailed on request: a picture of what it does, what it is
// and who it's for, one sentence and one action. The full description, the
// tech and the other links sit behind Details, so the page reads as a set of
// distinct things rather than nine paragraphs (proposals/wireframes/projects-scan.html).

// The practice rows have no picture, just a glyph.
const GLYPHS: Record<string, typeof CubeIcon> = {
  design: SwatchIcon,
  "ai-tools": CommandLineIcon,
  homelab: ServerStackIcon,
};

function track(project: Project, link: string) {
  event("project_link_clicked", { project: project.slug, link });
}

// "live" is the only status in colour: it's the one a visitor can act on
// today. Beta stays neutral so blue keeps meaning "you can click this"
// (DESIGN.md §3). The word always ships with the colour.
function Status({ status }: { status: Project["status"] }) {
  const live = status === "live";
  return (
    <span
      className={`shrink-0 inline-flex items-center gap-1.5 font-mono uppercase tracking-[0.12em] text-[10.5px] leading-none rounded-full border px-2 py-1 ${
        live
          ? "border-success-line bg-success-surface text-success-ink"
          : "border-line-strong text-slate"
      }`}
    >
      {live && <span className="h-1.5 w-1.5 rounded-full bg-success" aria-hidden="true" />}
      {status}
    </span>
  );
}

export default function ProjectCard({
  project,
  variant = "card",
}: {
  project: Project;
  variant?: "card" | "row";
}) {
  const [open, setOpen] = useState(false);
  const detailsId = useId();
  const [primary, ...rest] = project.links ?? [];
  const Glyph = GLYPHS[project.slug] ?? CubeIcon;
  const row = variant === "row";

  const actions = (
    <div className="flex flex-wrap items-center gap-2 mt-2">
      {primary && (
        <a
          href={primary.url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => track(project, primary.label)}
          className="inline-flex items-center gap-1.5 min-h-9 pointer-coarse:min-h-11 px-3.5 rounded-lg bg-interactive text-on-interactive text-sm font-semibold hover:bg-interactive-hover transition-colors"
        >
          {primary.label}
          <ArrowUpRightIcon className="h-3.5 w-3.5" strokeWidth={2.5} aria-hidden="true" />
        </a>
      )}
      <button
        type="button"
        aria-expanded={open}
        aria-controls={detailsId}
        onClick={() => {
          if (!open) event("project_details_opened", { project: project.slug });
          setOpen(!open);
        }}
        className="inline-flex items-center gap-1.5 min-h-9 pointer-coarse:min-h-11 px-3 rounded-lg border border-line-control text-sm text-ink hover:bg-surface-hover transition-colors"
      >
        {open ? "Less" : "Details"}
        <ChevronDownIcon
          className={`h-3.5 w-3.5 transition-transform ${open ? "rotate-180" : ""}`}
          strokeWidth={2.5}
          aria-hidden="true"
        />
      </button>
    </div>
  );

  const details = (
    <div
      id={detailsId}
      hidden={!open}
      className="mt-3 pt-3 border-t border-line text-sm text-ink-soft space-y-3"
    >
      <p>{project.description}</p>
      <p>
        <span className="block font-mono uppercase tracking-[0.08em] text-[11px] text-slate">
          Built with
        </span>
        {project.tech.join(" · ")}
      </p>
      {rest.length > 0 && (
        <p className="flex flex-wrap gap-x-4 gap-y-1">
          {rest.map((link) => (
            <a
              key={link.url}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => track(project, link.label)}
              className="text-interactive-ink hover:underline"
            >
              {link.label} ↗
            </a>
          ))}
        </p>
      )}
    </div>
  );

  if (row) {
    return (
      <article className="grid grid-cols-[44px_1fr] gap-x-3.5 gap-y-1 bg-card border border-line rounded-xl px-4 py-3.5">
        <span
          className="row-span-3 h-11 w-11 rounded-[10px] grid place-items-center project-stage text-mark"
          aria-hidden="true"
        >
          <Glyph className="h-[22px] w-[22px]" />
        </span>
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-[17px] font-bold tracking-tight text-ink">{project.title}</h3>
          <Status status={project.status} />
        </div>
        <p className="text-[14.5px] leading-normal text-ink-soft">{project.blurb}</p>
        <div>{actions}</div>
        <div className="col-span-2">{details}</div>
      </article>
    );
  }

  return (
    <article
      data-mark={project.mark}
      className="bg-card border border-line rounded-xl overflow-hidden shadow-sm transition-colors hover:border-line-strong"
    >
      <div className="project-stage h-[150px] md:h-[190px] grid place-items-center overflow-hidden border-b border-line">
        <ProjectArt slug={project.slug} />
      </div>
      <div className="px-[18px] pt-4 pb-[18px] grid gap-1.5">
        <span className="font-mono uppercase tracking-[0.04em] text-[11.5px] text-slate">
          {project.meta}
        </span>
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-[21px] font-bold tracking-tight text-ink">{project.title}</h3>
          <Status status={project.status} />
        </div>
        <p className="text-[15.5px] leading-normal text-ink-soft">{project.blurb}</p>
        {actions}
        {details}
      </div>
    </article>
  );
}
