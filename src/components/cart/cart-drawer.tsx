"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingBag, X } from "lucide-react";
import { useState } from "react";

import { useCart } from "@/components/providers/cart-provider";
import { Button, buttonStyles } from "@/components/ui/button";
import { QuantityStepper } from "@/components/ui/quantity-stepper";
import { withLocale } from "@/i18n/config";
import type { Locale } from "@/lib/types";
import { formatCurrency, localizeSize } from "@/lib/utils";

interface CartDrawerProps {
  locale: Locale;
  copy: {
    title: string;
    subtotal: string;
    emptyTitle: string;
    emptyBody: string;
    continueShopping: string;
    checkout: string;
    viewCart: string;
    remove: string;
    clearCart: string;
    confirmClearCart: string;
    cancel: string;
    quantity: string;
    close: string;
  };
}

export function CartDrawer({ locale, copy }: CartDrawerProps) {
  const [confirmingClear, setConfirmingClear] = useState(false);
  const {
    items,
    subtotal,
    isDrawerOpen,
    closeDrawer,
    updateQuantity,
    removeItem,
    clearCart,
  } = useCart();

  return (
    <>
      <div
        className={`fixed inset-0 z-[90] bg-[rgba(24,21,17,0.42)] backdrop-blur-sm transition ${isDrawerOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"}`}
        onClick={closeDrawer}
      />
      <aside
        aria-label={copy.title}
        className={`fixed right-0 top-0 z-[100] flex h-full w-full max-w-xl flex-col border-l border-[rgba(111,89,64,0.14)] bg-[var(--color-paper)] shadow-[0_24px_80px_rgba(24,21,17,0.18)] transition duration-300 ${isDrawerOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex items-center justify-between border-b border-[var(--color-line)] px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[rgba(176,136,74,0.14)] text-[var(--color-accent)]">
              <ShoppingBag className="h-5 w-5" />
            </div>
            <div>
              <p className="font-display text-2xl text-[var(--color-ink)]">
                {copy.title}
              </p>
              <p className="text-sm text-[var(--color-muted)]">
                {copy.subtotal}: {formatCurrency(subtotal, "USD", locale)}
              </p>
            </div>
          </div>
          <button
            type="button"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-[var(--color-line)] bg-white/80 transition hover:border-[var(--color-accent)]"
            onClick={closeDrawer}
            aria-label={copy.close}
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-5 px-8 text-center">
            <div className="flex h-18 w-18 items-center justify-center rounded-full bg-[rgba(176,136,74,0.14)] text-[var(--color-accent)]">
              <ShoppingBag className="h-7 w-7" />
            </div>
            <div className="space-y-3">
              <h3 className="font-display text-3xl text-[var(--color-ink)]">
                {copy.emptyTitle}
              </h3>
              <p className="mx-auto max-w-sm text-sm leading-7 text-[var(--color-muted)]">
                {copy.emptyBody}
              </p>
            </div>
            <Button variant="secondary" onClick={closeDrawer}>
              {copy.continueShopping}
            </Button>
          </div>
        ) : (
          <>
            <div className="flex-1 space-y-4 overflow-y-auto px-6 py-6">
              {items.map((item) => (
                <article
                  key={item.slug}
                  className="rounded-[2rem] border border-[var(--color-line)] bg-white/80 p-4 shadow-[0_10px_30px_rgba(24,21,17,0.04)]"
                >
                  <div className="flex gap-4">
                    <div className="relative h-28 w-24 shrink-0 overflow-hidden rounded-[1.5rem] bg-[var(--color-surface)]">
                      <Image
                        src={item.image}
                        alt={item.name[locale]}
                        fill
                        className="object-cover"
                        sizes="96px"
                      />
                    </div>
                    <div className="flex min-w-0 flex-1 flex-col justify-between gap-3">
                      <div>
                        <h3 className="font-medium text-[var(--color-ink)]">
                          {item.name[locale]}
                        </h3>
                        <p className="mt-1 text-sm text-[var(--color-muted)]">
                          {item.tagline[locale]}
                        </p>
                        <p className="mt-2 text-xs uppercase tracking-[0.14em] text-[var(--color-muted)]">
                          {localizeSize(item.size, locale)}
                        </p>
                      </div>
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="space-y-2">
                          <p className="text-sm font-semibold text-[var(--color-ink)]">
                            {formatCurrency(item.price * item.quantity, item.currency, locale)}
                          </p>
                          <button
                            type="button"
                            className="text-xs font-medium uppercase tracking-[0.16em] text-[var(--color-muted)] transition hover:text-[var(--color-ink)]"
                            onClick={() => removeItem(item.slug)}
                          >
                            {copy.remove}
                          </button>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-xs uppercase tracking-[0.16em] text-[var(--color-muted)]">
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
            <div className="space-y-4 border-t border-[var(--color-line)] px-6 py-6">
              <div className="flex items-center justify-between text-sm text-[var(--color-muted)]">
                <span>{copy.subtotal}</span>
                <span className="font-semibold text-[var(--color-ink)]">
                  {formatCurrency(subtotal, "USD", locale)}
                </span>
              </div>
              {confirmingClear ? (
                <div className="rounded-[1.5rem] border border-[rgba(155,58,45,0.14)] bg-[rgba(155,58,45,0.05)] p-3">
                  <div className="grid gap-3 sm:grid-cols-2">
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
              <div className="grid gap-3 sm:grid-cols-2">
                <Link
                  href={withLocale("/checkout", locale)}
                  onClick={closeDrawer}
                  className={buttonStyles({ className: "w-full" })}
                >
                  {copy.checkout}
                </Link>
                <Link
                  href={withLocale("/cart", locale)}
                  onClick={closeDrawer}
                  className={buttonStyles({
                    variant: "secondary",
                    className: "w-full",
                  })}
                >
                  {copy.viewCart}
                </Link>
              </div>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
