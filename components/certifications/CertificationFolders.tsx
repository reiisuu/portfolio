"use client";

import { Award, ExternalLink, ShieldCheck, Terminal, X } from "lucide-react";
import { useState } from "react";
import type { CertCategory } from "@/lib/types";

const categoryIcons = [Terminal, ShieldCheck, Award];

function CertFolder({
  category,
  index,
  onOpen,
}: {
  category: CertCategory;
  index: number;
  onOpen: () => void;
}) {
  const Icon = categoryIcons[index % categoryIcons.length];
  const badgeCount = Math.min(Math.max(category.certifications.length, 3), 6);

  return (
    <button
      type="button"
      onClick={onOpen}
      className="group flex flex-col items-center gap-4 rounded-3xl p-3 text-center transition hover:bg-foreground/[0.04] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
    >
      <span className="relative flex h-44 w-44 items-center justify-center rounded-full border border-foreground/15 bg-foreground/[0.045] shadow-[0_18px_45px_rgba(0,0,0,0.12)] transition group-hover:border-accent/60 group-hover:shadow-[0_0_32px_rgba(207,103,227,0.18)]">
        <span className="absolute inset-5 rounded-full border border-foreground/10" aria-hidden="true" />
        {Array.from({ length: badgeCount }, (_, badgeIndex) => {
          const angle = (badgeIndex / badgeCount) * Math.PI * 2 - Math.PI / 2;
          return (
            <span
              key={badgeIndex}
              className="absolute flex h-9 w-9 items-center justify-center rounded-full border border-accent/35 bg-background text-accent shadow-lg"
              style={{
                left: `calc(50% + ${Math.cos(angle) * 58}px - 18px)`,
                top: `calc(50% + ${Math.sin(angle) * 58}px - 18px)`,
              }}
            >
              <span className="h-2 w-2 rounded-full bg-accent" />
            </span>
          );
        })}
        <span className="relative flex h-20 w-20 items-center justify-center rounded-full border border-accent/45 bg-accent/10 text-accent transition group-hover:bg-accent/20">
          <Icon size={28} strokeWidth={1.5} />
        </span>
      </span>
      <span>
        <span className="block font-mono text-[10px] uppercase tracking-[0.16em] text-accent">
          {String(index + 1).padStart(2, "0")} {"// Category"}
        </span>
        <span className="mt-1 block text-sm font-medium text-foreground">{category.name}</span>
      </span>
    </button>
  );
}

export function CertificationFolders({ categories }: { categories: CertCategory[] }) {
  const [selectedCategory, setSelectedCategory] = useState<CertCategory | null>(null);

  return (
    <div className="w-full min-w-0">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((category, index) => (
          <CertFolder
            key={category.name}
            category={category}
            index={index}
            onOpen={() => setSelectedCategory(category)}
          />
        ))}
      </div>
      <p className="mt-4 text-center font-mono text-[9px] uppercase tracking-[0.16em] text-foreground/40">
        Select a certification module to view details
      </p>

      {selectedCategory && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/75 p-4 backdrop-blur-md"
          role="presentation"
          onClick={() => setSelectedCategory(null)}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="certification-dialog-title"
            className="relative max-h-[90svh] w-full max-w-lg overflow-y-auto rounded-3xl border border-accent/45 bg-background p-5 shadow-[0_20px_80px_rgba(0,0,0,0.35)] sm:p-8"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setSelectedCategory(null)}
              aria-label="Close certification details"
              className="absolute right-5 top-5 text-foreground/50 transition hover:text-foreground"
            >
              <X size={20} />
            </button>
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-accent">Certification module</p>
            <h3 id="certification-dialog-title" className="mt-3 pr-8 text-2xl font-semibold text-foreground">
              {selectedCategory.name}
            </h3>
            <div className="mt-6 space-y-3">
              {selectedCategory.certifications.map((certification) => (
                <div key={certification.name} className="rounded-2xl border border-foreground/10 bg-foreground/[0.035] p-4">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                    <div className="min-w-0">
                      <h4 className="font-medium text-foreground">{certification.name}</h4>
                      <p className="mt-1 text-sm text-foreground/60">{certification.issuer}</p>
                    </div>
                    <span className="shrink-0 font-mono text-[9px] uppercase tracking-[0.1em] text-foreground/45">
                      {certification.date}
                    </span>
                  </div>
                  {certification.credentialUrl && (
                    <a
                      href={certification.credentialUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-3 inline-flex items-center gap-2 text-xs text-accent transition hover:text-foreground"
                    >
                      View credential <ExternalLink size={13} />
                    </a>
                  )}
                </div>
              ))}
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
