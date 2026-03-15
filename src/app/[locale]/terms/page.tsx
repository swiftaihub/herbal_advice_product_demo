import type { Metadata } from "next";

import { LegalShell } from "@/components/content/legal-shell";
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
    pathname: "/terms",
    title: copy.legal.terms,
    description: copy.legal.terms,
  });
}

export default async function TermsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const typedLocale = locale as Locale;

  const content =
    typedLocale === "zh"
      ? {
          eyebrow: "服务条款",
          title: "使用本网站前请先了解这些说明",
          intro:
            "本页面为可继续扩展的前端条款占位内容，用于承接未来真实电商与账户功能上线后的正式条款。",
          sections: [
            {
              title: "网站使用",
              body: [
                "你可以浏览产品、原料与文章内容，并使用 Helper AI 作为产品发现工具。",
                "如未来接入真实交易功能，条款应补充支付、配送、退货与账户责任说明。",
              ],
            },
            {
              title: "内容性质",
              body: [
                "本站内容用于品牌展示与日常养护教育，不构成医疗建议。",
                "文章与原料页应以合规、克制的方式呈现草本茶相关信息。",
              ],
            },
            {
              title: "后续更新",
              body: [
                "当站点正式接入后端服务时，条款将随之更新并补充更具体的运营细则。",
              ],
            },
          ],
        }
      : {
          eyebrow: "Terms of service",
          title: "Important notes before using the site",
          intro:
            "This page is an expandable frontend placeholder for the terms that would accompany live commerce and account functionality in production.",
          sections: [
            {
              title: "Using the site",
              body: [
                "Users can browse products, ingredients, articles, and use Helper AI as a discovery tool.",
                "Once commerce features are connected, production terms should add payment, shipping, returns, and account responsibilities.",
              ],
            },
            {
              title: "Nature of the content",
              body: [
                "Site content is provided for brand presentation and daily wellness education and does not replace medical advice.",
                "Editorial and ingredient content should remain compliance-aware and restrained in tone.",
              ],
            },
            {
              title: "Future updates",
              body: [
                "When live backend services are connected, these terms should be updated to reflect operational details more precisely.",
              ],
            },
          ],
        };

  return <LegalShell {...content} />;
}
