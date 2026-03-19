import type { Metadata } from "next";

import { locales, withLocale } from "@/i18n/config";
import {
  brandDescription,
  brandName,
  siteOrigin,
  socialPreviewImage,
} from "@/lib/site";
import type { Locale } from "@/lib/types";
import { absoluteUrl } from "@/lib/utils";

function toMetadataUrl(url: string) {
  if (url.startsWith("/")) {
    return absoluteUrl(url);
  }

  return url;
}

export function buildMetadata({
  locale,
  pathname,
  title,
  description,
  image = socialPreviewImage,
  noIndex = false,
  canonicalUrl,
  languageAlternates,
}: {
  locale: Locale;
  pathname: string;
  title?: string;
  description?: string;
  image?: string;
  noIndex?: boolean;
  canonicalUrl?: string;
  languageAlternates?: Partial<Record<Locale, string>>;
}): Metadata {
  const pageTitle = title ? `${title} | ${brandName[locale]}` : brandName[locale];
  const pageDescription = description ?? brandDescription[locale];
  const currentUrl = toMetadataUrl(
    canonicalUrl ?? absoluteUrl(withLocale(pathname, locale)),
  );

  const languages = languageAlternates
    ? Object.fromEntries(
        Object.entries(languageAlternates)
          .filter(([, url]) => Boolean(url))
          .map(([supportedLocale, url]) => [
            supportedLocale,
            toMetadataUrl(url as string),
          ]),
      )
    : Object.fromEntries(
        locales.map((supportedLocale) => [
          supportedLocale,
          toMetadataUrl(absoluteUrl(withLocale(pathname, supportedLocale))),
        ]),
      );

  return {
    metadataBase: new URL(siteOrigin),
    title: pageTitle,
    description: pageDescription,
    alternates: {
      canonical: currentUrl,
      languages: Object.keys(languages).length > 0 ? languages : undefined,
    },
    openGraph: {
      type: "website",
      locale: locale === "zh" ? "zh_CN" : "en_US",
      url: currentUrl,
      title: pageTitle,
      description: pageDescription,
      siteName: brandName[locale],
      images: [
        {
          url: absoluteUrl(image),
          width: 1200,
          height: 630,
          alt: brandName[locale],
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description: pageDescription,
      images: [absoluteUrl(image)],
    },
    robots: noIndex
      ? {
          follow: false,
          index: false,
        }
      : undefined,
  };
}
