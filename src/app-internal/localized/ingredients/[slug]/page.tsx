import Image from "next/image";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ArticleCard } from "@/components/cards/article-card";
import { ProductCard } from "@/components/cards/product-card";
import { LocaleLink } from "@/components/layout/locale-link";
import { StructuredData } from "@/components/seo/structured-data";
import { Badge } from "@/components/ui/badge";
import { SectionHeading } from "@/components/ui/section-heading";
import {
  getContentLanguageAlternates,
  getContentPath,
  getContentUrl,
} from "@/lib/content-links";
import { getRelatedArticlesForIngredient } from "@/lib/data/articles";
import { getAllIngredients, getIngredientBySlug } from "@/lib/data/ingredients";
import { getProductsByIngredient } from "@/lib/data/products";
import { getMessages } from "@/i18n/messages";
import { buildMetadata } from "@/lib/seo";
import type { Locale } from "@/lib/types";

export const dynamicParams = false;

export async function generateStaticParams() {
  const ingredients = await getAllIngredients();

  return ingredients.map((ingredient) => ({
    slug: ingredient.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const typedLocale = locale as Locale;
  const ingredient = await getIngredientBySlug(slug);

  if (!ingredient) {
    return {};
  }

  const alternates = getContentLanguageAlternates(ingredient, "ingredients");

  return buildMetadata({
    locale: typedLocale,
    pathname: `/ingredients/${slug}`,
    title: ingredient.name[typedLocale],
    description: ingredient.summary[typedLocale],
    image: ingredient.images[0],
    canonicalUrl: alternates[typedLocale],
    languageAlternates: alternates,
  });
}

export default async function IngredientDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const typedLocale = locale as Locale;
  const copy = getMessages(typedLocale);
  const ingredient = await getIngredientBySlug(slug);

  if (!ingredient) {
    notFound();
  }

  const [ingredients, products, articles] = await Promise.all([
    getAllIngredients(),
    getProductsByIngredient(slug),
    getRelatedArticlesForIngredient(slug, typedLocale),
  ]);
  const ingredientUrl = getContentUrl(ingredient, "ingredients", typedLocale);

  const pairingIngredients = ingredient.pairings
    .map((pairing) => ingredients.find((entry) => entry.slug === pairing))
    .filter((entry): entry is NonNullable<typeof entry> => Boolean(entry));

  return (
    <>
      <StructuredData
        data={{
          "@context": "https://schema.org",
          "@type": "DefinedTerm",
          name: ingredient.name[typedLocale],
          description: ingredient.summary[typedLocale],
          url: ingredientUrl,
        }}
      />
      <div className="page-section py-10 sm:py-12 md:py-20">
        <div className="mx-auto max-w-7xl space-y-10 md:space-y-12">
          <div className="grid gap-5 sm:gap-6 lg:grid-cols-[0.92fr_1.08fr] lg:items-center lg:gap-8">
            <div className="relative aspect-[5/4.95] overflow-hidden rounded-[2rem] border border-[rgba(111,89,64,0.12)] bg-[var(--color-surface)] shadow-[0_18px_48px_rgba(24,21,17,0.08)] sm:aspect-[5/4.8] sm:rounded-[2.75rem]">
              <Image
                src={ingredient.images[0]}
                alt={ingredient.name[typedLocale]}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 45vw"
              />
            </div>
            <section className="space-y-5 rounded-[2rem] border border-[rgba(111,89,64,0.12)] bg-white/82 p-5 shadow-[0_18px_48px_rgba(24,21,17,0.06)] sm:rounded-[2.75rem] sm:p-6 md:space-y-6 md:p-10">
              <Badge>{copy.ingredient.eyebrow}</Badge>
              <h1 className="font-display text-[2.8rem] leading-[1.02] text-[var(--color-ink)] sm:text-5xl md:text-7xl">
                {ingredient.name[typedLocale]}
              </h1>
              <p className="text-sm leading-7 text-[var(--color-copy)] sm:text-base sm:leading-8 md:text-lg">
                {ingredient.summary[typedLocale]}
              </p>
              <div className="grid gap-3 min-[360px]:grid-cols-2 sm:gap-4">
                <div className="rounded-[1.5rem] bg-[rgba(248,243,235,0.72)] p-4 sm:rounded-[2rem] sm:p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-accent)]">
                    {copy.ingredient.aliases}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {ingredient.aliases[typedLocale].map((alias) => (
                      <span
                        key={alias}
                        className="rounded-full border border-[rgba(111,89,64,0.12)] px-3 py-1 text-sm text-[var(--color-copy)]"
                      >
                        {alias}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="rounded-[1.5rem] bg-[rgba(248,243,235,0.72)] p-4 sm:rounded-[2rem] sm:p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-accent)]">
                    {copy.ingredient.flavorProfile}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {ingredient.flavor_profile[typedLocale].map((item) => (
                      <span
                        key={item}
                        className="rounded-full border border-[rgba(111,89,64,0.12)] px-3 py-1 text-sm text-[var(--color-copy)]"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          </div>

          <div className="grid gap-4 min-[360px]:grid-cols-2 lg:grid-cols-3 sm:gap-5 lg:gap-6">
            <article className="rounded-[1.55rem] border border-[rgba(111,89,64,0.12)] bg-white/82 p-4 shadow-[0_12px_34px_rgba(24,21,17,0.05)] sm:rounded-[2rem] sm:p-6">
              <h2 className="font-display text-3xl text-[var(--color-ink)]">
                {copy.ingredient.nutritionFocus}
              </h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {ingredient.nutrition_focus[typedLocale].map((item) => (
                  <span
                    key={item}
                    className="rounded-full bg-[rgba(176,136,74,0.08)] px-3 py-2 text-sm text-[var(--color-copy)]"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </article>
            <article className="rounded-[1.55rem] border border-[rgba(111,89,64,0.12)] bg-white/82 p-4 shadow-[0_12px_34px_rgba(24,21,17,0.05)] sm:rounded-[2rem] sm:p-6">
              <h2 className="font-display text-3xl text-[var(--color-ink)]">
                {copy.ingredient.traditionalUse}
              </h2>
              <p className="mt-3 text-sm leading-6 text-[var(--color-copy)] sm:mt-4 sm:leading-7">
                {ingredient.traditional_use[typedLocale]}
              </p>
            </article>
            <article className="rounded-[1.55rem] border border-[rgba(111,89,64,0.12)] bg-white/82 p-4 shadow-[0_12px_34px_rgba(24,21,17,0.05)] sm:rounded-[2rem] sm:p-6">
              <h2 className="font-display text-3xl text-[var(--color-ink)]">
                {copy.ingredient.cautions}
              </h2>
              <p className="mt-3 text-sm leading-6 text-[var(--color-copy)] sm:mt-4 sm:leading-7">
                {ingredient.cautions[typedLocale]}
              </p>
            </article>
          </div>

          <section className="rounded-[2rem] border border-[rgba(111,89,64,0.12)] bg-[rgba(248,243,235,0.78)] p-5 shadow-[0_14px_36px_rgba(24,21,17,0.04)] sm:rounded-[2.5rem] sm:p-8">
            <SectionHeading
              eyebrow={copy.ingredient.pairings}
              title={copy.ingredient.pairings}
              description={typedLocale === "zh" ? "这些原料常与当前原料形成更完整的杯中层次。" : "These ingredients are often paired to shape a fuller cup profile."}
            />
            <div className="mt-6 flex flex-wrap gap-2.5 sm:mt-8 sm:gap-3">
              {pairingIngredients.map((pairing) => (
                <LocaleLink
                  key={pairing.slug}
                  href={getContentPath(pairing, "ingredients", typedLocale)}
                  locale={typedLocale}
                  className="rounded-full border border-[var(--color-line)] bg-white/80 px-4 py-2 text-sm text-[var(--color-ink)] transition hover:border-[var(--color-accent)]"
                >
                  {pairing.name[typedLocale]}
                </LocaleLink>
              ))}
            </div>
          </section>

          {products.length > 0 ? (
            <section>
              <SectionHeading
                eyebrow={copy.common.relatedProducts}
                title={copy.ingredient.relatedProducts}
              />
              <div className="mt-8 grid gap-4 min-[360px]:grid-cols-2 xl:grid-cols-3 sm:mt-10 sm:gap-5 xl:gap-6">
                {products.map((product) => (
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

          {articles.length > 0 ? (
            <section>
              <SectionHeading
                eyebrow={copy.common.relatedArticles}
                title={copy.ingredient.relatedArticles}
              />
              <div className="mt-8 grid gap-4 min-[360px]:grid-cols-2 xl:grid-cols-3 sm:mt-10 sm:gap-5 xl:gap-6">
                {articles.map((article) => (
                  <ArticleCard
                    key={article.slug}
                    article={article}
                    locale={typedLocale}
                    label={copy.common.readArticle}
                  />
                ))}
              </div>
            </section>
          ) : null}
        </div>
      </div>
    </>
  );
}
