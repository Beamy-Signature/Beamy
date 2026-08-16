import type { MetadataRoute } from "next";
import { getCollections, getProducts } from "@/lib/data/queries";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = "https://beamy.fashion";
  const [products, collections] = await Promise.all([
    getProducts(),
    getCollections(),
  ]);

  const staticRoutes = ["", "/collections", "/collections/men", "/collections/women", "/about", "/contact", "/how-it-works"].map(
    (path) => ({
      url: `${base}${path}`,
      lastModified: new Date(),
    }),
  );

  return [
    ...staticRoutes,
    ...collections
      .filter((collection) => collection.slug !== "men" && collection.slug !== "women")
      .map((collection) => ({
      url: `${base}/collections/${collection.slug}`,
      lastModified: new Date(),
    })),
    ...products.map((product) => ({
      url: `${base}/product/${product.slug}`,
      lastModified: new Date(product.updated_at),
    })),
  ];
}
