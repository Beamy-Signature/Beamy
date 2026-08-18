"use client";

import Link from "next/link";
import { SafeImage } from "@/components/site/SafeImage";
import { useMemo, useState } from "react";
import { useCart } from "@/components/site/CartProvider";
import { useSite } from "@/components/site/SiteProvider";
import { cartTotals, checkoutWhatsAppLink } from "@/lib/checkout";
import { formatNaira, formatPrice } from "@/lib/format";

export default function CartPage() {
  const { items, updateQuantity, removeItem } = useCart();
  const { whatsappNumber } = useSite();
  const { subtotal, hasOnRequest } = cartTotals(items);
  const [details, setDetails] = useState({
    name: "",
    phone: "",
    address: "",
    occasion: "",
    notes: "",
  });

  const href = useMemo(
    () => checkoutWhatsAppLink(whatsappNumber, items, details),
    [details, items, whatsappNumber],
  );

  if (items.length === 0) {
    return (
      <section className="px-5 py-24 text-center">
        <h1 className="editorial-title text-[2.5rem] md:text-5xl">Your bag is waiting.</h1>
        <p className="mx-auto mt-4 max-w-md text-muted">
          When a piece speaks to you, add it here. We will help you finish the order on WhatsApp.
        </p>
        <Link href="/collections" className="mt-8 inline-flex w-full max-w-xs justify-center border border-ink px-5 py-3 text-[11px] tracking-[0.18em] uppercase sm:w-auto">
          Browse collections
        </Link>
      </section>
    );
  }

  return (
    <section className="px-5 py-16 md:px-8 md:py-24">
      <div className="mx-auto grid max-w-7xl min-w-0 gap-16 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="min-w-0">
          <h1 className="editorial-title text-[2.5rem] md:text-5xl">Your bag</h1>
          <ul className="mt-10 space-y-8">
            {items.map((item) => (
              <li key={item.productId} className="flex min-w-0 gap-4 border-b border-line pb-8 sm:gap-5">
                <div className="relative h-28 w-20 shrink-0 overflow-hidden bg-line sm:h-32 sm:w-24">
                  {item.image ? (
                    <SafeImage src={item.image} alt={item.name} fill className="object-cover" sizes="96px" />
                  ) : null}
                </div>
                <div className="min-w-0 flex-1">
                  <Link href={`/product/${item.slug}`} className="font-serif text-xl break-words sm:text-2xl">
                    {item.name}
                  </Link>
                  <p className="mt-1 text-sm text-muted">
                    {formatPrice(item.price, item.priceDisplayMode)}
                  </p>
                  <div className="mt-4 flex flex-wrap items-center gap-3">
                    <button type="button" className="h-9 w-9 border border-line" onClick={() => updateQuantity(item.productId, item.quantity - 1)}>
                      −
                    </button>
                    <span>{item.quantity}</span>
                    <button type="button" className="h-9 w-9 border border-line" onClick={() => updateQuantity(item.productId, item.quantity + 1)}>
                      +
                    </button>
                    <button type="button" className="ml-4 text-sm text-red-800 underline" onClick={() => removeItem(item.productId)}>
                      Remove
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="min-w-0 border border-line bg-paper p-5 md:p-8">
          <h2 className="font-serif text-3xl">Checkout on WhatsApp</h2>
          <p className="mt-3 text-sm text-muted">
            Fill this in so BEAMY receives a clear, numbered order with your total.
          </p>
          <div className="mt-6 space-y-4">
            <Field
              label="Your name"
              description="So we know who the order is for."
              value={details.name}
              onChange={(value) => setDetails({ ...details, name: value })}
            />
            <Field
              label="Phone"
              description="A number we can reach you on, preferably WhatsApp."
              value={details.phone}
              onChange={(value) => setDetails({ ...details, phone: value })}
            />
            <Field
              label="Delivery address"
              description="Where the finished piece should go, if you already know."
              value={details.address}
              onChange={(value) => setDetails({ ...details, address: value })}
            />
            <Field
              label="Occasion / date needed"
              description="A wedding, sitting, or the day you need it by."
              value={details.occasion}
              onChange={(value) => setDetails({ ...details, occasion: value })}
            />
            <label className="block text-sm">
              Notes
              <span className="mt-1 block text-xs leading-5 text-muted">
                Measurements, fabric wishes, or anything else we should know.
              </span>
              <textarea
                rows={3}
                value={details.notes}
                onChange={(event) => setDetails({ ...details, notes: event.target.value })}
                className="mt-2 w-full border border-line bg-transparent px-3 py-2.5 text-sm"
              />
            </label>
          </div>
          <div className="mt-6 flex flex-wrap items-start justify-between gap-2 border-t border-line pt-4 text-sm">
            <span>Total</span>
            <span className="max-w-full text-right font-medium break-words">
              {formatNaira(subtotal)}
              {hasOnRequest ? " + items on request" : ""}
            </span>
          </div>
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 flex w-full items-center justify-center bg-ink px-5 py-3.5 text-[11px] tracking-[0.18em] text-paper uppercase"
          >
            Send order on WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}

function Field({
  label,
  description,
  value,
  onChange,
}: {
  label: string;
  description?: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block text-sm">
      {label}
      {description ? <span className="mt-1 block text-xs leading-5 text-muted">{description}</span> : null}
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 w-full border border-line bg-transparent px-3 py-2.5 text-sm"
      />
    </label>
  );
}
