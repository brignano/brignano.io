"use client";

import { useState } from "react";
import { glossary, type Achievement } from "@/lib/constants";
import { event } from "@/lib/gtag";

/**
 * A single Highlights card. The skill pills are buttons: tapping one reveals a
 * plain-language definition of that buzzword below the row (one open at a time),
 * so non-technical readers can decode the jargon without it leading the copy.
 * Click works on touch where the old hover-tooltip idea would not.
 */
export default function HighlightCard({
  achievement,
  index,
}: {
  achievement: Achievement;
  index: number;
}) {
  const [openSkill, setOpenSkill] = useState<string | null>(null);
  const definition = openSkill ? glossary[openSkill] : null;

  return (
    <div
      data-aos="fade-up"
      data-aos-duration={600}
      data-aos-delay={index * 70}
      className="bg-card/70 backdrop-blur-sm border border-line rounded-xl px-6 py-5 shadow-sm flex flex-col"
    >
      <p className="text-base font-semibold tracking-tight mb-2">
        {achievement.outcome}
      </p>
      <p className="text-sm text-slate mb-4 leading-relaxed">
        {achievement.detail}
      </p>

      <div className="flex flex-wrap gap-2">
        {achievement.skills.map((skill) => {
          const hasDefinition = Boolean(glossary[skill]);

          // A term with no definition stays a plain, non-interactive pill.
          if (!hasDefinition) {
            return (
              <span
                key={skill}
                className="text-xs px-2.5 py-1 rounded-full border border-line-strong text-ink-soft"
              >
                {skill}
              </span>
            );
          }

          const isOpen = openSkill === skill;
          return (
            <button
              key={skill}
              type="button"
              aria-expanded={isOpen}
              onClick={() => {
                const next = isOpen ? null : skill;
                setOpenSkill(next);
                if (next) {
                  event("glossary_opened", {
                    term: skill,
                    transport_type: "beacon",
                  });
                }
              }}
              className={`text-xs px-2.5 py-1 rounded-full border transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-interactive-ink ${
                isOpen
                  ? "border-interactive bg-interactive-surface text-interactive-ink"
                  : "border-line-strong text-ink-soft hover:border-interactive hover:text-interactive-ink"
              }`}
            >
              {skill}
            </button>
          );
        })}
      </div>

      {definition && (
        <div
          role="note"
          className="mt-3 rounded-lg border border-dashed border-line-strong bg-card/60 px-3.5 py-3 text-sm text-ink-soft leading-relaxed"
        >
          <span className="font-semibold">{openSkill}</span> — {definition}
        </div>
      )}
    </div>
  );
}
