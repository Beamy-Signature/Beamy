import { promises as fs } from "fs";
import path from "path";
import type {
  Category,
  Collection,
  GalleryImage,
  HeroImage,
  ProductWithRelations,
  SiteSettings,
  Testimonial,
} from "@/lib/types";
import * as seed from "@/lib/data/seed";

export type CmsStore = {
  settings: SiteSettings;
  heroImages: HeroImage[];
  categories: Category[];
  collections: Collection[];
  products: ProductWithRelations[];
  testimonials: Testimonial[];
  galleryImages: GalleryImage[];
};

const storePath = path.join(process.cwd(), "data", "cms.json");

function fromSeed(): CmsStore {
  return {
    settings: seed.settings,
    heroImages: seed.heroImages.map((image, index) => ({
      id: `hero-${index + 1}`,
      url: image.url,
      alt: image.alt,
      sort_order: index + 1,
      published: true,
    })),
    categories: seed.categories,
    collections: seed.collections,
    products: seed.products,
    testimonials: seed.testimonials,
    galleryImages: seed.galleryImages,
  };
}

export async function readStore(): Promise<CmsStore> {
  try {
    const raw = await fs.readFile(storePath, "utf8");
    const parsed = JSON.parse(raw) as Partial<CmsStore>;
    const fallback = fromSeed();
    return {
      settings: parsed.settings ?? fallback.settings,
      heroImages: parsed.heroImages ?? fallback.heroImages,
      categories: parsed.categories ?? fallback.categories,
      collections: parsed.collections ?? fallback.collections,
      products: parsed.products ?? fallback.products,
      testimonials: parsed.testimonials ?? fallback.testimonials,
      galleryImages: parsed.galleryImages ?? fallback.galleryImages,
    };
  } catch {
    return fromSeed();
  }
}

export async function writeStore(store: CmsStore): Promise<void> {
  await fs.mkdir(path.dirname(storePath), { recursive: true });
  await fs.writeFile(storePath, JSON.stringify(store, null, 2), "utf8");
}

export function hydrateProduct(
  product: ProductWithRelations,
  store: CmsStore,
): ProductWithRelations {
  return {
    ...product,
    category: store.categories.find((item) => item.id === product.category_id) ?? null,
    collection: store.collections.find((item) => item.id === product.collection_id) ?? null,
    images: [...(product.images ?? [])].sort((a, b) => a.sort_order - b.sort_order),
  };
}
