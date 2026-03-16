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

  return buildMetadata({
    locale: typedLocale,
    pathname: "/checkout",
    title: typedLocale === "zh" ? "结账" : "Checkout",
    description:
      typedLocale === "zh"
        ? "前端占位式结账流程，便于后续接入真实支付与配送服务。"
        : "A frontend-ready placeholder checkout surface for later payment and fulfillment integration.",
    noIndex: true,
  });
}

export default async function CheckoutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const typedLocale = locale as Locale;
  const steps =
    typedLocale === "zh"
      ? ["联系方式", "配送方式", "支付服务接入", "订单确认"]
      : ["Contact information", "Delivery method", "Payment service integration", "Order review"];
  const copy = getMessages(typedLocale);

  return (
    <div className="page-section py-14 md:py-20">
      <div className="mx-auto max-w-5xl rounded-[2.75rem] border border-[rgba(111,89,64,0.12)] bg-white/80 p-8 shadow-[0_18px_48px_rgba(24,21,17,0.06)] md:p-10">
        <Badge>{typedLocale === "zh" ? "结账占位流程" : "Checkout placeholder"}</Badge>
        <h1 className="mt-5 font-display text-5xl text-[var(--color-ink)] md:text-6xl">
          {typedLocale === "zh"
            ? "已为真实电商接入预留结构"
            : "Structured for live commerce integration"}
        </h1>
        <p className="mt-5 max-w-3xl text-base leading-8 text-[var(--color-copy)]">
          {copy.cart.checkoutNote}
        </p>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {steps.map((step, index) => (
            <div
              key={step}
              className="rounded-[2rem] border border-[rgba(111,89,64,0.12)] bg-[rgba(248,243,235,0.72)] p-5"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-accent)]">
                {typedLocale === "zh" ? `步骤 ${index + 1}` : `Step ${index + 1}`}
              </p>
              <p className="mt-3 text-lg font-medium text-[var(--color-ink)]">{step}</p>
            </div>
          ))}
        </div>
        <div className="mt-8">
          <LocaleLink href="/cart" locale={typedLocale}>
            <Button variant="secondary">{copy.navigation.cart}</Button>
          </LocaleLink>
        </div>
      </div>
    </div>
  );
}
