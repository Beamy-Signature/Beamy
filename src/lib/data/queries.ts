import type {
  Category,
  Collection,
  DashboardStats,
  GalleryImage,
  HeroImage,
  ProductImage,
  ProductWithRelations,
  SiteSettings,
  Testimonial,
} from "@/lib/types";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createPublicClient } from "@/lib/supabase/public";
import { createClient } from "@/lib/supabase/server";
import { hydrateProduct, readStore } from "@/lib/data/local-store";
import { matchesCatalogueGender } from "@/lib/data/gender";
import * as seed from "@/lib/data/seed";

type ProductRow = Omit<ProductWithRelations, "category" | "collection" | "images"> & {
  categories: Category | Category[] | null;
  collections: Collection | Collection[] | null;
  product_images: ProductImage[] | null;
};

function publishedOnly<T extends { published: boolean }>(items: T[]) {
  return items.filter((item) => item.published);
}

function one<T>(value: T | T[] | null | undefined): T | null {
  if (!value) return null;
  return Array.isArray(value) ? (value[0] ?? null) : value;
}

function mapProduct(row: ProductRow): ProductWithRelations {
  const images = [...(row.product_images ?? [])].sort(
    (a, b) => a.sort_order - b.sort_order,
  );
  const { categories, collections, product_images: _images, ...product } = row;
  void _images;
  return {
    ...product,
    category: one(categories),
    collection: one(collections),
    images,
  };
}

function publicClient() {
  return createPublicClient();
}

async function adminClient() {
  return createClient();
}

export async function getSiteSettings(): Promise<SiteSettings> {
  if (!isSupabaseConfigured()) return (await readStore()).settings;
  const client = publicClient();
  const { data, error } = await client.from("site_settings").select("*").single();
  if (error || !data) return seed.settings;
  return data as SiteSettings;
}

export async function getHeroImages(): Promise<HeroImage[]> {
  if (!isSupabaseConfigured()) {
    return (await readStore()).heroImages
      .filter((image) => image.published)
      .sort((a, b) => a.sort_order - b.sort_order);
  }
  const client = publicClient();
  const { data, error } = await client
    .from("hero_images")
    .select("*")
    .eq("published", true)
    .order("sort_order");
  if (error || !data) {
    return seed.heroImages.map((image, index) => ({
      id: `hero-${index + 1}`,
      url: image.url,
      alt: image.alt,
      sort_order: index + 1,
      published: true,
    }));
  }
  return data as HeroImage[];
}

export async function getAdminHeroImages(): Promise<HeroImage[]> {
  if (!isSupabaseConfigured()) {
    return [...(await readStore()).heroImages].sort((a, b) => a.sort_order - b.sort_order);
  }
  const client = await adminClient();
  const { data, error } = await client.from("hero_images").select("*").order("sort_order");
  if (error || !data) return [];
  return data as HeroImage[];
}

export async function getCategories(gender?: "men" | "women"): Promise<Category[]> {
  if (!isSupabaseConfigured()) {
    return (await readStore()).categories
      .filter((category) => (gender ? category.gender === gender : true))
      .sort((a, b) => a.sort_order - b.sort_order);
  }
  const client = publicClient();
  let query = client.from("categories").select("*").order("sort_order");
  if (gender) query = query.eq("gender", gender);
  const { data, error } = await query;
  if (error || !data) return [];
  return data as Category[];
}

export async function getCollections(options?: {
  publishedOnly?: boolean;
}): Promise<Collection[]> {
  const published = options?.publishedOnly ?? true;
  if (!isSupabaseConfigured()) {
    const list = published ? publishedOnly((await readStore()).collections) : (await readStore()).collections;
    return [...list].sort((a, b) => a.sort_order - b.sort_order);
  }
  const client = published ? publicClient() : await adminClient();
  let query = client.from("collections").select("*").order("sort_order");
  if (published) query = query.eq("published", true);
  const { data, error } = await query;
  if (error || !data) return [];
  return data as Collection[];
}

export async function getCollectionBySlug(
  slug: string,
): Promise<Collection | null> {
  if (!isSupabaseConfigured()) {
    const store = await readStore();
    return (
      store.collections.find(
        (collection) => collection.slug === slug && collection.published,
      ) ?? null
    );
  }
  const client = publicClient();
  const { data, error } = await client
    .from("collections")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();
  if (error || !data) return null;
  return data as Collection;
}

const productSelect =
  "*, categories(*), collections(*), product_images(*)";

export async function getProducts(options?: {
  gender?: "men" | "women";
  collectionSlug?: string;
  categorySlug?: string;
  featured?: boolean;
  publishedOnly?: boolean;
}): Promise<ProductWithRelations[]> {
  const published = options?.publishedOnly ?? true;

  if (!isSupabaseConfigured()) {
    const store = await readStore();
    return store.products
      .map((product) => hydrateProduct(product, store))
      .filter((product) => {
        if (published && !product.published) return false;
        if (options?.gender && !matchesCatalogueGender(product.gender, options.gender)) return false;
        if (options?.featured && !product.featured) return false;
        if (options?.collectionSlug && product.collection?.slug !== options.collectionSlug) {
          return false;
        }
        if (options?.categorySlug && product.category?.slug !== options.categorySlug) {
          return false;
        }
        return true;
      })
      .sort((a, b) => a.sort_order - b.sort_order);
  }

  const client = published ? publicClient() : await adminClient();
  let query = client.from("products").select(productSelect).order("sort_order");
  if (published) query = query.eq("published", true);
  if (options?.gender) {
    query = query.or(`gender.eq.${options.gender},gender.eq.unisex`);
  }
  if (options?.featured) query = query.eq("featured", true);
  const { data, error } = await query;
  if (error || !data) return [];

  return (data as ProductRow[])
    .map(mapProduct)
    .filter((product) => {
      if (options?.collectionSlug && product.collection?.slug !== options.collectionSlug) {
        return false;
      }
      if (options?.categorySlug && product.category?.slug !== options.categorySlug) {
        return false;
      }
      return true;
    });
}

export async function getProductBySlug(
  slug: string,
  options?: { includeUnpublished?: boolean },
): Promise<ProductWithRelations | null> {
  if (!isSupabaseConfigured()) {
    const store = await readStore();
    const product = store.products.find((item) => item.slug === slug);
    if (!product) return null;
    if (!options?.includeUnpublished && !product.published) return null;
    return hydrateProduct(product, store);
  }

  const client = publicClient();
  let query = client.from("products").select(productSelect).eq("slug", slug);
  if (!options?.includeUnpublished) query = query.eq("published", true);
  const { data, error } = await query.maybeSingle();
  if (error || !data) return null;
  return mapProduct(data as ProductRow);
}

export async function getProductById(
  id: string,
): Promise<ProductWithRelations | null> {
  if (!isSupabaseConfigured()) {
    const store = await readStore();
    const product = store.products.find((item) => item.id === id) ?? null;
    return product ? hydrateProduct(product, store) : null;
  }
  const client = await adminClient();
  const { data, error } = await client
    .from("products")
    .select(productSelect)
    .eq("id", id)
    .maybeSingle();
  if (error || !data) return null;
  return mapProduct(data as ProductRow);
}

export async function getRelatedProducts(
  product: ProductWithRelations,
  limit = 3,
): Promise<ProductWithRelations[]> {
  const all = await getProducts({
    gender: product.gender === "unisex" ? undefined : product.gender,
  });
  return all.filter((item) => item.id !== product.id).slice(0, limit);
}

export async function getTestimonials(): Promise<Testimonial[]> {
  if (!isSupabaseConfigured()) {
    return publishedOnly((await readStore()).testimonials).sort((a, b) => a.sort_order - b.sort_order);
  }
  const client = publicClient();
  const { data, error } = await client
    .from("testimonials")
    .select("*")
    .eq("published", true)
    .order("sort_order");
  if (error || !data) return [];
  return data as Testimonial[];
}

export async function getGalleryImages(): Promise<GalleryImage[]> {
  if (!isSupabaseConfigured()) {
    return publishedOnly((await readStore()).galleryImages).sort((a, b) => a.sort_order - b.sort_order);
  }
  const client = publicClient();
  const { data, error } = await client
    .from("gallery_images")
    .select("*")
    .eq("published", true)
    .order("sort_order");
  if (error || !data) return [];
  return data as GalleryImage[];
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const products = await getProducts({ publishedOnly: false });
  const collections = await getCollections({ publishedOnly: false });
  return {
    totalProducts: products.length,
    publishedProducts: products.filter((product) => product.published).length,
    draftProducts: products.filter((product) => !product.published).length,
    collections: collections.length,
    featuredProducts: products.filter((product) => product.featured).length,
  };
}

export async function getAdminTestimonials(): Promise<Testimonial[]> {
  if (!isSupabaseConfigured()) {
    return [...(await readStore()).testimonials].sort((a, b) => a.sort_order - b.sort_order);
  }
  const client = await adminClient();
  const { data, error } = await client
    .from("testimonials")
    .select("*")
    .order("sort_order");
  if (error || !data) return [];
  return data as Testimonial[];
}

export async function getAdminGalleryImages(): Promise<GalleryImage[]> {
  if (!isSupabaseConfigured()) {
    return [...(await readStore()).galleryImages].sort((a, b) => a.sort_order - b.sort_order);
  }
  const client = await adminClient();
  const { data, error } = await client
    .from("gallery_images")
    .select("*")
    .order("sort_order");
  if (error || !data) return [];
  return data as GalleryImage[];
}

export { seed };
