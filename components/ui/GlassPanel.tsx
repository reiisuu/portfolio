import type { HTMLAttributes } from "react";
import { clsx } from "clsx";

export function GlassPanel({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={clsx(
        "rounded-3xl border border-foreground/15 bg-foreground/[0.06] backdrop-blur-xl",
        className,
      )}
      {...props}
    />
  );
}
