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
      className={`relative overflow-hidden rounded-[2.25rem] border border-[rgba(176,136,74,0.18)] bg-[linear-gradient(145deg,rgba(246,239,229,0.96),rgba(255,255,255,0.92))] p-6 shadow-[0_18px_40px_rgba(24,21,17,0.06)] ${compact ? "md:p-7" : "md:p-10"}`}
    >
      <div className="absolute inset-y-0 right-0 hidden w-64 bg-[radial-gradient(circle_at_center,rgba(176,136,74,0.16),transparent_68%)] md:block" />
      <div className="relative flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div className="max-w-2xl space-y-4">
          <span className="inline-flex items-center gap-2 rounded-full bg-[rgba(176,136,74,0.12)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-accent)]">
            <Sparkles className="h-4 w-4" />
            Helper AI
          </span>
          <div className="space-y-3">
            <h2 className="font-display text-3xl leading-tight text-[var(--color-ink)] md:text-5xl">
              {title}
            </h2>
            <p className="max-w-2xl text-base leading-8 text-[var(--color-copy)]">
              {description}
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
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
