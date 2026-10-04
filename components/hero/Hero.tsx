"use client";

import { DotMatrixText } from "@/components/ui/DotMatrixText";
import { StatusBar } from "@/components/layout/StatusBar";
import { LinksSection } from "@/components/hero/LinksSection";
import { TechCube } from "@/components/cube/TechCube";
import { links, name, tagline } from "@/lib/data";

export function Hero() {
  return (
    <section className="mx-auto flex min-h-[100svh] w-full max-w-7xl flex-col justify-start gap-[clamp(0.75rem,4vw,2rem)] px-[clamp(0.75rem,5vw,2rem)] py-[clamp(0.75rem,5vw,2rem)] sm:justify-center sm:px-8 lg:h-[100svh] lg:min-h-0 lg:overflow-hidden lg:px-10">
      <StatusBar />
      <div className="flex min-h-0 flex-1 flex-col gap-[clamp(0.75rem,5vw,2rem)] lg:grid lg:grid-cols-[minmax(0,1.75fr)_minmax(18rem,0.75fr)] lg:items-stretch">
        <div className="order-1 flex h-[clamp(19rem,44svh,26rem)] min-h-0 justify-center overflow-visible sm:h-[30rem] sm:min-h-[30rem] lg:order-1 lg:h-auto lg:min-h-0">
          <TechCube />
        </div>
        <div className="order-2 flex min-w-0 flex-col justify-center gap-3 pt-4 sm:gap-6 sm:pt-4 lg:order-2 lg:pt-0">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-foreground/60 sm:text-sm">Hi, I am</p>
          <DotMatrixText className="block text-[clamp(2.25rem,12vw,4.5rem)] leading-none text-accent">{name}</DotMatrixText>
          <p className="max-w-lg text-pretty text-[clamp(0.875rem,3.5vw,1.125rem)] leading-7 text-foreground/70 sm:leading-8">{tagline}</p>
          <LinksSection items={links} />
        </div>
      </div>
    </section>
  );
}
