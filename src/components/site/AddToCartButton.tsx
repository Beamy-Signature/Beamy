"use client";

import { useCart } from "@/components/site/CartProvider";
import type { ProductWithRelations } from "@/lib/types";

export function AddToCartButton({
  product,
  className = "",
}: {
  product: ProductWithRelations;
  className?: string;
}) {
  const { addItem } = useCart();

  return (
    <button
      type="button"
      onClick={() => addItem(product)}
      className={`inline-flex items-center justify-center border border-ink px-5 py-3 text-[11px] tracking-[0.18em] uppercase transition-colors duration-300 hover:bg-ink hover:text-paper ${className}`}
    >
      Add to bag
    </button>
  );
}
