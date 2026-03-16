import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

import { siteOrigin, toSitePath } from "@/lib/site";
import type { Locale, LocalizedString } from "@/lib/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(
  value: number,
  currency: string,
  locale: Locale,
) {
  return new Intl.NumberFormat(locale === "zh" ? "zh-CN" : "en-US", {
    style: "currency",
    currency,
  }).format(value);
}

export function localizeValue(value: LocalizedString, locale: Locale) {
  return value[locale];
}

export function titleCaseFromSlug(input: string) {
  return input
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function clamp(input: string, maxLength: number) {
  return input.length > maxLength ? `${input.slice(0, maxLength - 1)}…` : input;
}

export function readingMinutesFromText(input: string) {
  const wordCount = input.trim().split(/\s+/).length;
  return Math.max(2, Math.round(wordCount / 180));
}

export function localizeSize(size: string, locale: Locale) {
  if (locale === "en") {
    return size;
  }

  const match = size.match(/^(\d+)\s+sachets$/i);

  if (!match) {
    return size;
  }

  return `${match[1]} 袋茶包`;
}

export function formatDate(value: string, locale: Locale) {
  return new Intl.DateTimeFormat(locale === "zh" ? "zh-CN" : "en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

export function absoluteUrl(pathname: string) {
  return new URL(toSitePath(pathname), `${siteOrigin}/`).toString();
}
