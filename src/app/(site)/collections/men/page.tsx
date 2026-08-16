import type { Metadata } from "next";
import { CatalogueGrid } from "@/components/site/CatalogueGrid";
import { Reveal } from "@/components/site/Reveal";
import { getCategories, getProducts } from "@/lib/data/queries";

export const metadata: Metadata = {
  title: "Men's Collection",
  description: "BEAMY men's collection — bespoke suits, agbada, kaftans, shirts and urban jackets.",
};

export default async function MenCollectionPage() {
  const [products, categories] = await Promise.all([
    getProducts({ gender: "men" }),
    getCategories("men"),
  ]);

  return (
    <section className="px-5 py-16 md:px-8 md:py-24">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <p className="text-[11px] tracking-[0.28em] text-gold uppercase">Men</p>
          <h1 className="editorial-title mt-3 text-5xl md:text-7xl">Men's Collection</h1>
          <p className="mt-5 max-w-xl text-muted">
            Structured tailoring for work, weddings and refined everyday wear.
          </p>
        </Reveal>
        <div className="mt-12">
          <CatalogueGrid products={products} categories={categories} />
        </div>
      </div>
    </section>
  );
}
