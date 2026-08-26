"use client";

import Link from "next/link";
import {
  DocumentTextIcon,
  CodeBracketIcon,
  EnvelopeIcon,
} from "@heroicons/react/24/outline";
import HomeContributions from "@/components/home-contributions";
import HighlightCard from "@/components/highlight-card";
import CountUp from "@/components/count-up";
import LatestCommit from "@/components/latest-commit";
import BreadcrumbSchema from "@/components/breadcrumb-schema";
import ProjectCard from "@/components/project-card";
import {
  socialLinks,
  achievements,
  nowBuilding,
  featuredProjects,
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
      <main className="max-w-7xl mx-auto md:px-16 px-6 lg:mt-24 mt-16">
        {/* Hero — full-height, staggered reveal (TSD §5.1) */}
        <section className="relative fold-fit flex flex-col justify-center mb-8 md:mb-16">
          {/* Two columns at lg. The hero previously used 672px of a 1152px
              container and left ~624px of the fold empty on the right, which is
              where the signature was meant to go. Rather than fill it with
              decoration, the proof metrics move there at full size — the
              strongest credibility signal for this audience, in the fold.
              Three grid children keep the mobile order copy -> proof -> actions
              without duplicating the markup. */}
          <div className="relative z-10 grid gap-y-9 lg:grid-cols-[minmax(0,1fr)_18rem] lg:gap-x-16 lg:items-center">
            <div className="max-w-2xl lg:col-start-1 lg:row-start-1">
            <p
              data-aos="fade-up"
              data-aos-duration={500}
              className="font-display uppercase tracking-[0.18em] text-[11px] sm:text-xs text-slate mb-5"
            >
              Senior Staff Software Engineer · The Hartford
            </p>
            <h1
              data-aos="fade-up"
              data-aos-duration={600}
              data-aos-delay={80}
              className="font-sans font-bold tracking-tight text-4xl sm:text-5xl lg:text-6xl mb-6 leading-[1.05]"
            >
              I build the platforms thousands of engineers ship on.
            </h1>
            <p
              data-aos="fade-up"
              data-aos-duration={600}
              data-aos-delay={180}
              className="text-base sm:text-lg text-ink-soft mb-8 max-w-xl leading-relaxed"
            >
              I build the shared tools and automation engineers rely on to ship software — faster, safer, and more consistently. Think of it as building the factory, not the products that roll off it. Increasingly, that means baking AI right into those tools.
            </p>
            </div>

            {/* Proof panel. A row of three small numbers on mobile; a stacked
                panel at lg where it has real room. */}
            <dl
              data-aos="fade-up"
              data-aos-duration={600}
              data-aos-delay={260}
              className="flex flex-wrap gap-x-7 gap-y-4 sm:gap-x-0 lg:flex-col lg:gap-0 lg:col-start-2 lg:row-start-1 lg:row-span-2 lg:rounded-lg lg:border lg:border-line lg:bg-card lg:p-7 lg:shadow-1"
            >
              {heroMetrics.map((metric) => (
                <div
                  key={metric.label}
                  className="flex flex-col sm:px-5 sm:first:pl-0 sm:border-l sm:first:border-l-0 border-line lg:px-0 lg:border-l-0 lg:border-t lg:first:border-t-0 lg:border-line lg:py-4 lg:first:pt-0 lg:last:pb-0"
                >
                  <dd className="text-xl lg:text-3xl font-bold tracking-tight">
                    <CountUp value={metric.value} />
                  </dd>
                  <dt className="text-xs lg:text-sm text-slate mt-1">
                    {metric.label}
                  </dt>
                </div>
              ))}
            </dl>

            <div className="lg:col-start-1 lg:row-start-2">

            {/* Primary CTAs — one filled, one outline (TSD §5.3) */}
            <div
              data-aos="fade-up"
              data-aos-duration={600}
              data-aos-delay={340}
              className="flex flex-wrap md:flex-nowrap gap-4 mb-10 items-center"
            >
              <Link
                href="/resume"
                className="inline-flex items-center px-6 py-3 bg-interactive hover:bg-interactive-hover text-on-interactive font-semibold rounded-lg transition-colors duration-200 md:flex-shrink-0"
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
                className="inline-flex items-center px-6 py-3 border-2 border-line-strong hover:border-interactive font-semibold rounded-lg transition-all duration-200 md:flex-shrink-0"
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

            {/* Social Links — last thing in the hero, so no trailing margin.
                It used to carry `mb-8` below xl, which both added 32px to a
                section already fighting for room on the first screen and
                pulled the visually-centred content up off centre. The gap to
                what follows is the section's own `mb-8 md:mb-16`. */}
            <ul
              data-aos="fade-up"
              data-aos-duration={600}
              data-aos-delay={420}
              className="flex items-center flex-wrap gap-x-5 gap-y-4"
            >
              {socialLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    target="_blank"
                    className="flex items-center border-b border-line group"
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
        </section>

        {/* About Section */}
        <section
          className="py-16 md:py-24"
          data-aos="fade-up"
          data-aos-duration={800}
        >
          <h2 className="font-sans text-3xl sm:text-4xl mb-8 font-bold tracking-tight">
            About Me
          </h2>
          <div className="max-w-3xl space-y-4 text-base sm:text-lg text-ink-soft leading-relaxed">
            <p>
              I design and scale the systems big engineering teams build on — easy to operate, hard to break, and built to grow with the teams that use them.
            </p>
            <p>
              In practice, that means taking the slow, repetitive, mistake-prone parts of building software and making them automatic and safe — the behind-the-scenes plumbing most people never see but every engineer relies on. Increasingly, that means building AI directly into those everyday tools.
            </p>
            <p>
              Beyond the platform, I lead our enterprise hackathons, mentor emerging leaders as a rotation manager and career coach in the company&apos;s Leadership Development Program, and serve on the Central Connecticut State University (CCSU) Computer Science Industry Advisory Board.
            </p>
            <p>
              Outside of work, you&apos;ll usually find me climbing rocks, snowboarding through the woods, or exploring new ideas.
            </p>
          </div>
        </section>

        {/* Highlights — outcome cards + "Now" strip (TSD §5.5b) */}
        <section className="py-16 md:py-24">
          <h2
            data-aos="fade-up"
            data-aos-duration={600}
            className="font-sans text-3xl sm:text-4xl mb-3 font-bold tracking-tight"
          >
            Highlights
          </h2>
          <p
            data-aos="fade-up"
            data-aos-duration={600}
            className="text-sm text-slate mb-8"
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
            className="mt-8 pt-6 border-t border-line"
          >
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
              <p className="font-display uppercase tracking-[0.18em] text-[11px] text-slate">
                Now building
              </p>
              <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-ink-soft">
                {nowBuilding.map((item) => {
                  const label = (
                    <span className="font-medium text-ink">
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
                          className="group inline-flex items-center gap-1 underline decoration-dotted decoration-line-strong underline-offset-4 hover:decoration-interactive-ink focus-visible:decoration-interactive-ink transition-colors"
                        >
                          {label}
                          <span
                            aria-hidden="true"
                            className="text-[11px] text-slate transition-transform group-hover:translate-x-0.5"
                          >
                            ↗
                          </span>
                        </a>
                      ) : (
                        label
                      )}{" "}
                      <span className="text-slate">
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

        {/* Projects — homepage shows only the featured few and hands off to
            /projects for the full list. Keeping one array in constants.ts as the
            source of truth means adding a project never touches this file. */}
        {featuredProjects.length > 0 && (
          <section
            className="py-16 md:py-24"
            data-aos="fade-up"
            data-aos-duration={1000}
          >
            <div className="flex flex-wrap items-baseline justify-between gap-4 mb-8">
              <h2 className="font-sans text-3xl sm:text-4xl font-bold tracking-tight">
                Projects
              </h2>
              <Link
                href="/projects"
                className="text-sm text-interactive-ink hover:underline"
              >
                All projects →
              </Link>
            </div>
            <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-6">
              {featuredProjects.map((project) => (
                <ProjectCard key={project.slug} project={project} />
              ))}
            </div>
          </section>
        )}

        {/* Work Experience (Current Position Only) */}
        <section
          className="py-16 md:py-24"
          data-aos="fade-up"
          data-aos-duration={800}
        >
          <div className="max-w-3xl">
            <h2 className="font-sans text-3xl sm:text-4xl mb-4 font-bold tracking-tight">
              Current Role
            </h2>
            <h3 className="text-2xl font-semibold mb-2">
              Senior Staff Software Engineer — Enterprise Platform Engineering
            </h3>
            <p className="text-lg text-ink-soft mb-4 leading-relaxed">
              I lead the strategy, design, and delivery of The Hartford&apos;s developer platform — the one place 4,000+ engineers go to build, ship, and run their software, on its way to the full 8,000-engineer organization.
            </p>
            <p className="text-base text-ink-soft mb-6 leading-relaxed">
              My focus is making the whole thing automatic, reliable, and secure by default — so engineers hit fewer roadblocks and spend more time on the work that matters.
            </p>
            <ul className="space-y-3 mb-6">
              {[
                "Leading a CEO-sponsored push to make new-engineer setup self-service — the platform already gets a fresh machine productive in hours, down from a 40+ day wait, as it rolls out team-wide.",
                "One consistent set of tools — a command-line app, a desktop app, and editor add-ons — that 1,000+ engineers adopted in the first 90 days.",
                "One command builds any project — and runs the same on your laptop, in the cloud, or on a remote machine. Nothing to set up per project.",
                "Live insight into where engineers lose time: the platform watches its own tools, surfaces the biggest slow-downs, and posts a public health status page anyone can subscribe to.",
                "AI help built right in — ready-to-use skills and assistants that plug into the platform's own data.",
                "Keeping the automated build-test-release systems running reliably across thousands of projects.",
              ].map((item) => (
                <li
                  key={item}
                  className="relative pl-5 text-ink-soft leading-relaxed before:content-['—'] before:absolute before:left-0 before:text-slate"
                >
                  {item}
                </li>
              ))}
            </ul>

            {/* Depth on demand — the dense toolchain lives behind one click so
                the bullets above stay readable for non-specialists, while
                engineers who want the stack can expand it. */}
            <details className="group mb-6 rounded-lg border border-line bg-card/60 px-5 py-4 [&_summary::-webkit-details-marker]:hidden">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-medium">
                <span>The stack behind it</span>
                <span
                  aria-hidden="true"
                  className="font-display text-[10px] uppercase tracking-[0.14em] text-interactive-ink transition-transform group-open:rotate-180"
                >
                  ▾
                </span>
              </summary>
              <p className="mt-3 border-t border-dashed border-line pt-3 text-sm text-ink-soft leading-relaxed">
                Under the hood: a real-time event pipeline (AWS, DynamoDB,
                Snowflake) with ML analysis of developer pain points;
                observability through Splunk and Dynatrace; and an end-to-end
                CI/CD and DevSecOps toolchain — Jenkins, GitHub Actions,
                Harness, AWS CodePipeline, Nexus, SonarQube, Checkmarx —
                supporting 60,000+ pipelines across 70,000+ runs a week, with a
                unified pipeline model designed to consolidate them onto
                platform tooling. AI features ship as MCP-based skills.
              </p>
            </details>

            <p className="text-sm text-ink-soft mb-4">
              <span className="font-medium text-ink">
                Prior:
              </span>{" "}
              migrated 10,000+ code repositories to GitHub Enterprise Cloud; recognized with the 2023 Enterprise Tech Data &amp; Cyber Award.
            </p>
            <p className="text-sm text-slate">
              For my full career history, see{" "}
              <Link href="/resume" className="underline text-interactive-ink">
                my resume
              </Link>
              .
            </p>
          </div>
        </section>

        {/* Open-source activity — calm real-data preview that funnels to /coding */}
        <section
          className="py-16 md:py-24"
          data-aos="fade-up"
          data-aos-duration={800}
        >
          <h2 className="font-sans text-3xl sm:text-4xl font-bold tracking-tight mb-4">
            Open-source activity
          </h2>
          {/* Lead with evergreen substance so the section reads strong even when
              recent public activity is bursty/quiet (the grid is supporting
              texture, not the whole story). */}
          <div className="flex flex-wrap items-baseline gap-x-7 gap-y-2 mb-6 text-sm text-ink-soft">
            <span>
              <span className="font-semibold text-ink">
                30+
              </span>{" "}
              public repositories
            </span>
            <span>
              Building in public since{" "}
              <span className="font-semibold text-ink">
                2014
              </span>
            </span>
          </div>
          <div className="bg-card/70 backdrop-blur-sm border border-line rounded-xl p-6 sm:p-8">
            <HomeContributions username="brignano" />
          </div>
          <p className="text-sm text-slate mt-4">
            For more detailed information, see{" "}
            <Link href="/coding" className="underline text-interactive-ink">
              my coding activity
            </Link>
            .
          </p>
        </section>

        {/* Contact — a standalone full-height finale (TSD §5.1). */}
        <section
          className="min-h-[70vh] flex flex-col justify-center border-t border-line mt-8"
          data-aos="fade-up"
          data-aos-duration={800}
        >
          <h2
            className="font-sans text-4xl sm:text-5xl lg:text-6xl mb-6 font-bold tracking-tight"
          >
            Let&apos;s build something.
          </h2>
          <p className="text-ink-soft mb-10 max-w-2xl text-lg leading-relaxed">
            If you&apos;re building tools that make engineering teams faster — or just want to talk shop about platforms, developer experience, or AI — I&apos;d love to connect.
          </p>
          <div>
            <a
              href="mailto:hi@brignano.io"
              className="inline-flex items-center px-8 py-4 bg-interactive hover:bg-interactive-hover text-on-interactive font-bold text-lg rounded-lg transition-colors duration-200"
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
