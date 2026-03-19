import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ArticleMarkdown } from "@/components/articles/article-markdown";
import { ArticleCard } from "@/components/cards/article-card";
import { IngredientCard } from "@/components/cards/ingredient-card";
import { ProductCard } from "@/components/cards/product-card";
import { StructuredData } from "@/components/seo/structured-data";
import { Badge } from "@/components/ui/badge";
import { SectionHeading } from "@/components/ui/section-heading";
import {
  getContentLanguageAlternates,
  getContentUrl,
} from "@/lib/content-links";
import {
  getAllArticleMeta,
  getAllArticleSlugs,
  getArticleBySlug,
} from "@/lib/data/articles";
import { getAllIngredients } from "@/lib/data/ingredients";
import { getActiveProducts } from "@/lib/data/products";
import { getMessages } from "@/i18n/messages";
import { brandName } from "@/lib/site";
import { buildMetadata } from "@/lib/seo";
import type { Locale } from "@/lib/types";
import { absoluteUrl, formatDate } from "@/lib/utils";

export const dynamicParams = false;

export async function generateStaticParams() {
  const slugs = await getAllArticleSlugs();

  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const typedLocale = locale as Locale;
  const article = await getArticleBySlug(slug, typedLocale).catch(() => null);

  if (!article) {
    return {};
  }

  const alternates = getContentLanguageAlternates(
    article,
    "articles",
    article.availableLocales,
  );

  return buildMetadata({
    locale: typedLocale,
    pathname: `/articles/${slug}`,
    title: article.seoTitle ?? article.title,
    description: article.seoDescription ?? article.excerpt,
    image: article.coverImage,
    canonicalUrl: alternates[typedLocale],
    languageAlternates: alternates,
  });
}

export default async function ArticleDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const typedLocale = locale as Locale;
  const copy = getMessages(typedLocale);
  const article = await getArticleBySlug(slug, typedLocale).catch(() => null);

  if (!article) {
    notFound();
  }

  const [products, ingredients, allArticles] = await Promise.all([
    getActiveProducts(),
    getAllIngredients(),
    getAllArticleMeta(typedLocale),
  ]);

  const relatedProducts = products.filter((product) =>
    article.relatedProducts.includes(product.slug),
  );
  const relatedIngredients = ingredients.filter((ingredient) =>
    article.relatedIngredients.includes(ingredient.slug),
  );
  const moreArticles = allArticles
    .filter((entry) => entry.slug !== article.slug)
    .slice(0, 3);
  const articleUrl = getContentUrl(article, "articles", typedLocale);

  return (
    <>
      <StructuredData
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: article.title,
          description: article.excerpt,
          datePublished: article.publishedAt,
          dateModified: article.updatedAt ?? article.publishedAt,
          author: {
            "@type": "Organization",
            name: brandName[typedLocale],
          },
          image: absoluteUrl(article.coverImage),
          url: articleUrl,
        }}
      />
      <div className="page-section py-10 sm:py-12 md:py-20">
        <div className="mx-auto max-w-7xl space-y-10 md:space-y-12">
          <header className="mx-auto max-w-4xl text-center">
            <Badge>{article.category}</Badge>
            <h1 className="mt-4 font-display text-[2.9rem] leading-[1.02] text-[var(--color-ink)] sm:mt-5 sm:text-5xl md:text-7xl">
              {article.title}
            </h1>
            <p className="mx-auto mt-4 max-w-3xl text-sm leading-7 text-[var(--color-copy)] sm:mt-5 sm:text-base sm:leading-8 md:text-lg">
              {article.excerpt}
            </p>
            <div className="mt-5 flex flex-wrap items-center justify-center gap-2.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--color-muted)] sm:mt-6 sm:gap-3 sm:text-xs sm:tracking-[0.18em]">
              <span>{formatDate(article.publishedAt, typedLocale)}</span>
              <span aria-hidden="true">/</span>
              <span>
                {article.readingMinutes} {copy.common.minutes}
              </span>
            </div>
            <div className="mt-5 flex flex-wrap justify-center gap-2 sm:mt-6">
              {article.tags.map((tag) => (
                <Badge key={tag}>{tag}</Badge>
              ))}
            </div>
          </header>

          <div className="mx-auto max-w-5xl rounded-[2rem] border border-[rgba(111,89,64,0.12)] bg-white/82 p-5 shadow-[0_18px_50px_rgba(24,21,17,0.06)] sm:rounded-[2.25rem] sm:p-6 md:rounded-[2.75rem] md:p-12">
            <ArticleMarkdown
              content={article.body}
              style={{
                fontFamily:
                  article.readingTheme === "serif"
                    ? "var(--font-display-en), var(--font-display-zh), serif"
                    : "var(--font-body-en), var(--font-body-zh), sans-serif",
              }}
            />
          </div>

          {relatedProducts.length > 0 ? (
            <section>
              <SectionHeading
                eyebrow={copy.common.relatedProducts}
                title={copy.common.relatedProducts}
              />
              <div className="mt-8 grid gap-4 min-[360px]:grid-cols-2 xl:grid-cols-3 sm:mt-10 sm:gap-5 xl:gap-6">
                {relatedProducts.map((product) => (
                  <ProductCard
                    key={product.slug}
                    product={product}
                    locale={typedLocale}
                    addToCartLabel={copy.common.addToCart}
                    detailLabel={copy.common.viewDetails}
                  />
                ))}
              </div>
            </section>
          ) : null}

          {relatedIngredients.length > 0 ? (
            <section>
              <SectionHeading
                eyebrow={copy.common.relatedIngredients}
                title={copy.common.relatedIngredients}
              />
              <div className="mt-8 grid gap-4 min-[360px]:grid-cols-2 xl:grid-cols-3 sm:mt-10 sm:gap-5 xl:gap-6">
                {relatedIngredients.map((ingredient) => (
                  <IngredientCard
                    key={ingredient.slug}
                    ingredient={ingredient}
                    locale={typedLocale}
                    label={copy.navigation.ingredients}
                  />
                ))}
              </div>
            </section>
          ) : null}

          <section>
            <SectionHeading
              eyebrow={copy.common.relatedArticles}
              title={copy.common.relatedArticles}
            />
            <div className="mt-8 grid gap-4 min-[360px]:grid-cols-2 xl:grid-cols-3 sm:mt-10 sm:gap-5 xl:gap-6">
              {moreArticles.map((entry) => (
                <ArticleCard
                  key={`${entry.locale}-${entry.slug}`}
                  article={entry}
                  locale={typedLocale}
                  label={copy.common.readArticle}
                />
              ))}
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
