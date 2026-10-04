"use client";

import { FileText, Mail } from "lucide-react";
import type { LinkItem } from "@/lib/types";
import { IconButton } from "@/components/ui/IconButton";

export function LinksSection({ items }: { items: LinkItem[] }) {
  return (
    <div className="grid min-w-0 grid-cols-2 gap-2 sm:gap-3" aria-label="Social links">
      {items.map((item) => (
        <IconButton
          key={item.label}
          href={item.href}
          label={item.label}
          className="h-11 min-w-0 w-full justify-start gap-2 px-2.5 sm:h-14 sm:gap-3 sm:px-4"
        >
          {item.icon === "resume" && <FileText size={21} strokeWidth={1.6} />}
          {item.icon === "mail" && <Mail size={21} strokeWidth={1.6} />}
          {item.icon === "linkedin" && (
            <svg aria-hidden="true" className="h-[21px] w-[21px] fill-current" viewBox="0 0 24 24">
              <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12ZM3.56 20.45h3.56V9H3.56v11.45Z" />
            </svg>
          )}
          {item.icon === "github" && (
            <span
              aria-hidden="true"
              className="h-[21px] w-[21px] bg-current [mask-position:center] [mask-repeat:no-repeat] [mask-size:contain] [-webkit-mask-position:center] [-webkit-mask-repeat:no-repeat] [-webkit-mask-size:contain]"
              style={{ maskImage: "url('/github.svg')", WebkitMaskImage: "url('/github.svg')" }}
            />
          )}
          <span className="truncate text-[10px] font-medium uppercase tracking-[0.04em] sm:text-xs sm:tracking-[0.1em]">
            {item.icon === "mail" ? "Gmail" : item.label}
          </span>
        </IconButton>
      ))}
    </div>
  );
}
