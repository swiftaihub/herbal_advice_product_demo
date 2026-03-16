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

export function buildMetadata({
  locale,
  pathname,
  title,
  description,
  image = socialPreviewImage,
  noIndex = false,
}: {
  locale: Locale;
  pathname: string;
  title?: string;
  description?: string;
  image?: string;
  noIndex?: boolean;
}): Metadata {
  const pageTitle = title ? `${title} | ${brandName[locale]}` : brandName[locale];
  const pageDescription = description ?? brandDescription[locale];
  const currentPath = withLocale(pathname, locale);

  const languages = Object.fromEntries(
    locales.map((supportedLocale) => [
      supportedLocale,
      absoluteUrl(withLocale(pathname, supportedLocale)),
    ]),
  );

  return {
    metadataBase: new URL(siteOrigin),
    title: pageTitle,
    description: pageDescription,
    alternates: {
      canonical: absoluteUrl(currentPath),
      languages,
    },
    openGraph: {
      type: "website",
      locale: locale === "zh" ? "zh_CN" : "en_US",
      url: absoluteUrl(currentPath),
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
