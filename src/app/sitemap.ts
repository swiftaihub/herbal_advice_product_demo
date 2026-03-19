import type { MetadataRoute } from "next";

import { locales, withLocale } from "@/i18n/config";
import { getContentUrl } from "@/lib/content-links";
import { getAllArticleEntries } from "@/lib/data/articles";
import { getAllIngredients } from "@/lib/data/ingredients";
import { getActiveProducts } from "@/lib/data/products";
import { absoluteUrl } from "@/lib/utils";

export const dynamic = "force-static";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, ingredients, articles] = await Promise.all([
    getActiveProducts(),
    getAllIngredients(),
    getAllArticleEntries(),
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
      url: getContentUrl(product, "products", locale),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  );

  const localizedIngredients = locales.flatMap((locale) =>
    ingredients.map((ingredient) => ({
      url: getContentUrl(ingredient, "ingredients", locale),
      changeFrequency: "monthly" as const,
      priority: 0.75,
    })),
  );

  const localizedArticles = articles.map((article) => ({
    url: getContentUrl(article, "articles", article.locale),
    lastModified: article.updatedAt ?? article.publishedAt,
    changeFrequency: "monthly" as const,
    priority: 0.76,
  }));

  return [
    ...localizedStatic,
    ...localizedProducts,
    ...localizedIngredients,
    ...localizedArticles,
  ];
}
