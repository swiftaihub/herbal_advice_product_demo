"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { useCart } from "@/components/providers/cart-provider";
import { buttonStyles } from "@/components/ui/button";
import { QuantityStepper } from "@/components/ui/quantity-stepper";
import { withLocale } from "@/i18n/config";
import type { Locale } from "@/lib/types";
import { formatCurrency, localizeSize } from "@/lib/utils";

export function CartPageView({
  locale,
  copy,
}: {
  locale: Locale;
  copy: {
    title: string;
    summaryTitle: string;
    subtotal: string;
    emptyTitle: string;
    emptyBody: string;
    continueShopping: string;
    checkout: string;
    remove: string;
    clearCart: string;
    confirmClearCart: string;
    cancel: string;
    quantity: string;
    checkoutNote: string;
  };
}) {
  const [confirmingClear, setConfirmingClear] = useState(false);
  const { items, subtotal, updateQuantity, removeItem, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <div className="rounded-[2.5rem] border border-dashed border-[rgba(111,89,64,0.22)] bg-white/55 px-8 py-16 text-center">
        <h2 className="font-display text-4xl text-[var(--color-ink)]">
          {copy.emptyTitle}
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-base leading-8 text-[var(--color-muted)]">
          {copy.emptyBody}
        </p>
        <Link
          href={withLocale("/shop", locale)}
          className={buttonStyles({ className: "mt-8" })}
        >
          {copy.continueShopping}
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[0.65fr_0.35fr]">
      <div className="space-y-4">
        {items.map((item) => (
          <article
            key={item.slug}
            className="rounded-[2rem] border border-[rgba(111,89,64,0.12)] bg-white/82 p-5 shadow-[0_12px_36px_rgba(24,21,17,0.05)]"
          >
            <div className="flex flex-col gap-5 md:flex-row">
              <div className="relative aspect-[4/4.2] w-full overflow-hidden rounded-[1.75rem] bg-[var(--color-surface)] md:w-48">
                <Image
                  src={item.image}
                  alt={item.name[locale]}
                  fill
                  className="object-cover"
                  sizes="192px"
                />
              </div>
              <div className="flex flex-1 flex-col justify-between gap-5">
                <div className="space-y-3">
                  <div>
                    <h3 className="font-display text-3xl text-[var(--color-ink)]">
                      {item.name[locale]}
                    </h3>
                    <p className="mt-2 text-sm leading-7 text-[var(--color-muted)]">
                      {item.tagline[locale]}
                    </p>
                  </div>
                  <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-muted)]">
                    {localizeSize(item.size, locale)}
                  </p>
                </div>
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="space-y-2">
                    <span className="text-sm font-semibold text-[var(--color-ink)]">
                      {formatCurrency(item.price * item.quantity, item.currency, locale)}
                    </span>
                    <button
                      type="button"
                      className="block text-xs font-medium uppercase tracking-[0.18em] text-[var(--color-muted)] transition hover:text-[var(--color-ink)]"
                      onClick={() => removeItem(item.slug)}
                    >
                      {copy.remove}
                    </button>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs uppercase tracking-[0.18em] text-[var(--color-muted)]">
                      {copy.quantity}
                    </span>
                    <QuantityStepper
                      value={item.quantity}
                      allowBelowMin
                      onChange={(value) => updateQuantity(item.slug, value)}
                    />
                  </div>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
      <aside className="rounded-[2.25rem] border border-[rgba(111,89,64,0.12)] bg-white/82 p-6 shadow-[0_14px_40px_rgba(24,21,17,0.06)] lg:sticky lg:top-28 lg:h-fit">
        <div className="space-y-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-accent)]">
              {copy.summaryTitle}
            </p>
            <div className="mt-5 flex items-center justify-between text-sm text-[var(--color-muted)]">
              <span>{copy.subtotal}</span>
              <span className="text-lg font-semibold text-[var(--color-ink)]">
                {formatCurrency(subtotal, "USD", locale)}
              </span>
            </div>
          </div>
          <p className="rounded-[1.75rem] bg-[rgba(176,136,74,0.08)] p-5 text-sm leading-7 text-[var(--color-copy)]">
            {copy.checkoutNote}
          </p>
          {confirmingClear ? (
            <div className="rounded-[1.75rem] border border-[rgba(155,58,45,0.14)] bg-[rgba(155,58,45,0.05)] p-3">
              <div className="grid gap-3">
                <button
                  type="button"
                  className="inline-flex h-11 items-center justify-center rounded-full bg-[var(--color-ink)] px-4 text-sm font-medium text-[var(--color-paper)] transition hover:bg-[var(--color-ink-soft)]"
                  onClick={() => {
                    clearCart();
                    setConfirmingClear(false);
                  }}
                >
                  {copy.confirmClearCart}
                </button>
                <button
                  type="button"
                  className="inline-flex h-11 items-center justify-center rounded-full border border-[var(--color-line)] bg-white/80 px-4 text-sm font-medium text-[var(--color-ink)] transition hover:border-[var(--color-accent)]"
                  onClick={() => setConfirmingClear(false)}
                >
                  {copy.cancel}
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              className="w-full text-center text-xs font-medium uppercase tracking-[0.16em] text-[var(--color-muted)] transition hover:text-[var(--color-ink)]"
              onClick={() => setConfirmingClear(true)}
            >
              {copy.clearCart}
            </button>
          )}
          <Link
            href={withLocale("/checkout", locale)}
            className={buttonStyles({ className: "w-full" })}
          >
            {copy.checkout}
          </Link>
          <Link
            href={withLocale("/shop", locale)}
            className={buttonStyles({
              variant: "secondary",
              className: "w-full",
            })}
          >
            {copy.continueShopping}
          </Link>
        </div>
      </aside>
    </div>
  );
}
