import type { HTMLAttributes } from "react";
import { clsx } from "clsx";

export function DotMatrixText({
  className,
  ...props
}: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={clsx(
        "font-display uppercase tracking-[0.18em] text-accent",
        className,
      )}
      {...props}
    />
  );
}
