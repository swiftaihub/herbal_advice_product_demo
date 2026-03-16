import Image from "next/image";
import type { Metadata } from "next";

import { HelperAiPanel } from "@/components/ai/helper-ai-panel";
import { Badge } from "@/components/ui/badge";
import { SectionHeading } from "@/components/ui/section-heading";
import { getMessages } from "@/i18n/messages";
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
    pathname: "/about",
    title: copy.navigation.about,
    description: copy.about.description,
    image: "/images/brand/about.jpg",
  });
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const typedLocale = locale as Locale;
  const copy = getMessages(typedLocale);
  const values =
    typedLocale === "zh"
      ? [
          {
            title: "品牌叙事与购物体验一体化",
            body: "让文章、原料知识与产品页共同构成更完整的用户决策路径。",
          },
          {
            title: "面向双语用户的优雅体验",
            body: "同一套结构中兼顾中文与英文内容，不让语言切换显得割裂。",
          },
          {
            title: "为真实生产环境预留扩展性",
            body: "在视觉精致度之外，也重视可维护的数据模型、路由与状态架构。",
          },
        ]
      : [
          {
            title: "Brand storytelling and commerce working together",
            body: "Editorial, ingredient education, and product detail pages all contribute to a more informed buying journey.",
          },
          {
            title: "An elegant experience for bilingual audiences",
            body: "Chinese and English readers move through the same elevated system without the language switch feeling bolted on.",
          },
          {
            title: "Built for real production extension",
            body: "The visual polish is matched by data-driven routing, maintainable state, and scalable content architecture.",
          },
        ];

  return (
    <div className="page-section py-14 md:py-20">
      <div className="mx-auto max-w-7xl space-y-10">
        <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <div className="space-y-6 rounded-[2.75rem] border border-[rgba(111,89,64,0.12)] bg-white/80 p-8 shadow-[0_18px_48px_rgba(24,21,17,0.06)] md:p-10">
            <Badge>{copy.about.eyebrow}</Badge>
            <h1 className="font-display text-5xl leading-tight text-[var(--color-ink)] md:text-7xl">
              {copy.about.title}
            </h1>
            <p className="max-w-2xl text-base leading-8 text-[var(--color-copy)] md:text-lg">
              {copy.about.description}
            </p>
          </div>
          <div className="relative aspect-[5/4.6] overflow-hidden rounded-[2.75rem] border border-[rgba(111,89,64,0.12)] bg-[var(--color-surface)] shadow-[0_18px_48px_rgba(24,21,17,0.08)]">
            <Image
              src="/images/brand/about.jpg"
              alt={copy.navigation.about}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
        </div>

        <div className="rounded-[2.75rem] border border-[rgba(111,89,64,0.12)] bg-white/80 p-8 shadow-[0_18px_40px_rgba(24,21,17,0.06)] md:p-10">
          <SectionHeading
            eyebrow={copy.navigation.about}
            title={typedLocale === "zh" ? "我们如何定义这个品牌体验" : "How the brand experience is shaped"}
            description={typedLocale === "zh" ? "它既是一个精品茶品牌前端，也是一个可持续扩展的内容电商基础。": "This storefront is both a premium tea brand frontend and a scalable foundation for content-commerce growth."}
          />
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {values.map((value) => (
              <article
                key={value.title}
                className="rounded-[2rem] border border-[rgba(111,89,64,0.1)] bg-[rgba(248,243,235,0.7)] p-6"
              >
                <h2 className="font-display text-3xl text-[var(--color-ink)]">
                  {value.title}
                </h2>
                <p className="mt-4 text-sm leading-7 text-[var(--color-copy)]">
                  {value.body}
                </p>
              </article>
            ))}
          </div>
        </div>

        <HelperAiPanel
          locale={typedLocale}
          title={typedLocale === "zh" ? "把推荐工具放在品牌核心位置" : "Putting guided recommendations at the center"}
          description={typedLocale === "zh" ? "Helper AI 不被放在页脚角落，而是成为品牌识别度很高的入口，帮助用户从不确定进入更相关的产品路径。": "Helper AI is not hidden in the footer. It sits at the center of discovery so unsure customers can move directly into more relevant blends."}
          primaryLabel={copy.home.primaryCta}
          secondaryLabel={copy.aiGuide.launchLabel}
        />
      </div>
    </div>
  );
}
