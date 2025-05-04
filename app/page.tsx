"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import GitHubCalendar from "react-github-calendar";

export default function Home() {
  const [calendarYear, setCalendarYear] = useState(new Date().getFullYear());

  const socialLinks = [
    {
      name: "GitHub",
      href: "https://www.github.com/brignano",
      icon: (
        <svg
          stroke="currentColor"
          fill="currentColor"
          strokeWidth="0"
          viewBox="0 0 24 24"
          className="h-5 w-5 text-zinc-500 group-hover:dark:text-white group-hover:text-zinc-800 duration-300"
          aria-hidden="true"
          height="1em"
          width="1em"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M12.026 2c-5.509 0-9.974 4.465-9.974 9.974 0 4.406 2.857 8.145 6.821 9.465.499.09.679-.217.679-.481 0-.237-.008-.865-.011-1.696-2.775.602-3.361-1.338-3.361-1.338-.452-1.152-1.107-1.459-1.107-1.459-.905-.619.069-.605.069-.605 1.002.07 1.527 1.028 1.527 1.028.89 1.524 2.336 1.084 2.902.829.091-.645.351-1.085.635-1.334-2.214-.251-4.542-1.107-4.542-4.93 0-1.087.389-1.979 1.024-2.675-.101-.253-.446-1.268.099-2.64 0 0 .837-.269 2.742 1.021a9.582 9.582 0 0 1 2.496-.336 9.554 9.554 0 0 1 2.496.336c1.906-1.291 2.742-1.021 2.742-1.021.545 1.372.203 2.387.099 2.64.64.696 1.024 1.587 1.024 2.675 0 3.833-2.33 4.675-4.552 4.922.355.308.675.916.675 1.846 0 1.334-.012 2.41-.012 2.737 0 .267.178.577.687.479C19.146 20.115 22 16.379 22 11.974 22 6.465 17.535 2 12.026 2z"
          ></path>
        </svg>
      ),
    },
    {
      name: "Linkedin",
      href: "https://www.linkedin.com/in/brignano",
      icon: (
        <svg
          stroke="currentColor"
          fill="currentColor"
          strokeWidth="0"
          viewBox="0 0 24 24"
          className="h-5 w-5 text-zinc-500 group-hover:dark:text-white group-hover:text-zinc-800 duration-300"
          aria-hidden="true"
          height="1em"
          width="1em"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M20 3H4a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1zM8.339 18.337H5.667v-8.59h2.672v8.59zM7.003 8.574a1.548 1.548 0 1 1 0-3.096 1.548 1.548 0 0 1 0 3.096zm11.335 9.763h-2.669V14.16c0-.996-.018-2.277-1.388-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248h-2.667v-8.59h2.56v1.174h.037c.355-.675 1.227-1.387 2.524-1.387 2.704 0 3.203 1.778 3.203 4.092v4.71z"></path>
        </svg>
      ),
    },
    {
      name: "WakaTime",
      href: "https://wakatime.com/@brignano",
      icon: (
        <svg
          stroke="currentColor"
          fill="currentColor"
          strokeWidth="0"
          viewBox="0 0 256 256"
          className="h-5 w-5 text-zinc-500 group-hover:dark:text-white group-hover:text-zinc-800 duration-300"
          aria-hidden="true"
          height="1em"
          width="1em"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g>
            <path d="M128,0 C57.308,0 0,57.308 0,128 C0,198.693 57.308,256 128,256 C198.693,256 256,198.693 256,128 C256,57.308 198.693,0 128,0 M128,33.805 C179.939,33.805 222.195,76.061 222.195,128 C222.195,179.94 179.939,222.195 128,222.195 C76.061,222.195 33.805,179.94 33.805,128 C33.805,76.061 76.061,33.805 128,33.805 M115.4993,155.6431 L115.3873,155.6431 C113.4353,155.6081 111.6083,154.6751 110.4343,153.1151 L81.5593,114.7321 C79.4553,111.9351 80.0173,107.9611 82.8143,105.8561 C85.6123,103.7511 89.5853,104.3131 91.6903,107.1111 L115.6833,139.0051 L122.5463,130.5271 C123.7493,129.0411 125.5603,128.1771 127.4723,128.1771 L127.4803,128.1771 C129.3973,128.1791 131.2093,129.0471 132.4103,130.5411 L139.0003,138.7281 L176.6923,90.1341 C178.8353,87.3681 182.8173,86.8651 185.5843,89.0111 C188.3493,91.1561 188.8533,95.1371 186.7073,97.9041 L144.1003,152.8371 C142.9143,154.3681 141.0883,155.2721 139.1503,155.2901 L139.0933,155.2901 C137.1743,155.2901 135.3583,154.4221 134.1553,152.9261 L127.4583,144.6071 L120.4253,153.2931 C119.2213,154.7811 117.4103,155.6431 115.4993,155.6431"></path>
          </g>
        </svg>
      ),
    },
  ];

  const jobs = [
    {
      company: "The Hartford",
      logo: "the-hartford.jpeg",
      url: "https://www.thehartford.com/",
      title: "Senior Staff Software Engineer",
      description:
        "Serve as Technical Lead and Solutions Architect for the Platform Engineering organization, driving the rationalization of CI/CD tools, Cloud/SaaS migrations, and enterprise-wide improvements to the developer experience. Lead inner-sourcing initiatives within the Engineering Center of Practice, the annual enterprise Hackathon, and corporate-sponsored engagements with Central Connecticut State University as a member of their Computer Science Industry Advisory Board. Mentor developers and interns to foster professional growth and promote engineering excellence.",
      startDate: "May 16, 2023",
      endDate: "Present",
    },
    {
      company: "The Hartford",
      logo: "the-hartford.jpeg",
      url: "https://www.thehartford.com/",
      title: "Staff Software Engineer",
      description:
        "Functioned as the technical lead for multiple teams to deliver automated solutions for end-to-end quality assurance. Designed and implemented enterprise-grade tools for test data management and forms validation using Playwright and Cucumber. Established and enforced SDLC standards across the organization to ensure scalable and consistent development practices. Improved test performance by over 30% with core automation optimizations and improved test data management strategies.",
      startDate: "Mar 16, 2021",
      endDate: "May 15, 2023",
    },
    {
      company: "The Hartford",
      logo: "the-hartford.jpeg",
      url: "https://www.thehartford.com/",
      title: "Senior Software Engineer",
      description:
        "Led the technical implementation of a new Policy Administration platform, serving as the technical lead for a large Agile team within the Scaled Agile Framework (SAFe). Designed and delivered a premium data integration solution for the enterprise general ledger. Established DevOps pipelines using Jenkins and uDeploy, and implemented performance monitoring and alerting with Dynatrace, and SumoLogic. Championed engineering best practices through code reviews, CI/CD optimization, and automation. Mentored developers and enforced standards around code quality, versioning, and test coverage to ensure scalable, maintainable solutions.",
      startDate: "Mar 16, 2020",
      endDate: "Mar 15, 2021",
    },
    {
      company: "The Hartford",
      logo: "the-hartford.jpeg",
      url: "https://www.thehartford.com/",
      title: "Software Engineer",
      description:
        "Contributed to the development of a customer-facing application for selling Personal Lines Auto and Home insurance, built on a microservices architecture (20+ services) using Spring Boot and Angular. Collaborated with Agile Product Owners and Scrum Masters on story creation, refinement, and execution. Participated in triaging and resolving critical, time-sensitive defects to ensure application reliability. Provided mentorship to teammates and supported adoption of new technologies and development best practices.",
      startDate: "Sept 16, 2018",
      endDate: "Mar 15, 2020",
    },
    {
      company: "The Hartford",
      logo: "the-hartford.jpeg",
      url: "https://www.thehartford.com/",
      title: "Multi-Stack Engineer",
      description:
        "Provided full-stack expertise, spanning software components, databases, platforms, and infrastructure. Acted as the go-to technical leader, managing high-impact incidents and driving swift service restoration. Led root cause analysis and implemented problem management practices. Championed the migration to open-source platforms, containerization, and public cloud deployment. Drove the adoption of DevOps tools and best practices across the application portfolio. Influenced major technical design decisions and collaborated with architecture and delivery teams to shape the organization’s technical strategy.",
      startDate: "Mar 16, 2018",
      endDate: "Sept 15, 2018",
    },
    {
      company: "The Hartford",
      logo: "the-hartford.jpeg",
      url: "https://www.thehartford.com/",
      title: "Developer",
      description:
        "Led an Agile scrum team in the design and architecture of a new internal CRM application for quoting and issuing Personal Insurance policies. Integrated multiple web services to streamline processes and reduce handling time. Successfully resolved defects and incidents, ensuring seamless application performance for Personal Insurance agents.",
      startDate: "Mar 16, 2017",
      endDate: "Mar 15, 2018",
    },
    {
      company: "The Hartford",
      logo: "the-hartford.jpeg",
      url: "https://www.thehartford.com/",
      title: "Spec App Development",
      description:
        "Triaged and resolved production issues to ensure uninterrupted application functionality. Led disaster recovery testing and annual audits to maintain enterprise compliance and system resilience. Refactored legacy code to reduce technical debt, improving application stability, performance, and maintainability.",
      startDate: "June 15, 2016",
      endDate: "Mar 15, 2017",
    },
  ];

  return (
    <main className="max-w-7xl mx-auto md:px-16 px-6 lg:mt-32 mt-20">
      <section className="flex xl:flex-row flex-col xl:items-center items-start xl:justify-center justify-between gap-x-12 mb-16">
        <div className="lg:max-w-2xl max-w-2xl">
          <div style={{ opacity: 1, transform: "none" }}>
            <div>
              <h1 className="font-silkscreen-mono font-semibold tracking-tight text-3xl sm:text-5xl mb-6 lg:leading-[3.7rem] leading-tight lg:min-w-[700px] min-w-full">
                Full-stack Developer, DevSecOps Engineer & Cloud Architect
              </h1>
              <div className="text-base dark:text-zinc-400 text-zinc-600">
                <div
                  className="inline-block"
                  style={{
                    animation: "wave 1.25s ease-in-out infinite",
                  }}
                >
                  👋
                </div>
                &nbsp;&nbsp;I&apos;m Anthony, a full-stack developer specialized
                in building exceptional websites, applications, and everything
                in between. When I&apos;m not writing code and playing video
                games, you can find me climbing rocks or snowboarding.
              </div>
            </div>
            <div style={{ opacity: 1 }}>
              <div>
                <ul className="flex items-center flex-wrap gap-x-5 gap-y-4 my-10">
                  {socialLinks.map((link) => (
                    <li key={link.name}>
                      <Link
                        href={link.href}
                        target="_blank"
                        className="flex items-center border-b dark:border-b-zinc-800 border-zinc-200 group"
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
      </section>
      <section>
        <div style={{ opacity: "1" }}>
          <div className="mb-8">
            <h2 className="font-incognito text-4xl font-bold tracking-tight">
              Contribution Graph
            </h2>
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
                    { length: new Date().getFullYear() - 2021 + 1 },
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
      <section className="mt-32">
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
                    />
                  </Link>
                  <div className="flex flex-col items-start">
                    <h3 className="text-xl font-semibold">{job.company}</h3>
                    <p>{job.title}</p>
                    <time className="text-sm text-zinc-500 mt-2 tracking-widest uppercase">
                      {job.startDate.toUpperCase()} -{" "}
                      <span
                        className={
                          job.endDate.toLowerCase() === "present"
                            ? "text-tertiary-color"
                            : ""
                        }
                      >
                        {job.endDate.toUpperCase()}
                      </span>
                    </time>
                    <p className="tracking-tight dark:text-zinc-400 text-zinc-600 my-4">
                      {job.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
