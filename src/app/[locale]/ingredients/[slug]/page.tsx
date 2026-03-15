import Image from "next/image";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ArticleCard } from "@/components/cards/article-card";
import { ProductCard } from "@/components/cards/product-card";
import { LocaleLink } from "@/components/layout/locale-link";
import { StructuredData } from "@/components/seo/structured-data";
import { Badge } from "@/components/ui/badge";
import { SectionHeading } from "@/components/ui/section-heading";
import { getRelatedArticlesForIngredient } from "@/lib/data/articles";
import { getAllIngredients, getIngredientBySlug } from "@/lib/data/ingredients";
import { getProductsByIngredient } from "@/lib/data/products";
import { getMessages } from "@/i18n/messages";
import { buildMetadata } from "@/lib/seo";
import type { Locale } from "@/lib/types";
import { absoluteUrl } from "@/lib/utils";

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

  return buildMetadata({
    locale: typedLocale,
    pathname: `/ingredients/${slug}`,
    title: ingredient.name[typedLocale],
    description: ingredient.summary[typedLocale],
    image: ingredient.images[0],
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
    getRelatedArticlesForIngredient(slug),
  ]);

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
          url: absoluteUrl(`/ingredients/${ingredient.slug}`),
        }}
      />
      <div className="page-section py-14 md:py-20">
        <div className="mx-auto max-w-7xl space-y-12">
          <div className="grid gap-8 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
            <div className="relative aspect-[5/4.8] overflow-hidden rounded-[2.75rem] border border-[rgba(111,89,64,0.12)] bg-[var(--color-surface)] shadow-[0_18px_48px_rgba(24,21,17,0.08)]">
              <Image
                src={ingredient.images[0]}
                alt={ingredient.name[typedLocale]}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 45vw"
              />
            </div>
            <section className="space-y-6 rounded-[2.75rem] border border-[rgba(111,89,64,0.12)] bg-white/82 p-8 shadow-[0_18px_48px_rgba(24,21,17,0.06)] md:p-10">
              <Badge>{copy.ingredient.eyebrow}</Badge>
              <h1 className="font-display text-5xl text-[var(--color-ink)] md:text-7xl">
                {ingredient.name[typedLocale]}
              </h1>
              <p className="text-base leading-8 text-[var(--color-copy)] md:text-lg">
                {ingredient.summary[typedLocale]}
              </p>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-[2rem] bg-[rgba(248,243,235,0.72)] p-5">
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
                <div className="rounded-[2rem] bg-[rgba(248,243,235,0.72)] p-5">
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

          <div className="grid gap-6 lg:grid-cols-3">
            <article className="rounded-[2rem] border border-[rgba(111,89,64,0.12)] bg-white/82 p-6 shadow-[0_12px_34px_rgba(24,21,17,0.05)]">
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
            <article className="rounded-[2rem] border border-[rgba(111,89,64,0.12)] bg-white/82 p-6 shadow-[0_12px_34px_rgba(24,21,17,0.05)]">
              <h2 className="font-display text-3xl text-[var(--color-ink)]">
                {copy.ingredient.traditionalUse}
              </h2>
              <p className="mt-4 text-sm leading-7 text-[var(--color-copy)]">
                {ingredient.traditional_use[typedLocale]}
              </p>
            </article>
            <article className="rounded-[2rem] border border-[rgba(111,89,64,0.12)] bg-white/82 p-6 shadow-[0_12px_34px_rgba(24,21,17,0.05)]">
              <h2 className="font-display text-3xl text-[var(--color-ink)]">
                {copy.ingredient.cautions}
              </h2>
              <p className="mt-4 text-sm leading-7 text-[var(--color-copy)]">
                {ingredient.cautions[typedLocale]}
              </p>
            </article>
          </div>

          <section className="rounded-[2.5rem] border border-[rgba(111,89,64,0.12)] bg-[rgba(248,243,235,0.78)] p-8 shadow-[0_14px_36px_rgba(24,21,17,0.04)]">
            <SectionHeading
              eyebrow={copy.ingredient.pairings}
              title={copy.ingredient.pairings}
              description={typedLocale === "zh" ? "这些原料常与当前原料形成更完整的杯中层次。" : "These ingredients are often paired to shape a fuller cup profile."}
            />
            <div className="mt-8 flex flex-wrap gap-3">
              {pairingIngredients.map((pairing) => (
                <LocaleLink
                  key={pairing.slug}
                  href={`/ingredients/${pairing.slug}`}
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
              <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
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
              <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
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
