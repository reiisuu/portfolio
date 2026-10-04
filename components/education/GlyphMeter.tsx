"use client";

import { useState } from "react";
import type { EducationStage } from "@/lib/types";

function GlyphSegment({ active }: { active: boolean }) {
  return (
    <span className="grid h-24 w-16 grid-cols-2 grid-rows-4 gap-1.5 rounded-xl border border-foreground/15 bg-foreground/[0.04] p-2">
      {Array.from({ length: 8 }, (_, index) => (
        <span
          key={index}
          className={`rounded-[2px] transition-colors duration-300 ${
            active
              ? index % 3 === 0
                ? "bg-accent"
                : "bg-accent/45"
              : "bg-foreground/15"
          }`}
        />
      ))}
    </span>
  );
}

export function GlyphMeter({ stages }: { stages: EducationStage[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeStage = stages[activeIndex] ?? stages[0];

  if (!activeStage) return null;

  return (
    <div className="grid w-full min-w-0 gap-8 md:grid-cols-[minmax(14rem,0.7fr)_minmax(0,1.3fr)] md:items-center md:gap-14">
      <div className="relative flex h-full items-center justify-center md:justify-start">
        <div className="absolute bottom-12 top-12 w-px bg-foreground/15" aria-hidden="true" />
        <div className="relative flex flex-col items-center gap-6">
          {stages.map((stage, index) => (
            <button
              key={`${stage.label}-${stage.school}`}
              type="button"
              onClick={() => setActiveIndex(index)}
              onMouseEnter={() => setActiveIndex(index)}
              aria-label={`Show ${stage.label} education`}
              aria-pressed={activeIndex === index}
              className="group relative flex items-center gap-3 rounded-xl p-1 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent sm:gap-5"
            >
              <GlyphSegment active={activeIndex === index} />
              <span className="absolute left-[4.75rem] whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.08em] text-foreground/55 transition-colors group-hover:text-foreground/90 sm:left-20 sm:text-xs sm:tracking-[0.12em]">
                {stage.label}
              </span>
            </button>
          ))}
        </div>
      </div>
      <div className="min-w-0 rounded-2xl border border-accent/35 bg-accent/[0.06] p-5 sm:p-7">
        <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-accent">
          Education node // {String(activeIndex + 1).padStart(2, "0")}
        </p>
        <h3 className="mt-3 text-xl font-semibold text-foreground sm:text-2xl">{activeStage.school}</h3>
        <p className="mt-2 text-sm leading-6 text-foreground/70">{activeStage.detail}</p>
        <div className="mt-6 flex flex-wrap gap-3 font-mono text-[10px] uppercase tracking-[0.12em] text-foreground/50">
          <span className="rounded-full border border-foreground/15 px-3 py-1.5">{activeStage.label}</span>
          <span className="rounded-full border border-foreground/15 px-3 py-1.5">{activeStage.period}</span>
        </div>
      </div>
    </div>
  );
}
