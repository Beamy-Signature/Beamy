"use client";

import { useMemo, useState } from "react";
import type { Category, ProductWithRelations } from "@/lib/types";
import { EmptyState } from "@/components/site/EmptyState";
import { ProductCard } from "@/components/site/ProductCard";
import { Reveal } from "@/components/site/Reveal";

export function CatalogueGrid({
  products,
  categories,
}: {
  products: ProductWithRelations[];
  categories: Category[];
}) {
  const [category, setCategory] = useState("all");
  const filtered = useMemo(() => {
    if (category === "all") return products;
    return products.filter((product) => product.category?.slug === category);
  }, [category, products]);

  return (
    <div>
      <div className="-mx-5 mb-10 flex gap-2 overflow-x-auto px-5 pb-2 md:mx-0 md:flex-wrap md:overflow-visible md:px-0">
        <FilterChip active={category === "all"} onClick={() => setCategory("all")}>
          All
        </FilterChip>
        {categories.map((item) => (
          <FilterChip
            key={item.id}
            active={category === item.slug}
            onClick={() => setCategory(item.slug)}
          >
            {item.name}
          </FilterChip>
        ))}
      </div>
      {filtered.length === 0 ? (
        <EmptyState
          title="Nothing here just yet"
          body="This corner of the collection is still being dressed. Please look through All, or come back shortly."
        />
      ) : (
        <div className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((product, index) => (
            <Reveal key={product.id} delay={Math.min(index, 8) * 70}>
              <ProductCard product={product} />
            </Reveal>
          ))}
        </div>
      )}
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`shrink-0 border px-4 py-2 text-[11px] tracking-[0.16em] uppercase transition-colors duration-300 ${
        active ? "border-ink bg-ink text-paper" : "border-line bg-transparent text-muted hover:border-ink"
      }`}
    >
      {children}
    </button>
  );
}
