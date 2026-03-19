import { ArrowUpRight, Sparkles } from "lucide-react";

import { LocaleLink } from "@/components/layout/locale-link";
import { Button } from "@/components/ui/button";
import { aiGuideUrl } from "@/lib/site";
import type { Locale } from "@/lib/types";

export function HelperAiPanel({
  locale,
  title,
  description,
  primaryLabel,
  secondaryLabel,
  compact = false,
}: {
  locale: Locale;
  title: string;
  description: string;
  primaryLabel: string;
  secondaryLabel: string;
  compact?: boolean;
}) {
  return (
    <section
      className={`relative overflow-hidden rounded-[1.9rem] border border-[rgba(176,136,74,0.18)] bg-[linear-gradient(145deg,rgba(246,239,229,0.96),rgba(255,255,255,0.92))] p-5 shadow-[0_18px_40px_rgba(24,21,17,0.06)] sm:rounded-[2.25rem] sm:p-6 ${compact ? "md:p-7" : "md:p-10"}`}
    >
      <div className="absolute inset-y-0 right-0 hidden w-64 bg-[radial-gradient(circle_at_center,rgba(176,136,74,0.16),transparent_68%)] md:block" />
      <div className="relative flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div className="max-w-2xl space-y-3">
          <span className="inline-flex items-center gap-2 rounded-full bg-[rgba(176,136,74,0.12)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--color-accent)] sm:text-xs sm:tracking-[0.22em]">
            <Sparkles className="h-4 w-4" />
            Helper AI
          </span>
          <div className="space-y-2.5">
            <h2 className="font-display text-[2rem] leading-[1.02] text-[var(--color-ink)] md:text-5xl">
              {title}
            </h2>
            <p className="max-w-2xl text-sm leading-6 text-[var(--color-copy)] sm:text-base sm:leading-7">
              {description}
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-2.5 min-[360px]:flex-row">
          <LocaleLink href="/ai-guide" locale={locale}>
            <Button>{primaryLabel}</Button>
          </LocaleLink>
          <a href={aiGuideUrl} target="_blank" rel="noreferrer">
            <Button variant="secondary" icon={<ArrowUpRight className="h-4 w-4" />}>
              {secondaryLabel}
            </Button>
          </a>
        </div>
      </div>
    </section>
  );
}
