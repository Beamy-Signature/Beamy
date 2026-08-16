import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/site/Reveal";
import { getCollections } from "@/lib/data/queries";

export const metadata: Metadata = {
  title: "Collections",
  description: "Browse BEAMY collections for men and women — bespoke and made-to-measure fashion from Lagos.",
};

export default async function CollectionsPage() {
  const collections = await getCollections();

  return (
    <section className="px-5 py-16 md:px-8 md:py-24">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <p className="text-[11px] tracking-[0.28em] text-gold uppercase">Catalogue</p>
          <h1 className="editorial-title mt-3 text-5xl md:text-7xl">Collections</h1>
          <p className="mt-5 max-w-xl text-muted">
            Contemporary pieces for work, weddings, occasions and refined everyday wear.
          </p>
        </Reveal>
        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {collections.map((collection, index) => (
            <Reveal key={collection.id} delay={index * 100}>
              <Link
                href={`/collections/${collection.slug}`}
                className="group relative block min-h-[380px] overflow-hidden bg-ink text-paper"
              >
                {collection.image_url ? (
                  <Image
                    src={collection.image_url}
                    alt={collection.name}
                    fill
                    className="object-cover opacity-70 transition-transform duration-700 ease-out group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                ) : null}
                <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-transparent" />
                <div className="absolute right-0 bottom-0 left-0 p-7">
                  <h2 className="editorial-title text-4xl">{collection.name}</h2>
                  <p className="mt-2 text-sm text-paper/70">{collection.description}</p>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
