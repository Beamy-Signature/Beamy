"use client";

import { SafeImage } from "@/components/site/SafeImage";
import { useState } from "react";
import type { Testimonial } from "@/lib/types";

export function Testimonials({ items }: { items: Testimonial[] }) {
  const [index, setIndex] = useState(0);
  if (items.length === 0) return null;
  const item = items[index]!;

  return (
    <section className="bg-paper px-5 py-20 md:px-8">
      <div className="mx-auto max-w-4xl text-center">
        <p className="text-[11px] tracking-[0.28em] text-gold uppercase">Client notes</p>
        <blockquote
          key={item.id}
          className="editorial-title mt-8 text-[1.75rem] break-words transition-opacity duration-500 sm:text-3xl md:text-5xl"
        >
          “{item.quote}”
        </blockquote>
        <div className="mt-8 flex min-w-0 flex-wrap items-center justify-center gap-4">
          {item.image_url ? (
            <div className="relative h-12 w-12 overflow-hidden">
              <SafeImage src={item.image_url} alt={item.customer_name} fill className="object-cover" sizes="48px" />
            </div>
          ) : null}
          <div className="min-w-0 text-left">
            <p className="text-sm break-words">{item.customer_name}</p>
            <p className="text-xs tracking-wide text-muted">
              {[item.role, item.location].filter(Boolean).join(" · ")}
            </p>
          </div>
        </div>
        {items.length > 1 ? (
          <div className="mt-10 flex justify-center gap-2">
            {items.map((entry, i) => (
              <button
                key={entry.id}
                type="button"
                aria-label={`Show testimonial from ${entry.customer_name}`}
                onClick={() => setIndex(i)}
                className={`h-1.5 w-8 ${i === index ? "bg-gold" : "bg-line"}`}
              />
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
