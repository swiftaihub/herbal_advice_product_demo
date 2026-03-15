import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export function Badge({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-[rgba(111,89,64,0.16)] bg-[rgba(255,250,241,0.92)] px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-[var(--color-muted)]",
        className,
      )}
    >
      {children}
    </span>
  );
}
