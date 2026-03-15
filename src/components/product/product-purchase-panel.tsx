"use client";

import { useState } from "react";

import { AddToCartButton } from "@/components/cart/add-to-cart-button";
import { LocaleLink } from "@/components/layout/locale-link";
import { Button } from "@/components/ui/button";
import { QuantityStepper } from "@/components/ui/quantity-stepper";
import type { Locale, Product } from "@/lib/types";
import { formatCurrency, localizeSize } from "@/lib/utils";

export function ProductPurchasePanel({
  product,
  locale,
  addToCartLabel,
  quantityLabel,
  helperLabel,
  collectionLabel,
}: {
  product: Product;
  locale: Locale;
  addToCartLabel: string;
  quantityLabel: string;
  helperLabel: string;
  collectionLabel: string;
}) {
  const [quantity, setQuantity] = useState(1);

  return (
    <aside className="rounded-[2.25rem] border border-[rgba(111,89,64,0.14)] bg-white/85 p-6 shadow-[0_18px_50px_rgba(24,21,17,0.08)] lg:sticky lg:top-28">
      <div className="space-y-5">
        <div className="space-y-2">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--color-accent)]">
            {formatCurrency(product.price, product.currency, locale)}
          </p>
          <p className="text-sm text-[var(--color-muted)]">
            {localizeSize(product.size, locale)}
          </p>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-muted)]">
              {quantityLabel}
            </span>
            <QuantityStepper value={quantity} onChange={setQuantity} />
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
            quantity={quantity}
            openDrawerOnAdd
            className="w-full"
          />
        </div>
        <div className="space-y-3 rounded-[1.75rem] bg-[rgba(176,136,74,0.08)] p-5">
          <p className="text-sm leading-7 text-[var(--color-copy)]">
            {helperLabel}
          </p>
          <LocaleLink href="/ai-guide" locale={locale}>
            <Button variant="secondary" className="w-full">
              Helper AI
            </Button>
          </LocaleLink>
        </div>
        <LocaleLink href="/shop" locale={locale}>
          <Button variant="ghost" className="w-full">
            {collectionLabel}
          </Button>
        </LocaleLink>
      </div>
    </aside>
  );
}
