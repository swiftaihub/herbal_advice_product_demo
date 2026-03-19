import type { Metadata } from "next";

import { ExternalLink, Sparkles } from "lucide-react";

import { LocaleLink } from "@/components/layout/locale-link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";
import { aiPathways } from "@/lib/ai-pathways";
import { getContentPath } from "@/lib/content-links";
import { getActiveProducts } from "@/lib/data/products";
import { getMessages } from "@/i18n/messages";
import { aiGuideUrl } from "@/lib/site";
import { buildMetadata } from "@/lib/seo";
import type { Locale } from "@/lib/types";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const typedLocale = locale as Locale;
  const copy = getMessages(typedLocale);

  return buildMetadata({
    locale: typedLocale,
    pathname: "/ai-guide",
    title: copy.navigation.aiGuide,
    description: copy.aiGuide.description,
  });
}

export default async function AiGuidePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const typedLocale = locale as Locale;
  const copy = getMessages(typedLocale);
  const products = await getActiveProducts();

  return (
    <div className="page-section py-14 md:py-20">
      <div className="mx-auto max-w-7xl space-y-10">
        <div className="rounded-[2.75rem] border border-[rgba(111,89,64,0.12)] bg-white/80 p-8 shadow-[0_18px_48px_rgba(24,21,17,0.06)] md:p-10">
          <Badge>{copy.aiGuide.eyebrow}</Badge>
          <div className="mt-5 grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
            <div>
              <h1 className="font-display text-5xl leading-tight text-[var(--color-ink)] md:text-7xl">
                {copy.aiGuide.title}
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-8 text-[var(--color-copy)] md:text-lg">
                {copy.aiGuide.description}
              </p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <a href={aiGuideUrl} target="_blank" rel="noreferrer">
                  <Button icon={<ExternalLink className="h-4 w-4" />}>
                    {copy.aiGuide.launchLabel}
                  </Button>
                </a>
                <LocaleLink href="/shop" locale={typedLocale}>
                  <Button variant="secondary">{copy.navigation.shop}</Button>
                </LocaleLink>
              </div>
            </div>
            <div className="rounded-[2.25rem] border border-[rgba(176,136,74,0.18)] bg-[rgba(176,136,74,0.08)] p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-accent)]">
                Helper AI
              </p>
              <p className="mt-4 text-sm leading-7 text-[var(--color-copy)]">
                {copy.aiGuide.embedBody}
              </p>
              <div className="mt-6 grid gap-3">
                {[
                  typedLocale === "zh"
                    ? "回答几道简短问题，缩小选择范围"
                    : "Answer a few prompts to narrow the collection",
                  typedLocale === "zh"
                    ? "从不确定到更聚焦的产品清单"
                    : "Move from uncertainty to a focused shortlist",
                  typedLocale === "zh"
                    ? "直接进入相关产品与原料内容"
                    : "Jump directly into relevant blends and ingredients",
                ].map((item) => (
                  <div key={item} className="rounded-2xl bg-white/75 px-4 py-3 text-sm text-[var(--color-copy)]">
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <SectionHeading
          eyebrow={copy.aiGuide.pathwayTitle}
          title={copy.aiGuide.pathwayTitle}
          description={copy.aiGuide.description}
        />

        <div className="grid gap-6 lg:grid-cols-2">
          {aiPathways.map((pathway) => (
            <article
              key={pathway.id}
              className="rounded-[2.25rem] border border-[rgba(111,89,64,0.12)] bg-white/82 p-6 shadow-[0_12px_34px_rgba(24,21,17,0.05)]"
            >
              <div className="flex items-center gap-3 text-[var(--color-accent)]">
                <Sparkles className="h-4 w-4" />
                <span className="text-xs font-semibold uppercase tracking-[0.22em]">
                  Helper AI
                </span>
              </div>
              <h2 className="mt-4 font-display text-4xl text-[var(--color-ink)]">
                {pathway.title[typedLocale]}
              </h2>
              <p className="mt-4 text-sm leading-7 text-[var(--color-copy)]">
                {pathway.description[typedLocale]}
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                {pathway.productSlugs.map((slug) => {
                  const product = products.find((entry) => entry.slug === slug);
                  if (!product) {
                    return null;
                  }

                  return (
                    <LocaleLink
                      key={slug}
                      href={getContentPath(product, "products", typedLocale)}
                      locale={typedLocale}
                      className="rounded-full border border-[var(--color-line)] bg-[rgba(248,243,235,0.8)] px-4 py-2 text-sm text-[var(--color-ink)] transition hover:border-[var(--color-accent)]"
                    >
                      {product.name[typedLocale]}
                    </LocaleLink>
                  );
                })}
              </div>
            </article>
          ))}
        </div>

        <section className="rounded-[2.75rem] border border-[rgba(111,89,64,0.12)] bg-[rgba(34,30,22,0.96)] p-4 shadow-[0_18px_50px_rgba(24,21,17,0.16)] md:p-6">
          <div className="mb-4 flex items-center justify-between gap-4 px-2">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-sun)]">
                {copy.aiGuide.embedTitle}
              </p>
              <p className="mt-2 text-sm text-[rgba(248,243,235,0.72)]">
                {copy.aiGuide.embedBody}
              </p>
            </div>
            <a href={aiGuideUrl} target="_blank" rel="noreferrer">
              <Button variant="secondary">{copy.aiGuide.launchLabel}</Button>
            </a>
          </div>
          <div className="overflow-hidden rounded-[2rem] border border-[rgba(255,255,255,0.12)] bg-white">
            <iframe
              src={aiGuideUrl}
              title="Helper AI"
              className="h-[760px] w-full"
            />
          </div>
        </section>
      </div>
    </div>
  );
}
