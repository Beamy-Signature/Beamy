import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CatalogueGrid } from "@/components/site/CatalogueGrid";
import { EmptyState } from "@/components/site/EmptyState";
import { Reveal } from "@/components/site/Reveal";
import { getCategories, getCollectionBySlug, getCollections, getProducts } from "@/lib/data/queries";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const collections = await getCollections();
  return collections
    .filter((collection) => collection.slug !== "men" && collection.slug !== "women")
    .map((collection) => ({ slug: collection.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  if (slug === "men" || slug === "women") return {};
  const collection = await getCollectionBySlug(slug);
  if (!collection) return { title: "Collection" };
  return {
    title: collection.name,
    description: collection.description ?? `Browse the ${collection.name} from BEAMY.`,
  };
}

export default async function CollectionSlugPage({ params }: Props) {
  const { slug } = await params;
  if (slug === "men" || slug === "women") {
    notFound();
  }

  const collection = await getCollectionBySlug(slug);
  if (!collection) notFound();

  const products = await getProducts({ collectionSlug: slug });
  const gender =
    collection.gender === "men" || collection.gender === "women"
      ? collection.gender
      : undefined;
  const categories = await getCategories(gender);

  return (
    <section className="px-5 py-16 md:px-8 md:py-24">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <p className="text-[11px] tracking-[0.28em] text-gold uppercase">Collection</p>
          <h1 className="editorial-title mt-3 text-5xl md:text-7xl">{collection.name}</h1>
          {collection.description ? (
            <p className="mt-5 max-w-xl text-muted">{collection.description}</p>
          ) : null}
        </Reveal>
        <div className="mt-12">
          {products.length === 0 ? (
            <EmptyState
              title="No pieces yet"
              body="This collection is being prepared."
              href="/collections"
              cta="Browse collections"
            />
          ) : (
            <CatalogueGrid products={products} categories={categories} />
          )}
        </div>
      </div>
    </section>
  );
}
