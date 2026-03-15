import type { Metadata } from "next";

import { CartPageView } from "@/components/cart/cart-page-view";
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
    pathname: "/cart",
    title: copy.navigation.cart,
    description: copy.cart.checkoutNote,
  });
}

export default async function CartPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const typedLocale = locale as Locale;
  const copy = getMessages(typedLocale);

  return (
    <div className="page-section py-14 md:py-20">
      <div className="mx-auto max-w-7xl space-y-10">
        <div className="space-y-4">
          <Badge>{copy.navigation.cart}</Badge>
          <h1 className="font-display text-5xl text-[var(--color-ink)] md:text-6xl">
            {copy.cart.title}
          </h1>
        </div>
        <CartPageView
          locale={typedLocale}
          copy={{
            title: copy.cart.title,
            summaryTitle: copy.cart.summaryTitle,
            subtotal: copy.common.subtotal,
            emptyTitle: copy.common.emptyStateTitle,
            emptyBody: copy.cart.emptyBody,
            continueShopping: copy.common.continueShopping,
            checkout: copy.common.checkout,
            remove: copy.common.remove,
            clearCart: copy.common.clearCart,
            confirmClearCart: copy.common.confirmClearCart,
            cancel: copy.common.cancel,
            quantity: copy.common.quantity,
            checkoutNote: copy.cart.checkoutNote,
          }}
        />
      </div>
    </div>
  );
}
