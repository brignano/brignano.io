"use client";

import Image from "next/image";
import Link from "next/link";
import { DocumentTextIcon, EnvelopeIcon } from "@heroicons/react/24/outline";
import CountUp from "@/components/count-up";
import BreadcrumbSchema from "@/components/breadcrumb-schema";
import {
  socialLinks,
  featuredProjects,
  heroMetrics,
  SITE_NAME,
  SITE_LOCATION,
  SITE_ROLE,
  SITE_TAGLINE,
} from "@/lib/constants";
import { noteHref } from "@/lib/notes-path";
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
                    Hi, I&apos;m Anthony.
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
                Think of it as the factory, not the products that roll off it:
                the shared tools that help engineers ship software faster and
                more safely.
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
              <p className="text-sm text-slate">{SITE_LOCATION}</p>
              <dl className="mt-5 pt-5 border-t border-line w-full">
                <dd className="text-3xl font-bold tracking-tight">
                  <CountUp value={heroMetrics[0].value} />
                </dd>
                <dt className="text-sm text-slate mt-1">
                  {heroMetrics[0].label}
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
                  className="inline-flex items-center px-4 sm:px-6 py-3 border-2 border-line-strong hover:border-interactive-ink font-semibold rounded-lg transition-all duration-200 md:flex-shrink-0"
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

        {/* The homepage is four sections: who (hero), work, side projects,
            and a sign-off. It used to be nine, and said "4,000+" six times.
            Anything deeper has a page of its own: the full role on /resume,
            the stories on /notes, the commit feed and contribution graph on
            /coding. Before adding a section here, check it says something the
            other three don't. Wireframe: proposals/wireframes/home-digest.html. */}

        {/* Work: one card per case study, led by a headline that reads on its
            own. Card copy is `home` in lib/work.ts. */}
        <section
          id="work"
          className="py-10 md:py-16 border-t border-line"
          data-aos="fade-up"
          data-aos-duration={800}
        >
          <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 mb-2">
            <h2 className="font-sans text-2xl md:text-4xl font-bold tracking-tight">
              Work I&apos;m proud of
            </h2>
            <Link
              href="/resume"
              className="text-sm text-interactive-ink hover:underline"
            >
              Resume →
            </Link>
          </div>
          <p className="text-ink-soft mb-6 md:mb-8">
            Three projects from The Hartford, each with the full story one tap
            away.
          </p>
          <ul className="grid md:grid-cols-3 grid-cols-1 gap-3 md:gap-4">
            {caseStudies.map((study) => (
              <li key={study.slug}>
                <Link
                  href={noteHref(study.slug)}
                  className="group flex h-full flex-col gap-1.5 bg-card border border-line rounded-xl p-5 md:p-6 transition-colors hover:border-line-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-interactive-ink"
                >
                  <p className="eyebrow">
                    {study.home.kicker}
                  </p>
                  <h3 className="mt-1 text-xl md:text-2xl font-bold tracking-tight leading-snug text-ink text-balance group-hover:text-interactive-ink transition-colors">
                    {study.home.headline}
                  </h3>
                  <p className="text-sm text-ink-soft leading-relaxed">
                    {study.home.line}
                  </p>
                  <span className="mt-auto pt-2 text-sm text-interactive-ink">
                    Read the story →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-6 max-w-3xl text-ink-soft leading-relaxed">
            <span className="font-semibold text-ink">Beyond the platform,</span>{" "}
            I lead our enterprise hackathons, mentor in the Leadership
            Development Program, and sit on CCSU&apos;s Computer Science
            Industry Advisory Board.
          </p>
        </section>

        {/* Side projects: the featured three, one line each. The full cards
            live on /projects. */}
        {featuredProjects.length > 0 && (
          <section
            id="projects"
            className="py-10 md:py-16 border-t border-line"
            data-aos="fade-up"
            data-aos-duration={800}
          >
            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 mb-6 md:mb-8">
              <h2 className="font-sans text-2xl md:text-4xl font-bold tracking-tight">
                On the side
              </h2>
              <Link
                href="/projects"
                className="text-sm text-interactive-ink hover:underline"
              >
                All projects →
              </Link>
            </div>
            <ul className="grid md:grid-cols-3 grid-cols-1 gap-3 md:gap-4">
              {featuredProjects.map((project) => {
                const link = project.links?.[0];
                const body = (
                  <>
                    <span className="flex items-center justify-between gap-3">
                      <span className="font-semibold text-ink group-hover:text-interactive-ink transition-colors">
                        {project.title}
                      </span>
                      <span className="font-mono font-medium uppercase tracking-[0.08em] text-xs text-slate border border-line-strong rounded-full px-2 py-0.5">
                        {project.status}
                      </span>
                    </span>
                    <span className="block mt-1 text-sm text-ink-soft leading-relaxed">
                      {project.blurb}
                    </span>
                  </>
                );
                const cls =
                  "group block h-full bg-card border border-line rounded-xl px-5 py-4 transition-colors hover:border-line-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-interactive-ink";
                return (
                  <li key={project.slug}>
                    {link ? (
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={cls}
                        onClick={() => {
                          event("project_link_clicked", {
                            project: project.slug,
                            link: link.label,
                            location: "home",
                            transport_type: "beacon",
                          });
                        }}
                      >
                        {body}
                      </a>
                    ) : (
                      <div className={cls}>{body}</div>
                    )}
                  </li>
                );
              })}
            </ul>
            <p className="mt-6 text-ink-soft">
              More of what I build in public is on{" "}
              <Link href="/coding" className="underline text-interactive-ink">
                my coding page
              </Link>
              .
            </p>
          </section>
        )}

        {/* Sign-off: the personal side lives here now, one photo and a few
            words in Anthony's voice, rather than a grid of tiles. The photo
            is his pick (Nov 2026). Captions and copy state only what he gave. */}
        <section
          id="contact"
          className="py-12 md:py-20 border-t border-line grid md:grid-cols-2 gap-8 md:gap-14 items-center"
          data-aos="fade-up"
          data-aos-duration={800}
        >
          <div className="relative aspect-[4/5] md:aspect-[3/4] max-h-[34rem] w-full overflow-hidden rounded-xl border border-line bg-card">
            <Image
              src="/life/exploring.jpg"
              alt="Anthony on a rock above a turquoise mountain lake, peaks behind"
              fill
              sizes="(min-width: 768px) 45vw, 100vw"
              className="object-cover"
              style={{ objectPosition: "50% 35%" }}
            />
          </div>
          <div>
            <p className="eyebrow mb-3">
              Off the clock
            </p>
            <h2 className="font-sans text-4xl md:text-5xl lg:text-6xl mb-5 font-bold tracking-tight">
              Say hello.
            </h2>
            <p className="text-ink-soft mb-8 max-w-xl text-lg leading-relaxed">
              When I&apos;m not working I&apos;m usually outside: climbing,
              snowboarding through the trees, or hiking somewhere with a view,
              camera in hand. Want to talk platforms or AI, or swap
              snowboarding stories? I&apos;d love to hear from you.
            </p>
            <a
              href="mailto:hi@brignano.io"
              className="inline-flex items-center px-6 py-3 bg-interactive hover:bg-interactive-hover text-on-interactive font-semibold text-lg rounded-lg transition-colors duration-200"
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
            <p className="mt-4 text-sm text-slate">hi@brignano.io</p>
          </div>
        </section>
      </main>
    </>
  );
}
