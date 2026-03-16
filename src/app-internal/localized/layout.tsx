import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { CartAnnouncement } from "@/components/cart/cart-announcement";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { FloatingAiCta } from "@/components/layout/floating-ai-cta";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { locales } from "@/i18n/config";
import { getMessages } from "@/i18n/messages";
import { brandName, newsletterPlaceholderTitle } from "@/lib/site";
import { buildMetadata } from "@/lib/seo";
import type { Locale } from "@/lib/types";

export const dynamic = "error";
export const dynamicParams = false;

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  if (!locales.includes(locale as Locale)) {
    return {};
  }

  return buildMetadata({
    locale: locale as Locale,
    pathname: "/",
  });
}

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;

  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  const typedLocale = locale as Locale;
  const copy = getMessages(typedLocale);

  return (
    <div className="min-h-screen">
      <SiteHeader
        locale={typedLocale}
        brandName={brandName[typedLocale]}
        brandLabel={typedLocale === "zh" ? "精品草本茶" : "Premium herbal tea"}
        accountLabel={copy.navigation.account}
        cartLabel={copy.navigation.cart}
        navigation={copy.navigation}
        common={{ menu: copy.common.menu }}
        localeLabel={copy.localeLabel}
      />
      <main>{children}</main>
      <SiteFooter
        locale={typedLocale}
        brandName={brandName[typedLocale]}
        footer={copy.footer}
        navigation={{
          shop: copy.navigation.shop,
          ingredients: copy.navigation.ingredients,
          articles: copy.navigation.articles,
          aiGuide: copy.navigation.aiGuide,
          faq: copy.navigation.faq,
          contact: copy.navigation.contact,
          about: copy.navigation.about,
        }}
        legal={copy.legal}
        newsletterTitle={newsletterPlaceholderTitle[typedLocale]}
        newsletterBody={copy.home.newsletterBody}
      />
      <FloatingAiCta locale={typedLocale} label={copy.navigation.aiGuide} />
      <CartDrawer
        locale={typedLocale}
        copy={{
          title: copy.cart.drawerTitle,
          subtotal: copy.common.subtotal,
          emptyTitle: copy.common.emptyStateTitle,
          emptyBody: copy.cart.emptyBody,
          continueShopping: copy.common.continueShopping,
          checkout: copy.common.checkout,
          viewCart: copy.common.viewCart,
          remove: copy.common.remove,
          clearCart: copy.common.clearCart,
          confirmClearCart: copy.common.confirmClearCart,
          cancel: copy.common.cancel,
          quantity: copy.common.quantity,
          close: copy.common.close,
        }}
      />
      <CartAnnouncement />
    </div>
  );
}
