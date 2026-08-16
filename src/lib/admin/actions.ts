"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { slugify } from "@/lib/slug";
import { hydrateProduct, readStore, writeStore } from "@/lib/data/local-store";
import { friendlyAuthError, friendlySaveError } from "@/lib/friendly-error";
import type {
  Gender,
  HeroImage,
  PriceDisplayMode,
  ProductImage,
  ProductWithRelations,
} from "@/lib/types";

function revalidateCatalogue() {
  revalidatePath("/", "layout");
  revalidatePath("/admin", "layout");
}

function str(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

async function requireSupabaseUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");
  return supabase;
}

export async function loginAction(formData: FormData) {
  if (!isSupabaseConfigured()) {
    throw new Error("The catalogue is still on this computer. Connect Supabase when you are ready to go live.");
  }
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const next = String(formData.get("next") ?? "/admin");
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    redirect(`/admin/login?error=${encodeURIComponent(friendlyAuthError(error.message))}`);
  }
  redirect(next.startsWith("/admin") ? next : "/admin");
}

export async function logoutAction() {
  if (!isSupabaseConfigured()) redirect("/");
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

function productPayload(formData: FormData) {
  const id = str(formData, "id") || crypto.randomUUID();
  const name = str(formData, "name");
  const now = new Date().toISOString();
  const imageUrls = formData.getAll("image_url").map(String).filter(Boolean);
  const imageAlts = formData.getAll("image_alt").map(String);
  const images: ProductImage[] = imageUrls.map((url, index) => ({
    id: crypto.randomUUID(),
    product_id: id,
    url,
    alt: imageAlts[index] || name,
    sort_order: index + 1,
  }));

  const product: ProductWithRelations = {
    id,
    name,
    slug: str(formData, "slug") || slugify(name),
    description: str(formData, "description"),
    additional_info: str(formData, "additional_info") || null,
    price: str(formData, "price") ? Number(str(formData, "price")) : null,
    price_display_mode: (str(formData, "price_display_mode") || "fixed") as PriceDisplayMode,
    category_id: str(formData, "category_id") || null,
    collection_id: str(formData, "collection_id") || null,
    gender: str(formData, "gender") as Gender,
    featured: formData.get("featured") === "on",
    published: formData.get("published") === "on",
    sort_order: Number(str(formData, "sort_order") || 0),
    whatsapp_message: str(formData, "whatsapp_message") || null,
    created_at: str(formData, "created_at") || now,
    updated_at: now,
    category: null,
    collection: null,
    images,
  };

  return product;
}

export async function saveProductAction(formData: FormData) {
  const product = productPayload(formData);
  if (!isSupabaseConfigured()) {
    const store = await readStore();
    const existing = store.products.find((item) => item.id === product.id);
    if (existing) product.created_at = existing.created_at;
    const hydrated = hydrateProduct(product, store);
    store.products = [...store.products.filter((item) => item.id !== product.id), hydrated];
    await writeStore(store);
    revalidateCatalogue();
    redirect("/admin/products");
  }

  const supabase = await requireSupabaseUser();
  const { images, category, collection, ...row } = product;
  void category;
  void collection;
  const { error } = await supabase.from("products").upsert(row);
  if (error) throw new Error(friendlySaveError(error.message));
  await supabase.from("product_images").delete().eq("product_id", product.id);
  if (images.length > 0) {
    const { error: imageError } = await supabase.from("product_images").insert(
      images.map((image) => ({
        product_id: product.id,
        url: image.url,
        alt: image.alt,
        sort_order: image.sort_order,
      })),
    );
    if (imageError) throw new Error(friendlySaveError(imageError.message));
  }
  revalidateCatalogue();
  redirect("/admin/products");
}

export async function deleteProductAction(formData: FormData) {
  const id = str(formData, "id");
  if (!isSupabaseConfigured()) {
    const store = await readStore();
    store.products = store.products.filter((item) => item.id !== id);
    await writeStore(store);
    revalidateCatalogue();
    redirect("/admin/products");
  }
  const supabase = await requireSupabaseUser();
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) throw new Error(friendlySaveError(error.message));
  revalidateCatalogue();
  redirect("/admin/products");
}

export async function toggleProductFlag(formData: FormData) {
  const id = str(formData, "id");
  const field = str(formData, "field");
  const value = str(formData, "value") === "true";
  if (field !== "published" && field !== "featured") {
    throw new Error("That change could not be applied. Please refresh and try again.");
  }
  if (!isSupabaseConfigured()) {
    const store = await readStore();
    store.products = store.products.map((item) =>
      item.id === id ? { ...item, [field]: value } : item,
    );
    await writeStore(store);
    revalidateCatalogue();
    return;
  }
  const supabase = await requireSupabaseUser();
  const { error } = await supabase.from("products").update({ [field]: value }).eq("id", id);
  if (error) throw new Error(friendlySaveError(error.message));
  revalidateCatalogue();
}

export async function saveCollectionAction(formData: FormData) {
  const id = str(formData, "id") || crypto.randomUUID();
  const name = str(formData, "name");
  const now = new Date().toISOString();
  const collection = {
    id,
    name,
    slug: str(formData, "slug") || slugify(name),
    description: str(formData, "description") || null,
    image_url: str(formData, "image_url") || null,
    gender: (str(formData, "gender") || null) as Gender | null,
    published: formData.get("published") === "on",
    sort_order: Number(str(formData, "sort_order") || 0),
    created_at: now,
    updated_at: now,
  };

  if (!isSupabaseConfigured()) {
    const store = await readStore();
    const existing = store.collections.find((item) => item.id === id);
    if (existing) collection.created_at = existing.created_at;
    store.collections = [...store.collections.filter((item) => item.id !== id), collection];
    store.products = store.products.map((product) => hydrateProduct(product, store));
    await writeStore(store);
    revalidateCatalogue();
    redirect("/admin/collections");
  }

  const supabase = await requireSupabaseUser();
  const { error } = await supabase.from("collections").upsert(collection);
  if (error) throw new Error(friendlySaveError(error.message));
  revalidateCatalogue();
  redirect("/admin/collections");
}

export async function deleteCollectionAction(formData: FormData) {
  const id = str(formData, "id");
  if (!isSupabaseConfigured()) {
    const store = await readStore();
    const collection = store.collections.find((item) => item.id === id);
    if (collection && (collection.slug === "men" || collection.slug === "women")) {
      throw new Error(friendlySaveError("Men and Women collections cannot be deleted."));
    }
    store.collections = store.collections.filter((item) => item.id !== id);
    await writeStore(store);
    revalidateCatalogue();
    redirect("/admin/collections");
  }
  const supabase = await requireSupabaseUser();
  const { data } = await supabase.from("collections").select("slug").eq("id", id).maybeSingle();
  if (data?.slug === "men" || data?.slug === "women") {
    throw new Error(friendlySaveError("Men and Women collections cannot be deleted."));
  }
  const { error } = await supabase.from("collections").delete().eq("id", id);
  if (error) throw new Error(friendlySaveError(error.message));
  revalidateCatalogue();
  redirect("/admin/collections");
}

export async function saveCategoryAction(formData: FormData) {
  const id = str(formData, "id") || crypto.randomUUID();
  const name = str(formData, "name");
  const now = new Date().toISOString();
  const category = {
    id,
    name,
    slug: str(formData, "slug") || slugify(name),
    gender: str(formData, "gender") as "men" | "women",
    sort_order: Number(str(formData, "sort_order") || 0),
    created_at: now,
    updated_at: now,
  };
  if (!isSupabaseConfigured()) {
    const store = await readStore();
    const existing = store.categories.find((item) => item.id === id);
    if (existing) category.created_at = existing.created_at;
    store.categories = [...store.categories.filter((item) => item.id !== id), category];
    store.products = store.products.map((product) => hydrateProduct(product, store));
    await writeStore(store);
    revalidateCatalogue();
    redirect("/admin/categories");
  }
  const supabase = await requireSupabaseUser();
  const { error } = await supabase.from("categories").upsert(category);
  if (error) throw new Error(friendlySaveError(error.message));
  revalidateCatalogue();
  redirect("/admin/categories");
}

export async function deleteCategoryAction(formData: FormData) {
  const id = str(formData, "id");
  if (!isSupabaseConfigured()) {
    const store = await readStore();
    store.categories = store.categories.filter((item) => item.id !== id);
    store.products = store.products.map((product) => hydrateProduct(product, store));
    await writeStore(store);
    revalidateCatalogue();
    redirect("/admin/categories");
  }
  const supabase = await requireSupabaseUser();
  const { error } = await supabase.from("categories").delete().eq("id", id);
  if (error) throw new Error(friendlySaveError(error.message));
  revalidateCatalogue();
  redirect("/admin/categories");
}

export async function saveTestimonialAction(formData: FormData) {
  const id = str(formData, "id") || crypto.randomUUID();
  const now = new Date().toISOString();
  const testimonial = {
    id,
    customer_name: str(formData, "customer_name"),
    quote: str(formData, "quote"),
    image_url: str(formData, "image_url") || null,
    role: str(formData, "role") || null,
    location: str(formData, "location") || null,
    published: formData.get("published") === "on",
    sort_order: Number(str(formData, "sort_order") || 0),
    created_at: now,
  };
  if (!isSupabaseConfigured()) {
    const store = await readStore();
    const existing = store.testimonials.find((item) => item.id === id);
    if (existing) testimonial.created_at = existing.created_at;
    store.testimonials = [...store.testimonials.filter((item) => item.id !== id), testimonial];
    await writeStore(store);
    revalidateCatalogue();
    redirect("/admin/testimonials");
  }
  const supabase = await requireSupabaseUser();
  const { error } = await supabase.from("testimonials").upsert(testimonial);
  if (error) throw new Error(friendlySaveError(error.message));
  revalidateCatalogue();
  redirect("/admin/testimonials");
}

export async function deleteTestimonialAction(formData: FormData) {
  const id = str(formData, "id");
  if (!isSupabaseConfigured()) {
    const store = await readStore();
    store.testimonials = store.testimonials.filter((item) => item.id !== id);
    await writeStore(store);
    revalidateCatalogue();
    redirect("/admin/testimonials");
  }
  const supabase = await requireSupabaseUser();
  const { error } = await supabase.from("testimonials").delete().eq("id", id);
  if (error) throw new Error(friendlySaveError(error.message));
  revalidateCatalogue();
  redirect("/admin/testimonials");
}

export async function saveSettingsAction(formData: FormData) {
  const settings = {
    id: str(formData, "id") || "00000000-0000-4000-8000-000000000001",
    phone: str(formData, "phone"),
    whatsapp_number: str(formData, "whatsapp_number"),
    email: str(formData, "email"),
    instagram_fashion: str(formData, "instagram_fashion"),
    instagram_woman: str(formData, "instagram_woman"),
    address: str(formData, "address"),
    hero_headline: str(formData, "hero_headline"),
    hero_subheadline: str(formData, "hero_subheadline"),
    about_short: str(formData, "about_short"),
    about_long: str(formData, "about_long"),
    footer_tagline: str(formData, "footer_tagline"),
    updated_at: new Date().toISOString(),
  };
  if (!isSupabaseConfigured()) {
    const store = await readStore();
    store.settings = settings;
    await writeStore(store);
    revalidateCatalogue();
    redirect("/admin/settings");
  }
  const supabase = await requireSupabaseUser();
  const { error } = await supabase.from("site_settings").upsert(settings);
  if (error) throw new Error(friendlySaveError(error.message));
  revalidateCatalogue();
  redirect("/admin/settings");
}

export async function saveHeroImagesAction(formData: FormData) {
  const payload = str(formData, "payload");
  const items = JSON.parse(payload) as HeroImage[];
  if (!isSupabaseConfigured()) {
    const store = await readStore();
    store.heroImages = items;
    await writeStore(store);
    revalidateCatalogue();
    redirect("/admin/homepage");
  }
  const supabase = await requireSupabaseUser();
  await supabase.from("hero_images").delete().gte("sort_order", 0);
  if (items.length > 0) {
    const { error } = await supabase.from("hero_images").insert(items);
    if (error) throw new Error(friendlySaveError(error.message));
  }
  revalidateCatalogue();
  redirect("/admin/homepage");
}
