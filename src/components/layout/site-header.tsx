"use client";

import Image from "next/image";
import Link from "next/link";
import { Menu, ShoppingBag, Sparkles, UserRound, X } from "lucide-react";
import { useState } from "react";
import { usePathname } from "next/navigation";

import { useCart } from "@/components/providers/cart-provider";
import { LanguageToggle } from "@/components/layout/language-toggle";
import { withLocale } from "@/i18n/config";
import type { Locale } from "@/lib/types";
import { cn } from "@/lib/utils";

type HeaderNavigation = {
  shop: string;
  ingredients: string;
  articles: string;
  aiGuide: string;
  about: string;
};

interface HeaderProps {
  locale: Locale;
  brandName: string;
  brandLabel: string;
  accountLabel: string;
  cartLabel: string;
  navigation: HeaderNavigation;
  common: {
    menu: string;
  };
  localeLabel: string;
}

export function SiteHeader({
  locale,
  brandName,
  brandLabel,
  accountLabel,
  cartLabel,
  navigation,
  common,
  localeLabel,
}: HeaderProps) {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { count, openDrawer } = useCart();

  const navItems = [
    { href: "/shop", label: navigation.shop },
    { href: "/ingredients", label: navigation.ingredients },
    { href: "/articles", label: navigation.articles },
    { href: "/ai-guide", label: navigation.aiGuide, icon: Sparkles },
    { href: "/about", label: navigation.about },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-[rgba(111,89,64,0.08)] bg-[rgba(250,245,238,0.78)] backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-3.5 py-3 sm:px-6 sm:py-4 lg:px-8">
        <div className="flex items-center gap-4 sm:gap-5">
          <Link
            href={withLocale("/", locale)}
            prefetch={false}
            className="flex items-center gap-3"
          >
            <div className="relative h-10 w-10 overflow-hidden rounded-full border border-[rgba(176,136,74,0.18)] bg-white/80 sm:h-12 sm:w-12">
              <Image
                src="/images/brand/logo-mark.png"
                alt={brandName}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 40px, 48px"
              />
            </div>
            <div className="hidden sm:block">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-accent)]">
                {brandLabel}
              </p>
              <p className="font-display text-2xl text-[var(--color-ink)]">
                {brandName}
              </p>
            </div>
          </Link>
          <nav className="hidden items-center gap-1 lg:flex">
            {navItems.map((item) => {
              const active =
                pathname === withLocale(item.href, locale) ||
                pathname.startsWith(`${withLocale(item.href, locale)}/`);
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={withLocale(item.href, locale)}
                  prefetch={false}
                  onClick={() => setIsMenuOpen(false)}
                  className={cn(
                    "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition",
                    active
                      ? "bg-[rgba(176,136,74,0.12)] text-[var(--color-ink)]"
                      : "text-[var(--color-muted)] hover:bg-white/70 hover:text-[var(--color-ink)]",
                  )}
                >
                  {Icon ? <Icon className="h-4 w-4" /> : null}
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="hidden md:block">
            <LanguageToggle locale={locale} label={localeLabel} />
          </div>
          <Link
            href={withLocale("/sign-in", locale)}
            prefetch={false}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--color-line)] bg-white/80 text-[var(--color-ink)] transition hover:border-[var(--color-accent)] hover:bg-white sm:h-11 sm:w-11"
            aria-label={accountLabel}
          >
            <UserRound className="h-5 w-5" />
          </Link>
          <button
            type="button"
            onClick={openDrawer}
            className="relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--color-line)] bg-white/80 text-[var(--color-ink)] transition hover:border-[var(--color-accent)] hover:bg-white sm:h-11 sm:w-11"
            aria-label={cartLabel}
          >
            <ShoppingBag className="h-5 w-5" />
            {count > 0 ? (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[var(--color-ink)] px-1 text-[10px] font-semibold text-[var(--color-paper)]">
                {count}
              </span>
            ) : null}
          </button>
          <button
            type="button"
            onClick={() => setIsMenuOpen((current) => !current)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--color-line)] bg-white/80 text-[var(--color-ink)] transition hover:border-[var(--color-accent)] hover:bg-white sm:h-11 sm:w-11 lg:hidden"
            aria-label={common.menu}
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>
      <div
        className={cn(
          "border-t border-[rgba(111,89,64,0.08)] bg-[rgba(250,245,238,0.94)] px-4 transition lg:hidden",
          isMenuOpen ? "max-h-[480px] py-3 opacity-100 sm:py-4" : "max-h-0 overflow-hidden py-0 opacity-0",
        )}
      >
        <div className="mx-auto max-w-7xl space-y-2 sm:px-2">
          <div className="pb-2 md:hidden">
            <LanguageToggle locale={locale} label={localeLabel} />
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={withLocale(item.href, locale)}
                prefetch={false}
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center justify-between rounded-2xl border border-transparent bg-white/65 px-4 py-3 text-sm font-medium text-[var(--color-ink)] transition hover:border-[var(--color-line)]"
              >
                <span>{item.label}</span>
                {Icon ? <Icon className="h-4 w-4 text-[var(--color-accent)]" /> : null}
              </Link>
            );
          })}
        </div>
      </div>
    </header>
  );
}
