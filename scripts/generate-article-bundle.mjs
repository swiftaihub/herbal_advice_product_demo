import fs from "node:fs/promises";
import path from "node:path";

import matter from "gray-matter";

const repoRoot = process.cwd();
const articlesRoot = path.join(repoRoot, "content", "articles");
const outputPath = path.join(
  repoRoot,
  "src",
  "lib",
  "data",
  "article-bundle.generated.ts",
);
const articleFilePattern = /^(en|zh)\.(md|mdx)$/i;
const localeOrder = ["en", "zh"];

function normalizeDate(value, fieldName, filePath) {
  const normalized =
    typeof value === "string" ? value.trim() : value?.toISOString?.().slice(0, 10);

  if (!normalized || Number.isNaN(new Date(normalized).getTime())) {
    throw new Error(`Invalid ${fieldName} in ${path.relative(repoRoot, filePath)}`);
  }

  return new Date(normalized).toISOString().slice(0, 10);
}

function normalizeString(value, fieldName, filePath) {
  if (typeof value !== "string" || !value.trim()) {
    throw new Error(`Invalid ${fieldName} in ${path.relative(repoRoot, filePath)}`);
  }

  return value.trim();
}

function normalizeStringArray(value, fieldName, filePath) {
  if (value == null) {
    return [];
  }

  if (!Array.isArray(value) || value.some((item) => typeof item !== "string" || !item.trim())) {
    throw new Error(`Invalid ${fieldName} in ${path.relative(repoRoot, filePath)}`);
  }

  return value.map((item) => item.trim());
}

function normalizeLink(value, filePath) {
  if (value == null) {
    return undefined;
  }

  const link = normalizeString(value, "link", filePath);

  if (!link.startsWith("/") && !/^https?:\/\//.test(link)) {
    throw new Error(
      `Invalid link in ${path.relative(repoRoot, filePath)}: must be absolute or root-relative`,
    );
  }

  return link;
}

function compareField(slug, fieldName, first, second) {
  if (JSON.stringify(first) !== JSON.stringify(second)) {
    throw new Error(
      `Article "${slug}" has mismatched shared frontmatter for "${fieldName}" across locale files.`,
    );
  }
}

function readingMinutesFromText(text) {
  const plainText = text
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`[^`]+`/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\[[^\]]+\]\([^)]+\)/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  const wordCount = plainText ? plainText.split(" ").length : 0;

  return Math.max(1, Math.ceil(wordCount / 180));
}

async function readArticleVariant(slug, locale, filePath) {
  const rawSource = await fs.readFile(filePath, "utf8");
  const parsed = matter(rawSource);
  const body = parsed.content.trim();

  if (!body) {
    throw new Error(`Article "${slug}" locale "${locale}" has no body content.`);
  }

  const data = parsed.data ?? {};

  return {
    locale,
    filePath,
    body,
    frontmatter: {
      title: normalizeString(data.title, "title", filePath),
      excerpt: normalizeString(data.excerpt, "excerpt", filePath),
      category: normalizeString(data.category, "category", filePath),
      tags: normalizeStringArray(data.tags, "tags", filePath),
      coverImage: normalizeString(data.coverImage, "coverImage", filePath),
      featured: Boolean(data.featured),
      publishedAt: normalizeDate(data.publishedAt, "publishedAt", filePath),
      updatedAt:
        data.updatedAt == null
          ? undefined
          : normalizeDate(data.updatedAt, "updatedAt", filePath),
      readingTheme:
        data.readingTheme === "sans" || data.readingTheme === "serif"
          ? data.readingTheme
          : "serif",
      relatedProducts: normalizeStringArray(
        data.relatedProducts,
        "relatedProducts",
        filePath,
      ),
      relatedIngredients: normalizeStringArray(
        data.relatedIngredients,
        "relatedIngredients",
        filePath,
      ),
      seoTitle:
        data.seoTitle == null
          ? undefined
          : normalizeString(data.seoTitle, "seoTitle", filePath),
      seoDescription:
        data.seoDescription == null
          ? undefined
          : normalizeString(data.seoDescription, "seoDescription", filePath),
      link: normalizeLink(data.link, filePath),
    },
  };
}

async function collectArticles() {
  const directoryEntries = await fs.readdir(articlesRoot, { withFileTypes: true });
  const records = [];

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
        const locale = file.name.slice(0, 2);
        return readArticleVariant(slug, locale, path.join(articleDirectory, file.name));
      }),
    );

    const seenLocales = new Set();

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
    );

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
}

function renderModule(records) {
  return `import type { Article } from "@/lib/types";\n\nexport const generatedArticles: Article[] = ${JSON.stringify(records, null, 2)};\n`;
}

const records = await collectArticles();
await fs.writeFile(outputPath, renderModule(records), "utf8");
console.log(
  `Generated ${path.relative(repoRoot, outputPath)} with ${records.length} article records.`,
);
