"use client";

import { ShoppingBag } from "lucide-react";

import { useCart } from "@/components/providers/cart-provider";

export function CartAnnouncement() {
  const { announcement } = useCart();

  if (!announcement) {
    return null;
  }

  return (
    <div
      aria-live="polite"
      className="pointer-events-none fixed bottom-5 left-1/2 z-[80] -translate-x-1/2 rounded-full border border-[rgba(111,89,64,0.14)] bg-[rgba(34,30,22,0.92)] px-4 py-3 text-sm text-[var(--color-paper)] shadow-[0_20px_50px_rgba(24,21,17,0.28)]"
    >
      <span className="inline-flex items-center gap-2">
        <ShoppingBag className="h-4 w-4" />
        {announcement}
      </span>
    </div>
  );
}
