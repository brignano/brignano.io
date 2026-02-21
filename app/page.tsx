"use client";

import Link from "next/link";
import GitHubCalendarClient from "@/components/github-calendar-client";
import HeroSVG from "@/components/hero-svg";
import BreadcrumbSchema from "@/components/breadcrumb-schema";
import { socialLinks, highlights, projects } from "@/lib/constants";
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
        <section
          data-aos="fade-down"
          data-aos-duration={500}
          data-aos-once={true}
          className="flex xl:flex-row flex-col xl:items-center items-start xl:justify-center justify-between gap-x-12 mb-16"
        >
          <div className="lg:max-w-2xl max-w-2xl">
            <div style={{ opacity: 1, transform: "none" }}>
              <div>
                <h1 className="font-silkscreen-mono font-semibold tracking-tight text-3xl sm:text-5xl mb-6 lg:leading-[3.7rem] leading-tight lg:min-w-[700px] min-w-full">
                  I design enterprise developer platforms that help thousands of engineers ship software safely and quickly.
                </h1>
                <p className="text-base dark:text-zinc-400 text-zinc-600 mb-8">
                  My work focuses on internal developer platforms, CI/CD ecosystems, and DevOps intelligence that make software delivery safer, faster, and more reliable. I treat developer experience as a product, favoring paved roads, self-service platforms, and opinionated defaults over one-off solutions.
                </p>

                {/* Primary CTAs */}
                <div className="flex flex-wrap md:flex-nowrap gap-4 mb-10 items-center">
                  <a
                    href="mailto:hi@brignano.io"
                    className="inline-flex items-center px-6 py-3 border-2 dark:border-zinc-700 border-zinc-300 dark:hover:border-zinc-500 hover:border-zinc-400 font-semibold rounded-lg transition-all duration-200 md:flex-shrink-0"
                    onClick={() => {
                      event("cta_clicked", {
                        cta: "contact",
                        location: "hero",
                        transport_type: "beacon",
                      });
                    }}
                  >
                    Contact Me
                    <svg
                      className="ml-2 w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </a>
                  <Link
                    href="/resume"
                    className="inline-flex items-center px-6 py-3 border-2 dark:border-zinc-700 border-zinc-300 dark:hover:border-zinc-500 hover:border-zinc-400 font-semibold rounded-lg transition-all duration-200 md:flex-shrink-0"
                    onClick={() => {
                      event("cta_clicked", {
                        cta: "resume",
                        location: "hero",
                        transport_type: "beacon",
                      });
                    }}
                  >
                    View Resume
                    <svg
                      className="ml-2 w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
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
                    <svg
                      className="ml-2 w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 18l6-6-6-6M8 6L2 12l6 6"
                      />
                    </svg>
                  </Link>
                </div>

                {/* Social Links */}
                <div style={{ opacity: 1 }}>
                  <div>
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
                </div>
              </div>
            </div>
          </div>
          <div style={{ opacity: "1" }}>
            <div>
              <HeroSVG />
            </div>
          </div>
        </section>

        {/* About Section */}
        <section
          className="md:mt-32 xl:mt-30"
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
                    My work focuses on reducing friction and turning software delivery into a repeatable, paved road through automation, strong testing, and security as first-class concerns. It sits at the intersection of platform engineering, developer experience, and emerging technologies, including AI-enabled tooling.
                  </p>
                  <p>
                    Outside of work, you'll usually find me climbing rocks, snowboarding the glades, or exploring new ideas.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Highlights Strip */}
        <section
          className="mb-24"
          data-aos="fade-up"
          data-aos-duration={800}
          data-aos-once={true}
        >
          <div className="grid md:grid-cols-3 grid-cols-2 gap-4 auto-rows-fr">
            {highlights.map((highlight, index) => (
              <div
                key={index}
                className="bg-white dark:bg-zinc-900 border dark:border-zinc-800 border-zinc-200 rounded-md px-6 py-4 shadow-sm w-full sm:w-auto text-center h-full min-h-24 flex items-center justify-center"
              >
                <p className="text-sm font-medium">{highlight}</p>
              </div>
            ))}
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
                At The Hartford, I lead the strategy, design, and delivery of the
                enterprise developer platform ecosystem. My work spans CI/CD, security, artifact management, and observability — treating the developer platform as a product used by thousands of engineers.
              </p>
              <p className="text-base dark:text-zinc-400 text-zinc-600 mb-4">
                I own large-scale platform initiatives, including the migration of 11,000+ repositories to GitHub Enterprise Cloud, the design and operation of scalable CI/CD and governance platforms, and the adoption of next-generation developer tooling. My focus is on automation, reliability, and security as first-class concerns-reducing operational friction, lowering incident rates, and accelerating developer productivity across the enterprise.
              </p>
              <ul className="list-disc list-inside mb-4">
                <li>Leading development of AI-native platform capabilities, including MCP servers and a unified DevOps intelligence layer that enables AI agents to safely query and operate enterprise CI/CD systems</li>
                <li>Architecting a first-class enterprise CLI that provides a consistent command surface for build execution, pipeline interaction, and developer workflows across platforms</li>
                <li>Led enterprise migration to GitHub Enterprise Cloud (11,000+ repositories)</li>
                <li>
                  Built and operated CI/CD, governance, and observability
                  platforms
                </li>
                <li>
                  Rolled out next-gen CI/CD tooling, reducing developer-reported
                  incidents
                </li>
                <li>
                  Recognized with the 2023 Enterprise Tech Data & Cyber Award for
                  platform adoption and productivity
                </li>
              </ul>
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
                Contribution Graph
              </h2>
              <p className="dark:text-zinc-400 text-zinc-600 max-w-2xl">
                GitHub contribution activity by year.
              </p>
            </div>
            <div style={{ opacity: "1", transform: "none" }}>
              <GitHubCalendarClient
                username="brignano"
                initialYear={new Date().getFullYear()}
                colorScheme="light"
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
              Want to collaborate or chat?
            </h2>
            <p className="dark:text-zinc-400 text-zinc-600 mb-10 max-w-2xl mx-auto text-lg">
              Interested in platform engineering, developer experience, or AI-native software delivery?
            </p>
            <p className="dark:text-zinc-400 text-zinc-600 mb-10 max-w-2xl mx-auto text-lg">
              I'm always happy to connect with engineers and leaders building internal platforms.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="mailto:hi@brignano.io"
                className="inline-flex items-center px-8 py-4 border-2 dark:border-zinc-600 border-zinc-400 dark:hover:border-zinc-500 hover:border-zinc-500 dark:text-zinc-300 text-zinc-700 font-bold text-lg rounded-lg transition-all duration-200"
                onClick={() => {
                  event("cta_clicked", {
                    cta: "contact_bottom",
                    location: "bottom",
                    transport_type: "beacon",
                  });
                }}
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                Email Me
              </a>
              <a
                href="https://www.linkedin.com/in/brignano"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-8 py-4 border-2 dark:border-zinc-600 border-zinc-400 dark:hover:border-zinc-500 hover:border-zinc-500 dark:text-zinc-300 text-zinc-700 font-bold text-lg rounded-lg transition-all duration-200"
                onClick={() => {
                  event("cta_clicked", {
                    cta: "linkedin_bottom",
                    location: "bottom",
                    transport_type: "beacon",
                  });
                }}
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M20 3H4a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1zM8.339 18.337H5.667v-8.59h2.672v8.59zM7.003 8.574a1.548 1.548 0 1 1 0-3.096 1.548 1.548 0 0 1 0 3.096zm11.335 9.763h-2.669V14.16c0-.996-.018-2.277-1.388-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248h-2.667v-8.59h2.56v1.174h.037c.355-.675 1.227-1.387 2.524-1.387 2.704 0 3.203 1.778 3.203 4.092v4.71z" />
                </svg>
                LinkedIn
              </a>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
