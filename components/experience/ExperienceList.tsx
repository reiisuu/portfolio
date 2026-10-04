"use client";

import type { ExperienceEntry } from "@/lib/types";
import { useMemo, useState } from "react";

function initialsFor(company: string) {
  const initials = company
    .split(" ")
    .filter(Boolean)
    .map((word) => word[0])
    .join("")
    .slice(0, 3)
    .toUpperCase();
  return initials;
}

function logoSource(source: string) {
  try {
    const url = new URL(source);
    const isWikimediaFile = url.hostname.endsWith("wikimedia.org") && url.pathname.includes("/File:");

    if (isWikimediaFile) {
      const fileName = url.pathname.split("/File:")[1];
      return `https://commons.wikimedia.org/wiki/Special:FilePath/${fileName}`;
    }

    const hasImageExtension = /\.(avif|gif|jpe?g|png|svg|webp)(?:$|[?#])/i.test(url.pathname);
    if (hasImageExtension) return source;

    return `https://www.google.com/s2/favicons?domain=${url.hostname}&sz=128`;
  } catch {
    return source;
  }
}

function DotMatrixLogo({ company, logoSrc }: Pick<ExperienceEntry, "company" | "logoSrc">) {
  const [showFallback, setShowFallback] = useState(false);
  const initials = useMemo(() => initialsFor(company), [company]);
  const resolvedLogo = useMemo(() => logoSource(logoSrc), [logoSrc]);

  return (
    <div className="relative flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-full border border-foreground/20 bg-background shadow-inner sm:h-28 sm:w-28">
      {!showFallback ? (
        // External sources are resolved at runtime and may not be compatible with next/image optimization.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={resolvedLogo}
          alt={`${company} logo`}
          loading="lazy"
          onError={() => setShowFallback(true)}
          className="h-full w-full object-contain p-5 [mix-blend-mode:screen] sm:p-6"
        />
      ) : (
        <>
          <div className="absolute inset-3 grid grid-cols-5 grid-rows-5 gap-1 opacity-75" aria-hidden="true">
            {Array.from({ length: 25 }, (_, index) => (
              <span
                key={index}
                className={`rounded-full ${index % 3 === 0 || index % 7 === 0 ? "bg-accent" : "bg-foreground/35"}`}
              />
            ))}
          </div>
          <span className="relative z-10 font-display text-sm tracking-[0.16em] text-foreground">{initials}</span>
        </>
      )}
    </div>
  );
}

function ExperienceCard({ entry, index }: { entry: ExperienceEntry; index: number }) {
  return (
    <article className="grid gap-5 rounded-2xl border border-foreground/10 bg-foreground/[0.035] p-5 transition hover:border-accent/40 hover:bg-foreground/[0.055] sm:grid-cols-[7rem_minmax(0,1fr)] sm:gap-7 sm:p-7">
      <div className="flex items-start justify-center sm:justify-start">
        <DotMatrixLogo company={entry.company} logoSrc={entry.logoSrc} />
      </div>
      <div className="min-w-0">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-5">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-accent">
              {String(index + 1).padStart(2, "0")} {"// Experience node"}
            </p>
            <h3 className="mt-2 text-xl font-semibold tracking-tight text-foreground">{entry.role}</h3>
            <p className="mt-1 text-sm font-medium text-foreground/70">{entry.company}</p>
          </div>
          <span className="shrink-0 font-mono text-[10px] uppercase tracking-[0.12em] text-foreground/45">
            {entry.period}
          </span>
        </div>
        <ul className="mt-5 space-y-3 text-sm leading-6 text-foreground/65">
          {entry.achievements.map((achievement) => (
            <li key={achievement} className="flex gap-3">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" aria-hidden="true" />
              <span>{achievement}</span>
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}

export function ExperienceList({
  workEntries,
  organizationEntries,
}: {
  workEntries: ExperienceEntry[];
  organizationEntries: ExperienceEntry[];
}) {
  const [activeCategory, setActiveCategory] = useState<"work" | "organizations">("work");
  const entries = activeCategory === "work" ? workEntries : organizationEntries;

  return (
    <div className="mt-6 min-w-0 sm:mt-8">
      <div className="flex w-full max-w-md flex-col rounded-2xl border border-foreground/15 bg-foreground/[0.04] p-1 sm:flex-row sm:rounded-full" aria-label="Experience categories">
        {[
          { id: "work" as const, label: "Work Experience" },
          { id: "organizations" as const, label: "Organizations" },
        ].map((category) => (
          <button
            key={category.id}
            type="button"
            onClick={() => setActiveCategory(category.id)}
            className={`min-h-10 flex-1 rounded-full px-3 py-2 text-center font-mono text-[10px] uppercase tracking-[0.1em] transition sm:px-5 ${
              activeCategory === category.id
                ? "bg-accent/25 text-foreground shadow-[0_0_18px_rgba(207,103,227,0.16)]"
                : "text-foreground/50 hover:text-foreground"
            }`}
            aria-pressed={activeCategory === category.id}
          >
            {category.label}
          </button>
        ))}
      </div>
      <div className="mt-5 space-y-4">
        {entries.map((entry, index) => (
          <ExperienceCard key={entry.id} entry={entry} index={index} />
        ))}
      </div>
    </div>
  );
}
