"use client";

import Link from "next/link";
import {
  DocumentTextIcon,
  CodeBracketIcon,
  EnvelopeIcon,
} from "@heroicons/react/24/outline";
import HomeContributions from "@/components/home-contributions";
import HighlightCard from "@/components/highlight-card";
import TrailThread from "@/components/trail-thread";
import CountUp from "@/components/count-up";
import LatestCommit from "@/components/latest-commit";
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
      <TrailThread />
      <main className="max-w-7xl mx-auto md:px-16 px-6 lg:mt-24 mt-16">
        {/* Hero — full-height trailhead with a staggered reveal (TSD §5.1) */}
        <section
          data-trail
          className="relative overflow-hidden min-h-[86vh] flex flex-col justify-center mb-8 md:mb-16"
        >
          <div className="relative z-10 max-w-2xl">
            <p
              data-aos="fade-up"
              data-aos-duration={500}
              className="font-silkscreen-mono uppercase tracking-[0.18em] text-[11px] sm:text-xs text-primary-color mb-5"
            >
              Senior Staff Software Engineer · The Hartford
            </p>
            <h1
              data-aos="fade-up"
              data-aos-duration={600}
              data-aos-delay={80}
              className="font-incognito font-bold tracking-tight text-4xl sm:text-5xl lg:text-6xl mb-6 leading-[1.05]"
            >
              I build the platforms thousands of engineers ship on.
            </h1>
            <p
              data-aos="fade-up"
              data-aos-duration={600}
              data-aos-delay={180}
              className="text-base sm:text-lg dark:text-zinc-400 text-zinc-600 mb-8 max-w-xl leading-relaxed"
            >
              I build the shared tools and automation engineers rely on to ship software — faster, safer, and more consistently. Think of it as building the factory, not the products that roll off it. Increasingly, that means baking AI right into those tools.
            </p>

            {/* Metric strip — proof above the fold. Dividers only once the row
                fits on one line (sm+); plain gap on mobile to avoid a dangling
                divider when items wrap. */}
            <dl
              data-aos="fade-up"
              data-aos-duration={600}
              data-aos-delay={260}
              className="flex flex-wrap gap-x-7 gap-y-4 sm:gap-x-0 mb-9"
            >
              {heroMetrics.map((metric) => (
                <div
                  key={metric.label}
                  className="flex flex-col sm:px-5 sm:first:pl-0 sm:border-l sm:first:border-l-0 dark:border-zinc-800 border-zinc-200"
                >
                  <dd className="text-xl font-bold tracking-tight">
                    <CountUp value={metric.value} />
                  </dd>
                  <dt className="text-xs dark:text-zinc-400 text-zinc-500 mt-1">
                    {metric.label}
                  </dt>
                </div>
              ))}
            </dl>

            {/* Primary CTAs — one filled, one outline (TSD §5.3) */}
            <div
              data-aos="fade-up"
              data-aos-duration={600}
              data-aos-delay={340}
              className="flex flex-wrap md:flex-nowrap gap-4 mb-10 items-center"
            >
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
            <ul
              data-aos="fade-up"
              data-aos-duration={600}
              data-aos-delay={420}
              className="flex items-center flex-wrap gap-x-5 gap-y-4 xl:mb-0 mb-8"
            >
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
          data-trail
          className="py-16 md:py-24"
          data-aos="fade-up"
          data-aos-duration={800}
        >
          <h2 className="font-incognito text-3xl sm:text-4xl mb-8 font-bold tracking-tight">
            About Me
          </h2>
          <div className="max-w-3xl space-y-4 text-base sm:text-lg dark:text-zinc-400 text-zinc-600 leading-relaxed">
            <p>
              I design and scale the systems big engineering teams build on — easy to operate, hard to break, and built to grow with the teams that use them.
            </p>
            <p>
              In practice, that means taking the slow, repetitive, mistake-prone parts of building software and making them automatic and safe — the behind-the-scenes plumbing most people never see but every engineer relies on. Increasingly, that means building AI directly into those everyday tools.
            </p>
            <p>
              Beyond the platform, I lead our enterprise hackathons, mentor emerging leaders as a rotation manager in the company&apos;s Leadership Development Program, and serve on the Central Connecticut State University (CCSU) Computer Science Industry Advisory Board.
            </p>
            <p>
              Outside of work, you&apos;ll usually find me climbing rocks, snowboarding through the woods, or exploring new ideas.
            </p>
          </div>
        </section>

        {/* Highlights — outcome cards + "Now" strip (TSD §5.5b) */}
        <section data-trail className="py-16 md:py-24">
          <h2
            data-aos="fade-up"
            data-aos-duration={600}
            className="font-incognito text-3xl sm:text-4xl mb-3 font-bold tracking-tight"
          >
            Highlights
          </h2>
          <p
            data-aos="fade-up"
            data-aos-duration={600}
            className="text-sm dark:text-zinc-500 text-zinc-500 mb-8"
          >
            New to the jargon? Tap any tag to see what it means in plain English.
          </p>

          {/* Tier 1 — quantified outcomes with tappable skill pills that reveal
              a plain-language definition (components/highlight-card.tsx). */}
          <div className="grid md:grid-cols-2 grid-cols-1 gap-4 items-start">
            {achievements.map((achievement, index) => (
              <HighlightCard
                key={index}
                achievement={achievement}
                index={index}
              />
            ))}
          </div>

          {/* Tier 2 — what I'm building now */}
          <div
            data-aos="fade-up"
            data-aos-duration={600}
            className="mt-8 pt-6 border-t dark:border-zinc-800 border-zinc-200"
          >
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
              <p className="font-silkscreen-mono uppercase tracking-[0.18em] text-[11px] text-primary-color">
                Now building
              </p>
              <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm dark:text-zinc-400 text-zinc-600">
                {nowBuilding.map((item) => {
                  const label = (
                    <span className="font-medium dark:text-zinc-200 text-zinc-800">
                      {item.label}
                    </span>
                  );
                  return (
                    <li key={item.label}>
                      {item.href ? (
                        <a
                          href={item.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group inline-flex items-center gap-1 underline decoration-dotted decoration-zinc-300 dark:decoration-zinc-600 underline-offset-4 hover:decoration-primary-color focus-visible:decoration-primary-color transition-colors"
                        >
                          {label}
                          <span
                            aria-hidden="true"
                            className="text-[11px] text-zinc-400 dark:text-zinc-500 transition-transform group-hover:translate-x-0.5"
                          >
                            ↗
                          </span>
                        </a>
                      ) : (
                        label
                      )}{" "}
                      <span className="dark:text-zinc-500 text-zinc-500">
                        {item.detail}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
            <LatestCommit />
          </div>
        </section>

        {/* Projects Section - Only show if projects exist */}
        {projects.length > 0 && (
          <section
            className="py-16 md:py-24"
            data-aos="fade-up"
            data-aos-duration={1000}
          >
            <h2 className="font-incognito text-3xl sm:text-4xl mb-8 font-bold tracking-tight">
              Projects
            </h2>
            <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-6">
              {projects.map((project, index) => (
                <div
                  key={index}
                  className="bg-white/70 dark:bg-zinc-900/50 backdrop-blur-sm border dark:border-zinc-800 border-zinc-200 rounded-xl px-6 py-4 shadow-sm"
                >
                  <h3 className="text-xl font-semibold mb-3">{project.title}</h3>
                  <p className="dark:text-zinc-400 text-zinc-600 mb-4">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tech.map((tech, i) => (
                      <span
                        key={i}
                        className="text-xs px-2.5 py-1 rounded-full border dark:border-zinc-700 border-zinc-300 dark:text-zinc-400 text-zinc-600"
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
          </section>
        )}

        {/* Work Experience (Current Position Only) */}
        <section
          data-trail
          className="py-16 md:py-24"
          data-aos="fade-up"
          data-aos-duration={800}
        >
          <div className="max-w-3xl">
            <h2 className="font-incognito text-3xl sm:text-4xl mb-4 font-bold tracking-tight">
              Current Role
            </h2>
            <h3 className="text-2xl font-semibold mb-2">
              Senior Staff Software Engineer — Enterprise Platform Engineering
            </h3>
            <p className="text-lg dark:text-zinc-300 text-zinc-700 mb-4 leading-relaxed">
              I lead the strategy, design, and delivery of The Hartford&apos;s developer platform — the one place 8,000+ engineers go to build, ship, and run their software.
            </p>
            <p className="text-base dark:text-zinc-400 text-zinc-600 mb-6 leading-relaxed">
              My focus is making the whole thing automatic, reliable, and secure by default — so engineers hit fewer roadblocks and spend more time on the work that matters.
            </p>
            <ul className="space-y-3 mb-6">
              {[
                "Leading a CEO-sponsored push to make setup self-service for new engineers — down from a 40+ day wait.",
                "One consistent set of tools — a command-line app, a desktop app, and editor add-ons — that 1,000+ engineers adopted in the first 90 days.",
                "One command builds any project — and runs the same on your laptop, in the cloud, or on a remote machine. Nothing to set up per project.",
                "Live insight into where engineers lose time: the platform watches its own tools, surfaces the biggest slow-downs, and posts a public health status page anyone can subscribe to.",
                "AI help built right in — ready-to-use skills and assistants that plug into the platform's own data.",
                "Keeping the automated build-test-release systems running reliably across thousands of projects.",
              ].map((item) => (
                <li
                  key={item}
                  className="relative pl-5 dark:text-zinc-400 text-zinc-600 leading-relaxed before:content-['—'] before:absolute before:left-0 before:text-zinc-400 dark:before:text-zinc-600"
                >
                  {item}
                </li>
              ))}
            </ul>

            {/* Depth on demand — the dense toolchain lives behind one click so
                the bullets above stay readable for non-specialists, while
                engineers who want the stack can expand it. */}
            <details className="group mb-6 rounded-lg border dark:border-zinc-800 border-zinc-200 bg-white/60 dark:bg-zinc-900/40 px-5 py-4 [&_summary::-webkit-details-marker]:hidden">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-medium">
                <span>The stack behind it</span>
                <span
                  aria-hidden="true"
                  className="font-silkscreen-mono text-[10px] uppercase tracking-[0.14em] text-primary-color transition-transform group-open:rotate-180"
                >
                  ▾
                </span>
              </summary>
              <p className="mt-3 border-t border-dashed dark:border-zinc-800 border-zinc-200 pt-3 text-sm dark:text-zinc-400 text-zinc-600 leading-relaxed">
                Under the hood: a real-time event pipeline (AWS, DynamoDB,
                Snowflake) with ML analysis of developer pain points;
                observability through Splunk and Dynatrace; and an end-to-end
                CI/CD and DevSecOps toolchain — Jenkins, GitHub Actions,
                Harness, AWS CodePipeline, Nexus, SonarQube, Checkmarx — keeping
                thousands of pipelines reliable. AI features ship as MCP-based
                skills.
              </p>
            </details>

            <p className="text-sm dark:text-zinc-400 text-zinc-600 mb-4">
              <span className="font-medium dark:text-zinc-300 text-zinc-700">
                Prior:
              </span>{" "}
              migrated 10,000+ code repositories to GitHub Enterprise Cloud; recognized with the 2023 Enterprise Tech Data &amp; Cyber Award.
            </p>
            <p className="text-sm dark:text-zinc-500 text-zinc-500">
              For my full career history, see{" "}
              <Link href="/resume" className="underline text-primary-color">
                my resume
              </Link>
              .
            </p>
          </div>
        </section>

        {/* Open-source activity — calm real-data preview that funnels to /coding */}
        <section
          data-trail
          className="py-16 md:py-24"
          data-aos="fade-up"
          data-aos-duration={800}
        >
          <h2 className="font-incognito text-3xl sm:text-4xl font-bold tracking-tight mb-4">
            Open-source activity
          </h2>
          {/* Lead with evergreen substance so the section reads strong even when
              recent public activity is bursty/quiet (the grid is supporting
              texture, not the whole story). */}
          <div className="flex flex-wrap items-baseline gap-x-7 gap-y-2 mb-6 text-sm dark:text-zinc-400 text-zinc-600">
            <span>
              <span className="font-semibold dark:text-zinc-100 text-zinc-900">
                30+
              </span>{" "}
              public repositories
            </span>
            <span>
              Building in public since{" "}
              <span className="font-semibold dark:text-zinc-100 text-zinc-900">
                2014
              </span>
            </span>
          </div>
          <div className="bg-white/70 dark:bg-zinc-900/50 backdrop-blur-sm border dark:border-zinc-800 border-zinc-200 rounded-xl p-6 sm:p-8">
            <HomeContributions username="brignano" />
          </div>
          <p className="text-sm dark:text-zinc-500 text-zinc-500 mt-4">
            For more detailed information, see{" "}
            <Link href="/coding" className="underline text-primary-color">
              my coding activity
            </Link>
            .
          </p>
        </section>

        {/* Contact — the summit: a standalone full-height finale (TSD §5.1).
            The trail's summit node anchors to the heading so the journey ends
            ON the CTA, not in the gap above it. */}
        <section
          className="min-h-[70vh] flex flex-col justify-center border-t dark:border-zinc-800 border-zinc-200 mt-8"
          data-aos="fade-up"
          data-aos-duration={800}
        >
          <h2
            data-trail="summit"
            className="font-incognito text-4xl sm:text-5xl lg:text-6xl mb-6 font-bold tracking-tight"
          >
            Let&apos;s build something.
          </h2>
          <p className="dark:text-zinc-400 text-zinc-600 mb-10 max-w-2xl text-lg leading-relaxed">
            If you&apos;re building tools that make engineering teams faster — or just want to talk shop about platforms, developer experience, or AI — I&apos;d love to connect.
          </p>
          <div>
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
        </section>
      </main>
    </>
  );
}
