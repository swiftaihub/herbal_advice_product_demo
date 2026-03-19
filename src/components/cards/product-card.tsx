import Image from "next/image";

import { AddToCartButton } from "@/components/cart/add-to-cart-button";
import { LocaleLink } from "@/components/layout/locale-link";
import { Badge } from "@/components/ui/badge";
import { getContentPath } from "@/lib/content-links";
import { getBenefitLabel } from "@/lib/taxonomies";
import type { Locale, Product } from "@/lib/types";
import { formatCurrency, localizeSize } from "@/lib/utils";

export function ProductCard({
  product,
  locale,
  addToCartLabel,
  detailLabel,
}: {
  product: Product;
  locale: Locale;
  addToCartLabel: string;
  detailLabel: string;
}) {
  const productHref = getContentPath(product, "products", locale);

  return (
    <article className="group flex h-full min-w-0 flex-col overflow-hidden rounded-[1.55rem] border border-[rgba(111,89,64,0.12)] bg-white/80 shadow-[0_12px_40px_rgba(24,21,17,0.05)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_50px_rgba(24,21,17,0.08)] sm:rounded-[2rem]">
      <LocaleLink href={productHref} locale={locale} className="block">
        <div className="relative aspect-[4/4.8] overflow-hidden bg-[var(--color-surface)] sm:aspect-[4/4.4]">
          <Image
            src={product.images[0]}
            alt={product.name[locale]}
            fill
            className="object-cover transition duration-500 group-hover:scale-[1.03]"
            sizes="(max-width: 640px) 50vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      </LocaleLink>
      <div className="flex flex-1 flex-col gap-3.5 p-4 sm:gap-5 sm:p-5">
        <div className="flex items-center justify-between gap-3">
          <Badge>{getBenefitLabel(product.benefit_tags[0], locale)}</Badge>
          <span className="text-xs font-semibold text-[var(--color-ink)] sm:text-sm">
            {formatCurrency(product.price, product.currency, locale)}
          </span>
        </div>
        <div className="min-w-0 space-y-2.5 sm:space-y-3">
          <div className="min-w-0">
            <h3 className="font-display text-[1.55rem] leading-[1.05] text-[var(--color-ink)] sm:text-3xl">
              {product.name[locale]}
            </h3>
            <p className="mt-1.5 text-[13px] leading-5 text-[var(--color-muted)] sm:mt-2 sm:text-sm sm:leading-7">
              {product.tagline[locale]}
            </p>
          </div>
          <p className="text-[13px] leading-5 text-[var(--color-copy)] sm:text-sm sm:leading-7">
            {product.summary[locale]}
          </p>
        </div>
        <div className="mt-auto space-y-3.5 sm:space-y-4">
          <div className="flex flex-wrap gap-2">
            {product.flavor_notes[locale].slice(0, 3).map((note) => (
              <span
                key={note}
                className="rounded-full bg-[rgba(176,136,74,0.08)] px-2.5 py-1 text-[11px] font-medium text-[var(--color-muted)] sm:px-3 sm:text-xs"
              >
                {note}
              </span>
            ))}
          </div>
          <div className="flex items-center justify-between gap-3">
            <span className="text-[10px] uppercase tracking-[0.14em] text-[var(--color-muted)] sm:text-xs sm:tracking-[0.16em]">
              {localizeSize(product.size, locale)}
            </span>
            <LocaleLink
              href={productHref}
              locale={locale}
              className="text-[13px] font-medium text-[var(--color-ink)] underline decoration-[rgba(176,136,74,0.4)] underline-offset-4 sm:text-sm"
            >
              {detailLabel}
            </LocaleLink>
          </div>
          <AddToCartButton
            item={{
              slug: product.slug,
              name: product.name,
              tagline: product.tagline,
              price: product.price,
              currency: product.currency,
              size: product.size,
              image: product.images[0],
            }}
            locale={locale}
            label={addToCartLabel}
            className="w-full"
          />
        </div>
      </div>
    </article>
  );
}
