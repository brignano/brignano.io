"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDownIcon, ShareIcon } from "@heroicons/react/24/outline";
import type { Experience, ResumeData } from "@/types/resume";
import { groupExperienceByCompany } from "@/lib/experience";
import { GitHubIcon, LinkedinIcon } from "@/lib/social-icons";
import BreadcrumbSchema from "@/components/breadcrumb-schema";
import { useToast } from "@/components/toast-provider";
import { event } from "@/lib/gtag";

// The PDF is generated at build time by app/resume.pdf/route.ts; the hero's
// View PDF button opens /resume.pdf in a new tab, in the browser's viewer.
//
// Layout (proposals/wireframes/resume-digest.html): the same content as the
// PDF, ordered so it reads before you open anything. One primary action, the
// summary as the opening paragraph, each role saying what it was while
// closed, and the long lists (skills, leadership, education, projects) as
// tight rows instead of stacks of cards. On desktop the name, the actions and
// an "on this page" list stay pinned on the left.

const RESUME_BREADCRUMBS = [
  {
    name: "Home",
    url: "https://brignano.io",
  },
  {
    name: "Resume",
    url: "https://brignano.io/resume",
  },
];

const SECTIONS = [
  { id: "experience", label: "Experience" },
  { id: "leadership", label: "Leadership & community" },
  { id: "skills", label: "Skills" },
  { id: "education", label: "Education" },
  { id: "projects", label: "Projects" },
] as const;

// How many highlights the current role shows before "Show all". Older roles
// show their one-sentence summary instead.
const CURRENT_PREVIEW = 3;

const isPresent = (job: { endDate: string }) =>
  String(job.endDate).toLowerCase() === "present";

// "Senior Staff Software Engineer — Enterprise Platform Engineering" reads as
// a title plus the team it sits in; on a phone the one long line wrapped to
// three big lines, so the team goes on a smaller line of its own.
function splitTitle(title: string): [string, string | undefined] {
  const [head, ...rest] = title.split(" — ");
  return [head, rest.length ? rest.join(" — ") : undefined];
}

function DateRange({ start, end }: { start: string; end: string }) {
  const present = String(end).toLowerCase() === "present";
  return (
    <time className="block font-mono text-xs uppercase tracking-[0.08em] text-slate">
      {String(start)} –{" "}
      <span className={present ? "text-ink font-medium" : ""}>
        {String(end)}
      </span>
    </time>
  );
}

function Toggle({
  open,
  controls,
  label,
  onClick,
}: {
  open: boolean;
  controls: string;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-expanded={open}
      aria-controls={controls}
      onClick={onClick}
      data-print-hide
      className="mt-1 inline-flex min-h-9 items-center gap-1.5 self-start text-sm text-interactive-ink hover:underline cursor-pointer rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-interactive-ink"
    >
      {open ? "Show less" : label}
      <ChevronDownIcon
        className={`h-4 w-4 transition-transform duration-150 motion-reduce:transition-none ${open ? "rotate-180" : ""}`}
        aria-hidden="true"
      />
    </button>
  );
}

function RoleCard({
  job,
  index,
  open,
  onToggle,
}: {
  job: Experience;
  index: number;
  open: boolean;
  onToggle: () => void;
}) {
  const current = isPresent(job);
  const [title, team] = splitTitle(job.position);
  const preview = current ? CURRENT_PREVIEW : 0;
  const total = job.highlights.length;
  const bodyId = `role-${index}`;
  const toggleLabel =
    preview > 0 ? `Show all ${total} highlights` : `Show ${total} highlights`;

  return (
    <li
      className="role relative"
      /* Print caps bullets off this rank instead of nth-child, so grouping
         can't hand a second group's first role the current role's larger
         allowance. Mirrors the `index === 0` slice in
         components/resume-pdf.tsx. */
      data-role-rank={index === 0 ? "primary" : "secondary"}
    >
      <span
        aria-hidden="true"
        data-print-hide
        className={`absolute -left-[22px] top-[19px] h-[11px] w-[11px] rounded-full border-2 ${
          current
            ? "border-interactive-ink bg-interactive-ink"
            : "border-line-strong bg-bg"
        }`}
      />
      <div className="role-card bg-card border border-line rounded-lg px-4 py-3.5 sm:px-6 sm:py-5 flex flex-col gap-1">
        <DateRange start={job.startDate} end={job.endDate} />
        <h4 className="text-[17px] font-semibold leading-snug">{title}</h4>
        {team && <p className="text-sm text-ink-soft">{team}</p>}
        {/* Closed, an older role still says what it was; printed, the
            bullets carry that, so the line is screen-only (globals.css). */}
        {job.summary && !current && (
          <p className="role-summary mt-1 text-[14.5px] leading-relaxed text-ink-soft">
            {job.summary}
          </p>
        )}
        <div id={bodyId} className="exp-body">
          <ul className="mt-1.5 list-disc pl-[18px] space-y-1.5 text-[14.5px] leading-relaxed text-ink-soft marker:text-slate">
            {job.highlights.map((highlight, i) => (
              <li key={i} className={open || i < preview ? "" : "hidden"}>
                {highlight}
              </li>
            ))}
          </ul>
          {open && job.technologies && (
            <ul className="job-tech mt-3 flex flex-wrap gap-1.5">
              {job.technologies.map((tech, i) => (
                <li
                  key={i}
                  className="text-xs px-2 py-0.5 bg-surface-active text-ink-soft rounded-sm"
                >
                  {tech}
                </li>
              ))}
            </ul>
          )}
        </div>
        <Toggle
          open={open}
          controls={bodyId}
          label={toggleLabel}
          onClick={onToggle}
        />
      </div>
    </li>
  );
}

function SectionHeading({ id, children }: { id: string; children: string }) {
  return (
    <h2
      id={`${id}-heading`}
      className="text-[22px] sm:text-[24px] font-bold tracking-tight leading-tight"
    >
      {children}
    </h2>
  );
}

// The interactive half of /resume. The data arrives already parsed from
// app/resume/page.tsx (a server component that reads public/resume.yml at
// build time), so the page ships with its content in the HTML: no
// "Loading resume..." flash, nothing for a crawler or link preview to miss,
// and no YAML parser in the client bundle.
export default function ResumeView({ data }: { data: ResumeData }) {
  const { showToast } = useToast();
  const [openRoles, setOpenRoles] = useState<Set<number>>(() => new Set());
  const [openLeads, setOpenLeads] = useState<Set<number>>(() => new Set());

  const handleDownloadPDF = () => {
    event("pdf_downloaded", {
      cta: "resume_download",
      origin: "resume",
      transport_type: "beacon",
    });
  };

  const handleShare = async () => {
    const url = window?.location.href ?? "/resume";
    try {
      if (navigator.share) {
        await navigator.share({
          title: "Anthony Brignano — Resume",
          url,
        });
      } else if (navigator?.clipboard) {
        await navigator.clipboard.writeText(url);
        showToast("Resume link copied to clipboard");
      } else {
        // last resort
        showToast(url);
      }
    } catch (err) {
      // Ignore AbortError (user canceled share dialog)
      if (err instanceof Error && err.name === "AbortError") {
        return;
      }
      // Log other errors silently
      console.error("Share failed", err);
    }
  };

  // Each card toggles independently, and opening one only grows that card,
  // so nothing above a tapped card moves.
  const toggle = (setter: typeof setOpenRoles) => (index: number) =>
    setter((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  const toggleRole = toggle(setOpenRoles);
  const toggleLead = toggle(setOpenLeads);

  const {
    personalInfo,
    summary,
    experience,
    leadership,
    education,
    skills,
    certifications,
    projects,
  } = data;

  const [title, team] = splitTitle(personalInfo.title);
  const currentCompany = experience?.find(isPresent)?.company;
  const sectionShown: Record<(typeof SECTIONS)[number]["id"], boolean> = {
    experience: !!experience?.length,
    leadership: !!leadership?.length,
    skills: !!skills?.length,
    education: !!education?.length,
    projects: !!projects?.length,
  };

  // "On this page" on a phone: a sticky bar of section chips under the header.
  // The current section is highlighted and the bar scrolls sideways to keep it
  // in view, so you can change sections from anywhere on the page.
  const chipBar = useRef<HTMLDivElement>(null);
  const [current, setCurrent] = useState<string | null>(null);

  useEffect(() => {
    const els = SECTIONS.map((x) => document.getElementById(x.id)).filter(
      (el): el is HTMLElement => !!el
    );
    // A section counts as current once its top passes the upper third.
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setCurrent(e.target.id);
        }
      },
      { rootMargin: "-20% 0px -70% 0px" }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const bar = chipBar.current;
    const chip = bar?.querySelector<HTMLElement>('[aria-current="location"]');
    if (!bar || !chip) return;
    bar.scrollTo({
      left: chip.offsetLeft - (bar.clientWidth - chip.clientWidth) / 2,
      behavior: "smooth",
    });
  }, [current]);

  // Secondary actions: round icon buttons on a phone, where four labelled
  // buttons wrapped GitHub onto a line of its own; quiet text links beside
  // the pinned sidebar on desktop, where there is room for the words.
  const secondary =
    "group inline-flex items-center justify-center gap-1 h-10 w-10 rounded-full border border-line-strong text-slate hover:text-ink hover:border-interactive-ink transition-colors cursor-pointer lg:h-auto lg:w-auto lg:min-h-10 lg:border-0 lg:rounded-sm lg:text-sm lg:text-interactive-ink lg:hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-interactive-ink";

  return (
    <>
      <BreadcrumbSchema items={RESUME_BREADCRUMBS} />
      <main className="resume-layout max-w-7xl mx-auto md:px-16 px-6 pb-16 lg:grid lg:grid-cols-[300px_minmax(0,1fr)] lg:gap-x-16 lg:items-start">
        {/* Hero: pinned on the left on desktop, the top of the page on a
            phone. It is pinned at the spot it already sits at, so it never
            slides up to a lower pin while the header hides. On a short screen
            the pin rises just enough to keep the whole column visible. */}
        <aside className="lg:row-span-2 lg:sticky lg:top-[clamp(7rem,calc(100svh-34rem),var(--fold-offset))] flex flex-col gap-2.5">
          <p className="font-mono text-xs uppercase tracking-[0.1em] text-slate">
            Resume
          </p>
          <h1 className="font-sans font-bold tracking-tight text-[34px] lg:text-[40px] leading-[1.1]">
            {personalInfo.name}
          </h1>
          <p className="resume-role text-lg font-semibold leading-snug">
            {title}
            {(team || currentCompany) && (
              <span className="block text-[15px] font-normal text-ink-soft">
                {[team, currentCompany].filter(Boolean).join(" · ")}
              </span>
            )}
          </p>
          <div className="flex flex-wrap gap-x-3.5 gap-y-1 text-[14.5px] text-ink-soft">
            {personalInfo.email && (
              <a
                href={`mailto:${personalInfo.email}`}
                className="hover:text-interactive-ink transition-colors"
              >
                {personalInfo.email}
              </a>
            )}
            {personalInfo.phone && <span>{personalInfo.phone}</span>}
            {personalInfo.location && <span>{personalInfo.location}</span>}
          </div>
          {/* Page actions live here, not in the site header, so they sit
              beside the content they act on. */}
          <div
            className="mt-2 flex flex-wrap items-center gap-3 lg:gap-x-5 lg:gap-y-1"
            data-print-hide
          >
            <a
              href="/resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleDownloadPDF}
              className="btn btn-primary lg:basis-full"
            >
              View PDF
            </a>
            <button
              type="button"
              onClick={handleShare}
              title="Share"
              className={secondary}
            >
              <ShareIcon className="h-5 w-5 lg:hidden" aria-hidden="true" />
              <span className="sr-only lg:not-sr-only">Share</span>
            </button>
            {personalInfo.linkedin && (
              <a
                href={personalInfo.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                title="LinkedIn"
                className={secondary}
              >
                <span className="lg:hidden">{LinkedinIcon}</span>
                <span className="sr-only lg:not-sr-only">LinkedIn ↗</span>
              </a>
            )}
            {personalInfo.github && (
              <a
                href={personalInfo.github}
                target="_blank"
                rel="noopener noreferrer"
                title="GitHub"
                className={secondary}
              >
                <span className="lg:hidden">{GitHubIcon}</span>
                <span className="sr-only lg:not-sr-only">GitHub ↗</span>
              </a>
            )}
          </div>
          <nav
            aria-label="On this page"
            data-print-hide
            className="hidden lg:flex flex-col mt-5 pt-4 border-t border-line"
          >
            <p className="font-mono text-xs uppercase tracking-[0.08em] text-slate mb-1">
              On this page
            </p>
            {SECTIONS.filter((s) => sectionShown[s.id]).map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className="py-1 text-sm text-ink-soft hover:text-ink transition-colors"
              >
                {s.label}
              </a>
            ))}
          </nav>
        </aside>

        {/* Phones: section chips that stay under the header. Sticky inside
            <main>, so it holds for the whole page; --site-header-h (set by the
            header) keeps it just below the header while that is showing. */}
        <div
          ref={chipBar}
          data-print-hide
          className="lg:hidden sticky top-[var(--site-header-h,0px)] z-20 -mx-6 mt-6 flex gap-2 overflow-x-auto border-b border-line bg-bg/90 px-6 py-2.5 backdrop-blur-md transition-[top] duration-300 ease-out motion-reduce:transition-none md:-mx-16 md:px-16 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {SECTIONS.filter((x) => sectionShown[x.id]).map((x) => (
            <a
              key={x.id}
              href={`#${x.id}`}
              aria-current={x.id === current ? "location" : undefined}
              className={`inline-flex min-h-9 shrink-0 items-center rounded-full border px-3.5 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-interactive-ink ${
                x.id === current
                  ? "border-interactive-ink font-semibold text-interactive-ink"
                  : "border-line-strong text-ink-soft hover:text-ink"
              }`}
            >
              {x.label}
            </a>
          ))}
        </div>

        {/* The summary opens the page: no heading, body size. */}
        <p className="resume-summary mt-6 lg:mt-0 lg:col-start-2 max-w-[62ch] text-[16.5px] lg:text-lg leading-relaxed text-ink-soft">
          {summary}
        </p>

        <div className="resume-sections flex flex-col gap-11 mt-11 min-w-0 lg:col-start-2">
          {experience && experience.length > 0 && (
            <section
              id="experience"
              aria-labelledby="experience-heading"
              className="scroll-mt-28 max-lg:scroll-mt-36"
            >
              <SectionHeading id="experience">Experience</SectionHeading>
              {/* Roles are grouped under one header per employer — see
                  lib/experience.ts for why. */}
              <div className="mt-4 flex flex-col gap-8">
                {groupExperienceByCompany(experience).map((group) => (
                  <div key={`${group.company}-${group.endDate}`}>
                    <div className="mb-4">
                      <h3 className="text-base font-semibold">
                        {group.company}
                      </h3>
                      <p className="text-sm text-slate">
                        {[
                          group.location,
                          `${String(group.startDate)} – ${String(group.endDate).toLowerCase() === "present" ? "present" : String(group.endDate)}`,
                          group.roles.length > 1
                            ? `${group.roles.length} roles`
                            : undefined,
                        ]
                          .filter(Boolean)
                          .join(" · ")}
                      </p>
                    </div>
                    <div className="role-track relative pl-[22px]">
                      <div
                        aria-hidden="true"
                        data-print-hide
                        className="absolute left-[5px] top-6 bottom-6 w-px bg-line-strong"
                      />
                      <ol className="role-list flex flex-col gap-3">
                        {group.roles.map(({ job, index }) => (
                          <RoleCard
                            key={index}
                            job={job}
                            index={index}
                            open={openRoles.has(index)}
                            onToggle={() => toggleRole(index)}
                          />
                        ))}
                      </ol>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {leadership && leadership.length > 0 && (
            <section
              id="leadership"
              aria-labelledby="leadership-heading"
              className="scroll-mt-28 max-lg:scroll-mt-36"
            >
              <SectionHeading id="leadership">
                Leadership &amp; community
              </SectionHeading>
              <ul className="lead-grid mt-4 border-t border-line">
                {leadership.map((item, index) => {
                  const open = openLeads.has(index);
                  return (
                    <li
                      key={index}
                      className="py-3.5 border-b border-line flex flex-col gap-0.5"
                    >
                      <h3 className="text-base font-semibold">
                        {item.organization}
                      </h3>
                      <p className="text-sm text-slate">{item.role}</p>
                      {/* The one-liner goes everywhere, print included; the
                          long form is screen-only, behind More. */}
                      {item.description && (
                        <p
                          className={`lead-summary mt-1 text-[14.5px] leading-relaxed text-ink-soft ${open && item.details ? "hidden" : ""}`}
                        >
                          {item.description}
                        </p>
                      )}
                      {item.details && (
                        <>
                          <p
                            id={`lead-${index}`}
                            className={`lead-detail mt-1 text-[14.5px] leading-relaxed text-ink-soft ${open || !item.description ? "" : "hidden"}`}
                          >
                            {item.details}
                          </p>
                          {item.description && (
                            <Toggle
                              open={open}
                              controls={`lead-${index}`}
                              label="More"
                              onClick={() => toggleLead(index)}
                            />
                          )}
                        </>
                      )}
                    </li>
                  );
                })}
              </ul>
            </section>
          )}

          {skills && skills.length > 0 && (
            <section
              id="skills"
              aria-labelledby="skills-heading"
              className="scroll-mt-28 max-lg:scroll-mt-36"
            >
              <SectionHeading id="skills">Skills</SectionHeading>
              <dl className="skill-list mt-4 border-t border-line">
                {skills.map((group) => (
                  <div
                    key={group.category}
                    className="skill-group py-2.5 border-b border-line grid gap-0.5 sm:grid-cols-[200px_minmax(0,1fr)] sm:gap-4 sm:items-baseline"
                  >
                    <dt className="font-mono text-xs uppercase tracking-[0.06em] text-slate">
                      {group.category}
                    </dt>
                    <dd className="text-[15px] leading-normal">
                      {group.items.join(", ")}
                    </dd>
                  </div>
                ))}
              </dl>
            </section>
          )}

          {/* Education prints and is in the downloaded PDF — a resume that
              omits it reads as a gap. */}
          {education && education.length > 0 && (
            <section
              id="education"
              aria-labelledby="education-heading"
              className="scroll-mt-28 max-lg:scroll-mt-36"
            >
              <SectionHeading id="education">Education</SectionHeading>
              <ul className="mt-4 border-t border-line">
                {education.map((edu, index) => {
                  const dates =
                    edu.startDate && edu.endDate
                      ? `${edu.startDate} – ${edu.endDate}`
                      : String(edu.startDate ?? edu.endDate ?? "");
                  return (
                    <li
                      key={index}
                      className="py-3.5 border-b border-line flex flex-col gap-0.5"
                    >
                      <h3 className="text-base font-semibold">
                        {edu.degree}
                        {edu.field && `, ${edu.field}`}
                      </h3>
                      <p className="text-sm text-slate">
                        {[edu.institution, dates].filter(Boolean).join(" · ")}
                      </p>
                      {edu.gpa && (
                        <p className="mt-1 text-[14.5px] text-ink-soft">
                          GPA: {edu.gpa}
                        </p>
                      )}
                      {edu.honors && edu.honors.length > 0 && (
                        <p className="mt-1 text-[14.5px] text-ink-soft">
                          {edu.honors.join(" · ")}
                        </p>
                      )}
                    </li>
                  );
                })}
              </ul>
            </section>
          )}

          {/* Side projects get one line, not a section: /projects has the
              full write-ups and the PDF leaves them out, so a second set of
              descriptions here would only drift. */}
          {projects && projects.length > 0 && (
            <section
              id="projects"
              aria-labelledby="projects-heading"
              className="resume-projects scroll-mt-28 max-lg:scroll-mt-36"
            >
              <SectionHeading id="projects">Projects</SectionHeading>
              <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">
                On the side, I build{" "}
                {projects.map((project, i) => (
                  <span key={project.name}>
                    {i > 0 && (i === projects.length - 1 ? " and " : ", ")}
                    {project.url || project.github ? (
                      <a
                        href={project.url ?? project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-ink underline decoration-line-strong underline-offset-2 hover:text-interactive-ink"
                      >
                        {project.name}
                      </a>
                    ) : (
                      project.name
                    )}
                  </span>
                ))}
                .{" "}
                <a
                  href="/projects"
                  className="text-interactive-ink hover:underline whitespace-nowrap"
                  data-print-hide
                >
                  See all projects →
                </a>
              </p>
            </section>
          )}

          {certifications && certifications.length > 0 && (
            <section aria-labelledby="certifications-heading">
              <SectionHeading id="certifications">
                Certifications
              </SectionHeading>
              <ul className="mt-4 border-t border-line">
                {certifications.map((cert, index) => (
                  <li
                    key={index}
                    className="py-3.5 border-b border-line flex flex-col gap-0.5"
                  >
                    <h3 className="text-base font-semibold">{cert.name}</h3>
                    <p className="text-sm text-slate">
                      {[
                        cert.issuer,
                        cert.date && `Issued ${cert.date}`,
                        cert.expirationDate && `Expires ${cert.expirationDate}`,
                        cert.credentialId && `ID ${cert.credentialId}`,
                      ]
                        .filter(Boolean)
                        .join(" · ")}
                    </p>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </main>
    </>
  );
}
