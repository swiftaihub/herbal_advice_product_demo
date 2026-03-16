import type { Metadata } from "next";

import { HelperAiPanel } from "@/components/ai/helper-ai-panel";
import { ProductExplorer } from "@/components/shop/product-explorer";
import { SectionHeading } from "@/components/ui/section-heading";
import { getActiveProducts, getShopTaxonomy } from "@/lib/data/products";
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
    pathname: "/shop",
    title: copy.navigation.shop,
    description: copy.shop.description,
    image: "/images/brand/collection.jpg",
  });
}

export default async function ShopPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const typedLocale = locale as Locale;
  const copy = getMessages(typedLocale);
  const [products, taxonomy] = await Promise.all([
    getActiveProducts(),
    getShopTaxonomy(),
  ]);

  return (
    <div className="page-section py-14 md:py-20">
      <div className="mx-auto max-w-7xl space-y-10">
        <SectionHeading
          eyebrow={copy.shop.eyebrow}
          title={copy.shop.title}
          description={copy.shop.description}
        />
        <HelperAiPanel
          locale={typedLocale}
          title={copy.shop.unsureTitle}
          description={copy.shop.unsureBody}
          primaryLabel={copy.common.openGuide}
          secondaryLabel={copy.aiGuide.launchLabel}
          compact
        />
        <ProductExplorer
          locale={typedLocale}
          products={products}
          benefitTags={taxonomy.benefitTags}
          constitutions={taxonomy.constitutions}
          discomforts={taxonomy.discomforts}
          copy={{
            addToCart: copy.common.addToCart,
            viewDetails: copy.common.viewDetails,
            noResults: copy.common.noResults,
            resetFilters: copy.common.resetFilters,
            searchLabel: copy.shop.filters.search,
            benefitsLabel: copy.shop.filters.benefits,
            constitutionsLabel: copy.shop.filters.constitutions,
            discomfortsLabel: copy.shop.filters.discomforts,
            sortLabel: copy.shop.filters.sort,
            sortFeatured: copy.shop.filters.sortFeatured,
            sortPriceLow: copy.shop.filters.sortPriceLow,
            sortPriceHigh: copy.shop.filters.sortPriceHigh,
          }}
        />
      </div>
    </div>
  );
}
