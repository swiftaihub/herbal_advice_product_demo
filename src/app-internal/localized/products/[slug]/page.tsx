import Image from "next/image";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ArticleCard } from "@/components/cards/article-card";
import { ProductCard } from "@/components/cards/product-card";
import { ProductPurchasePanel } from "@/components/product/product-purchase-panel";
import { LocaleLink } from "@/components/layout/locale-link";
import { StructuredData } from "@/components/seo/structured-data";
import { Badge } from "@/components/ui/badge";
import { SectionHeading } from "@/components/ui/section-heading";
import {
  getContentLanguageAlternates,
  getContentPath,
  getContentUrl,
} from "@/lib/content-links";
import { getRelatedArticlesForProduct } from "@/lib/data/articles";
import { getAllIngredients } from "@/lib/data/ingredients";
import {
  getActiveProducts,
  getProductBySlug,
  getRelatedProducts,
} from "@/lib/data/products";
import { getMessages } from "@/i18n/messages";
import {
  getBenefitLabel,
  getConstitutionLabel,
  getDiscomfortLabel,
} from "@/lib/taxonomies";
import { buildMetadata } from "@/lib/seo";
import type { Locale } from "@/lib/types";
import { absoluteUrl, formatCurrency } from "@/lib/utils";

export const dynamicParams = false;

export async function generateStaticParams() {
  const products = await getActiveProducts();

  return products.map((product) => ({
    slug: product.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const typedLocale = locale as Locale;
  const product = await getProductBySlug(slug);

  if (!product) {
    return {};
  }

  const alternates = getContentLanguageAlternates(product, "products");

  return buildMetadata({
    locale: typedLocale,
    pathname: `/products/${slug}`,
    title: product.name[typedLocale],
    description: product.summary[typedLocale],
    image: product.images[0],
    canonicalUrl: alternates[typedLocale],
    languageAlternates: alternates,
  });
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const typedLocale = locale as Locale;
  const copy = getMessages(typedLocale);
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const [ingredients, relatedProducts, relatedArticles] = await Promise.all([
    getAllIngredients(),
    getRelatedProducts(product, 4),
    getRelatedArticlesForProduct(product.slug, typedLocale, 3),
  ]);
  const productUrl = getContentUrl(product, "products", typedLocale);

  const productIngredients = product.ingredients
    .map((ingredientSlug) =>
      ingredients.find((ingredient) => ingredient.slug === ingredientSlug),
    )
    .filter((ingredient): ingredient is NonNullable<typeof ingredient> =>
      Boolean(ingredient),
    );

  return (
    <>
      <StructuredData
        data={{
          "@context": "https://schema.org",
          "@type": "Product",
          name: product.name[typedLocale],
          description: product.summary[typedLocale],
          image: product.images.map((image) => absoluteUrl(image)),
          sku: product.slug,
          offers: {
            "@type": "Offer",
            priceCurrency: product.currency,
            price: product.price,
            availability: "https://schema.org/InStock",
            url: productUrl,
          },
          brand: {
            "@type": "Brand",
            name: "Herbal Atelier",
          },
        }}
      />
      <div className="page-section py-10 sm:py-12 md:py-20">
        <div className="mx-auto max-w-7xl space-y-10 md:space-y-12">
          <div className="grid gap-5 sm:gap-6 xl:grid-cols-[0.58fr_0.42fr] xl:gap-8">
            <div className="space-y-4 sm:space-y-6">
              <div className="relative aspect-[4/4.7] overflow-hidden rounded-[2rem] border border-[rgba(111,89,64,0.12)] bg-[var(--color-surface)] shadow-[0_18px_48px_rgba(24,21,17,0.08)] sm:aspect-[4/4.5] sm:rounded-[2.75rem]">
                <Image
                  src={product.images[0]}
                  alt={product.name[typedLocale]}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1280px) 100vw, 58vw"
                  priority
                />
              </div>
              {product.images[1] ? (
                <div className="relative aspect-[5/3.3] overflow-hidden rounded-[1.9rem] border border-[rgba(111,89,64,0.12)] bg-[var(--color-surface)] shadow-[0_14px_34px_rgba(24,21,17,0.05)] sm:aspect-[5/3.2] sm:rounded-[2.5rem]">
                  <Image
                    src={product.images[1]}
                    alt={`${product.name[typedLocale]} lifestyle`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1280px) 100vw, 58vw"
                  />
                </div>
              ) : null}
            </div>

            <div className="space-y-5 sm:space-y-6">
              <section className="rounded-[2rem] border border-[rgba(111,89,64,0.12)] bg-white/82 p-5 shadow-[0_18px_48px_rgba(24,21,17,0.06)] sm:rounded-[2.75rem] sm:p-6 md:p-10">
                <div className="flex flex-wrap items-center gap-3">
                  {product.benefit_tags.slice(0, 3).map((tag) => (
                    <Badge key={tag}>{getBenefitLabel(tag, typedLocale)}</Badge>
                  ))}
                </div>
                <h1 className="mt-4 font-display text-[2.7rem] leading-[1.02] text-[var(--color-ink)] sm:mt-5 sm:text-5xl md:text-6xl">
                  {product.name[typedLocale]}
                </h1>
                <p className="mt-3 text-base leading-7 text-[var(--color-muted)] sm:mt-4 sm:text-lg sm:leading-8">
                  {product.tagline[typedLocale]}
                </p>
                <p className="mt-4 text-sm leading-7 text-[var(--color-copy)] sm:mt-5 sm:text-base sm:leading-8">
                  {product.summary[typedLocale]}
                </p>
                <div className="mt-5 grid gap-3 min-[360px]:grid-cols-2 sm:mt-6 sm:gap-4">
                  <div className="rounded-[1.5rem] bg-[rgba(248,243,235,0.82)] p-4 sm:rounded-[2rem] sm:p-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-accent)]">
                      {copy.product.keyBenefits}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {product.benefit_tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full border border-[rgba(111,89,64,0.12)] px-3 py-1 text-sm text-[var(--color-copy)]"
                        >
                          {getBenefitLabel(tag, typedLocale)}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="rounded-[1.5rem] bg-[rgba(248,243,235,0.82)] p-4 sm:rounded-[2rem] sm:p-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-accent)]">
                      {copy.product.flavorNotes}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {product.flavor_notes[typedLocale].map((note) => (
                        <span
                          key={note}
                          className="rounded-full border border-[rgba(111,89,64,0.12)] px-3 py-1 text-sm text-[var(--color-copy)]"
                        >
                          {note}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </section>

              <ProductPurchasePanel
                product={product}
                locale={typedLocale}
                addToCartLabel={copy.common.addToCart}
                quantityLabel={copy.common.quantity}
                helperLabel={copy.product.helperBody}
                collectionLabel={copy.product.collectionLink}
              />
            </div>
          </div>

          <div className="grid gap-4 min-[360px]:grid-cols-2 lg:grid-cols-3 sm:gap-5 lg:gap-6">
            <article className="rounded-[1.55rem] border border-[rgba(111,89,64,0.12)] bg-white/82 p-4 shadow-[0_12px_34px_rgba(24,21,17,0.05)] sm:rounded-[2rem] sm:p-6">
              <h2 className="font-display text-3xl text-[var(--color-ink)]">
                {copy.product.brewGuide}
              </h2>
              <p className="mt-3 text-sm leading-6 text-[var(--color-copy)] sm:mt-4 sm:leading-7">
                {product.brew_guide[typedLocale]}
              </p>
            </article>
            <article className="rounded-[1.55rem] border border-[rgba(111,89,64,0.12)] bg-white/82 p-4 shadow-[0_12px_34px_rgba(24,21,17,0.05)] sm:rounded-[2rem] sm:p-6">
              <h2 className="font-display text-3xl text-[var(--color-ink)]">
                {copy.product.targetUsers}
              </h2>
              <ul className="mt-3 space-y-2 text-sm leading-6 text-[var(--color-copy)] sm:mt-4 sm:leading-7">
                {product.target_users[typedLocale].map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
            <article className="rounded-[1.55rem] border border-[rgba(111,89,64,0.12)] bg-white/82 p-4 shadow-[0_12px_34px_rgba(24,21,17,0.05)] sm:rounded-[2rem] sm:p-6">
              <h2 className="font-display text-3xl text-[var(--color-ink)]">
                {typedLocale === "zh" ? "适用状态线索" : "Helpful discovery signals"}
              </h2>
              <div className="mt-3 space-y-3 sm:mt-4 sm:space-y-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-accent)]">
                    {typedLocale === "zh" ? "体质类型" : "Constitution types"}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {product.constitution_types.map((item) => (
                      <span
                        key={item}
                        className="rounded-full border border-[rgba(111,89,64,0.12)] px-3 py-1 text-sm text-[var(--color-copy)]"
                      >
                        {getConstitutionLabel(item, typedLocale)}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-accent)]">
                    {typedLocale === "zh" ? "近期状态" : "Recent discomforts"}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {product.recent_discomforts.map((item) => (
                      <span
                        key={item}
                        className="rounded-full border border-[rgba(111,89,64,0.12)] px-3 py-1 text-sm text-[var(--color-copy)]"
                      >
                        {getDiscomfortLabel(item, typedLocale)}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </article>
          </div>

          <section className="rounded-[2rem] border border-[rgba(111,89,64,0.12)] bg-white/82 p-5 shadow-[0_14px_34px_rgba(24,21,17,0.05)] sm:rounded-[2.5rem] sm:p-8">
            <SectionHeading
              eyebrow={copy.product.ingredientsTitle}
              title={copy.product.ingredientsTitle}
              description={typedLocale === "zh" ? "配方中的原料均可继续查看详细说明。" : "Every ingredient in the blend can be explored further in the library."}
            />
            <div className="mt-6 grid gap-3 min-[360px]:grid-cols-2 xl:grid-cols-4 sm:mt-8 sm:gap-4">
              {productIngredients.map((ingredient) => (
                <LocaleLink
                  key={ingredient.slug}
                  href={getContentPath(ingredient, "ingredients", typedLocale)}
                  locale={typedLocale}
                  className="rounded-[1.35rem] border border-[rgba(111,89,64,0.12)] bg-[rgba(248,243,235,0.76)] p-4 transition hover:border-[var(--color-accent)] sm:rounded-[1.75rem] sm:p-5"
                >
                  <p className="font-display text-[1.65rem] leading-[1.04] text-[var(--color-ink)] sm:text-3xl">
                    {ingredient.name[typedLocale]}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-[var(--color-copy)] sm:mt-3 sm:leading-7">
                    {ingredient.summary[typedLocale]}
                  </p>
                </LocaleLink>
              ))}
            </div>
          </section>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2 sm:gap-5 lg:gap-6">
            <article className="rounded-[1.55rem] border border-[rgba(111,89,64,0.12)] bg-white/82 p-4 shadow-[0_12px_34px_rgba(24,21,17,0.05)] sm:rounded-[2rem] sm:p-6">
              <h2 className="font-display text-3xl text-[var(--color-ink)]">
                {copy.product.cautions}
              </h2>
              <p className="mt-3 text-sm leading-6 text-[var(--color-copy)] sm:mt-4 sm:leading-7">
                {product.cautions[typedLocale]}
              </p>
            </article>
            <article className="rounded-[1.55rem] border border-[rgba(111,89,64,0.12)] bg-white/82 p-4 shadow-[0_12px_34px_rgba(24,21,17,0.05)] sm:rounded-[2rem] sm:p-6">
              <h2 className="font-display text-3xl text-[var(--color-ink)]">
                {copy.product.disclaimer}
              </h2>
              <p className="mt-3 text-sm leading-6 text-[var(--color-copy)] sm:mt-4 sm:leading-7">
                {product.disclaimer[typedLocale]}
              </p>
            </article>
          </div>

          {relatedArticles.length > 0 ? (
            <section>
              <SectionHeading
                eyebrow={copy.common.relatedArticles}
                title={copy.common.relatedArticles}
              />
              <div className="mt-8 grid gap-4 min-[360px]:grid-cols-2 xl:grid-cols-3 sm:mt-10 sm:gap-5 xl:gap-6">
                {relatedArticles.map((article) => (
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

          {relatedProducts.length > 0 ? (
            <section>
              <SectionHeading
                eyebrow={copy.common.relatedProducts}
                title={copy.common.relatedProducts}
              />
              <div className="mt-8 grid gap-4 min-[360px]:grid-cols-2 xl:grid-cols-4 sm:mt-10 sm:gap-5 xl:gap-6">
                {relatedProducts.map((relatedProduct) => (
                  <ProductCard
                    key={relatedProduct.slug}
                    product={relatedProduct}
                    locale={typedLocale}
                    addToCartLabel={copy.common.addToCart}
                    detailLabel={copy.common.viewDetails}
                  />
                ))}
              </div>
            </section>
          ) : null}

          <section className="rounded-[2rem] border border-[rgba(176,136,74,0.18)] bg-[rgba(248,243,235,0.86)] p-5 shadow-[0_14px_36px_rgba(24,21,17,0.04)] sm:rounded-[2.5rem] sm:p-8">
            <SectionHeading
              eyebrow="Helper AI"
              title={copy.product.helperTitle}
              description={copy.product.helperBody}
            />
            <div className="mt-6 flex flex-col gap-2.5 min-[360px]:flex-row sm:mt-8">
              <LocaleLink href="/ai-guide" locale={typedLocale}>
                <Badge className="px-5 py-3 text-sm normal-case tracking-normal">
                  Helper AI
                </Badge>
              </LocaleLink>
              <p className="text-sm leading-7 text-[var(--color-copy)]">
                {typedLocale === "zh"
                  ? `${formatCurrency(product.price, product.currency, typedLocale)} / ${product.size}`
                  : `${formatCurrency(product.price, product.currency, typedLocale)} / ${product.size}`}
              </p>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
