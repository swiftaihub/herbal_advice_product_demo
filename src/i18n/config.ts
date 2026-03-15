import type { Locale } from "@/lib/types";

export const locales: Locale[] = ["en", "zh"];
export const defaultLocale: Locale = "en";
export const localeCookieName = "site-locale";

export function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}

export function stripLocaleFromPathname(pathname: string): string {
  const segments = pathname.split("/");
  if (segments[1] && isLocale(segments[1])) {
    const nextPath = `/${segments.slice(2).join("/")}`.replace(/\/$/, "");
    return nextPath === "" ? "/" : nextPath;
  }

  return pathname || "/";
}

export function withLocale(pathname: string, locale: Locale): string {
  const normalized = pathname.startsWith("/") ? pathname : `/${pathname}`;
  const stripped = stripLocaleFromPathname(normalized);

  return stripped === "/" ? `/${locale}` : `/${locale}${stripped}`;
}
