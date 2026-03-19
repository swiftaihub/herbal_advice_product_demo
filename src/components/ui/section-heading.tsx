import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  className,
  action,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
  action?: ReactNode;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 sm:gap-4",
        align === "center" ? "mx-auto max-w-3xl items-center text-center" : "",
        className,
      )}
    >
      {eyebrow ? (
        <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--color-accent)] sm:text-xs sm:tracking-[0.28em]">
          {eyebrow}
        </span>
      ) : null}
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div className={cn("space-y-2.5", align === "center" ? "md:text-center" : "")}>
          <h2 className="font-display text-[2rem] leading-[1.02] tracking-tight text-[var(--color-ink)] md:text-5xl">
            {title}
          </h2>
          {description ? (
            <p className="max-w-2xl text-sm leading-6 text-[var(--color-muted)] sm:text-base sm:leading-7">
              {description}
            </p>
          ) : null}
        </div>
        {action ? <div className="w-full shrink-0 sm:w-auto">{action}</div> : null}
      </div>
    </div>
  );
}
