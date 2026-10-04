"use client";

import { ExternalLink, Play, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import type { Project } from "@/lib/types";

function ProjectCard({
  project,
  active,
  index,
  onOpen,
}: {
  project: Project;
  active: boolean;
  index: number;
  onOpen: () => void;
}) {
  return (
    <article
      className={`group relative w-[min(78vw,22rem)] shrink-0 overflow-hidden rounded-3xl border bg-foreground/[0.04] text-left transition duration-300 ${
        active
          ? "border-accent/70 shadow-[0_18px_55px_rgba(0,0,0,0.24),0_0_28px_rgba(207,103,227,0.16)] md:scale-[1.04]"
          : "border-foreground/10 opacity-75 md:scale-95"
      }`}
    >
      <div className="relative aspect-[16/9] overflow-hidden border-b border-foreground/10 bg-gradient-to-br from-accent/25 via-foreground/[0.06] to-background">
        {project.image ? (
          <Image src={project.image} alt="" fill sizes="(max-width: 768px) 78vw, 352px" className="object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center font-mono text-[10px] uppercase tracking-[0.18em] text-foreground/45">
            Project preview placeholder
          </div>
        )}
        <span className="absolute left-4 top-4 rounded-full border border-foreground/15 bg-background/70 px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.14em] text-foreground/65 backdrop-blur-md">
          {active ? "Featured" : "Placeholder"}
        </span>
        <span className="absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-full border border-foreground/20 bg-background/70 text-foreground backdrop-blur-md transition group-hover:border-accent group-hover:bg-accent/20 group-hover:text-accent">
          {project.videoUrl || project.liveUrl ? <Play size={14} fill="currentColor" /> : <ExternalLink size={14} />}
        </span>
      </div>
      <div className="space-y-4 p-5">
        <div>
          <p className="mb-2 font-mono text-[9px] uppercase tracking-[0.16em] text-accent">
            {String(index + 1).padStart(2, "0")} {"// Project slot"}
          </p>
          <h3 className="text-lg font-semibold tracking-tight text-foreground">{project.title}</h3>
          <p className="mt-2 text-sm leading-6 text-foreground/65">{project.description}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {project.stack.map((technology) => (
            <span key={technology} className="rounded-full border border-foreground/10 bg-foreground/[0.05] px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.08em] text-foreground/60">
              {technology}
            </span>
          ))}
        </div>
        <button
          type="button"
          onPointerDown={(event) => event.stopPropagation()}
          onPointerUp={(event) => event.stopPropagation()}
          onClick={(event) => {
            event.stopPropagation();
            onOpen();
          }}
          className="inline-flex min-h-10 w-full items-center justify-center rounded-full border border-accent/45 bg-accent/10 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.12em] text-foreground transition hover:border-accent hover:bg-accent/20 hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          View details
        </button>
      </div>
    </article>
  );
}

export function ProjectCarousel({ projects }: { projects: Project[] }) {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const suppressClick = useRef(false);
  const dragState = useRef({
    startX: 0,
    startScrollLeft: 0,
    pointerId: -1,
    distance: 0,
    lastX: 0,
    lastTime: 0,
    velocity: 0,
  });
  const momentumFrame = useRef<number | null>(null);

  const updateActiveIndex = () => {
    const carousel = carouselRef.current;
    if (!carousel) return;
    const cards = Array.from(carousel.children) as HTMLElement[];
    const center = carousel.scrollLeft + carousel.clientWidth / 2;
    const closest = cards.reduce(
      (best, card, index) => {
        const cardCenter = card.offsetLeft + card.offsetWidth / 2;
        const distance = Math.abs(cardCenter - center);
        return distance < best.distance ? { index, distance } : best;
      },
      { index: 0, distance: Number.POSITIVE_INFINITY },
    );
    setActiveIndex(closest.index);
  };

  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;
    let frame = 0;
    const handleScroll = () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(updateActiveIndex);
    };
    carousel.addEventListener("scroll", handleScroll, { passive: true });
    updateActiveIndex();
    return () => {
      carousel.removeEventListener("scroll", handleScroll);
      window.cancelAnimationFrame(frame);
    };
  }, [projects.length]);

  const stopMomentum = () => {
    if (momentumFrame.current !== null) {
      window.cancelAnimationFrame(momentumFrame.current);
      momentumFrame.current = null;
    }
  };

  const continueMomentum = (velocity: number) => {
    const carousel = carouselRef.current;
    if (!carousel || Math.abs(velocity) < 0.1) return;
    carousel.scrollLeft -= velocity;
    momentumFrame.current = window.requestAnimationFrame(() => {
      continueMomentum(velocity * 0.94);
    });
  };

  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    const carousel = carouselRef.current;
    if (!carousel) return;
    stopMomentum();
    dragState.current = {
      startX: event.clientX,
      startScrollLeft: carousel.scrollLeft,
      pointerId: event.pointerId,
      distance: 0,
      lastX: event.clientX,
      lastTime: performance.now(),
      velocity: 0,
    };
    suppressClick.current = false;
    carousel.setPointerCapture(event.pointerId);
    setDragging(true);
  };

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const carousel = carouselRef.current;
    if (!carousel || !dragging || dragState.current.pointerId !== event.pointerId) return;
    const distance = event.clientX - dragState.current.startX;
    dragState.current.distance = Math.abs(distance);
    const now = performance.now();
    const elapsed = Math.max(now - dragState.current.lastTime, 1);
    dragState.current.velocity = ((event.clientX - dragState.current.lastX) / elapsed) * 16;
    dragState.current.lastX = event.clientX;
    dragState.current.lastTime = now;
    carousel.scrollLeft = dragState.current.startScrollLeft - distance;
  };

  const stopDragging = (event: ReactPointerEvent<HTMLDivElement>) => {
    const carousel = carouselRef.current;
    if (carousel && dragState.current.pointerId === event.pointerId) {
      carousel.releasePointerCapture(event.pointerId);
    }
    continueMomentum(dragState.current.velocity);
    suppressClick.current = dragState.current.distance > 8;
    dragState.current.pointerId = -1;
    setDragging(false);
    window.setTimeout(() => {
      suppressClick.current = false;
    }, 0);
  };

  const handleCardOpen = (project: Project) => {
    if (suppressClick.current) return;
    setSelectedProject(project);
  };

  useEffect(() => {
    if (!selectedProject) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelectedProject(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedProject]);

  return (
    <div className="relative mt-6 min-w-0 sm:mt-8">
      <div
        ref={carouselRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={stopDragging}
        onPointerCancel={stopDragging}
        className={`flex min-w-0 gap-4 overflow-x-auto px-[8%] pb-6 pt-2 [scrollbar-width:none] [touch-action:pan-y] [&::-webkit-scrollbar]:hidden sm:px-[11%] md:gap-6 md:px-[18%] ${
          dragging ? "cursor-grabbing select-none" : "cursor-grab"
        }`}
      >
        {projects.map((project, index) => (
          <ProjectCard key={project.slug} project={project} active={index === activeIndex} index={index} onOpen={() => handleCardOpen(project)} />
        ))}
      </div>
      <div className="mx-auto mt-1 flex max-w-md items-center gap-3 px-4">
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-foreground/10">
          <div className="h-full rounded-full bg-accent transition-[width] duration-300 ease-out" style={{ width: `${((activeIndex + 1) / projects.length) * 100}%` }} />
        </div>
        <span className="min-w-12 text-right font-mono text-[9px] uppercase tracking-[0.12em] text-foreground/45">
          {String(activeIndex + 1).padStart(2, "0")} / {String(projects.length).padStart(2, "0")}
        </span>
      </div>
      <p className="text-center font-mono text-[9px] uppercase tracking-[0.16em] text-foreground/40">
        Swipe or drag to browse · click a card for details
      </p>
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            className="absolute inset-2 z-30 flex items-center justify-center rounded-2xl bg-background/75 p-3 backdrop-blur-xl sm:inset-3 sm:p-5"
            role="presentation"
            onClick={() => setSelectedProject(null)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <motion.section
              role="dialog"
              aria-modal="true"
              aria-labelledby="project-dialog-title"
              className="relative flex max-h-full w-full max-w-2xl flex-col overflow-hidden rounded-3xl border border-accent/45 bg-background p-4 shadow-[0_20px_80px_rgba(0,0,0,0.35)] sm:p-6"
              onClick={(event) => event.stopPropagation()}
              initial={{ opacity: 0, y: 18, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.98 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
            >
              <button type="button" onClick={() => setSelectedProject(null)} aria-label="Close project details" className="absolute right-5 top-5 z-10 inline-flex h-9 w-9 items-center justify-center rounded-full border border-foreground/15 bg-background/70 text-foreground/60 transition hover:border-accent hover:text-accent">
                <X size={17} />
              </button>
              <div className="min-h-0 overflow-y-auto overscroll-contain pr-1 [scrollbar-color:var(--accent)_transparent] [scrollbar-width:thin]">
                <p className="mt-5 font-mono text-[10px] uppercase tracking-[0.16em] text-accent">Project details</p>
                <h3 id="project-dialog-title" className="mt-3 pr-12 text-2xl font-semibold text-foreground sm:text-3xl">{selectedProject.title}</h3>
                <p className="mt-4 text-sm leading-7 text-foreground/70">{selectedProject.description}</p>
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  {[
                    ["Client / stakeholder", selectedProject.client],
                    ["Problem", selectedProject.problem],
                    ["Solution", selectedProject.solution],
                    ["Impact / status", selectedProject.impact],
                  ].map(([label, value]) => value && (
                    <div key={label} className="rounded-2xl border border-foreground/10 bg-foreground/[0.035] p-4">
                      <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-accent">{label}</p>
                      <p className="mt-2 text-sm leading-6 text-foreground/70">{value}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-6 flex flex-wrap gap-2">
                  {selectedProject.stack.map((technology) => (
                    <span key={technology} className="rounded-full border border-accent/30 bg-accent/10 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.08em] text-foreground/70">
                      {technology}
                    </span>
                  ))}
                </div>
                <div className="mt-8 flex flex-col items-stretch gap-3 pb-1 sm:flex-row sm:flex-wrap sm:items-center">
                  {selectedProject.liveUrl && <a href={selectedProject.liveUrl} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 rounded-full bg-accent px-4 py-2 text-xs font-medium text-white transition hover:bg-accent/80">View live demo <ExternalLink size={13} /></a>}
                  {selectedProject.repoUrl && <a href={selectedProject.repoUrl} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 rounded-full border border-foreground/20 px-4 py-2 text-xs font-medium text-foreground transition hover:border-accent hover:text-accent">View repository <ExternalLink size={13} /></a>}
                  {!selectedProject.liveUrl && !selectedProject.repoUrl && <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-foreground/40">Links will be added when this project is ready</span>}
                </div>
              </div>
            </motion.section>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
