"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

import type { CartLineItem } from "@/lib/types";

interface CartContextValue {
  items: CartLineItem[];
  count: number;
  subtotal: number;
  isDrawerOpen: boolean;
  announcement: string | null;
  addItem: (item: Omit<CartLineItem, "quantity">, quantity?: number) => void;
  updateQuantity: (slug: string, quantity: number) => void;
  removeItem: (slug: string) => void;
  clearCart: () => void;
  openDrawer: () => void;
  closeDrawer: () => void;
}

const storageKey = "herbal-atelier-cart";

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartLineItem[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [announcement, setAnnouncement] = useState<string | null>(null);
  const hasHydrated = useRef(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(storageKey);
      if (stored) {
        setItems(JSON.parse(stored) as CartLineItem[]);
      }
    } catch {
      // Ignore cart hydration issues and start fresh.
    } finally {
      hasHydrated.current = true;
    }
  }, []);

  useEffect(() => {
    if (!hasHydrated.current) {
      return;
    }

    window.localStorage.setItem(storageKey, JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    if (!announcement) {
      return;
    }

    const timeout = window.setTimeout(() => {
      setAnnouncement(null);
    }, 2600);

    return () => window.clearTimeout(timeout);
  }, [announcement]);

  function addItem(item: Omit<CartLineItem, "quantity">, quantity = 1) {
    setItems((currentItems) => {
      const existing = currentItems.find((entry) => entry.slug === item.slug);

      if (existing) {
        return currentItems.map((entry) =>
          entry.slug === item.slug
            ? { ...entry, quantity: entry.quantity + quantity }
            : entry,
        );
      }

      return [...currentItems, { ...item, quantity }];
    });

    setAnnouncement(`${item.name.en} added to cart`);
  }

  function updateQuantity(slug: string, quantity: number) {
    if (quantity <= 0) {
      removeItem(slug);
      return;
    }

    setItems((currentItems) =>
      currentItems.map((item) =>
        item.slug === slug ? { ...item, quantity } : item,
      ),
    );
  }

  function removeItem(slug: string) {
    setItems((currentItems) => currentItems.filter((item) => item.slug !== slug));
  }

  function clearCart() {
    setItems([]);
    setAnnouncement("Cart cleared");
  }

  const count = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        count,
        subtotal,
        isDrawerOpen,
        announcement,
        addItem,
        updateQuantity,
        removeItem,
        clearCart,
        openDrawer: () => setIsDrawerOpen(true),
        closeDrawer: () => setIsDrawerOpen(false),
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used inside CartProvider");
  }

  return context;
}
