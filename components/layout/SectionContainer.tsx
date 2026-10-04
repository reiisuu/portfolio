"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { DotMatrixText } from "@/components/ui/DotMatrixText";
import { Highlight } from "@/components/ui/Highlight";
import { ProjectCarousel } from "@/components/projects/ProjectCarousel";
import { GlyphMeter } from "@/components/education/GlyphMeter";
import { ExperienceList } from "@/components/experience/ExperienceList";
import { CertificationFolders } from "@/components/certifications/CertificationFolders";
import { bio, certCategories, education, experience, organizations, photo, projects } from "@/lib/data";

export function SectionContainer({ activeTab }: { activeTab: string }) {
  const label = activeTab.toUpperCase();
  return (
    <section id="portfolio-sections" className="mx-auto h-[calc(100svh-7rem)] min-h-[32rem] w-full max-w-5xl scroll-mt-28 px-[clamp(0.75rem,5vw,2rem)] pb-8 pt-6 sm:pt-8 lg:h-auto lg:min-h-[calc(100svh-4rem)] lg:px-10 lg:pt-16">
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          className="h-full"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.15 }}
        >
          <GlassPanel className="flex h-full min-w-0 flex-col overflow-y-auto overscroll-contain p-[clamp(1rem,5vw,2.5rem)] [scrollbar-color:var(--accent)_transparent] [scrollbar-width:thin] lg:h-[calc(100svh-11rem)]">
            <DotMatrixText className="shrink-0 text-xl text-accent sm:text-2xl">{label}</DotMatrixText>
            {activeTab === "about" ? (
              <div className="mt-6 grid min-w-0 gap-6 md:mt-8 md:grid-cols-[minmax(14rem,0.8fr)_minmax(0,1.2fr)] md:items-center md:gap-10">
                <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-foreground/15 bg-foreground/[0.06]">
                  <Image
                    src={photo}
                    alt="Portrait"
                    fill
                    sizes="(max-width: 767px) 100vw, 320px"
                    className="object-cover"
                  />
                </div>
                <div className="space-y-5">
                  <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-foreground/50">
                    Bio // Placeholder
                  </p>
                  <p className="max-w-xl text-sm leading-7 text-foreground/70 sm:text-base">
                    {bio}
                  </p>
                  <p className="max-w-xl text-sm leading-7 text-foreground/70 sm:text-base">
                    Add a short introduction here about your background, interests, and the kind of
                    <Highlight> software you build</Highlight>.
                  </p>
                </div>
              </div>
            ) : activeTab === "projects" ? (
              <ProjectCarousel projects={projects} />
            ) : activeTab === "education" ? (
              <div className="flex flex-1 items-center">
                <GlyphMeter stages={education} />
              </div>
            ) : activeTab === "experience" ? (
              <ExperienceList workEntries={experience} organizationEntries={organizations} />
            ) : activeTab === "certifications" ? (
              <div className="flex flex-1 items-center">
                <CertificationFolders categories={certCategories} />
              </div>
            ) : (
              <p className="mt-6 max-w-xl text-sm leading-6 text-foreground/60 sm:mt-8 sm:text-base sm:leading-normal">
                TODO: fill in the {activeTab} content in <code className="text-accent">lib/data.ts</code>.
              </p>
            )}
          </GlassPanel>
        </motion.div>
      </AnimatePresence>
    </section>
  );
}
