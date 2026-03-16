import type { Locale, LocalizedString } from "@/lib/types";

const configuredSiteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.trim() || "https://example.com";

const parsedSiteUrl = new URL(configuredSiteUrl);

export const siteOrigin = parsedSiteUrl.origin;
export const siteBasePath =
  parsedSiteUrl.pathname !== "/" ? parsedSiteUrl.pathname.replace(/\/+$/, "") : "";
export const siteUrl = `${siteOrigin}${siteBasePath}`;

export const brandName: LocalizedString = {
  en: "Herbal Atelier",
  zh: "草本茶序",
};

export const brandTagline: LocalizedString = {
  en: "Editorial herbal wellness teas for modern daily rituals.",
  zh: "为现代日常仪式而设的草本养生茶。",
};

export const brandDescription: LocalizedString = {
  en: "A bilingual herbal wellness tea storefront blending premium storytelling, product discovery, and guided AI recommendations.",
  zh: "一个融合品牌叙事、产品发现与 AI 引导推荐的双语草本茶内容电商网站。",
};

export const socialPreviewImage = "/images/brand/hero.jpg";

export const aiGuideUrl = "https://chat.swiftaihub.com/ui/herbal_advice";

export const contactEmail = "hello@herbalatelier.com";

export const newsletterPlaceholderTitle: LocalizedString = {
  en: "Stay close to new rituals",
  zh: "接收新的茶饮灵感",
};

export function getSiteName(locale: Locale) {
  return brandName[locale];
}

export function toSitePath(pathname: string) {
  const normalizedPath = pathname.startsWith("/") ? pathname : `/${pathname}`;

  return `${siteBasePath}${normalizedPath}` || "/";
}
