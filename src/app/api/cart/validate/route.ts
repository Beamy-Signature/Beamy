import { NextResponse } from "next/server";
import { getProducts } from "@/lib/data/queries";
import type { CartItem } from "@/lib/types";

export async function POST(request: Request) {
  let ids: string[] = [];
  try {
    const body = (await request.json()) as { ids?: unknown };
    ids = Array.isArray(body.ids) ? body.ids.map(String).filter(Boolean).slice(0, 50) : [];
  } catch {
    return NextResponse.json({ items: [] });
  }

  if (ids.length === 0) return NextResponse.json({ items: [] });

  const products = await getProducts();
  const byId = new Map(products.map((product) => [product.id, product]));
  const items: CartItem[] = ids.flatMap((id) => {
    const product = byId.get(id);
    if (!product) return [];
    return [
      {
        productId: product.id,
        slug: product.slug,
        name: product.name,
        price: product.price,
        priceDisplayMode: product.price_display_mode,
        quantity: 1,
        image: product.images[0]?.url ?? null,
      },
    ];
  });

  return NextResponse.json({ items });
}
