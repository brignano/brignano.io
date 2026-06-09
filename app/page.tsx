"use client";

import Link from "next/link";
import {
  DocumentTextIcon,
  CodeBracketIcon,
  EnvelopeIcon,
} from "@heroicons/react/24/outline";
import GitHubCalendarClient from "@/components/github-calendar-client";
import LatestCommit from "@/components/latest-commit";
import HeroMotif from "@/components/hero-motif";
import BreadcrumbSchema from "@/components/breadcrumb-schema";
import {
  socialLinks,
  achievements,
  nowBuilding,
  projects,
  heroMetrics,
} from "@/lib/constants";
import { event } from "@/lib/gtag";

const HOME_BREADCRUMBS = [
  {
    name: "Home",
    url: "https://brignano.io",
  },
];

export default function Home() {
  return (
    <>
      <BreadcrumbSchema items={HOME_BREADCRUMBS} />
      <main className="max-w-7xl mx-auto md:px-16 px-6 lg:mt-32 mt-20">
        {/* Hero Section with CTAs */}
        <section className="relative overflow-hidden mb-8 md:mb-24">
          <HeroMotif />
          <div
            data-aos="fade-down"
            data-aos-duration={500}
            data-aos-once={true}
            className="relative z-10 max-w-2xl"
          >
            <p className="font-silkscreen-mono uppercase tracking-[0.18em] text-[11px] sm:text-xs text-primary-color mb-5">
              Platform Engineering · DevEx · AI
            </p>
            <h1 className="font-incognito font-bold tracking-tight text-4xl sm:text-5xl lg:text-6xl mb-6 leading-[1.1]">
              I build the platforms thousands of engineers ship on.
            </h1>
            <p className="text-base sm:text-lg dark:text-zinc-400 text-zinc-600 mb-8 max-w-xl">
              Internal developer platforms, CI/CD ecosystems, and DevOps intelligence that make software delivery safer, faster, and more reliable — with a growing emphasis on AI-native tooling.
            </p>

            {/* Metric strip — proof above the fold. Dividers only once the row
                fits on one line (sm+); plain gap on mobile to avoid a dangling
                divider when items wrap. */}
            <dl className="flex flex-wrap gap-x-7 gap-y-4 sm:gap-x-0 mb-9">
              {heroMetrics.map((metric) => (
                <div
                  key={metric.label}
                  className="flex flex-col sm:px-5 sm:first:pl-0 sm:border-l sm:first:border-l-0 dark:border-zinc-800 border-zinc-200"
                >
                  <dd className="text-xl font-bold tracking-tight">
                    {metric.value}
                  </dd>
                  <dt className="text-xs dark:text-zinc-400 text-zinc-500 mt-1">
                    {metric.label}
                  </dt>
                </div>
              ))}
            </dl>

            {/* Primary CTAs — one filled, one outline (TSD §5.3) */}
            <div className="flex flex-wrap md:flex-nowrap gap-4 mb-10 items-center">
              <Link
                href="/resume"
                className="inline-flex items-center px-6 py-3 bg-violet-600 hover:bg-violet-500 text-white font-semibold rounded-lg transition-colors duration-200 md:flex-shrink-0"
                onClick={() => {
                  event("cta_clicked", {
                    cta: "resume",
                    location: "hero",
                    transport_type: "beacon",
                  });
                }}
              >
                Resume
                <DocumentTextIcon className="ml-2 w-4 h-4" aria-hidden="true" />
              </Link>
              <Link
                href="/coding"
                className="inline-flex items-center px-6 py-3 border-2 dark:border-zinc-700 border-zinc-300 dark:hover:border-zinc-500 hover:border-zinc-400 font-semibold rounded-lg transition-all duration-200 md:flex-shrink-0"
                onClick={() => {
                  event("cta_clicked", {
                    cta: "coding_activity",
                    location: "hero",
                    transport_type: "beacon",
                  });
                }}
              >
                Coding Activity
                <CodeBracketIcon className="ml-2 w-4 h-4" aria-hidden="true" />
              </Link>
            </div>

            {/* Social Links */}
            <ul className="flex items-center flex-wrap gap-x-5 gap-y-4 xl:mb-0 mb-8">
              {socialLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    target="_blank"
                    className="flex items-center border-b dark:border-b-zinc-800 border-zinc-200 group"
                    onClick={() => {
                      const ctaName = String(link.name)
                        .toLowerCase()
                        .replace(/\s+/g, "_");
                      event("social_link_clicked", {
                        cta: ctaName,
                        href: link.href,
                        transport_type: "beacon",
                      });
                    }}
                  >
                    {link.icon} <span className="ml-1">{link.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* About Section */}
        <section
          data-aos="fade-up"
          data-aos-duration={1000}
          data-aos-once={true}
        >
          <div style={{ opacity: "1" }}>
            <div>
              <div className="mb-8">
                <h2 className="font-incognito text-4xl mb-8 font-bold tracking-tight">
                  About Me
                </h2>
                <div className="max-w-3xl space-y-4 dark:text-zinc-400 text-zinc-600">
                  <p>
                    I design and scale enterprise developer platforms that are easy to operate, hard to break, and built to grow with the teams that use them.
                  </p>
                  <p>
                    My work focuses on reducing friction and turning software delivery into a repeatable, paved road through automation, strong testing, and security as first-class concerns. My work sits at the intersection of platform engineering, developer experience, and emerging technologies, including AI-enabled tooling.
                  </p>
                  <p>
                    Beyond the platform, I lead our enterprise hackathons, mentor emerging leaders as a rotation manager in the company&apos;s Leadership Development Program, and serve on the Central Connecticut State University (CCSU) Computer Science Industry Advisory Board.
                  </p>
                  <p>
                    Outside of work, you'll usually find me climbing rocks, snowboarding through the woods, or exploring new ideas.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Highlights — outcome cards + "Now" strip (TSD §5.5b) */}
        <section
          className="mb-24"
          data-aos="fade-up"
          data-aos-duration={800}
          data-aos-once={true}
        >
          {/* Tier 1 — quantified outcomes with skill pills */}
          <div className="grid md:grid-cols-2 grid-cols-1 gap-4 auto-rows-fr">
            {achievements.map((achievement, index) => (
              <div
                key={index}
                className="bg-white dark:bg-zinc-900 border dark:border-zinc-800 border-zinc-200 rounded-md px-6 py-5 shadow-sm h-full flex flex-col"
              >
                <p className="text-base font-semibold tracking-tight mb-3">
                  {achievement.outcome}
                </p>
                <div className="flex flex-wrap gap-2 mt-auto">
                  {achievement.skills.map((skill) => (
                    <span
                      key={skill}
                      className="text-xs px-2 py-1 dark:bg-zinc-800 bg-zinc-200 rounded"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Tier 2 — what I'm building now */}
          <div className="mt-6">
            <p className="font-silkscreen-mono uppercase tracking-[0.18em] text-[11px] text-primary-color mb-3">
              Now building
            </p>
            <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm dark:text-zinc-400 text-zinc-600">
              {nowBuilding.map((item) => (
                <li key={item.label}>
                  <span className="font-medium dark:text-zinc-200 text-zinc-800">
                    {item.label}
                  </span>{" "}
                  <span className="dark:text-zinc-500 text-zinc-500">
                    {item.detail}
                  </span>
                </li>
              ))}
            </ul>
            <LatestCommit />
          </div>
        </section>

        {/* Projects Section - Only show if projects exist */}
        {projects.length > 0 && (
          <section
            className="mb-32"
            data-aos="fade-up"
            data-aos-duration={1000}
            data-aos-once={true}
          >
            <div style={{ opacity: "1" }}>
              <div>
                <div className="mb-8">
                  <h2 className="font-incognito text-4xl mb-4 font-bold tracking-tight">
                    Projects
                  </h2>
                </div>
              </div>
            </div>
            <div style={{ opacity: "1" }}>
              <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-6">
                {projects.map((project, index) => (
                  <div
                    key={index}
                    className="bg-white dark:bg-zinc-900 border dark:border-zinc-800 border-zinc-200 rounded-md px-6 py-4 shadow-sm"
                  >
                    <h3 className="text-xl font-semibold mb-3">
                      {project.title}
                    </h3>
                    <p className="dark:text-zinc-400 text-zinc-600 mb-4">
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.tech.map((tech, i) => (
                        <span
                          key={i}
                          className="text-xs px-2 py-1 dark:bg-zinc-800 bg-zinc-200 rounded"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                    {project.links && project.links.length > 0 && (
                      <div className="flex gap-3">
                        {project.links.map((link, i) => (
                          <Link
                            key={i}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-primary-color hover:underline"
                          >
                            {link.label} →
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Work Experience (Current Position Only) */}
        <section
          className="mb-16"
          data-aos="fade-up"
          data-aos-duration={1000}
          data-aos-once={true}
        >
          <div style={{ opacity: 1 }}>
            <div className="max-w-3xl">
              <h2 className="font-incognito text-4xl mb-4 font-bold tracking-tight">
                Current Role
              </h2>
              <h3 className="text-2xl font-semibold mb-2">
                Senior Staff Software Engineer — Enterprise Platform Engineering
              </h3>
              <p className="text-lg dark:text-zinc-300 text-zinc-700 mb-4">
                I lead the strategy, design, and delivery of The Hartford&apos;s internal developer platform — the single pane of glass 8,000+ engineers build on.
              </p>
              <p className="text-base dark:text-zinc-400 text-zinc-600 mb-4">
                My focus is automation, reliability, and security as first-class concerns — reducing operational friction and accelerating developer productivity across the enterprise.
              </p>
              <ul className="list-disc list-inside mb-4 space-y-2">
                <li>
                  On a CEO-sponsored initiative to make developer onboarding self-service — down from a 40+ day baseline.
                </li>
                <li>
                  A unified developer surface — custom CLI, desktop app, and IDE extensions — with 1,000+ engineers active in the first 90 days.
                </li>
                <li>
                  &ldquo;One build command, any stack&rdquo; — the same command builds any project and runs the same on your laptop, in CI, or on a remote machine. Nothing to set up per project.
                </li>
                <li>
                  Real-time DevOps intelligence — an event bus streaming pipeline and CLI/IDE telemetry into AWS, DynamoDB, and Snowflake for ML analysis of developer pain points; upgraded observability (Splunk, Dynatrace) and a live platform health status page with subscribe-able alerts.
                </li>
                <li>
                  Native AI tooling and out-of-the-box skills (MCP, DevOps intelligence layer) built into the platform.
                </li>
                <li>
                  Operate the enterprise CI/CD and DevSecOps toolchain end to end (Jenkins, GitHub Actions, Harness, AWS CodePipeline, Nexus, SonarQube, Checkmarx) keeping thousands of pipelines reliable.
                </li>
              </ul>
              <p className="text-sm dark:text-zinc-400 text-zinc-600 mb-4">
                <span className="font-medium dark:text-zinc-300 text-zinc-700">Prior:</span>{" "}
                migrated 10,000+ repos to GitHub Enterprise Cloud; recognized with the 2023 Enterprise Tech Data &amp; Cyber Award.
              </p>
              <p className="text-sm dark:text-zinc-500 text-zinc-500 mt-4">
                For my full career history, see{" "}
                <Link href="/resume" className="underline text-primary-color">
                  my resume
                </Link>
                .
              </p>
            </div>
          </div>
        </section>

        {/* Contribution Graph with Context */}
        <section
          className="mt-10 sm:mt-32 lg:mt-24"
          data-aos="fade-up"
          data-aos-duration={1000}
          data-aos-once={true}
        >
          <div style={{ opacity: "1" }}>
            <div className="mb-4">
              <h2 className="font-incognito text-4xl font-bold tracking-tight mb-4">
                Open-source activity
              </h2>
              <p className="dark:text-zinc-400 text-zinc-600 max-w-2xl">
                GitHub contribution activity by year.
              </p>
            </div>
            <div style={{ opacity: "1", transform: "none" }}>
              <GitHubCalendarClient
                username="brignano"
                initialYear={new Date().getFullYear()}
              />
            </div>
          </div>
          <p className="text-sm dark:text-zinc-500 text-zinc-500 mt-4">
            For more detailed information, see{" "}
            <Link href="/coding" className="underline text-primary-color">
              my coding activity
            </Link>
            .
          </p>
        </section>

        {/* Contact CTA - Prominent Final Section */}
        <section
          className="mt-10 sm:mt-32 lg:mt-24"
          data-aos="fade-up"
          data-aos-duration={1000}
          data-aos-once={true}
        >
          <div className="dark:bg-primary-bg bg-zinc-50 dark:border-zinc-800 border-zinc-200 border-2 p-16 rounded-xl text-center">
            <h2 className="font-incognito text-4xl mb-6 font-bold tracking-tight">
              Let&apos;s build something.
            </h2>
            <p className="dark:text-zinc-400 text-zinc-600 mb-10 max-w-2xl mx-auto text-lg">
              If you're working on platform engineering, developer experience, or AI-native software delivery, I'd love to connect.
            </p>
            <div className="flex justify-center">
              <a
                href="mailto:hi@brignano.io"
                className="inline-flex items-center px-8 py-4 bg-violet-600 hover:bg-violet-500 text-white font-bold text-lg rounded-lg transition-colors duration-200"
                onClick={() => {
                  event("cta_clicked", {
                    cta: "contact_bottom",
                    location: "bottom",
                    transport_type: "beacon",
                  });
                }}
              >
                <EnvelopeIcon className="w-5 h-5 mr-2" aria-hidden="true" />
                Get in touch
              </a>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
