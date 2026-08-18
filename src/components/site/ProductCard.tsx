import { SafeImage } from "@/components/site/SafeImage";
import Link from "next/link";
import { AddToCartButton } from "@/components/site/AddToCartButton";
import { OrderButton } from "@/components/site/OrderButton";
import type { ProductWithRelations } from "@/lib/types";
import { formatPrice } from "@/lib/format";

export function ProductCard({ product }: { product: ProductWithRelations }) {
  const image = product.images[0];

  return (
    <article className="group min-w-0">
      <Link href={`/product/${product.slug}`} className="block">
        <div className="relative aspect-[3/4] overflow-hidden bg-line">
          {image ? (
            <SafeImage
              src={image.url}
              alt={image.alt || product.name}
              fill
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : null}
          <div className="absolute inset-0 bg-ink/0 transition-colors duration-500 group-hover:bg-ink/25" />
          <span className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-2 px-4 pb-4 text-center text-[11px] tracking-[0.2em] text-paper uppercase opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
            View piece
          </span>
        </div>
      </Link>
      <div className="pt-4">
        <p className="text-[10px] tracking-[0.16em] text-muted uppercase break-words sm:tracking-[0.2em]">
          {product.category?.name ?? product.gender}
        </p>
        <Link href={`/product/${product.slug}`}>
          <h3 className="mt-1 font-serif text-2xl leading-tight break-words transition-colors duration-300 group-hover:text-ink">
            {product.name}
          </h3>
        </Link>
        <p className="mt-2 text-sm text-muted">
          {formatPrice(product.price, product.price_display_mode)}
        </p>
        <div className="mt-4 grid gap-2">
          <AddToCartButton product={product} className="w-full" />
          <OrderButton
            productName={product.name}
            customMessage={product.whatsapp_message}
            variant="quiet"
            className="w-full"
          />
        </div>
      </div>
    </article>
  );
}
