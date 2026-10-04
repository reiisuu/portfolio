import type { ButtonHTMLAttributes, ReactNode } from "react";
import { clsx } from "clsx";

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  href?: string;
  label: string;
  children: ReactNode;
}

export function IconButton({
  href,
  label,
  children,
  className,
  ...props
}: IconButtonProps) {
  const classes = clsx(
    "inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-foreground/15 bg-foreground/[0.06] text-foreground transition hover:border-accent/60 hover:bg-accent/15 hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
    className,
  );

  if (href) {
    return (
      <a
        className={classes}
        href={href}
        aria-label={label}
        target={href.startsWith("http") ? "_blank" : undefined}
        rel={href.startsWith("http") ? "noreferrer" : undefined}
      >
        {children}
      </a>
    );
  }

  return (
    <button className={classes} aria-label={label} {...props}>
      {children}
    </button>
  );
}
