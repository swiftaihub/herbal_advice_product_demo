import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ArticleCard } from "@/components/cards/article-card";
import { IngredientCard } from "@/components/cards/ingredient-card";
import { ProductCard } from "@/components/cards/product-card";
import { StructuredData } from "@/components/seo/structured-data";
import { Badge } from "@/components/ui/badge";
import { SectionHeading } from "@/components/ui/section-heading";
import { getAllArticleMeta, getArticleBySlug } from "@/lib/data/articles";
import { getAllIngredients } from "@/lib/data/ingredients";
import { getActiveProducts } from "@/lib/data/products";
import { getMessages } from "@/i18n/messages";
import { brandName } from "@/lib/site";
import { buildMetadata } from "@/lib/seo";
import type { Locale } from "@/lib/types";
import { absoluteUrl, formatDate } from "@/lib/utils";

export async function generateStaticParams() {
  const articles = await getAllArticleMeta();

  return articles.map((article) => ({
    slug: article.slug,
  }));
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

  return buildMetadata({
    locale: typedLocale,
    pathname: `/articles/${slug}`,
    title: article.title[typedLocale],
    description: article.excerpt[typedLocale],
    image: article.coverImage,
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
    getAllArticleMeta(),
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

  return (
    <>
      <StructuredData
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: article.title[typedLocale],
          description: article.excerpt[typedLocale],
          datePublished: article.publishedAt,
          author: {
            "@type": "Organization",
            name: brandName[typedLocale],
          },
          image: absoluteUrl(article.coverImage),
          url: absoluteUrl(`/articles/${article.slug}`),
        }}
      />
      <div className="page-section py-14 md:py-20">
        <div className="mx-auto max-w-7xl space-y-12">
          <header className="mx-auto max-w-4xl text-center">
            <Badge>{article.category[typedLocale]}</Badge>
            <h1 className="mt-5 font-display text-5xl leading-tight text-[var(--color-ink)] md:text-7xl">
              {article.title[typedLocale]}
            </h1>
            <p className="mx-auto mt-5 max-w-3xl text-base leading-8 text-[var(--color-copy)] md:text-lg">
              {article.excerpt[typedLocale]}
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)]">
              <span>{formatDate(article.publishedAt, typedLocale)}</span>
              <span>•</span>
              <span>
                {article.readingMinutes} {copy.common.minutes}
              </span>
            </div>
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              {article.tags[typedLocale].map((tag) => (
                <Badge key={tag}>{tag}</Badge>
              ))}
            </div>
          </header>

          <div className="mx-auto max-w-5xl rounded-[2.75rem] border border-[rgba(111,89,64,0.12)] bg-white/82 p-8 shadow-[0_18px_50px_rgba(24,21,17,0.06)] md:p-12">
            <p className="rounded-[1.75rem] bg-[rgba(176,136,74,0.08)] px-5 py-4 text-sm leading-7 text-[var(--color-copy)]">
              {copy.articles.placeholderMessage}
            </p>
            <article
              className="article-prose mt-8"
              style={{
                fontFamily:
                  article.readingTheme === "serif"
                    ? "var(--font-display-en), var(--font-display-zh), serif"
                    : "var(--font-body-en), var(--font-body-zh), sans-serif",
              }}
              dangerouslySetInnerHTML={{ __html: article.bodyHtml }}
            />
          </div>

          {relatedProducts.length > 0 ? (
            <section>
              <SectionHeading
                eyebrow={copy.common.relatedProducts}
                title={copy.common.relatedProducts}
              />
              <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
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
              <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
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
            <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {moreArticles.map((entry) => (
                <ArticleCard
                  key={entry.slug}
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
