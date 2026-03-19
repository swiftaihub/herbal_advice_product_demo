import type { Metadata } from "next";
import Link from "next/link";

import { buttonStyles } from "@/components/ui/button";
import { withLocale } from "@/i18n/config";
import { brandName, brandTagline } from "@/lib/site";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: brandName.en,
  description: brandTagline.en,
  robots: {
    follow: true,
    index: false,
  },
};

export default function RootPage() {
  return (
    <main className="relative z-[1] flex min-h-screen items-center justify-center px-4 py-16">
      <div className="w-full max-w-3xl rounded-[2.75rem] border border-[rgba(111,89,64,0.12)] bg-white/80 p-10 text-center shadow-[0_18px_50px_rgba(24,21,17,0.06)] md:p-14">
        <p className="text-xs font-semibold uppercase tracking-[0.26em] text-[var(--color-accent)]">
          Herbal Atelier
        </p>
        <h1 className="mt-5 font-display text-5xl text-[var(--color-ink)] md:text-6xl">
          Choose your language
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-[var(--color-copy)]">
          Start with the fully static storefront in English or Chinese. Canonical
          public pages live under locale-prefixed routes only.
        </p>
        <div className="mt-10 grid gap-3 sm:grid-cols-2">
          <Link
            href={withLocale("/", "en")}
            prefetch={false}
            className="block"
          >
            <span
              className={buttonStyles({
                size: "lg",
                className:
                  "w-full text-base font-bold tracking-[0.02em] shadow-[0_18px_38px_rgba(24,21,17,0.22)]",
              })}
              style={{ color: "#ffffff" }}
            >
              English
            </span>
          </Link>
          <Link
            href={withLocale("/", "zh")}
            prefetch={false}
            className="block"
          >
            <span
              className={buttonStyles({
                variant: "secondary",
                size: "lg",
                className: "w-full text-base font-semibold tracking-[0.02em]",
              })}
            >
              中文
            </span>
          </Link>
        </div>
      </div>
    </main>
  );
}
