import "server-only";

import { cache } from "react";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

import { compileMDX } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";

import { mdxComponents } from "@/components/mdx/mdx-components";
import type { Article, ArticleMeta, Locale } from "@/lib/types";
import { readingMinutesFromText } from "@/lib/utils";

const articlesDirectory = path.join(process.cwd(), "content", "articles");

async function listArticleSlugs() {
  const entries = await readdir(articlesDirectory, { withFileTypes: true });

  return entries.filter((entry) => entry.isDirectory()).map((entry) => entry.name);
}

async function readArticleMeta(slug: string) {
  const file = await readFile(
    path.join(articlesDirectory, slug, "meta.json"),
    "utf8",
  );

  return JSON.parse(file) as ArticleMeta;
}

export const getAllArticleMeta = cache(async () => {
  const slugs = await listArticleSlugs();
  const articles = await Promise.all(slugs.map(readArticleMeta));

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
  const meta = await readArticleMeta(slug);
  const source = await readFile(
    path.join(articlesDirectory, slug, `${locale}.mdx`),
    "utf8",
  );
  const compiled = await compileMDX({
    source,
    options: {
      mdxOptions: {
        remarkPlugins: [remarkGfm],
      },
      parseFrontmatter: false,
    },
    components: mdxComponents,
  });

  const article: Article = {
    ...meta,
    body: compiled.content,
    readingMinutes: readingMinutesFromText(source),
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
