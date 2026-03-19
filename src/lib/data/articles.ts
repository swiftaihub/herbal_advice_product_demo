import "server-only";
import { cache } from "react";

import { generatedArticles } from "@/lib/data/article-bundle.generated";
import type { Article, ArticleMeta, Locale } from "@/lib/types";

function toArticleMeta(article: Article): ArticleMeta {
  return {
    slug: article.slug,
    locale: article.locale,
    availableLocales: article.availableLocales,
    title: article.title,
    excerpt: article.excerpt,
    category: article.category,
    tags: article.tags,
    coverImage: article.coverImage,
    featured: article.featured,
    publishedAt: article.publishedAt,
    updatedAt: article.updatedAt,
    readingTheme: article.readingTheme,
    relatedProducts: article.relatedProducts,
    relatedIngredients: article.relatedIngredients,
    seoTitle: article.seoTitle,
    seoDescription: article.seoDescription,
    links: article.links,
  };
}

const loadAllArticles = cache(async (): Promise<Article[]> => {
  const records = generatedArticles as Article[];

  return [...records].sort((left, right) => {
    const byDate =
      new Date(right.updatedAt ?? right.publishedAt).getTime() -
      new Date(left.updatedAt ?? left.publishedAt).getTime();

    if (byDate !== 0) {
      return byDate;
    }

    return left.slug.localeCompare(right.slug);
  });
});

export const getAllArticleMeta = cache(async (locale: Locale) => {
  const records = await loadAllArticles();

  return records
    .filter((record) => record.locale === locale)
    .map((record) => toArticleMeta(record));
});

export const getAllArticleEntries = cache(async () => {
  const records = await loadAllArticles();

  return records.map((record) => toArticleMeta(record));
});

export const getAllArticleSlugs = cache(async () => {
  const records = await loadAllArticles();

  return [...new Set(records.map((record) => record.slug))].sort((a, b) =>
    a.localeCompare(b),
  );
});

export async function getFeaturedArticles(locale: Locale, limit = 3) {
  const articles = await getAllArticleMeta(locale);

  return articles.filter((article) => article.featured).slice(0, limit);
}

export async function getArticleBySlug(slug: string, locale: Locale) {
  const records = await loadAllArticles();

  return records.find(
    (record) => record.slug === slug && record.locale === locale,
  );
}

export async function getRelatedArticlesForProduct(
  productSlug: string,
  locale: Locale,
  limit = 3,
) {
  const articles = await getAllArticleMeta(locale);

  return articles
    .filter((article) => article.relatedProducts.includes(productSlug))
    .slice(0, limit);
}

export async function getRelatedArticlesForIngredient(
  ingredientSlug: string,
  locale: Locale,
  limit = 3,
) {
  const articles = await getAllArticleMeta(locale);

  return articles
    .filter((article) => article.relatedIngredients.includes(ingredientSlug))
    .slice(0, limit);
}
