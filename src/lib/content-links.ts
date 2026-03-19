import { locales, withLocale } from "@/i18n/config";
import type { Locale, LocalizedLinks } from "@/lib/types";
import { absoluteUrl } from "@/lib/utils";

export type ContentSection = "products" | "ingredients" | "articles";

export interface LinkableContent {
  slug: string;
  links?: LocalizedLinks;
}

function normalizePath(path: string) {
  const [pathWithQuery, hash = ""] = path.split("#", 2);
  const [pathname, query = ""] = pathWithQuery.split("?", 2);
  const normalizedPathname = pathname.replace(/\/{2,}/g, "/").replace(/\/$/, "") || "/";

  return [
    normalizedPathname,
    query ? `?${query}` : "",
    hash ? `#${hash}` : "",
  ].join("");
}

function parseLocalizedLinkPath(link?: string) {
  const trimmed = link?.trim();

  if (!trimmed) {
    return undefined;
  }

  if (trimmed.startsWith("/")) {
    return normalizePath(trimmed);
  }

  try {
    const url = new URL(trimmed);
    return normalizePath(`${url.pathname}${url.search}${url.hash}`);
  } catch {
    return undefined;
  }
}

function normalizeLocalizedLink(link?: string) {
  const trimmed = link?.trim();

  if (!trimmed) {
    return undefined;
  }

  if (trimmed.startsWith("/")) {
    return absoluteUrl(normalizePath(trimmed));
  }

  try {
    const url = new URL(trimmed);
    url.pathname = normalizePath(url.pathname);

    return url.toString();
  } catch {
    return undefined;
  }
}

function buildLegacyLocalizedPath(
  section: ContentSection,
  slug: string,
  locale: Locale,
) {
  return withLocale(`/${section}/${slug}`, locale);
}

export function getContentPath<T extends LinkableContent>(
  entry: T,
  section: ContentSection,
  locale: Locale,
) {
  return (
    parseLocalizedLinkPath(entry.links?.[locale]) ??
    buildLegacyLocalizedPath(section, entry.slug, locale)
  );
}

export function getContentUrl<T extends LinkableContent>(
  entry: T,
  section: ContentSection,
  locale: Locale,
) {
  return (
    normalizeLocalizedLink(entry.links?.[locale]) ??
    absoluteUrl(buildLegacyLocalizedPath(section, entry.slug, locale))
  );
}

export function getContentLanguageAlternates<T extends LinkableContent>(
  entry: T,
  section: ContentSection,
  supportedLocales = locales,
) {
  return Object.fromEntries(
    supportedLocales.map((locale) => [locale, getContentUrl(entry, section, locale)]),
  ) as Partial<Record<Locale, string>>;
}

export function getContentRouteSegments<T extends LinkableContent>(
  entry: T,
  section: ContentSection,
  locale: Locale,
) {
  const localizedPath = parseLocalizedLinkPath(entry.links?.[locale]);

  if (!localizedPath) {
    return [entry.slug];
  }

  const pathname = localizedPath.split(/[?#]/, 1)[0];
  const segments = pathname.split("/").filter(Boolean);

  if (segments[0] === locale && segments[1] === section && segments.length > 2) {
    return segments.slice(2);
  }

  if (segments[0] === section && segments.length > 1) {
    return segments.slice(1);
  }

  return [entry.slug];
}
