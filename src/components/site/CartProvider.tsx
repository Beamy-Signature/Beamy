"use client";

import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import type { CartItem, ProductWithRelations } from "@/lib/types";

type CartContextValue = {
  items: CartItem[];
  addItem: (product: ProductWithRelations, quantity?: number) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void;
  clear: () => void;
  open: boolean;
  setOpen: (open: boolean) => void;
};

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "beamy-cart";

function toItem(product: ProductWithRelations, quantity: number): CartItem {
  return {
    productId: product.id,
    slug: product.slug,
    name: product.name,
    price: product.price,
    priceDisplayMode: product.price_display_mode,
    quantity,
    image: product.images[0]?.url ?? null,
  };
}

function mergeCart(primary: CartItem[], secondary: CartItem[]): CartItem[] {
  const map = new Map<string, CartItem>();
  for (const item of secondary) map.set(item.productId, { ...item });
  for (const item of primary) {
    const existing = map.get(item.productId);
    if (existing) {
      map.set(item.productId, { ...existing, quantity: existing.quantity + item.quantity });
    } else {
      map.set(item.productId, { ...item });
    }
  }
  return [...map.values()];
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [open, setOpen] = useState(false);
  const [ready, setReady] = useState(false);
  const itemsRef = useRef(items);
  itemsRef.current = items;

  useEffect(() => {
    let stored: CartItem[] = [];
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) stored = JSON.parse(raw) as CartItem[];
    } catch {
      stored = [];
    }
    setItems((current) => mergeCart(current, stored));
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, ready]);

  useEffect(() => {
    if (!ready) return;
    const ids = itemsRef.current.map((item) => item.productId);
    if (ids.length === 0) return;
    let cancelled = false;
    void (async () => {
      try {
        const response = await fetch("/api/cart/validate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ids }),
        });
        if (!response.ok || cancelled) return;
        const data = (await response.json()) as { items?: CartItem[] };
        const live = data.items ?? [];
        const liveById = new Map(live.map((item) => [item.productId, item]));
        setItems((current) =>
          current.flatMap((item) => {
            const next = liveById.get(item.productId);
            if (!next) return [];
            return [{ ...item, ...next, quantity: item.quantity }];
          }),
        );
      } catch {
        // Keep the local bag if the catalogue cannot be reached.
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [ready]);

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      addItem(product, quantity = 1) {
        setItems((current) => {
          const existing = current.find((item) => item.productId === product.id);
          if (existing) {
            return current.map((item) =>
              item.productId === product.id
                ? { ...item, quantity: item.quantity + quantity }
                : item,
            );
          }
          return [...current, toItem(product, quantity)];
        });
        setOpen(true);
      },
      updateQuantity(productId, quantity) {
        setItems((current) =>
          current
            .map((item) => (item.productId === productId ? { ...item, quantity } : item))
            .filter((item) => item.quantity > 0),
        );
      },
      removeItem(productId) {
        setItems((current) => current.filter((item) => item.productId !== productId));
      },
      clear() {
        setItems([]);
      },
      open,
      setOpen,
    }),
    [items, open],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
}
