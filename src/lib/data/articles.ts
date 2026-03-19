import "server-only";

import { promises as fs } from "node:fs";
import path from "node:path";

import matter from "gray-matter";
import { cache } from "react";
import { z } from "zod";

import type { Article, ArticleMeta, Locale, LocalizedLinks } from "@/lib/types";
import { readingMinutesFromText } from "@/lib/utils";

const articlesRoot = path.join(process.cwd(), "content", "articles");
const articleFilePattern = /^(en|zh)\.(md|mdx)$/i;
const localeOrder: Locale[] = ["en", "zh"];

const dateSchema = z
  .union([z.string(), z.date()])
  .transform((value) =>
    typeof value === "string"
      ? value.trim()
      : value.toISOString().slice(0, 10),
  )
  .refine(
    (value) => Boolean(value) && !Number.isNaN(new Date(value).getTime()),
    "must be a valid ISO-like date",
  )
  .transform((value) => new Date(value).toISOString().slice(0, 10));

const linkSchema = z
  .string()
  .trim()
  .min(1)
  .refine(
    (value) => value.startsWith("/") || /^https?:\/\//.test(value),
    "must be an absolute URL or a root-relative path",
  )
  .optional();

const articleFrontmatterSchema = z.object({
  title: z.string().trim().min(1),
  excerpt: z.string().trim().min(1),
  category: z.string().trim().min(1),
  tags: z.array(z.string().trim().min(1)).default([]),
  coverImage: z.string().trim().min(1),
  featured: z.boolean().default(false),
  publishedAt: dateSchema,
  updatedAt: dateSchema.optional(),
  readingTheme: z.enum(["serif", "sans"]).default("serif"),
  relatedProducts: z.array(z.string().trim().min(1)).default([]),
  relatedIngredients: z.array(z.string().trim().min(1)).default([]),
  seoTitle: z.string().trim().min(1).optional(),
  seoDescription: z.string().trim().min(1).optional(),
  link: linkSchema,
});

type ArticleFrontmatter = z.infer<typeof articleFrontmatterSchema>;

interface ArticleVariantSource {
  locale: Locale;
  filePath: string;
  body: string;
  frontmatter: ArticleFrontmatter;
}

function compareField<T>(slug: string, fieldName: string, first: T, second: T) {
  if (JSON.stringify(first) !== JSON.stringify(second)) {
    throw new Error(
      `Article "${slug}" has mismatched shared frontmatter for "${fieldName}" across locale files.`,
    );
  }
}

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

async function readArticleVariant(
  slug: string,
  locale: Locale,
  filePath: string,
): Promise<ArticleVariantSource> {
  const rawSource = await fs.readFile(filePath, "utf8");
  const parsed = matter(rawSource);
  const body = parsed.content.trim();

  if (!body) {
    throw new Error(`Article "${slug}" locale "${locale}" has no body content.`);
  }

  const result = articleFrontmatterSchema.safeParse(parsed.data);

  if (!result.success) {
    const flattened = result.error.issues
      .map((issue) => {
        const pathLabel = issue.path.length > 0 ? issue.path.join(".") : "frontmatter";
        return `${pathLabel}: ${issue.message}`;
      })
      .join("; ");

    throw new Error(
      `Invalid frontmatter in ${path.relative(process.cwd(), filePath)}: ${flattened}`,
    );
  }

  return {
    locale,
    filePath,
    body,
    frontmatter: result.data,
  };
}

const loadAllArticles = cache(async (): Promise<Article[]> => {
  const directoryEntries = await fs.readdir(articlesRoot, { withFileTypes: true });
  const records: Article[] = [];

  for (const entry of directoryEntries) {
    if (!entry.isDirectory()) {
      continue;
    }

    const slug = entry.name;
    const articleDirectory = path.join(articlesRoot, slug);
    const files = await fs.readdir(articleDirectory, { withFileTypes: true });
    const localeFiles = files.filter(
      (file) => file.isFile() && articleFilePattern.test(file.name),
    );

    if (localeFiles.length === 0) {
      throw new Error(
        `Article "${slug}" must include at least one locale file named en.md, en.mdx, zh.md, or zh.mdx.`,
      );
    }

    const variants = await Promise.all(
      localeFiles.map(async (file) => {
        const locale = file.name.slice(0, 2) as Locale;
        return readArticleVariant(slug, locale, path.join(articleDirectory, file.name));
      }),
    );

    const seenLocales = new Set<Locale>();

    for (const variant of variants) {
      if (seenLocales.has(variant.locale)) {
        throw new Error(
          `Article "${slug}" declares locale "${variant.locale}" more than once.`,
        );
      }

      seenLocales.add(variant.locale);
    }

    const [sourceOfTruth, ...rest] = variants;

    for (const variant of rest) {
      compareField(
        slug,
        "coverImage",
        sourceOfTruth.frontmatter.coverImage,
        variant.frontmatter.coverImage,
      );
      compareField(
        slug,
        "featured",
        sourceOfTruth.frontmatter.featured,
        variant.frontmatter.featured,
      );
      compareField(
        slug,
        "publishedAt",
        sourceOfTruth.frontmatter.publishedAt,
        variant.frontmatter.publishedAt,
      );
      compareField(
        slug,
        "updatedAt",
        sourceOfTruth.frontmatter.updatedAt,
        variant.frontmatter.updatedAt,
      );
      compareField(
        slug,
        "readingTheme",
        sourceOfTruth.frontmatter.readingTheme,
        variant.frontmatter.readingTheme,
      );
      compareField(
        slug,
        "relatedProducts",
        sourceOfTruth.frontmatter.relatedProducts,
        variant.frontmatter.relatedProducts,
      );
      compareField(
        slug,
        "relatedIngredients",
        sourceOfTruth.frontmatter.relatedIngredients,
        variant.frontmatter.relatedIngredients,
      );
    }

    const availableLocales = localeOrder.filter((locale) =>
      variants.some((variant) => variant.locale === locale),
    );
    const links = Object.fromEntries(
      variants
        .filter((variant) => Boolean(variant.frontmatter.link))
        .map((variant) => [variant.locale, variant.frontmatter.link]),
    ) as LocalizedLinks;

    for (const variant of variants) {
      records.push({
        slug,
        locale: variant.locale,
        availableLocales,
        title: variant.frontmatter.title,
        excerpt: variant.frontmatter.excerpt,
        category: variant.frontmatter.category,
        tags: variant.frontmatter.tags,
        coverImage: variant.frontmatter.coverImage,
        featured: variant.frontmatter.featured,
        publishedAt: variant.frontmatter.publishedAt,
        updatedAt: variant.frontmatter.updatedAt,
        readingTheme: variant.frontmatter.readingTheme,
        relatedProducts: variant.frontmatter.relatedProducts,
        relatedIngredients: variant.frontmatter.relatedIngredients,
        seoTitle: variant.frontmatter.seoTitle,
        seoDescription: variant.frontmatter.seoDescription,
        links: Object.keys(links).length > 0 ? links : undefined,
        body: variant.body,
        readingMinutes: readingMinutesFromText(variant.body),
      });
    }
  }

  return records.sort((left, right) => {
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
