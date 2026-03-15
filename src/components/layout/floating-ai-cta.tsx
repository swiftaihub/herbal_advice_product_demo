import { Sparkles } from "lucide-react";

import { LocaleLink } from "@/components/layout/locale-link";
import type { Locale } from "@/lib/types";

export function FloatingAiCta({
  locale,
  label,
}: {
  locale: Locale;
  label: string;
}) {
  return (
    <div className="fixed bottom-5 right-5 z-40 hidden md:block">
      <LocaleLink
        href="/ai-guide"
        locale={locale}
        className="inline-flex items-center gap-3 rounded-full border border-[rgba(176,136,74,0.24)] bg-[rgba(34,30,22,0.94)] px-5 py-3 text-sm font-medium text-[var(--color-paper)] shadow-[0_18px_40px_rgba(24,21,17,0.24)] transition hover:-translate-y-0.5"
      >
        <Sparkles className="h-4 w-4 text-[var(--color-sun)]" />
        {label}
      </LocaleLink>
    </div>
  );
}
