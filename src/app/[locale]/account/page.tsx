import type { Metadata } from "next";

import { Badge } from "@/components/ui/badge";
import { LocaleLink } from "@/components/layout/locale-link";
import { Button } from "@/components/ui/button";
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
    pathname: "/account",
    title: copy.navigation.account,
    description: copy.auth.accountBody,
    noIndex: true,
  });
}

export default async function AccountPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const typedLocale = locale as Locale;
  const copy = getMessages(typedLocale);
  const cards =
    typedLocale === "zh"
      ? [
          { title: "订单", body: "未来可接入真实订单与状态追踪。" },
          { title: "偏好", body: "可保存常购茶品、口味方向与 Helper AI 历史。" },
          { title: "内容订阅", body: "可接入品牌文章、上新与活动类订阅管理。" },
        ]
      : [
          { title: "Orders", body: "Ready for real order history and status tracking." },
          { title: "Preferences", body: "Can later store favorite blends, flavor directions, and AI history." },
          { title: "Subscriptions", body: "Prepared for editorial, product launch, and brand communication settings." },
        ];

  return (
    <div className="page-section py-14 md:py-20">
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="rounded-[2.75rem] border border-[rgba(111,89,64,0.12)] bg-white/80 p-8 shadow-[0_18px_48px_rgba(24,21,17,0.06)] md:p-10">
          <Badge>{copy.navigation.account}</Badge>
          <h1 className="mt-5 font-display text-5xl text-[var(--color-ink)] md:text-6xl">
            {copy.auth.accountTitle}
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-8 text-[var(--color-copy)]">
            {copy.auth.accountBody}
          </p>
          <div className="mt-6">
            <LocaleLink href="/sign-in" locale={typedLocale}>
              <Button variant="secondary">{copy.navigation.signIn}</Button>
            </LocaleLink>
          </div>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {cards.map((card) => (
            <article
              key={card.title}
              className="rounded-[2rem] border border-[rgba(111,89,64,0.12)] bg-white/82 p-6 shadow-[0_12px_34px_rgba(24,21,17,0.05)]"
            >
              <h2 className="font-display text-3xl text-[var(--color-ink)]">
                {card.title}
              </h2>
              <p className="mt-3 text-sm leading-7 text-[var(--color-copy)]">
                {card.body}
              </p>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
