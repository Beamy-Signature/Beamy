"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { slugify } from "@/lib/slug";
import { hydrateProduct, readStore, writeStore } from "@/lib/data/local-store";
import { LOCKED_COLLECTION_SLUGS } from "@/lib/data/gender";
import { requireSupabaseUser } from "@/lib/admin/guard";
import { upsertAndPrune, withoutCreatedAt } from "@/lib/admin/sync-rows";
import { friendlyAuthError, friendlySaveError } from "@/lib/friendly-error";
import { getRequestOrigin } from "@/lib/request-origin";
import type { AdminNoticeKey } from "@/lib/admin/notices";
import type {
  GalleryImage,
  Gender,
  HeroImage,
  PriceDisplayMode,
  ProductImage,
  ProductWithRelations,
} from "@/lib/types";

function revalidateCatalogue() {
  revalidatePath("/", "layout");
  revalidatePath("/admin", "layout");
  revalidatePath("/collections");
  revalidatePath("/collections/men");
  revalidatePath("/collections/women");
  revalidatePath("/product", "layout");
}

function done(path: string, notice: AdminNoticeKey): never {
  revalidateCatalogue();
  redirect(`${path}?notice=${notice}`);
}

async function defaultCollectionId(gender: string, supabase?: Awaited<ReturnType<typeof requireSupabaseUser>>) {
  const slug = gender === "women" ? "women" : "men";
  if (!isSupabaseConfigured()) {
    const store = await readStore();
    return store.collections.find((item) => item.slug === slug)?.id ?? null;
  }
  const client = supabase ?? (await requireSupabaseUser());
  const { data } = await client.from("collections").select("id").eq("slug", slug).maybeSingle();
  return data?.id ?? null;
}

function str(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

async function lockCollectionSlug(id: string, requestedSlug: string) {
  if (!isSupabaseConfigured()) {
    const store = await readStore();
    return applyLockedSlug(
      store.collections.find((item) => item.id === id)?.slug,
      requestedSlug,
      store.collections.some((item) => item.slug === requestedSlug && item.id !== id),
    );
  }
  const supabase = await requireSupabaseUser();
  const { data: existing } = await supabase.from("collections").select("slug").eq("id", id).maybeSingle();
  const { data: taken } = await supabase
    .from("collections")
    .select("id")
    .eq("slug", requestedSlug)
    .neq("id", id)
    .maybeSingle();
  return applyLockedSlug(existing?.slug, requestedSlug, Boolean(taken));
}

function applyLockedSlug(existingSlug: string | undefined, requestedSlug: string, taken: boolean) {
  if (existingSlug && LOCKED_COLLECTION_SLUGS.has(existingSlug)) {
    return existingSlug;
  }
  if (LOCKED_COLLECTION_SLUGS.has(requestedSlug) && existingSlug !== requestedSlug) {
    throw new Error(friendlySaveError("Men and Women web addresses cannot be used for another collection."));
  }
  if (taken && LOCKED_COLLECTION_SLUGS.has(requestedSlug)) {
    throw new Error(friendlySaveError("Men and Women web addresses cannot be used for another collection."));
  }
  return requestedSlug;
}

export async function loginAction(formData: FormData) {
  if (!isSupabaseConfigured()) {
    throw new Error("The catalogue is still on this computer. Connect Supabase when you are ready to go live.");
  }
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const next = String(formData.get("next") ?? "/admin");
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    redirect(`/admin/login?error=${encodeURIComponent(friendlyAuthError(error.message))}`);
  }
  redirect(next.startsWith("/admin") ? next : "/admin");
}

export async function signupAction(formData: FormData) {
  if (!isSupabaseConfigured()) {
    throw new Error("The catalogue is still on this computer. Connect Supabase when you are ready to go live.");
  }
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const confirm = String(formData.get("confirm") ?? "");
  if (password.length < 8) {
    redirect(`/admin/signup?error=${encodeURIComponent(friendlyAuthError("Please choose a password of at least 8 characters."))}`);
  }
  if (password !== confirm) {
    redirect(`/admin/signup?error=${encodeURIComponent(friendlyAuthError("Those passwords do not match."))}`);
  }
  const origin = await getRequestOrigin();
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/admin/auth/callback?next=/admin`,
    },
  });
  if (error) {
    redirect(`/admin/signup?error=${encodeURIComponent(friendlyAuthError(error.message))}`);
  }
  if (data.session) redirect("/admin");
  redirect("/admin/login?notice=check-email");
}

export async function forgotPasswordAction(formData: FormData) {
  if (!isSupabaseConfigured()) {
    throw new Error("The catalogue is still on this computer. Connect Supabase when you are ready to go live.");
  }
  const email = String(formData.get("email") ?? "").trim();
  const origin = await getRequestOrigin();
  const supabase = await createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/admin/auth/callback?next=/admin/reset-password`,
  });
  if (error) {
    const text = error.message.toLowerCase();
    if (text.includes("rate") || text.includes("too many")) {
      redirect(`/admin/forgot-password?error=${encodeURIComponent(friendlyAuthError(error.message))}`);
    }
  }
  redirect("/admin/login?notice=reset-sent");
}

export async function logoutAction() {
  if (!isSupabaseConfigured()) redirect("/admin");
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
  const imageIds = formData.getAll("image_id").map(String);
  const images: ProductImage[] = imageUrls.map((url, index) => ({
    id: imageIds[index] || crypto.randomUUID(),
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
  if (!product.collection_id) {
    product.collection_id = await defaultCollectionId(product.gender);
  }
  if (!isSupabaseConfigured()) {
    const store = await readStore();
    const existing = store.products.find((item) => item.id === product.id);
    if (existing) product.created_at = existing.created_at;
    const hydrated = hydrateProduct(product, store);
    store.products = [...store.products.filter((item) => item.id !== product.id), hydrated];
    await writeStore(store);
    done("/admin/products", "saved");
  }

  const supabase = await requireSupabaseUser();
  if (!product.collection_id) {
    product.collection_id = await defaultCollectionId(product.gender, supabase);
  }
  const { images, category, collection, ...row } = product;
  void category;
  void collection;
  const { error } = await supabase.from("products").upsert(withoutCreatedAt(row));
  if (error) throw new Error(friendlySaveError(error.message));
  await upsertAndPrune(
    supabase,
    "product_images",
    images.map((image) => ({
      id: image.id,
      product_id: product.id,
      url: image.url,
      alt: image.alt,
      sort_order: image.sort_order,
    })),
    { scopeColumn: "product_id", scopeValue: product.id },
  );
  done("/admin/products", "saved");
}

export async function deleteProductAction(formData: FormData) {
  const id = str(formData, "id");
  if (!isSupabaseConfigured()) {
    const store = await readStore();
    store.products = store.products.filter((item) => item.id !== id);
    await writeStore(store);
    done("/admin/products", "removed");
  }
  const supabase = await requireSupabaseUser();
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) throw new Error(friendlySaveError(error.message));
  done("/admin/products", "removed");
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
    done(
      "/admin/products",
      field === "published" ? (value ? "published" : "unpublished") : value ? "featured" : "unfeatured",
    );
  }
  const supabase = await requireSupabaseUser();
  const { error } = await supabase.from("products").update({ [field]: value }).eq("id", id);
  if (error) throw new Error(friendlySaveError(error.message));
  done(
    "/admin/products",
    field === "published" ? (value ? "published" : "unpublished") : value ? "featured" : "unfeatured",
  );
}

export async function saveCollectionAction(formData: FormData) {
  const id = str(formData, "id") || crypto.randomUUID();
  const name = str(formData, "name");
  const now = new Date().toISOString();
  const requestedSlug = str(formData, "slug") || slugify(name);
  const slug = await lockCollectionSlug(id, requestedSlug);
  const collection = {
    id,
    name,
    slug,
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
    done("/admin/collections", "saved");
  }

  const supabase = await requireSupabaseUser();
  const { error } = await supabase.from("collections").upsert(withoutCreatedAt(collection));
  if (error) throw new Error(friendlySaveError(error.message));
  done("/admin/collections", "saved");
}

export async function deleteCollectionAction(formData: FormData) {
  const id = str(formData, "id");
  if (!isSupabaseConfigured()) {
    const store = await readStore();
    const collection = store.collections.find((item) => item.id === id);
    if (collection && LOCKED_COLLECTION_SLUGS.has(collection.slug)) {
      throw new Error(friendlySaveError("Men and Women collections cannot be deleted."));
    }
    store.collections = store.collections.filter((item) => item.id !== id);
    await writeStore(store);
    done("/admin/collections", "removed");
  }
  const supabase = await requireSupabaseUser();
  const { data } = await supabase.from("collections").select("slug").eq("id", id).maybeSingle();
  if (data?.slug && LOCKED_COLLECTION_SLUGS.has(data.slug)) {
    throw new Error(friendlySaveError("Men and Women collections cannot be deleted."));
  }
  const { error } = await supabase.from("collections").delete().eq("id", id);
  if (error) throw new Error(friendlySaveError(error.message));
  done("/admin/collections", "removed");
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
    done("/admin/categories", "saved");
  }
  const supabase = await requireSupabaseUser();
  const { error } = await supabase.from("categories").upsert(withoutCreatedAt(category));
  if (error) throw new Error(friendlySaveError(error.message));
  done("/admin/categories", "saved");
}

export async function deleteCategoryAction(formData: FormData) {
  const id = str(formData, "id");
  if (!isSupabaseConfigured()) {
    const store = await readStore();
    store.categories = store.categories.filter((item) => item.id !== id);
    store.products = store.products.map((product) => hydrateProduct(product, store));
    await writeStore(store);
    done("/admin/categories", "removed");
  }
  const supabase = await requireSupabaseUser();
  const { error } = await supabase.from("categories").delete().eq("id", id);
  if (error) throw new Error(friendlySaveError(error.message));
  done("/admin/categories", "removed");
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
    done("/admin/testimonials", "saved");
  }
  const supabase = await requireSupabaseUser();
  const { error } = await supabase.from("testimonials").upsert(withoutCreatedAt(testimonial));
  if (error) throw new Error(friendlySaveError(error.message));
  done("/admin/testimonials", "saved");
}

export async function deleteTestimonialAction(formData: FormData) {
  const id = str(formData, "id");
  if (!isSupabaseConfigured()) {
    const store = await readStore();
    store.testimonials = store.testimonials.filter((item) => item.id !== id);
    await writeStore(store);
    done("/admin/testimonials", "removed");
  }
  const supabase = await requireSupabaseUser();
  const { error } = await supabase.from("testimonials").delete().eq("id", id);
  if (error) throw new Error(friendlySaveError(error.message));
  done("/admin/testimonials", "removed");
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
    done("/admin/settings", "saved");
  }
  const supabase = await requireSupabaseUser();
  const { error } = await supabase.from("site_settings").upsert(settings);
  if (error) throw new Error(friendlySaveError(error.message));
  done("/admin/settings", "saved");
}

export async function saveHeroImagesAction(formData: FormData) {
  const payload = str(formData, "payload");
  const items = JSON.parse(payload) as HeroImage[];
  if (!isSupabaseConfigured()) {
    const store = await readStore();
    store.heroImages = items;
    await writeStore(store);
    done("/admin/homepage", "saved");
  }
  const supabase = await requireSupabaseUser();
  await upsertAndPrune(
    supabase,
    "hero_images",
    items.map((item) => ({ ...item })),
  );
  done("/admin/homepage", "saved");
}

export async function saveGalleryImagesAction(formData: FormData) {
  const payload = str(formData, "payload");
  const items = JSON.parse(payload) as GalleryImage[];
  if (!isSupabaseConfigured()) {
    const store = await readStore();
    store.galleryImages = items;
    await writeStore(store);
    done("/admin/gallery", "saved");
  }
  const supabase = await requireSupabaseUser();
  await upsertAndPrune(
    supabase,
    "gallery_images",
    items.map((item) => ({ ...item })),
  );
  done("/admin/gallery", "saved");
}
