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
    pathname: "/disclaimer",
    title: copy.legal.disclaimer,
    description: copy.legal.disclaimer,
  });
}

export default async function DisclaimerPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const typedLocale = locale as Locale;

  const content =
    typedLocale === "zh"
      ? {
          eyebrow: "养生免责声明",
          title: "关于草本茶与内容表达的重要说明",
          intro:
            "本网站介绍的产品与原料内容以日常饮用、风味体验与养护教育为核心，不替代医生或其他专业医疗建议。",
          sections: [
            {
              title: "不作医疗承诺",
              body: [
                "本站不会以产品内容作出诊断、治疗、治愈或保证性效果承诺。",
                "如你有特殊身体情况、正在怀孕、哺乳，或正在接受治疗，请咨询合格专业人士。",
              ],
            },
            {
              title: "个体差异",
              body: [
                "不同体质、口味偏好与生活节奏，都会影响用户对茶饮的体验与选择。",
                "Helper AI 提供的是引导式产品发现体验，而不是医疗判断。",
              ],
            },
            {
              title: "内容更新",
              body: [
                "品牌内容会随着产品与编辑策略更新而调整，正式上线时应继续进行合规审核。",
              ],
            },
          ],
        }
      : {
          eyebrow: "Wellness disclaimer",
          title: "Important context around herbal tea and site content",
          intro:
            "Products and ingredient content on this site are presented for daily enjoyment, flavor education, and wellness-oriented context. They do not replace medical care or professional advice.",
          sections: [
            {
              title: "No medical claims",
              body: [
                "The site does not present products as a means to diagnose, treat, cure, or guarantee health outcomes.",
                "Users with individual concerns, pregnancy, nursing, or ongoing treatment should consult a qualified professional.",
              ],
            },
            {
              title: "Individual variation",
              body: [
                "Personal constitution, flavor preference, and daily rhythm all shape how a user experiences and selects tea.",
                "Helper AI is a guided discovery tool, not a medical assessment.",
              ],
            },
            {
              title: "Content updates",
              body: [
                "Brand content may evolve as the assortment and editorial strategy grow, and production launches should continue to review claims for compliance.",
              ],
            },
          ],
        };

  return <LegalShell {...content} />;
}
