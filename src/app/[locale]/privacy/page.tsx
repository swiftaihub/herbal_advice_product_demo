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
    pathname: "/privacy",
    title: copy.legal.privacy,
    description: copy.legal.privacy,
  });
}

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const typedLocale = locale as Locale;

  const content =
    typedLocale === "zh"
      ? {
          eyebrow: "隐私政策",
          title: "我们如何处理站点信息",
          intro:
            "本页面为前端阶段的隐私政策占位内容，用于说明未来接入真实分析、账户与电商后端后的信息处理方向。",
          sections: [
            {
              title: "收集的信息",
              body: [
                "当前站点主要展示前端结构，不会在本地演示中处理真实订单数据。",
                "未来接入后端后，可能包括账户资料、购物车、订单信息与联系表单内容。",
              ],
            },
            {
              title: "用途说明",
              body: [
                "信息将用于完成账户登录、订单处理、客服支持与品牌沟通。",
                "如接入分析工具，应在正式生产环境中同步更新 Cookie 与跟踪说明。",
              ],
            },
            {
              title: "用户控制权",
              body: [
                "未来正式上线时，用户应能访问、修改或删除相关账户资料，并查看更多隐私选项。",
              ],
            },
          ],
        }
      : {
          eyebrow: "Privacy policy",
          title: "How site information is handled",
          intro:
            "This is a frontend-stage privacy placeholder describing how real data handling can be layered in once analytics, account, and commerce services are connected.",
          sections: [
            {
              title: "Information collected",
              body: [
                "The current site is primarily a frontend implementation and does not process live production order data.",
                "Future integrations may include account details, cart state, order information, and contact form submissions.",
              ],
            },
            {
              title: "How information may be used",
              body: [
                "Connected data would support account access, order processing, customer care, and brand communications.",
                "If analytics tools are added, production policies should be updated with cookie and tracking disclosures.",
              ],
            },
            {
              title: "User controls",
              body: [
                "A live version should provide ways to access, update, or delete relevant account information and privacy preferences.",
              ],
            },
          ],
        };

  return <LegalShell {...content} />;
}
