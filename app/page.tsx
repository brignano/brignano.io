"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import GitHubCalendar from "react-github-calendar";
import { jobs, socialLinks } from "@/utils/constants";

export default function Home() {
  const [calendarYear, setCalendarYear] = useState(new Date().getFullYear());

  return (
    <main className="max-w-7xl mx-auto md:px-16 px-6 lg:mt-32 mt-20">
      <section className="flex xl:flex-row flex-col xl:items-center items-start xl:justify-center justify-between gap-x-12 mb-16">
        <div className="lg:max-w-2xl max-w-2xl">
          <div style={{ opacity: 1, transform: "none" }}>
            <div>
              <h1 className="font-silkscreen-mono font-semibold tracking-tight text-3xl sm:text-5xl mb-6 lg:leading-[3.7rem] leading-tight lg:min-w-[700px] min-w-full">
                Full-stack Developer, DevSecOps Engineer & Solutions Architect
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
                &nbsp;&nbsp;I&apos;m Anthony, a full-stack engineer specialized
                in building exceptional websites, applications, and everything
                in between. Big fan of automated processes, clean code, and
                strong coffee. When I&apos;m not writing code or playing video
                games, you can find me climbing rocks and snowboarding.
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
