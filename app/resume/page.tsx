"use client";

import { useEffect, useState } from "react";
import AOS from "aos";
import type { ResumeData } from "@/types/resume";

export default function Home() {
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [shareSupported, setShareSupported] = useState(false);

  useEffect(() => {
    AOS.init();
    setShareSupported(typeof navigator !== "undefined" && !!navigator.share);
  }, []);

  const handleShare = async () => {
    const url = typeof window !== "undefined" ? window.location.href : "/resume";
    try {
      if (navigator.share) {
        await navigator.share({ title: "Anthony Brignano — Resume", url });
      } else {
        await navigator.clipboard.writeText(url);
        alert("Link copied to clipboard");
      }
    } catch (err) {
      console.error("Share failed", err);
    }
  };

  const handleCopy = async () => {
    const url = typeof window !== "undefined" ? window.location.href : "/resume";
    try {
      await navigator.clipboard.writeText(url);
      alert("Link copied to clipboard");
    } catch (err) {
      console.error("Copy failed", err);
    }
  };

  useEffect(() => {
    const fetchResume = async () => {
      try {
        // Get the endpoint from environment variable or use default
        const endpoint =
          process.env.NEXT_PUBLIC_RESUME_ENDPOINT || "/resume.json";
        const response = await fetch(endpoint);

        if (!response.ok) {
          throw new Error(`Failed to fetch resume: ${response.statusText}`);
        }

        const data = await response.json();
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

  if (loading) {
    return (
      <main className="max-w-7xl mx-auto md:px-16 px-6 lg:mt-32 mt-20">
        <div className="text-center">
          <p className="text-lg dark:text-zinc-400 text-zinc-600">
            Loading resume...
          </p>
        </div>
      </main>
    );
  }

  if (error || !resumeData) {
    return (
      <main className="max-w-7xl mx-auto md:px-16 px-6 lg:mt-32 mt-20">
        <div className="text-center">
          <p className="text-lg text-red-600 dark:text-red-400">
            {error || "Failed to load resume data"}
          </p>
        </div>
      </main>
    );
  }

  const { personalInfo, summary, experience, education, skills, certifications, projects } = resumeData;

  return (
    <main className="max-w-7xl mx-auto md:px-16 px-6 lg:mt-32 mt-20">
      {/* Hero Section */}
      <section
        data-aos="fade-down"
        data-aos-duration={500}
        data-aos-once={true}
        className="mb-16 print-no-break print-no-gap"
      >
        <h1 className="font-silkscreen-mono font-semibold tracking-tight text-3xl sm:text-5xl mb-4 lg:leading-[3.7rem] leading-tight">
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
        {/* Social Media Links for screen only (button style) */}
        <div className="flex flex-wrap gap-4 mb-8 print:hidden">
          {personalInfo.website && (
            <a
              href={personalInfo.website}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 border-2 dark:border-zinc-700 border-zinc-300 dark:hover:border-zinc-500 hover:border-zinc-400 font-semibold rounded-lg transition-all duration-200"
            >
              Website
            </a>
          )}
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
          {/* Share button moved to header for better UX */}
        </div>
        {/* single share button removed from here; added next to social links above */}
      </section>

      {/* Social Media Links for print only (horizontal list) */}
      {(personalInfo.website || personalInfo.linkedin || personalInfo.github) && (
        <section className="mb-16 hidden print:block print-no-top">
          <ul className="flex flex-wrap justify-start gap-6 list-none p-0 m-0 print:block print-link-row">
            {personalInfo.website && (
              <li>
                <span>Website: {personalInfo.website}</span>
              </li>
            )}
            {personalInfo.linkedin && (
              <li>
                <span>LinkedIn: {personalInfo.linkedin}</span>
              </li>
            )}
            {personalInfo.github && (
              <li>
                <span>GitHub: {personalInfo.github}</span>
              </li>
            )}
          </ul>
        </section>
      )}

      {/* Summary Section */}
      <section
        data-aos="fade-up"
        data-aos-delay={100}
        data-aos-duration={500}
        data-aos-once={true}
        className="mb-16"
      >
        <h2 className="text-3xl mb-6 font-bold tracking-tight">
          Summary
        </h2>
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
          <h2 className="text-3xl mb-8 font-bold tracking-tight">
            Experience
          </h2>
          <div className="space-y-10">
            {experience.map((job, index) => (
              <div
                key={index}
                className="dark:bg-primary-bg bg-secondary-bg border dark:border-zinc-800 border-zinc-200 p-6 rounded-lg print:no-border-bg"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-xl font-semibold">{job.position}</h3>
                    <p className="text-lg font-medium dark:text-zinc-300 text-zinc-700">
                      {job.company}
                    </p>
                    {job.location && (
                      <p className="text-sm dark:text-zinc-400 text-zinc-600">
                        {job.location}
                      </p>
                    )}
                  </div>
                  <time className="text-sm text-zinc-600 dark:text-zinc-400 tracking-widest uppercase whitespace-nowrap">
                    {job.startDate.toUpperCase()} -{" "}
                    <span
                      className={
                        job.endDate.toLowerCase() === "present"
                          ? "text-primary-color"
                          : ""
                      }
                    >
                      {job.endDate.toUpperCase()}
                    </span>
                  </time>
                </div>
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
                  <div className="flex flex-wrap gap-2">
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
            ))}
          </div>
        </section>
      )}

      {/* Education Section */}
      {education && education.length > 0 && (
        <section
          className="mb-16"
          data-aos="fade-up"
          data-aos-duration={1000}
          data-aos-once={true}
        >
          <h2 className="text-3xl mb-8 font-bold tracking-tight">
            Education
          </h2>
          <div className="space-y-6">
            {education.map((edu, index) => (
              <div
                key={index}
                className="dark:bg-primary-bg bg-secondary-bg border dark:border-zinc-800 border-zinc-200 p-6 rounded-lg print:no-border-bg"
              >
                <h3 className="text-xl font-semibold">{edu.degree}</h3>
                {edu.field && (
                  <p className="text-lg dark:text-zinc-300 text-zinc-700">
                    {edu.field}
                  </p>
                )}
                <p className="font-medium dark:text-zinc-400 text-zinc-600">
                  {edu.institution}
                </p>
                {(edu.startDate || edu.endDate) && (
                  <p className="text-sm dark:text-zinc-400 text-zinc-600 mt-2">
                    {edu.startDate} - {edu.endDate}
                  </p>
                )}
                {edu.gpa && (
                  <p className="text-sm dark:text-zinc-400 text-zinc-600 mt-1">
                    GPA: {edu.gpa}
                  </p>
                )}
                {edu.honors && edu.honors.length > 0 && (
                  <ul className="list-disc list-inside dark:text-zinc-400 text-zinc-600 mt-2">
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
          <h2 className="text-3xl mb-8 font-bold tracking-tight">
            Skills
          </h2>
          <div className="grid md:grid-cols-2 grid-cols-1 gap-6">
            {skills.map((skillGroup, index) => (
              <div
                key={index}
                className="dark:bg-primary-bg bg-secondary-bg border dark:border-zinc-800 border-zinc-200 p-6 rounded-lg print:no-border-bg"
              >
                <h3 className="text-lg font-semibold mb-3">
                  {skillGroup.category}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {skillGroup.items.map((skill, i) => (
                    <span
                      key={i}
                      className="text-sm px-3 py-1 dark:bg-zinc-800 bg-zinc-200 rounded"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
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
          <h2 className="text-3xl mb-8 font-bold tracking-tight">
            Projects
          </h2>
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
                <p className="dark:text-zinc-400 text-zinc-600">{cert.issuer}</p>
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
  );
}
