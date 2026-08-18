"use client";

import Link from "next/link";
import { SafeImage } from "@/components/site/SafeImage";
import { useCart } from "@/components/site/CartProvider";
import { cartTotals } from "@/lib/checkout";
import { formatNaira, formatPrice } from "@/lib/format";

export function CartDrawer() {
  const { items, open, setOpen, updateQuantity, removeItem } = useCart();
  const { subtotal, hasOnRequest, itemCount } = cartTotals(items);

  return (
    <>
      <div
        className={`fixed inset-0 z-[60] bg-ink/40 transition-opacity duration-300 ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={() => setOpen(false)}
      />
      <aside
        className={`fixed top-0 right-0 z-[70] flex h-full w-full max-w-md flex-col bg-paper shadow-2xl transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <h2 className="font-serif text-2xl">Your bag ({itemCount})</h2>
          <button type="button" className="text-sm underline" onClick={() => setOpen(false)}>
            Close
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-6">
          {items.length === 0 ? (
            <p className="text-sm leading-6 text-muted">
              Your bag is waiting. Add a piece you love, and we will take the rest from there on WhatsApp.
            </p>
          ) : (
            <ul className="space-y-6">
              {items.map((item) => (
                <li key={item.productId} className="flex gap-4">
                  <div className="relative h-24 w-20 shrink-0 overflow-hidden bg-line">
                    {item.image ? (
                      <SafeImage src={item.image} alt={item.name} fill className="object-cover" sizes="80px" />
                    ) : null}
                  </div>
                  <div className="min-w-0 flex-1">
                    <Link href={`/product/${item.slug}`} className="font-medium" onClick={() => setOpen(false)}>
                      {item.name}
                    </Link>
                    <p className="mt-1 text-sm text-muted">
                      {formatPrice(item.price, item.priceDisplayMode)}
                    </p>
                    <div className="mt-3 flex items-center gap-3">
                      <button
                        type="button"
                        className="h-8 w-8 border border-line"
                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                      >
                        −
                      </button>
                      <span className="w-6 text-center text-sm">{item.quantity}</span>
                      <button
                        type="button"
                        className="h-8 w-8 border border-line"
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                      >
                        +
                      </button>
                      <button
                        type="button"
                        className="ml-auto text-xs text-red-800 underline"
                        onClick={() => removeItem(item.productId)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="border-t border-line px-5 py-5">
          <div className="flex justify-between text-sm">
            <span>Subtotal</span>
            <span>
              {formatNaira(subtotal)}
              {hasOnRequest ? " +" : ""}
            </span>
          </div>
          {hasOnRequest ? (
            <p className="mt-2 text-xs text-muted">Some pieces are priced on request.</p>
          ) : null}
          <Link
            href="/cart"
            onClick={() => setOpen(false)}
            className="mt-4 flex w-full items-center justify-center bg-ink px-5 py-3 text-[11px] tracking-[0.18em] text-paper uppercase"
          >
            Checkout on WhatsApp
          </Link>
        </div>
      </aside>
    </>
  );
}

export function CartButton() {
  const { items, setOpen } = useCart();
  const count = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <button
      type="button"
      onClick={() => setOpen(true)}
      className="relative flex h-11 shrink-0 items-center px-1.5 text-[10px] tracking-[0.12em] uppercase sm:px-2 sm:text-[11px] sm:tracking-[0.16em]"
      aria-label="Open bag"
    >
      Bag
      {count > 0 ? (
        <span className="ml-2 flex h-5 min-w-5 items-center justify-center bg-ink px-1 text-[10px] text-paper">
          {count}
        </span>
      ) : null}
    </button>
  );
}
