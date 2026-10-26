"use client";

import Image from "next/image";
import Link from "next/link";
import { DocumentTextIcon, EnvelopeIcon } from "@heroicons/react/24/outline";
import HomeContributions from "@/components/home-contributions";
import HighlightCard from "@/components/highlight-card";
import CountUp from "@/components/count-up";
import LatestCommit from "@/components/latest-commit";
import BreadcrumbSchema from "@/components/breadcrumb-schema";
import ProjectCard from "@/components/project-card";
import CaseStudyCard from "@/components/case-study-card";
import {
  socialLinks,
  achievements,
  nowBuilding,
  featuredProjects,
  lifePhotos,
  heroMetrics,
  SITE_NAME,
  SITE_ROLE,
  SITE_TAGLINE,
} from "@/lib/constants";
import { caseStudies } from "@/lib/work";
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
        <section
          id="top"
          className="relative fold-fit flex flex-col justify-center mb-8 md:mb-16"
        >
          {/* Two columns at lg. The hero previously used 672px of a 1152px
              container and left ~624px of the fold empty on the right, which is
              where the signature was meant to go. Rather than fill it with
              decoration, the proof metrics move there at full size — the
              strongest credibility signal for this audience, in the fold.
              Three grid children keep the mobile order copy -> proof -> actions
              without duplicating the markup. */}
          <div className="relative z-10 grid gap-y-4 sm:gap-y-9 lg:grid-cols-[minmax(0,1fr)_18rem] lg:gap-x-16 lg:items-center">
            <div className="max-w-2xl lg:col-start-1 lg:row-start-1">
              {/* Who, before what. Someone who searched the name should see it
                  confirmed, with a face, before the pitch. The photo sits here
                  below `lg`; at `lg` it moves into the right-hand card. */}
              <div
                data-aos="fade-up"
                data-aos-duration={500}
                className="flex items-center gap-4 mb-4 sm:mb-6"
              >
                <Image
                  src="/headshot.jpeg"
                  alt=""
                  width={64}
                  height={64}
                  priority
                  className="lg:hidden w-14 h-14 sm:w-16 sm:h-16 rounded-full object-cover border border-line"
                />
                <div>
                  <p className="text-base sm:text-lg font-semibold text-ink">
                    Hi, I&apos;m {SITE_NAME}.
                  </p>
                  <p className="text-sm text-slate">{SITE_ROLE}</p>
                </div>
              </div>
              <h1
                data-aos="fade-up"
                data-aos-duration={600}
                data-aos-delay={80}
                className="font-sans font-bold tracking-tight text-4xl sm:text-5xl lg:text-6xl mb-3 sm:mb-6 lg:mb-5 leading-[1.05]"
              >
                {SITE_TAGLINE}.
              </h1>
              <p
                data-aos="fade-up"
                data-aos-duration={600}
                data-aos-delay={180}
                className="text-base sm:text-lg text-ink-soft mb-5 sm:mb-8 lg:mb-6 max-w-xl leading-relaxed"
              >
                I build the shared tools and automation engineers rely on to
                ship software — faster, safer, and more consistently. Think of
                it as building the factory, not the products that roll off it.
                Increasingly, that means baking AI right into those tools.
              </p>
            </div>

            {/* Right-hand card at `lg`: the face, and the one number anyone
                can read. The pipeline and repository counts are real but mean
                nothing outside engineering, so they moved to Current Role. */}
            <div
              data-aos="fade-up"
              data-aos-duration={600}
              data-aos-delay={260}
              className="hidden lg:flex flex-col items-center text-center lg:col-start-2 lg:row-start-1 lg:row-span-2 rounded-lg border border-line bg-card p-6 shadow-1"
            >
              <Image
                src="/headshot.jpeg"
                alt={`Photo of ${SITE_NAME}`}
                width={128}
                height={128}
                priority
                className="w-32 h-32 rounded-full object-cover border border-line"
              />
              <p className="mt-4 font-semibold">{SITE_NAME}</p>
              <p className="text-sm text-slate">Connecticut</p>
              <dl className="mt-5 pt-5 border-t border-line w-full">
                <dd className="text-3xl font-bold tracking-tight">
                  <CountUp value={heroMetrics[0].value} />
                </dd>
                <dt className="text-sm text-slate mt-1">
                  engineers use the platform I lead
                </dt>
              </dl>
            </div>

            <div className="lg:col-start-1 lg:row-start-2">
              {/* Primary CTAs — one filled, one outline (TSD §5.3) */}
              <div
                data-aos="fade-up"
                data-aos-duration={600}
                data-aos-delay={340}
                /* No bottom margin below `sm` — the social row underneath is
                 hidden there, so this is the last thing in the hero.

                 `pr-14` below `sm` keeps the row out of the column the chat
                 launcher floats in (fixed 24px off the bottom-right corner, 48px
                 wide). On a phone this row is the last thing in the fold and
                 the hero is taller than the screen, so padding the section
                 can't lift it clear; narrowing the row instead makes the second
                 button wrap under the first when it would otherwise run under
                 the launcher. scripts/fold-check.mjs asserts this in CI. */
                className="flex flex-wrap md:flex-nowrap gap-3 sm:gap-4 mb-0 sm:mb-8 lg:mb-6 items-center pr-14 sm:pr-0"
              >
                <Link
                  href="/resume"
                  className="inline-flex items-center px-4 sm:px-6 py-3 bg-interactive hover:bg-interactive-hover text-on-interactive font-semibold rounded-lg transition-colors duration-200 md:flex-shrink-0"
                  onClick={() => {
                    event("cta_clicked", {
                      cta: "resume",
                      location: "hero",
                      transport_type: "beacon",
                    });
                  }}
                >
                  Resume
                  <DocumentTextIcon
                    className="ml-2 w-4 h-4"
                    aria-hidden="true"
                  />
                </Link>
                {/* The second CTA used to be Coding Activity, the most
                    engineers-only page on the site. Email works for everyone. */}
                <a
                  href="mailto:hi@brignano.io"
                  className="inline-flex items-center px-4 sm:px-6 py-3 border-2 border-line-strong hover:border-interactive font-semibold rounded-lg transition-all duration-200 md:flex-shrink-0"
                  onClick={() => {
                    event("cta_clicked", {
                      cta: "contact",
                      location: "hero",
                      transport_type: "beacon",
                    });
                  }}
                >
                  Get in touch
                  <EnvelopeIcon className="ml-2 w-4 h-4" aria-hidden="true" />
                </a>
              </div>

              {/* Social Links — hidden below `sm`, where the fold is the scarce
                resource and these three are the weakest claim on it: the exact
                same three links, with icons, sit in the footer of every page.
                Cutting them here is what buys the headline, the paragraph, the
                metrics and both CTAs a place on a phone's first screen without
                touching the copy.

                Last thing in the hero, so no trailing margin either. It used to
                carry `mb-8` below xl, which both added 32px to a section already
                fighting for room and pulled the centred content off centre; the
                gap to what follows is the section's own `mb-8 md:mb-16`. */}
              <ul
                data-aos="fade-up"
                data-aos-duration={600}
                data-aos-delay={420}
                className="hidden sm:flex items-center flex-wrap gap-x-5 gap-y-4"
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
          id="about"
          className="py-16 md:py-24"
          data-aos="fade-up"
          data-aos-duration={800}
        >
          <h2 className="font-sans text-3xl sm:text-4xl mb-8 font-bold tracking-tight">
            About Me
          </h2>
          <div className="max-w-3xl space-y-4 text-base sm:text-lg text-ink-soft leading-relaxed">
            <p>
              I design and scale the systems big engineering teams build on —
              easy to operate, hard to break, and built to grow with the teams
              that use them.
            </p>
            <p>
              In practice, that means taking the slow, repetitive, mistake-prone
              parts of building software and making them automatic and safe —
              the behind-the-scenes plumbing most people never see but every
              engineer relies on. Increasingly, that means building AI directly
              into those everyday tools.
            </p>
            <p>
              Beyond the platform, I lead our enterprise hackathons, mentor
              emerging leaders as a rotation manager and career coach in the
              company&apos;s Leadership Development Program, and serve on the
              Central Connecticut State University (CCSU) Computer Science
              Industry Advisory Board.
            </p>
          </div>
        </section>

        {/* Outside of work — the part of the page for people who searched
            the name rather than the job title. Early on purpose: friends,
            family and dates shouldn't have to scroll past case studies to
            find it. Photos and captions come from lib/constants.ts. */}
        <section
          id="life"
          className="py-16 md:py-24"
          data-aos="fade-up"
          data-aos-duration={800}
        >
          <h2 className="font-sans text-3xl sm:text-4xl mb-4 font-bold tracking-tight">
            Outside of work
          </h2>
          <p className="max-w-3xl text-base sm:text-lg text-ink-soft leading-relaxed mb-8">
            You&apos;ll usually find me outside: climbing, snowboarding through
            the trees, hiking somewhere with a view, or on a wakeboard behind a
            boat.
          </p>
          <ul className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
            {lifePhotos.map((photo) => (
              <li
                key={photo.src}
                className="relative aspect-[4/5] overflow-hidden rounded-lg border border-line bg-card"
              >
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  sizes="(min-width: 768px) 33vw, 50vw"
                  className="object-cover"
                  style={{ objectPosition: photo.position }}
                />
                <span className="absolute bottom-2 left-2 rounded-md bg-black/55 px-2 py-0.5 text-xs font-medium text-white">
                  {photo.caption}
                </span>
              </li>
            ))}
          </ul>
        </section>

        {/* Highlights — outcome cards + "Now" strip (TSD §5.5b) */}
        <section id="highlights" className="py-16 md:py-24">
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
            New to the jargon? Tap any tag to see what it means in plain
            English.
          </p>

          {/* Tier 1 — quantified outcomes with tappable skill pills that reveal
              a plain-language definition (components/highlight-card.tsx). */}
          <div className="grid md:grid-cols-2 grid-cols-1 gap-4">
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
                    <span className="font-medium text-ink">{item.label}</span>
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
                      <span className="text-slate">{item.detail}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
            <LatestCommit />
          </div>
        </section>

        {/* Selected work — the case studies. The highest-signal thing on
            the page for a hiring manager: how the work was done, not just
            that it was. Cards come from lib/work.ts. */}
        <section
          id="work"
          className="py-16 md:py-24"
          data-aos="fade-up"
          data-aos-duration={800}
        >
          <div className="flex flex-wrap items-baseline justify-between gap-4 mb-3">
            <h2 className="font-sans text-3xl sm:text-4xl font-bold tracking-tight">
              Selected work
            </h2>
            <Link
              href="/work"
              className="text-sm text-interactive-ink hover:underline"
            >
              About these write-ups →
            </Link>
          </div>
          <p className="text-sm text-slate mb-8 max-w-2xl">
            The problem, the constraints, what I built, and what changed.
            Nothing stated that isn&apos;t documented and current.
          </p>
          <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-6">
            {caseStudies.map((study) => (
              <CaseStudyCard key={study.slug} study={study} />
            ))}
          </div>
        </section>

        {/* Projects — homepage shows only the featured few and hands off to
            /projects for the full list. Keeping one array in constants.ts as the
            source of truth means adding a project never touches this file. */}
        {featuredProjects.length > 0 && (
          <section
            id="projects"
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
          id="role"
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
              I lead the strategy, design, and delivery of The Hartford&apos;s
              developer platform — the one place 4,000+ engineers go to build,
              ship, and run their software, on its way to the full
              8,000-engineer organization.
            </p>
            <p className="text-base text-ink-soft mb-6 leading-relaxed">
              My focus is making the whole thing automatic, reliable, and secure
              by default — so engineers hit fewer roadblocks and spend more time
              on the work that matters.
            </p>
            {/* The platform's scale, moved here from the hero: meaningful to
                engineers and recruiters, noise to everyone else. */}
            <dl className="flex flex-wrap gap-x-8 gap-y-4 mb-6">
              {heroMetrics.map((metric) => (
                <div key={metric.label} className="flex flex-col">
                  <dd className="text-2xl font-bold tracking-tight">
                    <CountUp value={metric.value} />
                  </dd>
                  <dt className="text-sm text-slate mt-1">{metric.label}</dt>
                </div>
              ))}
            </dl>
            <ul className="space-y-3 mb-6">
              {[
                "Leading a CEO-sponsored push to make new-engineer setup self-service — the platform already gets a fresh machine productive in hours, down from a 40+ day wait, as it rolls out team-wide.",
                "One consistent set of tools — a command-line app, a desktop app, and editor add-ons — that 1,000+ engineers adopted in the first 90 days.",
                "One command builds any project, the same way on every laptop, with nothing to set up per project. Running that same build on platform compute instead of the laptop is in progress.",
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
                supporting 95,000+ pipelines, with a unified pipeline model
                designed to consolidate them onto platform tooling. AI features
                ship as MCP-based skills.
              </p>
            </details>

            <p className="text-sm text-ink-soft mb-4">
              <span className="font-medium text-ink">Prior:</span> migrated
              10,000+ code repositories to GitHub Enterprise Cloud (
              <Link
                href="/work/github-enterprise-cloud-migration"
                className="underline text-interactive-ink"
              >
                case study
              </Link>
              ); recognized with the 2023 Enterprise Tech Data &amp; Cyber Award
              for the enterprise GitHub Actions implementation.
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
          id="open-source"
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
              <span className="font-semibold text-ink">30+</span> public
              repositories
            </span>
            <span>
              Building in public since{" "}
              <span className="font-semibold text-ink">2014</span>
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
          id="contact"
          className="min-h-[70vh] flex flex-col justify-center border-t border-line mt-8"
          data-aos="fade-up"
          data-aos-duration={800}
        >
          <h2 className="font-sans text-4xl sm:text-5xl lg:text-6xl mb-6 font-bold tracking-tight">
            Say hello.
          </h2>
          <p className="text-ink-soft mb-10 max-w-2xl text-lg leading-relaxed">
            Whether you want to talk shop about platforms, developer experience,
            or AI, swap climbing and snowboarding stories, or just say hi,
            I&apos;d love to hear from you.
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
