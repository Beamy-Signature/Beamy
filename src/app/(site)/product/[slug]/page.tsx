import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AddToCartButton } from "@/components/site/AddToCartButton";
import { OrderButton } from "@/components/site/OrderButton";
import { ProductCard } from "@/components/site/ProductCard";
import { ProductGallery } from "@/components/site/ProductGallery";
import { Reveal } from "@/components/site/Reveal";
import {
  getProductBySlug,
  getRelatedProducts,
} from "@/lib/data/queries";
import { formatPrice } from "@/lib/format";

type Props = {
  params: Promise<{ slug: string }>;
};

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Piece" };
  return {
    title: product.name,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: product.images[0] ? [{ url: product.images[0].url }] : undefined,
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const related = await getRelatedProducts(product);

  return (
    <article className="px-5 py-12 md:px-8 md:py-20">
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-2">
        <Reveal>
          <ProductGallery images={product.images} name={product.name} />
        </Reveal>
        <Reveal delay={120} className="lg:pt-8">
          <p className="text-[11px] tracking-[0.16em] text-gold uppercase sm:tracking-[0.22em]">
            {[product.category?.name, product.collection?.name].filter(Boolean).join(" · ")}
          </p>
          <h1 className="editorial-title mt-4 text-4xl break-words md:text-6xl">{product.name}</h1>
          <p className="mt-6 text-lg">{formatPrice(product.price, product.price_display_mode)}</p>
          <p className="mt-6 max-w-lg text-sm leading-7 text-muted">{product.description}</p>
          {product.additional_info ? (
            <p className="mt-4 max-w-lg text-sm leading-7 text-muted">{product.additional_info}</p>
          ) : null}
          <div className="mt-10 flex flex-wrap gap-3">
            <AddToCartButton product={product} className="w-full min-w-0 sm:w-auto sm:min-w-[180px]" />
            <OrderButton
              productName={product.name}
              customMessage={product.whatsapp_message}
              variant="outline"
              className="w-full min-w-0 sm:w-auto sm:min-w-[180px]"
            />
          </div>
        </Reveal>
      </div>

      {related.length > 0 ? (
        <div className="mx-auto mt-24 max-w-7xl">
          <Reveal>
            <div className="flex flex-wrap items-end justify-between gap-3">
              <h2 className="editorial-title min-w-0 text-3xl md:text-5xl">You may also like</h2>
              <Link href="/collections" className="shrink-0 text-[11px] tracking-[0.18em] uppercase">
                All collections
              </Link>
            </div>
          </Reveal>
          <div className="mt-10 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((item, index) => (
              <Reveal key={item.id} delay={index * 80}>
                <ProductCard product={item} />
              </Reveal>
            ))}
          </div>
        </div>
      ) : null}
    </article>
  );
}
