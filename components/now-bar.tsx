"use client";

import { useEffect, useState } from "react";
import HolidayGreeting from "@/components/holiday-greeting";
import LocalTime from "@/components/local-time";
import { nowBuilding } from "@/lib/constants";
import { useHoliday } from "@/lib/use-holiday";

// One quiet line under the header with live facts: Anthony's local time, his
// latest public commit and what he's building. It gives the site a pulse
// without a widget. Everything it shows is data the site already has; the
// commit comes from /api/now after the page loads, so the page stays static,
// and the line simply leaves the commit out if GitHub doesn't answer.
type Commit = { repo: string | null; url: string | null; date: string };

const ZONE = "America/New_York";

function useConnecticutTime() {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    // Tick on the minute so the clock is never a minute behind.
    const tick = () => setNow(new Date());
    tick();
    let interval: ReturnType<typeof setInterval> | undefined;
    const align = setTimeout(() => {
      tick();
      interval = setInterval(tick, 60_000);
    }, 60_000 - (Date.now() % 60_000));
    return () => {
      clearTimeout(align);
      if (interval) clearInterval(interval);
    };
  }, []);
  return now;
}

export default function NowBar() {
  const now = useConnecticutTime();
  // On a phone there's room for two items: during a holiday the greeting
  // takes the commit's place.
  const { holiday, off } = useHoliday();
  const greeting = Boolean(holiday && !off);
  const [commit, setCommit] = useState<Commit | null>(null);

  useEffect(() => {
    let live = true;
    fetch("/api/now")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (live && d?.commit?.date) setCommit(d.commit);
      })
      .catch(() => {});
    return () => {
      live = false;
    };
  }, []);

  const time = now
    ? now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", timeZone: ZONE })
    : null;

  return (
    <div data-print-hide className="border-b border-line font-mono text-xs text-slate md:px-16 px-6 lg:mb-28 mb-10">
      <div className="max-w-6xl mx-auto py-2.5 flex items-center gap-x-5 gap-y-1 whitespace-nowrap overflow-hidden">
        {/* The time is only known on the client; until then the line holds its
            height so nothing below it moves. */}
        <span className={time ? undefined : "invisible"}>
          <span className="text-ink-soft">{time ?? "12:00 PM"}</span> in Connecticut
        </span>
        {commit && (
          <span className={greeting ? "hidden sm:inline" : undefined}>
            last commit{" "}
            {commit.url ? (
              <a
                href={commit.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-ink-soft hover:text-ink underline decoration-line underline-offset-2"
              >
                <LocalTime iso={commit.date} className="" />
              </a>
            ) : (
              <LocalTime iso={commit.date} className="text-ink-soft" />
            )}
            {commit.repo && <span className="hidden lg:inline"> · {commit.repo}</span>}
          </span>
        )}
        <HolidayGreeting />
        <span className="hidden md:inline">
          building{" "}
          {nowBuilding.map((n, i) => (
            <span key={n.label}>
              {i > 0 && ", "}
              <span className="text-ink-soft">{n.label}</span>
            </span>
          ))}
        </span>
      </div>
    </div>
  );
}
