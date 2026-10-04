import type { HTMLAttributes } from "react";

export function Highlight({
  className = "",
  ...props
}: HTMLAttributes<HTMLSpanElement>) {
  return <span className={`text-accent ${className}`} {...props} />;
}
