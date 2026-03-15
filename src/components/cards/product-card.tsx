import Image from "next/image";

import { AddToCartButton } from "@/components/cart/add-to-cart-button";
import { LocaleLink } from "@/components/layout/locale-link";
import { Badge } from "@/components/ui/badge";
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
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-[2rem] border border-[rgba(111,89,64,0.12)] bg-white/80 shadow-[0_12px_40px_rgba(24,21,17,0.05)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_50px_rgba(24,21,17,0.08)]">
      <LocaleLink href={`/products/${product.slug}`} locale={locale} className="block">
        <div className="relative aspect-[4/4.4] overflow-hidden bg-[var(--color-surface)]">
          <Image
            src={product.images[0]}
            alt={product.name[locale]}
            fill
            className="object-cover transition duration-500 group-hover:scale-[1.03]"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      </LocaleLink>
      <div className="flex flex-1 flex-col gap-5 p-5">
        <div className="flex items-center justify-between gap-3">
          <Badge>{getBenefitLabel(product.benefit_tags[0], locale)}</Badge>
          <span className="text-sm font-semibold text-[var(--color-ink)]">
            {formatCurrency(product.price, product.currency, locale)}
          </span>
        </div>
        <div className="space-y-3">
          <div>
            <h3 className="font-display text-3xl leading-tight text-[var(--color-ink)]">
              {product.name[locale]}
            </h3>
            <p className="mt-2 text-sm leading-7 text-[var(--color-muted)]">
              {product.tagline[locale]}
            </p>
          </div>
          <p className="text-sm leading-7 text-[var(--color-copy)]">
            {product.summary[locale]}
          </p>
        </div>
        <div className="mt-auto space-y-4">
          <div className="flex flex-wrap gap-2">
            {product.flavor_notes[locale].slice(0, 3).map((note) => (
              <span
                key={note}
                className="rounded-full bg-[rgba(176,136,74,0.08)] px-3 py-1 text-xs font-medium text-[var(--color-muted)]"
              >
                {note}
              </span>
            ))}
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="text-xs uppercase tracking-[0.16em] text-[var(--color-muted)]">
              {localizeSize(product.size, locale)}
            </span>
            <LocaleLink
              href={`/products/${product.slug}`}
              locale={locale}
              className="text-sm font-medium text-[var(--color-ink)] underline decoration-[rgba(176,136,74,0.4)] underline-offset-4"
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
