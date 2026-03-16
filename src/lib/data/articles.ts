import "server-only";

import { cache } from "react";

import { articleRecords } from "@/lib/data/article-records.generated";
import type { Article, Locale } from "@/lib/types";

export const getAllArticleMeta = cache(async () => {
  const articles = Object.values(articleRecords).map((record) => record.meta);

  return articles.sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  );
});

export async function getFeaturedArticles(limit = 3) {
  const articles = await getAllArticleMeta();

  return articles.filter((article) => article.featured).slice(0, limit);
}

export async function getArticleBySlug(slug: string, locale: Locale) {
  const record = articleRecords[slug];

  if (!record) {
    return undefined;
  }

  const article: Article = {
    ...record.meta,
    bodyHtml: record.bodyHtml[locale],
    readingMinutes: record.readingMinutes[locale],
  };

  return article;
}

export async function getRelatedArticlesForProduct(productSlug: string, limit = 3) {
  const articles = await getAllArticleMeta();

  return articles
    .filter((article) => article.relatedProducts.includes(productSlug))
    .slice(0, limit);
}

export async function getRelatedArticlesForIngredient(
  ingredientSlug: string,
  limit = 3,
) {
  const articles = await getAllArticleMeta();

  return articles
    .filter((article) => article.relatedIngredients.includes(ingredientSlug))
    .slice(0, limit);
}
