"use client";

import { clsx } from "clsx";
import type { NavItem } from "@/lib/types";

export function HotNav({
  items,
  activeTab,
  onChange,
}: {
  items: NavItem[];
  activeTab: string;
  onChange: (id: string) => void;
}) {
  return (
    <nav className="relative z-20 mx-auto mt-[clamp(1.5rem,6vw,2rem)] w-[calc(100%-1.5rem)] max-w-5xl overflow-hidden rounded-full border border-foreground/15 bg-foreground/[0.07] p-1.5 shadow-2xl shadow-foreground/20 backdrop-blur-xl sm:w-[calc(100%-2.5rem)]" aria-label="Portfolio sections">
      <div className="portfolio-nav-scroll flex min-w-0 gap-1 overflow-x-auto sm:justify-center">
        {items.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => onChange(item.id)}
            className={clsx(
            "min-h-9 shrink-0 rounded-full px-3 py-2 text-[10px] uppercase tracking-[0.08em] text-foreground/55 transition hover:text-foreground focus-visible:outline-2 focus-visible:outline-accent sm:px-4 sm:text-xs sm:tracking-[0.12em]",
              activeTab === item.id &&
                "border border-accent/60 bg-accent/35 !text-foreground shadow-[0_0_20px_rgba(221,114,253,0.25)]",
            )}
          >
            {item.label}
          </button>
        ))}
      </div>
    </nav>
  );
}
