import type { MetadataRoute } from "next";

import { locales, withLocale } from "@/i18n/config";
import { getAllArticleMeta } from "@/lib/data/articles";
import { getAllIngredients } from "@/lib/data/ingredients";
import { getActiveProducts } from "@/lib/data/products";
import { absoluteUrl } from "@/lib/utils";

export const dynamic = "force-static";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, ingredients, articles] = await Promise.all([
    getActiveProducts(),
    getAllIngredients(),
    getAllArticleMeta(),
  ]);

  const staticRoutes = [
    "/shop",
    "/ingredients",
    "/articles",
    "/ai-guide",
    "/about",
    "/faq",
    "/contact",
    "/privacy",
    "/terms",
    "/disclaimer",
    "/",
  ];

  const localizedStatic = locales.flatMap((locale) =>
    staticRoutes.map((route) => ({
      url: absoluteUrl(withLocale(route, locale)),
      changeFrequency: route === "/" ? ("weekly" as const) : ("monthly" as const),
      priority: route === "/" ? 1 : 0.7,
    })),
  );

  const localizedProducts = locales.flatMap((locale) =>
    products.map((product) => ({
      url: absoluteUrl(withLocale(`/products/${product.slug}`, locale)),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  );

  const localizedIngredients = locales.flatMap((locale) =>
    ingredients.map((ingredient) => ({
      url: absoluteUrl(withLocale(`/ingredients/${ingredient.slug}`, locale)),
      changeFrequency: "monthly" as const,
      priority: 0.75,
    })),
  );

  const localizedArticles = locales.flatMap((locale) =>
    articles.map((article) => ({
      url: absoluteUrl(withLocale(`/articles/${article.slug}`, locale)),
      lastModified: article.publishedAt,
      changeFrequency: "monthly" as const,
      priority: 0.76,
    })),
  );

  return [
    ...localizedStatic,
    ...localizedProducts,
    ...localizedIngredients,
    ...localizedArticles,
  ];
}
