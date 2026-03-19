import type { Metadata } from "next";

import { Badge } from "@/components/ui/badge";
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
    pathname: "/faq",
    title: copy.navigation.faq,
    description: copy.faq.title,
  });
}

export default async function FaqPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const typedLocale = locale as Locale;
  const copy = getMessages(typedLocale);
  const faqs =
    typedLocale === "zh"
      ? [
          {
            question: "这些茶是医疗产品吗？",
            answer:
              "不是。本站将产品定位为日常草本茶与养护内容，不代替医疗建议，也不作治疗或诊断承诺。",
          },
          {
            question: "如果我不知道该选哪一款怎么办？",
            answer:
              "可以先使用 Helper AI。它会根据你的回答缩小范围，并引导你进入更相关的产品页与内容页。",
          },
          {
            question: "购物车和账户功能是否已经可以接入真实后端？",
            answer:
              "可以。当前已实现可维护的前端结构，便于后续连接 Shopify、Medusa、Stripe 或自定义认证系统。",
          },
          {
            question: "文章系统未来如何扩展？",
            answer:
              "只需在 content/articles 中新增文章目录，并加入带 frontmatter 的 en.mdx 和 zh.mdx（或 .md）内容文件，列表、详情页与元数据都会自动接入。",
          },
        ]
      : [
          {
            question: "Are these teas positioned as medical products?",
            answer:
              "No. The site presents them as daily herbal wellness teas and educational content, without diagnostic, treatment, or cure claims.",
          },
          {
            question: "What if I’m not sure which blend to choose?",
            answer:
              "Start with Helper AI. It narrows the collection based on your answers and routes you toward more relevant product and content pages.",
          },
          {
            question: "Can the cart and account flows connect to real services later?",
            answer:
              "Yes. The frontend architecture is intentionally structured for later integration with Shopify, Medusa, Stripe, or custom auth and commerce backends.",
          },
          {
            question: "How does the article system scale later on?",
            answer:
              "Add a new folder under content/articles with frontmatter-driven en.mdx and zh.mdx files, or use .md. The index, detail pages, and metadata will ingest them automatically.",
          },
        ];

  return (
    <div className="page-section py-14 md:py-20">
      <div className="mx-auto max-w-4xl rounded-[2.75rem] border border-[rgba(111,89,64,0.12)] bg-white/80 p-8 shadow-[0_18px_48px_rgba(24,21,17,0.06)] md:p-10">
        <Badge>{copy.faq.eyebrow}</Badge>
        <h1 className="mt-5 font-display text-5xl leading-tight text-[var(--color-ink)] md:text-6xl">
          {copy.faq.title}
        </h1>
        <div className="mt-10 space-y-4">
          {faqs.map((item) => (
            <details
              key={item.question}
              className="rounded-[2rem] border border-[rgba(111,89,64,0.12)] bg-[rgba(248,243,235,0.72)] p-6"
            >
              <summary className="cursor-pointer list-none font-medium text-[var(--color-ink)]">
                {item.question}
              </summary>
              <p className="mt-4 text-sm leading-7 text-[var(--color-copy)]">
                {item.answer}
              </p>
            </details>
          ))}
        </div>
      </div>
    </div>
  );
}
