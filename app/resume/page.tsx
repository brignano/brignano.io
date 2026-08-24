"use client";

import { useEffect, useState } from "react";
import {
  ArrowDownTrayIcon,
  MinusIcon,
  PlusIcon,
  ShareIcon,
} from "@heroicons/react/24/outline";
import { load as parseYaml } from "js-yaml";
import type { ResumeData } from "@/types/resume";
import { groupExperienceByCompany } from "@/lib/experience";
import BreadcrumbSchema from "@/components/breadcrumb-schema";
import { SkillBadge } from "@/components/skill-badge";
import { useToast } from "@/components/toast-provider";
import { event } from "@/lib/gtag";

// The downloadable PDF is generated at build time by app/resume.pdf/route.ts;
// the hero's download button links straight to /resume.pdf.

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

export default function Home() {
  const { showToast } = useToast();
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedIndices, setExpandedIndices] = useState<Set<number>>(
    new Set()
  );

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

  // Each card toggles independently. Because nothing above a tapped card
  // changes size, its position never shifts — no manual scroll or body-scroll
  // lock is needed (those caused the card to fly off-screen on mobile when an
  // accordion collapsed the taller card above it).
  const toggleExperience = (index: number) => {
    setExpandedIndices((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  useEffect(() => {
    const fetchResume = async () => {
      try {
        // Get the endpoint from environment variable or use default (now YAML)
        const endpoint =
          process.env.NEXT_PUBLIC_RESUME_ENDPOINT || "/resume.yml";
        const response = await fetch(endpoint);

        if (!response.ok) {
          throw new Error(`Failed to fetch resume: ${response.statusText}`);
        }

        const yamlText = await response.text();
        const data = parseYaml(yamlText) as ResumeData;
        setResumeData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load resume");
        console.error("Error loading resume:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchResume();
  }, []);

  // Expand the current ("present") role by default, once, after the data loads.
  useEffect(() => {
    if (!resumeData) return;
    const presentIndex = resumeData.experience?.findIndex(
      (job) => String(job.endDate).toLowerCase() === "present"
    );
    if (presentIndex !== undefined && presentIndex >= 0) {
      setExpandedIndices((prev) => (prev.size > 0 ? prev : new Set([presentIndex])));
    }
  }, [resumeData]);

  if (loading) {
    return (
      <>
        <BreadcrumbSchema items={RESUME_BREADCRUMBS} />
        <main className="max-w-7xl mx-auto md:px-16 px-6 lg:mt-32 mt-20">
        <div className="text-center">
          <p className="text-lg text-ink-soft">
            Loading resume...
          </p>
        </div>
      </main>
      </>
    );
  }

  if (error || !resumeData) {
    return (
      <>
        <BreadcrumbSchema items={RESUME_BREADCRUMBS} />
        <main className="max-w-7xl mx-auto md:px-16 px-6 lg:mt-32 mt-20">
        <div className="text-center">
          <p className="text-lg text-danger-ink">
            {error || "Failed to load resume data"}
          </p>
        </div>
      </main>
      </>
    );
  }

  const {
    personalInfo,
    summary,
    experience,
    leadership,
    education,
    skills,
    certifications,
    projects,
  } = resumeData;

  return (
    <>
      <BreadcrumbSchema items={RESUME_BREADCRUMBS} />
      <main className="max-w-7xl mx-auto md:px-16 px-6 lg:mt-32 mt-20">
      {/* Hero Section */}
      <section
        data-aos="fade-down"
        data-aos-duration={500}
        data-aos-once={true}
        className="mb-16"
      >
          <p className="text-sm uppercase tracking-wide text-slate mb-2">
            Resume
          </p>
        <h1 className="font-sans font-bold tracking-tight text-3xl sm:text-5xl mb-4 lg:leading-[3.7rem] leading-tight">
          {personalInfo.name}
        </h1>
        <p className="text-2xl font-semibold text-ink mb-4">
          {personalInfo.title}
        </p>
        <div className="flex flex-wrap gap-4 text-base text-ink-soft mb-6">
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
        {/* Page actions live here, not in the site header. They used to mount
            and animate into the global header on /resume only, so the chrome
            changed shape as you navigated, and two unlabeled icons in the
            navigation strip read as chrome rather than as things this page
            offers. Labeled, next to the profile links, they are discoverable
            and sit beside the content they act on. */}
        <div className="flex flex-wrap gap-4 mb-8" data-print-hide>
          <a
            aria-label="Download resume as PDF"
            href="/resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleDownloadPDF}
            className="inline-flex items-center gap-2 px-4 py-2 border-2 border-transparent bg-interactive text-on-interactive font-semibold rounded-lg hover:bg-interactive-hover transition-colors duration-200"
          >
            <ArrowDownTrayIcon className="h-5 w-5" />
            Download PDF
          </a>
          <button
            type="button"
            aria-label="Share resume"
            onClick={handleShare}
            className="inline-flex items-center gap-2 px-4 py-2 border-2 border-line-strong hover:border-interactive font-semibold rounded-lg transition-all duration-200 cursor-pointer"
          >
            <ShareIcon className="h-5 w-5" />
            Share
          </button>
          {personalInfo.linkedin && (
            <a
              href={personalInfo.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 border-2 border-line-strong hover:border-interactive font-semibold rounded-lg transition-all duration-200"
            >
              LinkedIn
            </a>
          )}
          {personalInfo.github && (
            <a
              href={personalInfo.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 border-2 border-line-strong hover:border-interactive font-semibold rounded-lg transition-all duration-200"
            >
              GitHub
            </a>
          )}
        </div>
      </section>

      {/* Summary Section */}
      <section
        data-aos="fade-up"
        data-aos-delay={100}
        data-aos-duration={500}
        data-aos-once={true}
        className="mb-16"
      >
        <h2 className="text-3xl mb-6 font-bold tracking-tight">Summary</h2>
        <p className="text-base text-ink-soft max-w-3xl">
          {summary}
        </p>
      </section>

      {/* Experience Section */}
      {experience && experience.length > 0 && (
        <section
          className="mb-16"
          data-aos="fade-up"
          data-aos-duration={1000}
          data-aos-once={true}
        >
          <h2 className="text-3xl mb-8 font-bold tracking-tight">Experience</h2>
          {/* Roles are grouped under one header per employer — see
              lib/experience.ts for why. */}
          <div className="space-y-12">
            {groupExperienceByCompany(experience).map((group) => (
              <div key={`${group.company}-${group.endDate}`}>
                <div className="mb-6">
                  <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                    <h3 className="text-2xl font-bold tracking-tight">
                      {group.company}
                    </h3>
                    <time className="text-sm text-ink-soft tracking-widest uppercase">
                      {String(group.startDate).toUpperCase()} -{" "}
                      <span
                        className={
                          String(group.endDate).toLowerCase() === "present"
                            ? "text-ink"
                            : ""
                        }
                      >
                        {String(group.endDate).toUpperCase()}
                      </span>
                    </time>
                  </div>
                  <p className="text-sm text-ink-soft">
                    {group.location}
                    {group.roles.length > 1 &&
                      ` · ${group.roles.length} roles`}
                  </p>
                </div>
            <div className="relative">
              <div
                className="absolute left-4 top-8 bottom-8 w-px -translate-x-1/2 bg-line-strong"
                data-print-hide
              />
              <div className="space-y-10">
                {group.roles.map(({ job, index }) => {
                  const isOpen = expandedIndices.has(index);
                  const ToggleIcon = isOpen ? MinusIcon : PlusIcon;
                  const dateLine = (className: string) => (
                    <time className={className}>
                      {String(job.startDate).toUpperCase()} -{" "}
                      <span
                        className={
                          String(job.endDate).toLowerCase() === "present"
                            ? "text-ink"
                            : ""
                        }
                      >
                        {String(job.endDate).toUpperCase()}
                      </span>
                    </time>
                  );

                  return (
                  <div
                    key={index}
                    className="relative"
                    /* Print caps bullets off this rank instead of nth-child,
                       so grouping can't hand a second group's first role the
                       current role's larger allowance. Mirrors the
                       `index === 0` slice in components/resume-pdf.tsx. */
                    data-role-rank={index === 0 ? "primary" : "secondary"}
                  >
                    <div
                      className={`absolute left-4 top-8 -translate-x-1/2 h-3 w-3 rounded-full border-2 z-10 ${isOpen
                          ? "border-line-strong bg-interactive"
                          : "border-line-strong bg-bg"
                        }`}
                      data-print-hide
                    />
                    <div
                      className="group ml-8 relative bg-card border border-line p-6 rounded-lg cursor-pointer transition-colors hover:border-interactive focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-interactive-ink"
                      role="button"
                      tabIndex={0}
                      aria-expanded={isOpen}
                      onClick={() => toggleExperience(index)}
                      onKeyDown={(event) => {
                        if (event.key === "Enter" || event.key === " ") {
                          event.preventDefault();
                          toggleExperience(index);
                        }
                      }}
                    >
                      {/* One left-aligned column with the date demoted to a meta
                          line. The date used to sit in its own right-hand
                          column, which stole ~90px from every title and pushed
                          them to 3-4 wrapped lines on mobile. */}
                      <div className="mb-3">
                        {dateLine(
                          "block mb-1.5 text-xs text-ink-soft tracking-widest uppercase"
                        )}
                        {/* Company and location live on the group header now —
                            repeating them on every card was the redundancy
                            that made one tenure look like six jobs. */}
                        <h4 className="text-xl font-semibold hover:text-interactive-ink transition-colors">
                          {job.position}
                        </h4>
                      </div>
                      {/* Disclosure row on the seam where the body opens. A
                          cursor change alone was invisible on touch, so people
                          did not realize these cards open; naming the payoff
                          ("10 highlights") beats a bare glyph at saying what
                          opening one gets you. Plus/minus, not a chevron, so it
                          does not read as a second copy of the up-chevron
                          scroll-to-top button. No rule above it — six dividers
                          down a column of six cards was pure noise. */}
                      <div
                        aria-hidden="true"
                        data-print-hide
                        className="mt-3 flex items-center gap-2 text-sm text-slate group-hover:text-interactive-ink transition-colors"
                      >
                        <ToggleIcon className="h-4 w-4" />
                        {isOpen
                          ? "Hide details"
                          : `${job.highlights.length} highlights`}
                      </div>
                      <div
                        className={`exp-body transition-all duration-300 overflow-hidden ${expandedIndices.has(index)
                          ? "max-h-[3000px] mt-4"
                          : "max-h-0"
                          }`}
                      >
                        {job.summary && (
                          <p className="tracking-tight text-ink-soft mb-4 italic">
                            {job.summary}
                          </p>
                        )}
                        <ul className="list-disc list-inside text-ink-soft space-y-2 mb-4">
                          {job.highlights.map((highlight, i) => (
                            <li key={i} className="text-sm">
                              {highlight}
                            </li>
                          ))}
                        </ul>
                        {job.technologies && (
                          <div className="job-tech flex flex-wrap gap-2">
                            {job.technologies.map((tech, i) => (
                              <span
                                key={i}
                                className="text-xs px-2 py-1 bg-surface-active rounded"
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  );
                })}
              </div>
            </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Leadership & Community Section */}
      {leadership && leadership.length > 0 && (
        <section
          className="mb-16"
          data-aos="fade-up"
          data-aos-duration={1000}
          data-aos-once={true}
        >
          <h2 className="text-3xl mb-8 font-bold tracking-tight">
            Leadership &amp; Community
          </h2>
          <div className="lead-grid grid md:grid-cols-2 grid-cols-1 gap-6">
            {leadership.map((item, index) => (
              <div
                key={index}
                className="bg-card border border-line p-6 rounded-lg"
              >
                <h3 className="text-lg font-semibold">{item.organization}</h3>
                <p className="text-sm text-ink-soft font-medium mb-2">
                  {item.role}
                </p>
                {/* Screen shows the long form; print swaps in the one-liner so
                    the cards stay a single row (globals.css) and the PDF stays
                    two pages (resume-pdf.tsx). */}
                {item.details && (
                  <p className="lead-detail text-sm text-ink-soft">
                    {item.details}
                  </p>
                )}
                {item.description && (
                  <p
                    className={`lead-summary text-sm text-ink-soft ${item.details ? "hidden" : ""}`}
                  >
                    {item.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education prints and is in the downloaded PDF — a resume that omits it
          reads as a gap, and there is room on page two for it. */}
      {education && education.length > 0 && (
        <section
          className="mb-16"
          data-aos="fade-up"
          data-aos-duration={1000}
          data-aos-once={true}
        >
          <h2 className="text-3xl mb-8 font-bold tracking-tight">Education</h2>
            <div className="space-y-10">
            {education.map((edu, index) => (
              <div
                key={index}
                className="bg-card border border-line p-6 rounded-lg"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-xl font-semibold">{edu.degree}</h3>
                    {edu.field && (
                      <p className="text-lg font-medium text-ink-soft">
                        {edu.field}
                      </p>
                    )}
                    <p className="text-sm text-ink-soft">
                      {edu.institution}
                    </p>
                  </div>
                  {(edu.startDate || edu.endDate) && (
                    <time className="text-sm text-ink-soft tracking-widest uppercase whitespace-nowrap">
                      {edu.startDate && edu.endDate
                        ? `${String(edu.startDate).toUpperCase()} - ${String(edu.endDate).toUpperCase()}`
                        : String(edu.startDate ?? edu.endDate ?? "").toUpperCase()}
                    </time>
                  )}
                </div>
                {edu.gpa && (
                  <p className="tracking-tight text-ink-soft mb-4 italic">
                    GPA: {edu.gpa}
                  </p>
                )}
                {edu.honors && edu.honors.length > 0 && (
                  <ul className="list-disc list-inside text-ink-soft space-y-2 mb-4">
                    {edu.honors.map((honor, i) => (
                      <li key={i} className="text-sm">
                        {honor}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills Section */}
      {skills && skills.length > 0 && (
        <section
          className="mb-16"
          data-aos="fade-up"
          data-aos-duration={1000}
          data-aos-once={true}
        >
          <h2 className="text-3xl mb-8 font-bold tracking-tight">Skills</h2>
          <div
            className="grid md:grid-cols-2 grid-cols-1 gap-6"
          >
            {skills.map((skillGroup, index) => (
              <div
                key={index}
                className="skill-group bg-card border border-line p-6 rounded-lg"
              >
                <h3 className="text-lg font-semibold mb-3">
                  {skillGroup.category}
                </h3>
                <ul className="skill-items flex flex-wrap gap-2">
                  {skillGroup.items.map((skill, i) => (
                    <li key={i} className="flex">
                      <SkillBadge name={skill} />
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Projects Section */}
      {projects && projects.length > 0 && (
        <section
          className="mb-16"
          data-aos="fade-up"
          data-aos-duration={1000}
          data-aos-once={true}
        >
          <h2 className="text-3xl mb-8 font-bold tracking-tight">Projects</h2>
          <div className="grid lg:grid-cols-2 grid-cols-1 gap-6">
            {projects.map((project, index) => (
              <div
                key={index}
                className="bg-card border border-line p-6 rounded-lg"
              >
                <h3 className="text-xl font-semibold mb-3">{project.name}</h3>
                <p className="text-ink-soft mb-4">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.technologies.map((tech, i) => (
                    <span
                      key={i}
                      className="text-xs px-2 py-1 bg-surface-active rounded"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
                {(project.url || project.github) && (
                  <div className="flex gap-3">
                    {project.url && (
                      <a
                        href={project.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-interactive-ink hover:underline"
                      >
                        View Project →
                      </a>
                    )}
                    {project.github && (
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-interactive-ink hover:underline"
                      >
                        GitHub →
                      </a>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Certifications Section */}
      {certifications && certifications.length > 0 && (
        <section
          className="mb-16"
          data-aos="fade-up"
          data-aos-duration={1000}
          data-aos-once={true}
        >
          <h2 className="text-3xl mb-8 font-bold tracking-tight">
            Certifications
          </h2>
          <div className="grid md:grid-cols-2 grid-cols-1 gap-6">
            {certifications.map((cert, index) => (
              <div
                key={index}
                className="bg-card border border-line p-6 rounded-lg"
              >
                <h3 className="text-lg font-semibold">{cert.name}</h3>
                <p className="text-ink-soft">
                  {cert.issuer}
                </p>
                {cert.date && (
                  <p className="text-sm text-ink-soft mt-2">
                    Issued: {cert.date}
                  </p>
                )}
                {cert.expirationDate && (
                  <p className="text-sm text-ink-soft">
                    Expires: {cert.expirationDate}
                  </p>
                )}
                {cert.credentialId && (
                  <p className="text-xs text-slate mt-2">
                    ID: {cert.credentialId}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}
    </main>
    </>
  );
}
