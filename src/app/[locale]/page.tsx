import Image from "next/image";
import type { Metadata } from "next";

import { HelperAiPanel } from "@/components/ai/helper-ai-panel";
import { ArticleCard } from "@/components/cards/article-card";
import { IngredientCard } from "@/components/cards/ingredient-card";
import { ProductCard } from "@/components/cards/product-card";
import { LocaleLink } from "@/components/layout/locale-link";
import { StructuredData } from "@/components/seo/structured-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";
import { getAllArticleMeta, getFeaturedArticles } from "@/lib/data/articles";
import { getAllIngredients } from "@/lib/data/ingredients";
import { getFeaturedProducts } from "@/lib/data/products";
import { getMessages } from "@/i18n/messages";
import { brandDescription, brandName } from "@/lib/site";
import { buildMetadata } from "@/lib/seo";
import type { Locale } from "@/lib/types";
import { withLocale } from "@/i18n/config";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  return buildMetadata({
    locale: locale as Locale,
    pathname: "/",
  });
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const typedLocale = locale as Locale;
  const copy = getMessages(typedLocale);
  const [featuredProducts, ingredients, featuredArticles, allArticles] =
    await Promise.all([
      getFeaturedProducts(),
      getAllIngredients(),
      getFeaturedArticles(3),
      getAllArticleMeta(),
    ]);

  const highlightedIngredients = ingredients.slice(0, 6);
  const ritualModules =
    typedLocale === "zh"
      ? [
          {
            title: "精致但不过度喧闹",
            body: "以克制的视觉与安静的转化路径，建立更可信赖的品牌体验。",
          },
          {
            title: "内容驱动的选购方式",
            body: "产品、原料与文章内容彼此连接，让用户越看越有方向感。",
          },
          {
            title: "为后续电商接入做好准备",
            body: "购物车、账户与结账入口都已具备可延展的前端结构。",
          },
        ]
      : [
          {
            title: "Premium without the noise",
            body: "A restrained visual system and calmer conversion path create a more trustworthy shopping experience.",
          },
          {
            title: "Content-led discovery",
            body: "Products, ingredient education, and journal entries work together so the collection becomes easier to navigate.",
          },
          {
            title: "Ready for real commerce wiring",
            body: "Cart, account, and checkout surfaces are structured for later integration with production services.",
          },
        ];

  return (
    <>
      <StructuredData
        data={{
          "@context": "https://schema.org",
          "@type": "Organization",
          name: brandName[typedLocale],
          description: brandDescription[typedLocale],
          url: withLocale("/", typedLocale),
        }}
      />
      <div className="page-section pb-14 pt-8 md:pb-20 md:pt-12">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <section className="space-y-8 rounded-[2.75rem] border border-[rgba(111,89,64,0.12)] bg-[rgba(255,255,255,0.78)] p-8 shadow-[0_20px_54px_rgba(24,21,17,0.06)] md:p-10">
            <Badge>{copy.home.eyebrow}</Badge>
            <div className="space-y-5">
              <h1 className="font-display text-5xl leading-[0.95] text-[var(--color-ink)] md:text-7xl">
                {copy.home.title}
              </h1>
              <p className="max-w-2xl text-base leading-8 text-[var(--color-copy)] md:text-lg">
                {copy.home.description}
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <LocaleLink href="/ai-guide" locale={typedLocale}>
                <Button>{copy.home.primaryCta}</Button>
              </LocaleLink>
              <LocaleLink href="/shop" locale={typedLocale}>
                <Button variant="secondary">{copy.home.secondaryCta}</Button>
              </LocaleLink>
            </div>
            <div className="grid gap-4 rounded-[2rem] bg-[rgba(176,136,74,0.08)] p-6 md:grid-cols-[0.9fr_1.1fr]">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-accent)]">
                  {copy.home.heroCardTitle}
                </p>
                <p className="mt-3 text-sm leading-7 text-[var(--color-copy)]">
                  {copy.home.heroCardBody}
                </p>
              </div>
              <div className="space-y-3">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-accent)]">
                  {copy.home.trustTitle}
                </p>
                <ul className="space-y-3 text-sm leading-7 text-[var(--color-copy)]">
                  {copy.home.trustItems.map((item) => (
                    <li key={item} className="rounded-2xl bg-white/70 px-4 py-3">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>
          <section className="relative overflow-hidden rounded-[2.75rem] border border-[rgba(111,89,64,0.12)] bg-[var(--color-surface)] shadow-[0_20px_54px_rgba(24,21,17,0.08)]">
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(24,21,17,0.05),rgba(24,21,17,0.28))]" />
            <div className="relative aspect-[5/5.8]">
              <Image
                src="/images/brand/hero.jpg"
                alt={brandName[typedLocale]}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
              <div className="rounded-[2rem] border border-[rgba(255,255,255,0.18)] bg-[rgba(34,30,22,0.72)] p-6 text-[var(--color-paper)] backdrop-blur-md">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-sun)]">
                  {copy.common.featuredCollection}
                </p>
                <p className="mt-3 font-display text-3xl md:text-4xl">
                  {featuredProducts[0]?.name[typedLocale]}
                </p>
                <p className="mt-3 text-sm leading-7 text-[rgba(248,243,235,0.8)]">
                  {featuredProducts[0]?.summary[typedLocale]}
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>

      <section className="page-section py-14 md:py-20">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow={copy.common.featured}
            title={copy.common.featuredCollection}
            description={copy.home.description}
            action={
              <LocaleLink href="/shop" locale={typedLocale}>
                <Button variant="secondary">{copy.common.browseShop}</Button>
              </LocaleLink>
            }
          />
          <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {featuredProducts.map((product) => (
              <ProductCard
                key={product.slug}
                product={product}
                locale={typedLocale}
                addToCartLabel={copy.common.addToCart}
                detailLabel={copy.common.viewDetails}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="page-section py-14 md:py-20">
        <div className="mx-auto max-w-7xl rounded-[2.75rem] border border-[rgba(111,89,64,0.12)] bg-white/70 p-8 shadow-[0_18px_40px_rgba(24,21,17,0.05)] md:p-10">
          <SectionHeading
            eyebrow={copy.home.valueTitle}
            title={copy.home.valueTitle}
            description={copy.home.trustModuleBody}
          />
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {copy.home.valueItems.map((item) => (
              <article
                key={item.title}
                className="rounded-[2rem] border border-[rgba(111,89,64,0.1)] bg-[rgba(248,243,235,0.72)] p-6"
              >
                <h3 className="font-display text-3xl text-[var(--color-ink)]">
                  {item.title}
                </h3>
                <p className="mt-4 text-sm leading-7 text-[var(--color-copy)]">
                  {item.body}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="page-section py-14 md:py-20">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow={copy.navigation.ingredients}
            title={copy.home.ingredientsTitle}
            description={copy.home.ingredientsBody}
            action={
              <LocaleLink href="/ingredients" locale={typedLocale}>
                <Button variant="secondary">{copy.common.viewAllIngredients}</Button>
              </LocaleLink>
            }
          />
          <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {highlightedIngredients.map((ingredient) => (
              <IngredientCard
                key={ingredient.slug}
                ingredient={ingredient}
                locale={typedLocale}
                label={copy.navigation.ingredients}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="page-section py-14 md:py-20">
        <div className="mx-auto max-w-7xl">
          <HelperAiPanel
            locale={typedLocale}
            title={copy.home.aiSpotlightTitle}
            description={copy.home.aiSpotlightBody}
            primaryLabel={copy.home.primaryCta}
            secondaryLabel={copy.aiGuide.launchLabel}
          />
        </div>
      </section>

      <section className="page-section py-14 md:py-20">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow={copy.navigation.articles}
            title={copy.articles.featured}
            description={copy.articles.description}
            action={
              <LocaleLink href="/articles" locale={typedLocale}>
                <Button variant="secondary">{copy.common.viewAllArticles}</Button>
              </LocaleLink>
            }
          />
          <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {featuredArticles.map((article) => (
              <ArticleCard
                key={article.slug}
                article={article}
                locale={typedLocale}
                label={copy.common.readArticle}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="page-section py-14 md:py-20">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-[2.5rem] border border-[rgba(111,89,64,0.12)] bg-[rgba(34,30,22,0.94)] p-8 text-[var(--color-paper)] shadow-[0_18px_44px_rgba(24,21,17,0.16)] md:p-10">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-sun)]">
              {copy.home.trustModuleTitle}
            </p>
            <h2 className="mt-4 font-display text-5xl text-[var(--color-paper)]">
              {typedLocale === "zh"
                ? "克制、可信、可持续扩展的品牌体验"
                : "A calm, credible, scalable brand experience"}
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-8 text-[rgba(248,243,235,0.78)]">
              {copy.home.trustModuleBody}
            </p>
          </div>
          <div className="grid gap-5">
            {ritualModules.map((item) => (
              <article
                key={item.title}
                className="rounded-[2rem] border border-[rgba(111,89,64,0.12)] bg-white/82 p-6 shadow-[0_12px_34px_rgba(24,21,17,0.05)]"
              >
                <h3 className="font-display text-3xl text-[var(--color-ink)]">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-[var(--color-copy)]">
                  {item.body}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="page-section pb-20 pt-14 md:pb-24 md:pt-20">
        <div className="mx-auto max-w-7xl rounded-[2.75rem] border border-[rgba(111,89,64,0.12)] bg-[linear-gradient(135deg,rgba(255,255,255,0.9),rgba(239,228,210,0.92))] p-8 shadow-[0_18px_42px_rgba(24,21,17,0.06)] md:p-10">
          <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
            <div>
              <Badge>{copy.home.newsletterTitle}</Badge>
              <h2 className="mt-4 font-display text-5xl text-[var(--color-ink)]">
                {copy.home.newsletterTitle}
              </h2>
              <p className="mt-4 max-w-xl text-base leading-8 text-[var(--color-copy)]">
                {copy.home.newsletterBody}
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {allArticles.slice(0, 2).map((article) => (
                <ArticleCard
                  key={article.slug}
                  article={article}
                  locale={typedLocale}
                  label={copy.common.readArticle}
                />
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
