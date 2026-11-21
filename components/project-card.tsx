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

// Status reads at a glance, on design's .pill: live is success (you can use
// it today), proof of concept attention, beta the neutral pill (still
// changing). The word always ships with the colour, so it is never the only
// signal (DESIGN.md §3).
const STATUS: Record<Project["status"], string> = {
  live: "pill pill-success",
  beta: "pill",
  "proof of concept": "pill pill-attention",
};

function Status({ status }: { status: Project["status"] }) {
  return <span className={`shrink-0 ${STATUS[status]}`}>{status}</span>;
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
    <div className="flex flex-wrap items-center gap-x-5 gap-y-1 mt-auto pt-1">
      {primary && (
        <a
          href={primary.url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => track(project, primary.label)}
          className="inline-flex items-center gap-1 min-h-9 pointer-coarse:min-h-11 text-sm font-semibold text-interactive-ink hover:text-interactive-ink-hover hover:underline underline-offset-4"
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
        className="inline-flex items-center gap-1 min-h-9 pointer-coarse:min-h-11 text-sm text-ink-soft hover:text-ink transition-colors"
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
      <article className="h-full grid grid-cols-[44px_1fr] grid-rows-[auto_1fr_auto_auto] gap-x-3.5 gap-y-1 card px-4 py-3.5">
        <span
          className="row-span-3 self-start h-11 w-11 rounded-[10px] grid place-items-center card-stage text-mark"
          aria-hidden="true"
        >
          <Glyph className="h-[22px] w-[22px] p-0" />
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
      className="h-full flex flex-col card p-0 gap-0 transition-colors hover:border-line-strong"
    >
      <div className="shrink-0 card-stage h-[150px] md:h-[190px] grid place-items-center overflow-hidden border-b border-line">
        <ProjectArt slug={project.slug} />
      </div>
      <div className="flex-1 flex flex-col px-[18px] pt-4 pb-[18px] gap-1.5">
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
