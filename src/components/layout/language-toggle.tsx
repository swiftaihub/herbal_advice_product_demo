"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { localeCookieName, stripLocaleFromPathname, withLocale } from "@/i18n/config";
import type { Locale } from "@/lib/types";
import { cn } from "@/lib/utils";

export function LanguageToggle({
  locale,
  label,
}: {
  locale: Locale;
  label: string;
}) {
  const pathname = usePathname();
  const nextLocale = locale === "en" ? "zh" : "en";
  const stripped = stripLocaleFromPathname(pathname);
  const nextHref = withLocale(stripped, nextLocale);

  return (
    <Link
      href={nextHref}
      prefetch={false}
      className={cn(
        "inline-flex h-11 items-center rounded-full border border-[var(--color-line)] bg-white/80 px-4 text-xs font-semibold tracking-[0.16em] text-[var(--color-ink)] transition hover:border-[var(--color-accent)] hover:bg-white",
      )}
      onClick={() => {
        document.cookie = `${localeCookieName}=${nextLocale}; path=/; max-age=31536000; SameSite=Lax`;
      }}
    >
      {label}
    </Link>
  );
}
