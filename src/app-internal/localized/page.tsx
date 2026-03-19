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
      getFeaturedArticles(typedLocale, 3),
      getAllArticleMeta(typedLocale),
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
      <div className="page-section pb-10 pt-4 sm:pb-12 sm:pt-6 md:pb-20 md:pt-12">
        <div className="mx-auto grid max-w-7xl gap-5 sm:gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-8">
          <section className="space-y-6 rounded-[2rem] border border-[rgba(111,89,64,0.12)] bg-[rgba(255,255,255,0.78)] p-5 shadow-[0_20px_54px_rgba(24,21,17,0.06)] sm:rounded-[2.25rem] sm:p-6 md:space-y-8 md:rounded-[2.75rem] md:p-10">
            <Badge>{copy.home.eyebrow}</Badge>
            <div className="space-y-3 sm:space-y-4 md:space-y-5">
              <h1 className="font-display text-[2.85rem] leading-[0.92] text-[var(--color-ink)] sm:text-5xl md:text-7xl">
                {copy.home.title}
              </h1>
              <p className="max-w-2xl text-sm leading-6 text-[var(--color-copy)] sm:text-base sm:leading-7 md:text-lg md:leading-8">
                {copy.home.description}
              </p>
            </div>
            <div className="flex flex-col gap-2.5 min-[360px]:flex-row">
              <LocaleLink href="/ai-guide" locale={typedLocale}>
                <Button>{copy.home.primaryCta}</Button>
              </LocaleLink>
              <LocaleLink href="/shop" locale={typedLocale}>
                <Button variant="secondary">{copy.home.secondaryCta}</Button>
              </LocaleLink>
            </div>
            <div className="grid gap-3 rounded-[1.5rem] bg-[rgba(176,136,74,0.08)] p-4 min-[560px]:grid-cols-[0.9fr_1.1fr] sm:rounded-[2rem] sm:p-5 md:gap-4 md:p-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-accent)]">
                  {copy.home.heroCardTitle}
                </p>
                <p className="mt-2.5 text-sm leading-6 text-[var(--color-copy)] sm:mt-3 sm:leading-7">
                  {copy.home.heroCardBody}
                </p>
              </div>
              <div className="space-y-2.5 sm:space-y-3">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-accent)]">
                  {copy.home.trustTitle}
                </p>
                <ul className="space-y-2 text-sm leading-6 text-[var(--color-copy)] sm:space-y-3 sm:leading-7">
                  {copy.home.trustItems.map((item) => (
                    <li key={item} className="rounded-[1.2rem] bg-white/70 px-3.5 py-2.5 sm:rounded-2xl sm:px-4 sm:py-3">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>
          <section className="relative overflow-hidden rounded-[2rem] border border-[rgba(111,89,64,0.12)] bg-[var(--color-surface)] shadow-[0_20px_54px_rgba(24,21,17,0.08)] sm:rounded-[2.75rem]">
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(24,21,17,0.05),rgba(24,21,17,0.28))]" />
            <div className="relative aspect-[5/5.4] sm:aspect-[5/5.8]">
              <Image
                src="/images/brand/hero.jpg"
                alt={brandName[typedLocale]}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5 md:p-8">
              <div className="rounded-[1.5rem] border border-[rgba(255,255,255,0.18)] bg-[rgba(34,30,22,0.72)] p-4 text-[var(--color-paper)] backdrop-blur-md sm:rounded-[2rem] sm:p-5 md:p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-sun)]">
                  {copy.common.featuredCollection}
                </p>
                <p className="mt-2.5 font-display text-[2rem] sm:mt-3 md:text-4xl">
                  {featuredProducts[0]?.name[typedLocale]}
                </p>
                <p className="mt-2.5 text-sm leading-6 text-[rgba(248,243,235,0.8)] sm:mt-3 sm:leading-7">
                  {featuredProducts[0]?.summary[typedLocale]}
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>

      <section className="page-section py-10 sm:py-12 md:py-20">
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
          <div className="mt-8 grid gap-4 min-[360px]:grid-cols-2 xl:grid-cols-4 sm:mt-10 sm:gap-5 xl:gap-6">
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

      <section className="page-section py-10 sm:py-12 md:py-20">
        <div className="mx-auto max-w-7xl rounded-[2rem] border border-[rgba(111,89,64,0.12)] bg-white/70 p-5 shadow-[0_18px_40px_rgba(24,21,17,0.05)] sm:rounded-[2.25rem] sm:p-6 md:rounded-[2.75rem] md:p-10">
          <SectionHeading
            eyebrow={copy.home.valueTitle}
            title={copy.home.valueTitle}
            description={copy.home.trustModuleBody}
          />
          <div className="mt-8 grid gap-4 min-[360px]:grid-cols-2 md:grid-cols-3 sm:mt-10 sm:gap-5">
            {copy.home.valueItems.map((item) => (
              <article
                key={item.title}
                className="rounded-[1.55rem] border border-[rgba(111,89,64,0.1)] bg-[rgba(248,243,235,0.72)] p-4 sm:rounded-[2rem] sm:p-6"
              >
                <h3 className="font-display text-[1.75rem] leading-[1.04] text-[var(--color-ink)] sm:text-3xl">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-[var(--color-copy)] sm:mt-4 sm:leading-7">
                  {item.body}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="page-section py-10 sm:py-12 md:py-20">
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
          <div className="mt-8 grid gap-4 min-[360px]:grid-cols-2 xl:grid-cols-3 sm:mt-10 sm:gap-5 xl:gap-6">
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

      <section className="page-section py-10 sm:py-12 md:py-20">
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

      <section className="page-section py-10 sm:py-12 md:py-20">
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
          <div className="mt-8 grid gap-4 min-[360px]:grid-cols-2 xl:grid-cols-3 sm:mt-10 sm:gap-5 xl:gap-6">
            {featuredArticles.map((article) => (
              <ArticleCard
                key={`${article.locale}-${article.slug}`}
                article={article}
                locale={typedLocale}
                label={copy.common.readArticle}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="page-section py-10 sm:py-12 md:py-20">
        <div className="mx-auto grid max-w-7xl gap-5 sm:gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-[2rem] border border-[rgba(111,89,64,0.12)] bg-[rgba(34,30,22,0.94)] p-5 text-[var(--color-paper)] shadow-[0_18px_44px_rgba(24,21,17,0.16)] sm:rounded-[2.5rem] sm:p-6 md:p-10">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-sun)]">
              {copy.home.trustModuleTitle}
            </p>
            <h2 className="mt-3 font-display text-[2.35rem] leading-[1.03] text-[var(--color-paper)] sm:mt-4 sm:text-5xl">
              {typedLocale === "zh"
                ? "克制、可信、可持续扩展的品牌体验"
                : "A calm, credible, scalable brand experience"}
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-[rgba(248,243,235,0.78)] sm:mt-5 sm:text-base sm:leading-8">
              {copy.home.trustModuleBody}
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 lg:gap-5">
            {ritualModules.map((item) => (
              <article
                key={item.title}
                className="rounded-[1.55rem] border border-[rgba(111,89,64,0.12)] bg-white/82 p-4 shadow-[0_12px_34px_rgba(24,21,17,0.05)] sm:rounded-[2rem] sm:p-6"
              >
                <h3 className="font-display text-[1.75rem] leading-[1.04] text-[var(--color-ink)] sm:text-3xl">
                  {item.title}
                </h3>
                <p className="mt-2.5 text-sm leading-6 text-[var(--color-copy)] sm:mt-3 sm:leading-7">
                  {item.body}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="page-section pb-16 pt-10 sm:pb-20 sm:pt-12 md:pb-24 md:pt-20">
        <div className="mx-auto max-w-7xl rounded-[2rem] border border-[rgba(111,89,64,0.12)] bg-[linear-gradient(135deg,rgba(255,255,255,0.9),rgba(239,228,210,0.92))] p-5 shadow-[0_18px_42px_rgba(24,21,17,0.06)] sm:rounded-[2.25rem] sm:p-6 md:rounded-[2.75rem] md:p-10">
          <div className="grid gap-5 sm:gap-6 lg:grid-cols-[0.95fr_1.05fr] md:gap-8">
            <div>
              <Badge>{copy.home.newsletterTitle}</Badge>
              <h2 className="mt-3 font-display text-[2.3rem] leading-[1.03] text-[var(--color-ink)] sm:mt-4 sm:text-5xl">
                {copy.home.newsletterTitle}
              </h2>
              <p className="mt-3 max-w-xl text-sm leading-6 text-[var(--color-copy)] sm:mt-4 sm:text-base sm:leading-8">
                {copy.home.newsletterBody}
              </p>
            </div>
            <div className="grid gap-4 min-[360px]:grid-cols-2">
              {allArticles.slice(0, 2).map((article) => (
                <ArticleCard
                  key={`${article.locale}-${article.slug}`}
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
