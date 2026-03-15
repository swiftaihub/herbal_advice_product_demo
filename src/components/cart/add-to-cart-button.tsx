"use client";

import { ShoppingBag } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useCart } from "@/components/providers/cart-provider";
import type { CartLineItem, Locale } from "@/lib/types";

export function AddToCartButton({
  item,
  locale,
  label,
  quantity = 1,
  openDrawerOnAdd = false,
  className,
}: {
  item: Omit<CartLineItem, "quantity">;
  locale: Locale;
  label: string;
  quantity?: number;
  openDrawerOnAdd?: boolean;
  className?: string;
}) {
  const { addItem, openDrawer } = useCart();

  return (
    <Button
      className={className}
      icon={<ShoppingBag className="h-4 w-4" />}
      onClick={() => {
        addItem(item, quantity);
        if (openDrawerOnAdd) {
          openDrawer();
        }
      }}
      aria-label={`${label} ${item.name[locale]}`}
    >
      {label}
    </Button>
  );
}
