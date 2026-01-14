"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { GitHubCalendar } from "react-github-calendar";
import { jobs, socialLinks, highlights, projects } from "@/utils/constants";
import AOS from "aos";
import { track } from "@vercel/analytics";

export default function Home() {
  const [calendarYear, setCalendarYear] = useState(new Date().getFullYear());

  useEffect(() => {
    AOS.init();
  }, []);

  return (
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
                I build secure, reliable cloud-native systems and the platforms teams depend on.
              </h1>
              <p className="text-base dark:text-zinc-400 text-zinc-600 mb-8">
                Full-stack engineer focused on DevSecOps, automation, and
                scalable architecture — helping teams ship faster with stronger
                CI/CD and security-first practices.
              </p>

              {/* Primary CTAs */}
              <div className="flex flex-wrap gap-4 mb-10">
                <a
                  href="mailto:anthony@brignano.io"
                  className="inline-flex items-center px-6 py-3 bg-primary-color hover:bg-opacity-90 text-white dark:text-zinc-900 font-semibold rounded-lg transition-all duration-200"
                  onClick={() => {
                    track("CTA Clicked", { type: "Contact" });
                  }}
                >
                  Contact Me
                </a>
                <a
                  href="https://docs.google.com/document/d/1NIwgN8u-V-1foCZ2Cb5I2KjpnA6birGL0aV9ZDjX5RI/edit?usp=sharing"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-6 py-3 border-2 dark:border-zinc-700 border-zinc-300 dark:hover:border-zinc-500 hover:border-zinc-400 font-semibold rounded-lg transition-all duration-200"
                  onClick={() => {
                    track("CTA Clicked", { type: "Resume" });
                  }}
                >
                  Download Resume
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
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                </a>
              </div>

              {/* Social Links */}
              <div style={{ opacity: 1 }}>
                <div>
                  <ul className="flex items-center flex-wrap gap-x-5 gap-y-4">
                    {socialLinks.map((link) => (
                      <li key={link.name}>
                        <Link
                          href={link.href}
                          target="_blank"
                          className="flex items-center border-b dark:border-b-zinc-800 border-zinc-200 group"
                          onClick={() => {
                            track("Social Link Clicked", {
                              name: link.name,
                              href: link.href,
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
            <svg
              viewBox="0 0 1273 906"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="lg:w-[450px] w-full h-full"
            >
              <g>
                <path
                  className="path"
                  d="M318.587 315.483V510.936L477.544 431.391V236.949M318.587 315.483L159.63 236.949M318.587 315.483L477.544 236.949M318.587 315.483V509.925L159.63 589.469M318.587 315.483L159.63 237.286L0.673828 315.483M318.587 315.483L159.63 394.016M477.544 236.949L318.587 158.753L159.63 236.949M477.544 236.949V432.402M477.544 236.949L318.587 158.416L477.544 80.2192L636.5 158.416L477.544 236.949ZM159.63 236.949V79.5451M159.63 589.469V394.016M159.63 589.469L0.673828 509.925V315.483M0.673828 315.483L159.63 394.016M159.63 79.5451L318.587 1.34863L477.544 79.5451L318.587 158.079L159.63 79.5451ZM795.457 395.701V237.286M795.457 237.286L636.5 159.09L477.544 237.286M795.457 237.286L636.5 315.82M477.544 237.286V431.728L601.139 491.762M477.544 237.286L636.5 315.82M636.5 315.82V472.887M954.414 668.003V473.561M954.414 473.561L795.457 395.364L636.5 473.561L795.457 552.094M954.414 473.561L795.457 552.094M954.414 473.561V669.014M954.414 473.561L795.457 395.027L954.414 316.831L1113.37 395.027L954.414 473.561ZM795.457 552.094L636.5 473.898L477.544 552.094M795.457 552.094L636.5 630.628M477.544 552.094V746.534L636.5 826.078V630.628M477.544 552.094L636.5 630.628M795.457 709.498V904.949M795.457 709.498L636.5 630.965M795.457 709.498L954.414 630.965M795.457 904.949L954.414 825.404V630.965M795.457 904.949L636.5 825.404V630.965M636.5 630.965L795.457 552.768L954.414 630.965M1113.37 552.431V747.882M1113.37 552.431L954.414 473.898M1113.37 552.431L1272.33 473.898M1113.37 747.882L1272.33 668.34V473.898M1113.37 747.882L954.414 668.34V473.898M954.414 473.898L1113.37 395.701L1272.33 473.898"
                  stroke="url(#paint-linear)"
                  strokeOpacity="0.6"
                  strokeWidth="2"
                ></path>
              </g>
              <path
                d="M154 586C154 583.239 156.239 581 159 581V581C161.761 581 164 583.239 164 586V586C164 588.761 161.761 591 159 591V591C156.239 591 154 588.761 154 586V586Z"
                fill="#27B173"
              ></path>
              <path
                d="M154 393C154 390.239 156.239 388 159 388V388C161.761 388 164 390.239 164 393V393C164 395.761 161.761 398 159 398V398C156.239 398 154 395.761 154 393V393Z"
                fill="#27B173"
              ></path>
              <path
                d="M788 551C788 548.239 790.239 546 793 546V546C795.761 546 798 548.239 798 551V551C798 553.761 795.761 556 793 556V556C790.239 556 788 553.761 788 551V551Z"
                fill="#27B173"
              ></path>
              <path
                d="M1108 551C1108 548.239 1110.24 546 1113 546V546C1115.76 546 1118 548.239 1118 551V551C1118 553.761 1115.76 556 1113 556V556C1110.24 556 1108 553.761 1108 551V551Z"
                fill="#27B173"
              ></path>
              <path
                d="M1108 398C1108 395.239 1110.24 393 1113 393V393C1115.76 393 1118 395.239 1118 398V398C1118 400.761 1115.76 403 1113 403V403C1110.24 403 1108 400.761 1108 398V398Z"
                fill="#27B173"
              ></path>
              <path
                d="M788 237C788 234.239 790.239 232 793 232V232C795.761 232 798 234.239 798 237V237C798 239.761 795.761 242 793 242V242C790.239 242 788 239.761 788 237V237Z"
                fill="#27B173"
              ></path>
              <defs>
                <linearGradient
                  id="paint-linear"
                  x1="1272.23"
                  y1="479.474"
                  x2="506.242"
                  y2="-216.277"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#27b173"></stop>
                  <stop offset="0.619553" stopColor="#1a663f"></stop>
                  <stop offset="0.93102" stopColor="#26312d"></stop>
                </linearGradient>
                <clipPath>
                  <rect width="1273" height="906" fill="white"></rect>
                </clipPath>
              </defs>
            </svg>
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
        <div className="grid md:grid-cols-3 grid-cols-2 gap-4">
          {highlights.map((highlight, index) => (
            <div
              key={index}
              className="dark:bg-primary-bg bg-secondary-bg border dark:border-zinc-800 border-zinc-200 p-4 rounded-lg text-center"
            >
              <p className="text-sm font-medium">{highlight}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Projects Section */}
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
            {projects.length > 0 ? (
              projects.map((project, index) => (
                <div
                  key={index}
                  className="dark:bg-primary-bg bg-secondary-bg border dark:border-zinc-800 border-zinc-200 p-6 rounded-lg"
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
                          className="text-sm text-primary-color hover:underline"
                        >
                          {link.label} →
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <>
                <div className="dark:bg-primary-bg bg-secondary-bg border dark:border-zinc-800 border-zinc-200 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold mb-3">
                    Automation & CI/CD Utilities
                  </h3>
                  <p className="dark:text-zinc-400 text-zinc-600">
                    Publishing soon — streamlined tools for modern delivery pipelines.
                  </p>
                </div>
                <div className="dark:bg-primary-bg bg-secondary-bg border dark:border-zinc-800 border-zinc-200 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold mb-3">
                    Observability Baselines
                  </h3>
                  <p className="dark:text-zinc-400 text-zinc-600">
                    Publishing soon — opinionated starters for monitoring and alerting.
                  </p>
                </div>
                <div className="dark:bg-primary-bg bg-secondary-bg border dark:border-zinc-800 border-zinc-200 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold mb-3">
                    Developer Tooling Experiments
                  </h3>
                  <p className="dark:text-zinc-400 text-zinc-600">
                    Publishing soon — explorations in improving developer experience.
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Contribution Graph with Context */}
      <section data-aos="fade-up" data-aos-duration={1000} data-aos-once={true}>
        <div style={{ opacity: "1" }}>
          <div className="mb-8">
            <h2 className="font-incognito text-4xl font-bold tracking-tight mb-4">
              Contribution Graph
            </h2>
            <p className="dark:text-zinc-400 text-zinc-600 max-w-2xl">
              GitHub contribution activity over the past year. Note: Private
              repository contributions may not appear, and the graph reflects
              only public activity on this platform.
            </p>
          </div>
          <div style={{ opacity: "1", transform: "none" }}>
            <div>
              <div className="flex xl:flex-row flex-col gap-4">
                <div className="dark:bg-primary-bg bg-secondary-bg border dark:border-zinc-800 border-zinc-200 p-8 rounded-lg max-w-fit max-h-fit">
                  <GitHubCalendar
                    username="brignano"
                    year={calendarYear}
                    colorScheme={"light"}
                  />
                </div>
                <div className="flex justify-start xl:flex-col flex-row flex-wrap gap-2">
                  {Array.from(
                    { length: 5 },
                    (_, i) => new Date().getFullYear() - i
                  ).map((year) => (
                    <button
                      className={
                        "cursor-pointer rounded-lg text-center px-4 py-2 border border-transparent dark:hover:border-zinc-700 hover:border-zinc-200 duration-100 text-sm font-medium" +
                        " " +
                        (year === calendarYear
                          ? "dark:bg-secondary-color bg-secondary-color dark:hover:border-transparent dark:text-zinc-800 text-white hover:border-transparent"
                          : "dark:bg-primary-bg bg-zinc-50 dark:text-white text-zinc-800")
                      }
                      key={year}
                      title={`View graph for the year ${year}`}
                      onClick={() => setCalendarYear(year)}
                    >
                      {year}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Work Experience */}
      <section
        className="mt-32"
        data-aos="fade-up"
        data-aos-duration={1000}
        data-aos-once={true}
      >
        <div style={{ opacity: "1" }}>
          <div>
            <div className="mb-16">
              <h2 className="font-incognito text-4xl mb-4 font-bold tracking-tight">
                Work Experience
              </h2>
            </div>
          </div>
        </div>
        <div style={{ opacity: "1" }}>
          <div>
            <div className="grid lg:grid-cols-2 grid-cols-1 gap-x-12 gap-y-10">
              {jobs.map((job) => (
                <div
                  key={job.company + job.title}
                  className="flex items-start lg:gap-x-6 gap-x-4 max-w-2xl relative before:absolute before:bottom-0 before:top-[5rem] before:left-9 before:w-[1px] before:h-[calc(100%-70px)] dark:before:bg-zinc-800 before:bg-zinc-200"
                >
                  <Link
                    href={job.url}
                    target="_blank"
                    className="grid place-items-center dark:bg-primary-bg bg-secondary-bg border dark:border-zinc-800 border-zinc-200 min-h-[80px] min-w-[80px] p-2 rounded-md overflow-clip relative"
                  >
                    <Image
                      alt={`${job.company} Logo`}
                      src={job.logo}
                      width={50}
                      height={50}
                      className="dark:invert"
                    />
                  </Link>
                  <div className="flex flex-col items-start">
                    <h3 className="text-xl font-semibold">{job.company}</h3>
                    <p className="font-medium">{job.title}</p>
                    <button className="border text-white bg-zinc-800 dark:bg-zinc-200 dark:text-zinc-800 text-xs p-1 px-2 rounded-full my-2">
                      {job.topic}
                    </button>
                    <time className="text-sm text-zinc-600 dark:text-zinc-400 mt-2 tracking-widest uppercase">
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
                    <p className="tracking-tight dark:text-zinc-400 text-zinc-600 my-4 italic">
                      {job.summary}
                    </p>
                    <ul className="list-disc list-inside dark:text-zinc-400 text-zinc-600 space-y-2">
                      {job.bullets.map((bullet, index) => {
                        const parts = bullet.split(/(\*\*.*?\*\*)/);
                        return (
                          <li key={index} className="text-sm">
                            {parts.map((part, i) => {
                              if (part.startsWith('**') && part.endsWith('**')) {
                                return (
                                  <strong
                                    key={i}
                                    className="font-bold dark:text-white text-zinc-900"
                                  >
                                    {part.slice(2, -2)}
                                  </strong>
                                );
                              }
                              return part;
                            })}
                          </li>
                        );
                      })}
                    </ul>
                    {job.tech && (
                      <p className="text-xs dark:text-zinc-500 text-zinc-500 mt-4">
                        <span className="font-semibold">Tech:</span> {job.tech}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section
        className="mt-32"
        data-aos="fade-up"
        data-aos-duration={1000}
        data-aos-once={true}
      >
        <div style={{ opacity: "1" }}>
          <div>
            <div className="mb-8">
              <h2 className="font-incognito text-4xl mb-8 font-bold tracking-tight">
                About
              </h2>
              <div className="max-w-3xl space-y-4 dark:text-zinc-400 text-zinc-600">
                <p>
                  I enjoy building systems that are secure, reliable, and
                  maintainable. My engineering philosophy centers on automation,
                  strong testing practices, and security-first delivery. Whether
                  it's designing CI/CD pipelines, building internal platforms,
                  or optimizing observability strategies, I focus on creating
                  solutions that empower teams to ship with confidence.
                </p>
                <p>
                  I'm always open to collaborating on platform engineering
                  challenges, DevSecOps transformations, or contributing to open
                  source projects. When I'm not coding, you'll probably find me
                  climbing rocks, snowboarding glades, or gaming with friends.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section
        className="mt-32 mb-20"
        data-aos="fade-up"
        data-aos-duration={1000}
        data-aos-once={true}
      >
        <div className="dark:bg-primary-bg bg-secondary-bg border dark:border-zinc-800 border-zinc-200 p-12 rounded-lg text-center">
          <h2 className="font-incognito text-3xl mb-4 font-bold tracking-tight">
            Want to collaborate or chat?
          </h2>
          <p className="dark:text-zinc-400 text-zinc-600 mb-8 max-w-xl mx-auto">
            Reach out via email or connect with me on LinkedIn.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="mailto:anthony@brignano.io"
              className="inline-flex items-center px-6 py-3 bg-primary-color hover:bg-opacity-90 text-white dark:text-zinc-900 font-semibold rounded-lg transition-all duration-200"
              onClick={() => {
                track("Contact CTA Clicked", { location: "bottom" });
              }}
            >
              Email Me
            </a>
            <a
              href="https://www.linkedin.com/in/brignano"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-6 py-3 border-2 dark:border-zinc-700 border-zinc-300 dark:hover:border-zinc-500 hover:border-zinc-400 font-semibold rounded-lg transition-all duration-200"
              onClick={() => {
                track("LinkedIn CTA Clicked", { location: "bottom" });
              }}
            >
              LinkedIn
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
