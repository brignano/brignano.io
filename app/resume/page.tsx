"use client";

import { useEffect, useRef, useState } from "react";
import yaml from "js-yaml";
import type { ResumeData } from "@/types/resume";
import BreadcrumbSchema from "@/components/breadcrumb-schema";
import { SkillBadge } from "@/components/skill-badge";

// The downloadable PDF is generated at build time by app/resume.pdf/route.ts;
// the header's download icon links straight to /resume.pdf.

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
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const EXPERIENCE_ANIMATION_LOCK_MS = 360;
  const experienceCardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const scrollLockTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const toggleExperience = (
    index: number,
    cardElement: HTMLDivElement,
    event: React.MouseEvent<HTMLDivElement> | React.KeyboardEvent<HTMLDivElement>
  ) => {
    // Prevent any default scrolling behavior
    if (event instanceof KeyboardEvent) {
      event.preventDefault();
    }

    // Scroll the card into view only if it's not currently visible
    const rect = cardElement.getBoundingClientRect();

    // Only scroll if the card is out of view (above or below the viewport)
    if (rect.top < 0 || rect.top > window.innerHeight) {
      // Scroll with padding from the top so the header stays visible after expansion
      const paddingFromTop = 80;
      const scrollTop = window.scrollY + rect.top - paddingFromTop;
      window.scrollTo(0, Math.max(0, scrollTop));
    }

    // Disable scrolling during animation
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // Re-enable scrolling after animation completes
    if (scrollLockTimeoutRef.current) {
      clearTimeout(scrollLockTimeoutRef.current);
    }
    scrollLockTimeoutRef.current = setTimeout(() => {
      document.body.style.overflow = originalOverflow;
      scrollLockTimeoutRef.current = null;
    }, EXPERIENCE_ANIMATION_LOCK_MS);

    setExpandedIndex((prev) => (prev === index ? null : index));
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
        const data = yaml.load(yamlText) as ResumeData;
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

  useEffect(() => {
    if (!resumeData || expandedIndex !== null) return;
    const presentIndex = resumeData.experience?.findIndex(
      (job) => String(job.endDate).toLowerCase() === "present"
    );
    if (presentIndex !== undefined && presentIndex >= 0) {
      setExpandedIndex(presentIndex);
    }
  }, [resumeData, expandedIndex]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (scrollLockTimeoutRef.current) {
        clearTimeout(scrollLockTimeoutRef.current);
      }
      document.body.style.overflow = "";
    };
  }, []);

  if (loading) {
    return (
      <>
        <BreadcrumbSchema items={RESUME_BREADCRUMBS} />
        <main className="max-w-7xl mx-auto md:px-16 px-6 lg:mt-32 mt-20">
        <div className="text-center">
          <p className="text-lg dark:text-zinc-400 text-zinc-600">
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
          <p className="text-lg text-red-600 dark:text-red-400">
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
          <p className="text-sm uppercase tracking-wide text-zinc-500 dark:text-zinc-400 mb-2">
            Resume
          </p>
        <h1 className="font-incognito font-bold tracking-tight text-3xl sm:text-5xl mb-4 lg:leading-[3.7rem] leading-tight">
          {personalInfo.name}
        </h1>
        <p className="text-2xl font-semibold dark:text-zinc-300 text-zinc-800 mb-4">
          {personalInfo.title}
        </p>
        <div className="flex flex-wrap gap-4 text-base dark:text-zinc-400 text-zinc-600 mb-6">
          {personalInfo.email && (
            <a
              href={`mailto:${personalInfo.email}`}
              className="hover:text-primary-color transition-colors"
            >
              {personalInfo.email}
            </a>
          )}
          {personalInfo.phone && <span>{personalInfo.phone}</span>}
          {personalInfo.location && <span>{personalInfo.location}</span>}
        </div>
        {/* Social Media Links */}
        <div className="flex flex-wrap gap-4 mb-8" data-print-hide>
          {/* LinkedIn and GitHub */}
          {personalInfo.linkedin && (
            <a
              href={personalInfo.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 border-2 dark:border-zinc-700 border-zinc-300 dark:hover:border-zinc-500 hover:border-zinc-400 font-semibold rounded-lg transition-all duration-200"
            >
              LinkedIn
            </a>
          )}
          {personalInfo.github && (
            <a
              href={personalInfo.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 border-2 dark:border-zinc-700 border-zinc-300 dark:hover:border-zinc-500 hover:border-zinc-400 font-semibold rounded-lg transition-all duration-200"
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
        <p className="text-base dark:text-zinc-400 text-zinc-600 max-w-3xl">
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
            <div className="relative">
              <div
                className="absolute left-4 top-8 bottom-8 w-px -translate-x-1/2 dark:bg-zinc-700 bg-zinc-300"
                data-print-hide
              />
              <div className="space-y-10">
                {experience.map((job, index) => (
                  <div key={index} className="relative">
                    <div
                      className={`absolute left-4 top-8 -translate-x-1/2 h-3 w-3 rounded-full border-2 z-10 ${expandedIndex === index
                          ? "border-zinc-400 bg-secondary-color"
                          : "dark:border-zinc-400 border-zinc-400 dark:bg-zinc-900 bg-zinc-100"
                        }`}
                      data-print-hide
                    />
                    <div
                      ref={(element) => {
                        experienceCardRefs.current[index] = element;
                      }}
                      className={`ml-8 relative dark:bg-primary-bg bg-secondary-bg border dark:border-zinc-800 border-zinc-200 p-6 rounded-lg ${expandedIndex === index ? "cursor-default" : "cursor-pointer"}`}
                      role="button"
                      tabIndex={0}
                      aria-expanded={expandedIndex === index}
                      onClick={(event) =>
                        toggleExperience(index, event.currentTarget, event)
                      }
                      onKeyDown={(event) => {
                        if (event.key === "Enter" || event.key === " ") {
                          toggleExperience(index, event.currentTarget, event);
                        }
                      }}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="text-xl font-semibold hover:text-primary-color transition-colors">
                            {job.position}
                          </h3>
                          <p className="text-lg font-medium dark:text-zinc-300 text-zinc-700">
                            {job.company}
                          </p>
                          <p className="text-sm dark:text-zinc-400 text-zinc-600">
                            {job.location}
                          </p>
                        </div>
                        <time className="text-sm text-zinc-600 dark:text-zinc-400 tracking-widest uppercase whitespace-nowrap">
                          {String(job.startDate).toUpperCase()} -{" "}
                          <span
                            className={
                              String(job.endDate).toLowerCase() === "present"
                                ? "text-primary-color"
                                : ""
                            }
                          >
                            {String(job.endDate).toUpperCase()}
                          </span>
                        </time>
                      </div>
                      <div
                        className={`exp-body transition-all duration-300 overflow-hidden ${expandedIndex === index
                          ? "max-h-[3000px] mt-4"
                          : "max-h-0"
                          }`}
                      >
                        {job.summary && (
                          <p className="tracking-tight dark:text-zinc-400 text-zinc-600 mb-4 italic">
                            {job.summary}
                          </p>
                        )}
                        <ul className="list-disc list-inside dark:text-zinc-400 text-zinc-600 space-y-2 mb-4">
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
                                className="text-xs px-2 py-1 dark:bg-zinc-800 bg-zinc-200 rounded"
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
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
                className="dark:bg-primary-bg bg-secondary-bg border dark:border-zinc-800 border-zinc-200 p-6 rounded-lg"
              >
                <h3 className="text-lg font-semibold">{item.organization}</h3>
                <p className="text-sm text-primary-color font-medium mb-2">
                  {item.role}
                </p>
                {item.description && (
                  <p className="text-sm dark:text-zinc-400 text-zinc-600">
                    {item.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education Section — hidden in print to keep the printed resume to two
          pages (parity with the downloaded PDF, which also omits it). */}
      {education && education.length > 0 && (
        <section
          className="mb-16"
          data-aos="fade-up"
          data-aos-duration={1000}
          data-aos-once={true}
          data-print-hide
        >
          <h2 className="text-3xl mb-8 font-bold tracking-tight">Education</h2>
            <div className="space-y-10">
            {education.map((edu, index) => (
              <div
                key={index}
                className="dark:bg-primary-bg bg-secondary-bg border dark:border-zinc-800 border-zinc-200 p-6 rounded-lg"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-xl font-semibold">{edu.degree}</h3>
                    {edu.field && (
                      <p className="text-lg font-medium dark:text-zinc-300 text-zinc-700">
                        {edu.field}
                      </p>
                    )}
                    <p className="text-sm dark:text-zinc-400 text-zinc-600">
                      {edu.institution}
                    </p>
                  </div>
                  {(edu.startDate || edu.endDate) && (
                    <time className="text-sm text-zinc-600 dark:text-zinc-400 tracking-widest uppercase whitespace-nowrap">
                      {edu.startDate && edu.endDate
                        ? `${String(edu.startDate).toUpperCase()} - ${String(edu.endDate).toUpperCase()}`
                        : String(edu.startDate ?? edu.endDate ?? "").toUpperCase()}
                    </time>
                  )}
                </div>
                {edu.gpa && (
                  <p className="tracking-tight dark:text-zinc-400 text-zinc-600 mb-4 italic">
                    GPA: {edu.gpa}
                  </p>
                )}
                {edu.honors && edu.honors.length > 0 && (
                  <ul className="list-disc list-inside dark:text-zinc-400 text-zinc-600 space-y-2 mb-4">
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
                className="skill-group dark:bg-primary-bg bg-secondary-bg border dark:border-zinc-800 border-zinc-200 p-6 rounded-lg"
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
                className="dark:bg-primary-bg bg-secondary-bg border dark:border-zinc-800 border-zinc-200 p-6 rounded-lg"
              >
                <h3 className="text-xl font-semibold mb-3">{project.name}</h3>
                <p className="dark:text-zinc-400 text-zinc-600 mb-4">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.technologies.map((tech, i) => (
                    <span
                      key={i}
                      className="text-xs px-2 py-1 dark:bg-zinc-800 bg-zinc-200 rounded"
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
                        className="text-sm text-primary-color hover:underline"
                      >
                        View Project →
                      </a>
                    )}
                    {project.github && (
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-primary-color hover:underline"
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
                className="dark:bg-primary-bg bg-secondary-bg border dark:border-zinc-800 border-zinc-200 p-6 rounded-lg"
              >
                <h3 className="text-lg font-semibold">{cert.name}</h3>
                <p className="dark:text-zinc-400 text-zinc-600">
                  {cert.issuer}
                </p>
                {cert.date && (
                  <p className="text-sm dark:text-zinc-400 text-zinc-600 mt-2">
                    Issued: {cert.date}
                  </p>
                )}
                {cert.expirationDate && (
                  <p className="text-sm dark:text-zinc-400 text-zinc-600">
                    Expires: {cert.expirationDate}
                  </p>
                )}
                {cert.credentialId && (
                  <p className="text-xs dark:text-zinc-500 text-zinc-500 mt-2">
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
