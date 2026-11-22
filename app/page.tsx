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
                  className="w-14 h-14 sm:w-16 sm:h-16 rounded-full object-cover border border-line"
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

            {/* Beside the headline at `lg` (under the buttons below it): a
                few plain facts set as annotations, not a card. The headshot
                card that used to sit here repeated the photo next to the
                name; the face now stays by "Hi, I'm Anthony" at every size.
                Wireframe: proposals/wireframes/the-cursor.html. */}
            <dl
              data-aos="fade-up"
              data-aos-duration={600}
              data-aos-delay={260}
              className="order-last lg:order-none grid grid-cols-2 lg:grid-cols-1 gap-x-6 gap-y-4 lg:gap-y-5 lg:col-start-2 lg:row-start-1 lg:row-span-2 lg:self-end lg:border-l lg:border-line lg:pl-7 pt-2 lg:pt-0"
            >
              {[
                { value: <CountUp value={heroMetrics[0].value} />, label: heroMetrics[0].label },
                { value: "2,000+", label: "devices run the desktop app I built" },
                { value: SITE_LOCATION, label: "where I'm based" },
                { value: "Off the clock", label: "climbing, snowboarding" },
              ].map((fact) => (
                <div key={fact.label} className="flex flex-col-reverse">
                  <dt className="font-mono text-xs text-slate mt-1">{fact.label}</dt>
                  <dd className="text-xl lg:text-2xl font-bold tracking-tight text-ink">
                    {fact.value}
                  </dd>
                </div>
              ))}
            </dl>

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
                  className="btn btn-lg btn-primary md:flex-shrink-0"
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
                    className="w-4 h-4"
                    aria-hidden="true"
                  />
                </Link>
                {/* The second CTA used to be Coding Activity, the most
                    engineers-only page on the site. Email works for everyone. */}
                <a
                  href="mailto:hi@brignano.io"
                  className="btn btn-lg btn-secondary md:flex-shrink-0"
                  onClick={() => {
                    event("cta_clicked", {
                      cta: "contact",
                      location: "hero",
                      transport_type: "beacon",
                    });
                  }}
                >
                  Get in touch
                  <EnvelopeIcon className="w-4 h-4" aria-hidden="true" />
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
          {/* One list style across the site (home, /notes): a row per
              story with its area, the outcome and the link. Cards are kept
              for things with a picture (/projects). */}
          <ul className="border-t border-line-strong">
            {caseStudies.map((study) => (
              <li key={study.slug} className="border-b border-line">
                <Link
                  href={noteHref(study.slug)}
                  className="group grid gap-1 py-4 md:py-6 md:grid-cols-[12rem_minmax(0,1fr)_auto] md:gap-x-8 md:items-baseline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-interactive-ink rounded-sm"
                >
                  <span className="font-mono text-xs text-slate">
                    {study.home.kicker}
                  </span>
                  <span>
                    <span className="block text-lg md:text-2xl font-semibold tracking-tight leading-snug text-ink text-balance group-hover:underline underline-offset-4 decoration-1">
                      {study.home.headline}
                    </span>
                    <span className="block mt-1 text-sm text-ink-soft leading-relaxed">
                      {study.home.line}
                    </span>
                  </span>
                  <span className="text-sm text-interactive-ink md:text-right whitespace-nowrap">
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
            <ul className="border-t border-line-strong">
              {featuredProjects.map((project) => {
                const link = project.links?.[0];
                const body = (
                  <>
                    <span className="flex items-center gap-3">
                      <span className="text-lg font-semibold tracking-tight text-ink group-hover:underline underline-offset-4 decoration-1">
                        {project.title}
                      </span>
                      <span className="font-mono font-medium uppercase tracking-[0.08em] text-xs text-slate border border-line-strong rounded-full px-2 py-0.5">
                        {project.status}
                      </span>
                    </span>
                    <span className="block mt-1 text-sm text-ink-soft leading-relaxed">
                      {project.blurb}
                    </span>
                    {link && (
                      <span className="block mt-2 md:mt-0 md:col-start-2 md:row-start-1 md:row-span-2 md:self-center text-sm text-interactive-ink whitespace-nowrap">
                        {link.label} ↗
                      </span>
                    )}
                  </>
                );
                const cls =
                  "group block md:grid md:grid-cols-[minmax(0,1fr)_auto] md:gap-x-8 py-4 md:py-5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-interactive-ink rounded-sm";
                return (
                  <li key={project.slug} className="border-b border-line">
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
              className="btn btn-lg btn-primary"
              onClick={() => {
                event("cta_clicked", {
                  cta: "contact_bottom",
                  location: "bottom",
                  transport_type: "beacon",
                });
              }}
            >
              <EnvelopeIcon className="w-5 h-5" aria-hidden="true" />
              Get in touch
            </a>
            <p className="mt-4 text-sm text-slate">hi@brignano.io</p>
          </div>
        </section>
      </main>
    </>
  );
}
