import { Instagram, Mail, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LocaleLink } from "@/components/layout/locale-link";
import { aiGuideUrl, contactEmail } from "@/lib/site";
import type { Locale } from "@/lib/types";

interface FooterProps {
  locale: Locale;
  brandName: string;
  footer: {
    discovery: string;
    support: string;
    legal: string;
    newsletter: string;
    rights: string;
  };
  navigation: {
    shop: string;
    ingredients: string;
    articles: string;
    aiGuide: string;
    faq: string;
    contact: string;
    about: string;
  };
  legal: {
    privacy: string;
    terms: string;
    disclaimer: string;
  };
  newsletterTitle: string;
  newsletterBody: string;
}

export function SiteFooter({
  locale,
  brandName,
  footer,
  navigation,
  legal,
  newsletterTitle,
  newsletterBody,
}: FooterProps) {
  return (
    <footer className="border-t border-[rgba(111,89,64,0.1)] bg-[rgba(243,236,226,0.92)]">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:grid-cols-2 sm:gap-10 sm:px-6 sm:py-14 lg:grid-cols-[1.2fr_0.8fr_0.8fr_0.8fr] lg:px-8">
        <div className="space-y-4 sm:col-span-2 lg:col-span-1 lg:space-y-5">
          <p className="font-display text-[2rem] text-[var(--color-ink)] sm:text-3xl">{brandName}</p>
          <p className="max-w-md text-sm leading-7 text-[var(--color-muted)]">
            {newsletterBody}
          </p>
          <form className="space-y-3 rounded-[1.6rem] border border-[rgba(111,89,64,0.1)] bg-white/70 p-4 sm:rounded-[2rem] sm:p-5">
            <div className="space-y-2">
              <p className="font-medium text-[var(--color-ink)]">{newsletterTitle}</p>
              <p className="text-sm leading-6 text-[var(--color-muted)]">
                {footer.newsletter}
              </p>
            </div>
            <Input type="email" placeholder={contactEmail} />
            <Button type="button" className="w-full">
              {newsletterTitle}
            </Button>
          </form>
          <div className="flex items-center gap-3 text-[var(--color-muted)]">
            <a
              href={`mailto:${contactEmail}`}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[rgba(111,89,64,0.12)] bg-white/80 transition hover:border-[var(--color-accent)]"
            >
              <Mail className="h-4 w-4" />
            </a>
            <a
              href={aiGuideUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[rgba(111,89,64,0.12)] bg-white/80 transition hover:border-[var(--color-accent)]"
            >
              <Sparkles className="h-4 w-4" />
            </a>
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[rgba(111,89,64,0.12)] bg-white/80">
              <Instagram className="h-4 w-4" />
            </span>
          </div>
        </div>
        <div className="space-y-4">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-accent)]">
            {footer.discovery}
          </p>
          <div className="space-y-3 text-sm text-[var(--color-muted)]">
            <LocaleLink href="/shop" locale={locale} className="block hover:text-[var(--color-ink)]">
              {navigation.shop}
            </LocaleLink>
            <LocaleLink href="/ingredients" locale={locale} className="block hover:text-[var(--color-ink)]">
              {navigation.ingredients}
            </LocaleLink>
            <LocaleLink href="/articles" locale={locale} className="block hover:text-[var(--color-ink)]">
              {navigation.articles}
            </LocaleLink>
            <LocaleLink href="/ai-guide" locale={locale} className="block hover:text-[var(--color-ink)]">
              {navigation.aiGuide}
            </LocaleLink>
          </div>
        </div>
        <div className="space-y-4">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-accent)]">
            {footer.support}
          </p>
          <div className="space-y-3 text-sm text-[var(--color-muted)]">
            <LocaleLink href="/about" locale={locale} className="block hover:text-[var(--color-ink)]">
              {navigation.about}
            </LocaleLink>
            <LocaleLink href="/faq" locale={locale} className="block hover:text-[var(--color-ink)]">
              {navigation.faq}
            </LocaleLink>
            <LocaleLink href="/contact" locale={locale} className="block hover:text-[var(--color-ink)]">
              {navigation.contact}
            </LocaleLink>
          </div>
        </div>
        <div className="space-y-4">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-accent)]">
            {footer.legal}
          </p>
          <div className="space-y-3 text-sm text-[var(--color-muted)]">
            <LocaleLink href="/privacy" locale={locale} className="block hover:text-[var(--color-ink)]">
              {legal.privacy}
            </LocaleLink>
            <LocaleLink href="/terms" locale={locale} className="block hover:text-[var(--color-ink)]">
              {legal.terms}
            </LocaleLink>
            <LocaleLink href="/disclaimer" locale={locale} className="block hover:text-[var(--color-ink)]">
              {legal.disclaimer}
            </LocaleLink>
          </div>
        </div>
      </div>
      <div className="border-t border-[rgba(111,89,64,0.08)]">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-5 text-sm text-[var(--color-muted)] sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
          <span>
            © {new Date().getFullYear()} {brandName}. {footer.rights}
          </span>
          <span>{contactEmail}</span>
        </div>
      </div>
    </footer>
  );
}
