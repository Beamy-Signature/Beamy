import type { Metadata } from "next";
import { CatalogueGrid } from "@/components/site/CatalogueGrid";
import { Reveal } from "@/components/site/Reveal";
import { getCategories, getProducts } from "@/lib/data/queries";

export const metadata: Metadata = {
  title: "Women's Collection",
  description: "BEAMY women's collection — corporate suits, gowns, tweed, high-waist suits and urban pieces.",
};

export default async function WomenCollectionPage() {
  const [products, categories] = await Promise.all([
    getProducts({ gender: "women" }),
    getCategories("women"),
  ]);

  return (
    <section className="px-5 py-16 md:px-8 md:py-24">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <p className="text-[11px] tracking-[0.28em] text-gold uppercase">Women</p>
          <h1 className="editorial-title mt-3 text-5xl md:text-7xl">Women's Collection</h1>
          <p className="mt-5 max-w-xl text-muted">
            Contemporary silhouettes with a clean, executive finish.
          </p>
        </Reveal>
        <div className="mt-12">
          <CatalogueGrid products={products} categories={categories} />
        </div>
      </div>
    </section>
  );
}
