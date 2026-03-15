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

  return buildMetadata({
    locale: typedLocale,
    pathname: `/products/${slug}`,
    title: product.name[typedLocale],
    description: product.summary[typedLocale],
    image: product.images[0],
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
    getRelatedArticlesForProduct(product.slug, 3),
  ]);

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
            url: absoluteUrl(`/products/${product.slug}`),
          },
          brand: {
            "@type": "Brand",
            name: "Herbal Atelier",
          },
        }}
      />
      <div className="page-section py-14 md:py-20">
        <div className="mx-auto max-w-7xl space-y-12">
          <div className="grid gap-8 xl:grid-cols-[0.58fr_0.42fr]">
            <div className="space-y-6">
              <div className="relative aspect-[4/4.5] overflow-hidden rounded-[2.75rem] border border-[rgba(111,89,64,0.12)] bg-[var(--color-surface)] shadow-[0_18px_48px_rgba(24,21,17,0.08)]">
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
                <div className="relative aspect-[5/3.2] overflow-hidden rounded-[2.5rem] border border-[rgba(111,89,64,0.12)] bg-[var(--color-surface)] shadow-[0_14px_34px_rgba(24,21,17,0.05)]">
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

            <div className="space-y-6">
              <section className="rounded-[2.75rem] border border-[rgba(111,89,64,0.12)] bg-white/82 p-8 shadow-[0_18px_48px_rgba(24,21,17,0.06)] md:p-10">
                <div className="flex flex-wrap items-center gap-3">
                  {product.benefit_tags.slice(0, 3).map((tag) => (
                    <Badge key={tag}>{getBenefitLabel(tag, typedLocale)}</Badge>
                  ))}
                </div>
                <h1 className="mt-5 font-display text-5xl leading-tight text-[var(--color-ink)] md:text-6xl">
                  {product.name[typedLocale]}
                </h1>
                <p className="mt-4 text-lg leading-8 text-[var(--color-muted)]">
                  {product.tagline[typedLocale]}
                </p>
                <p className="mt-5 text-base leading-8 text-[var(--color-copy)]">
                  {product.summary[typedLocale]}
                </p>
                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  <div className="rounded-[2rem] bg-[rgba(248,243,235,0.82)] p-5">
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
                  <div className="rounded-[2rem] bg-[rgba(248,243,235,0.82)] p-5">
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

          <div className="grid gap-6 lg:grid-cols-3">
            <article className="rounded-[2rem] border border-[rgba(111,89,64,0.12)] bg-white/82 p-6 shadow-[0_12px_34px_rgba(24,21,17,0.05)]">
              <h2 className="font-display text-3xl text-[var(--color-ink)]">
                {copy.product.brewGuide}
              </h2>
              <p className="mt-4 text-sm leading-7 text-[var(--color-copy)]">
                {product.brew_guide[typedLocale]}
              </p>
            </article>
            <article className="rounded-[2rem] border border-[rgba(111,89,64,0.12)] bg-white/82 p-6 shadow-[0_12px_34px_rgba(24,21,17,0.05)]">
              <h2 className="font-display text-3xl text-[var(--color-ink)]">
                {copy.product.targetUsers}
              </h2>
              <ul className="mt-4 space-y-2 text-sm leading-7 text-[var(--color-copy)]">
                {product.target_users[typedLocale].map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
            <article className="rounded-[2rem] border border-[rgba(111,89,64,0.12)] bg-white/82 p-6 shadow-[0_12px_34px_rgba(24,21,17,0.05)]">
              <h2 className="font-display text-3xl text-[var(--color-ink)]">
                {typedLocale === "zh" ? "适用状态线索" : "Helpful discovery signals"}
              </h2>
              <div className="mt-4 space-y-4">
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

          <section className="rounded-[2.5rem] border border-[rgba(111,89,64,0.12)] bg-white/82 p-8 shadow-[0_14px_34px_rgba(24,21,17,0.05)]">
            <SectionHeading
              eyebrow={copy.product.ingredientsTitle}
              title={copy.product.ingredientsTitle}
              description={typedLocale === "zh" ? "配方中的原料均可继续查看详细说明。" : "Every ingredient in the blend can be explored further in the library."}
            />
            <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {productIngredients.map((ingredient) => (
                <LocaleLink
                  key={ingredient.slug}
                  href={`/ingredients/${ingredient.slug}`}
                  locale={typedLocale}
                  className="rounded-[1.75rem] border border-[rgba(111,89,64,0.12)] bg-[rgba(248,243,235,0.76)] p-5 transition hover:border-[var(--color-accent)]"
                >
                  <p className="font-display text-3xl text-[var(--color-ink)]">
                    {ingredient.name[typedLocale]}
                  </p>
                  <p className="mt-3 text-sm leading-7 text-[var(--color-copy)]">
                    {ingredient.summary[typedLocale]}
                  </p>
                </LocaleLink>
              ))}
            </div>
          </section>

          <div className="grid gap-6 lg:grid-cols-2">
            <article className="rounded-[2rem] border border-[rgba(111,89,64,0.12)] bg-white/82 p-6 shadow-[0_12px_34px_rgba(24,21,17,0.05)]">
              <h2 className="font-display text-3xl text-[var(--color-ink)]">
                {copy.product.cautions}
              </h2>
              <p className="mt-4 text-sm leading-7 text-[var(--color-copy)]">
                {product.cautions[typedLocale]}
              </p>
            </article>
            <article className="rounded-[2rem] border border-[rgba(111,89,64,0.12)] bg-white/82 p-6 shadow-[0_12px_34px_rgba(24,21,17,0.05)]">
              <h2 className="font-display text-3xl text-[var(--color-ink)]">
                {copy.product.disclaimer}
              </h2>
              <p className="mt-4 text-sm leading-7 text-[var(--color-copy)]">
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
              <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
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
              <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
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

          <section className="rounded-[2.5rem] border border-[rgba(176,136,74,0.18)] bg-[rgba(248,243,235,0.86)] p-8 shadow-[0_14px_36px_rgba(24,21,17,0.04)]">
            <SectionHeading
              eyebrow="Helper AI"
              title={copy.product.helperTitle}
              description={copy.product.helperBody}
            />
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
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
