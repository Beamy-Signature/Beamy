"use client";

import { useState } from "react";
import { PhotoUploader } from "@/components/admin/PhotoUploader";
import type { Category, Collection, ProductWithRelations } from "@/lib/types";

export function ProductForm({
  product,
  categories,
  collections,
  action,
}: {
  product?: ProductWithRelations | null;
  categories: Category[];
  collections: Collection[];
  action: (formData: FormData) => void | Promise<void>;
}) {
  const [gender, setGender] = useState(product?.gender ?? "men");
  const fallbackCollection =
    collections.find((item) => item.slug === (gender === "women" ? "women" : "men"))?.id ?? "";

  return (
    <form action={action} className="max-w-3xl space-y-6">
      {product ? <input type="hidden" name="id" value={product.id} /> : null}
      <Field label="Design name">
        <input name="name" required defaultValue={product?.name} className={inputClass} />
      </Field>
      <PhotoUploader
        folder="designs"
        multiple
        label="Photos"
        value={product?.images.map((image) => ({
          id: image.id,
          url: image.url,
          alt: image.alt ?? "",
        }))}
      />
      <Field label="Description">
        <textarea name="description" rows={5} required defaultValue={product?.description} className={inputClass} />
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Price (Naira)">
          <input name="price" type="number" min="0" defaultValue={product?.price ?? ""} className={inputClass} />
        </Field>
        <Field label="Price display">
          <select name="price_display_mode" defaultValue={product?.price_display_mode ?? "fixed"} className={inputClass}>
            <option value="fixed">Fixed price</option>
            <option value="from">Starting from</option>
            <option value="on_request">Price on request</option>
          </select>
        </Field>
      </div>
      <Field label="For">
        <select
          name="gender"
          value={gender}
          onChange={(event) => setGender(event.target.value as "men" | "women" | "unisex")}
          className={inputClass}
        >
          <option value="men">Men</option>
          <option value="women">Women</option>
          <option value="unisex">Unisex</option>
        </select>
      </Field>
      <Field label="Collection">
        <select
          name="collection_id"
          defaultValue={product?.collection_id ?? fallbackCollection}
          key={gender}
          className={inputClass}
        >
          <option value="">Choose a collection</option>
          {collections.map((collection) => (
            <option key={collection.id} value={collection.id}>
              {collection.name}
            </option>
          ))}
        </select>
      </Field>
      <div className="flex gap-6">
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="published" defaultChecked={product?.published ?? true} />
          Published
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="featured" defaultChecked={product?.featured ?? false} />
          Show on homepage
        </label>
      </div>
      <details className="text-sm">
        <summary className="cursor-pointer underline">More options</summary>
        <div className="mt-5 space-y-5 border border-line bg-paper p-5">
          <Field label="Category">
            <select name="category_id" defaultValue={product?.category_id ?? ""} className={inputClass}>
              <option value="">None</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.gender === "men" ? "Men" : "Women"} — {category.name}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Additional information">
            <textarea name="additional_info" rows={3} defaultValue={product?.additional_info ?? ""} className={inputClass} />
          </Field>
          <Field label="Web address (leave blank to generate)">
            <input name="slug" defaultValue={product?.slug} className={inputClass} />
          </Field>
          <Field label="Display order">
            <input name="sort_order" type="number" defaultValue={product?.sort_order ?? 0} className={inputClass} />
          </Field>
          <Field label="Custom WhatsApp message">
            <textarea
              name="whatsapp_message"
              rows={3}
              defaultValue={product?.whatsapp_message ?? ""}
              placeholder="Leave blank to use the standard order message."
              className={inputClass}
            />
          </Field>
        </div>
      </details>
      <button type="submit" className="admin-primary">
        Save design
      </button>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm">{label}</span>
      {children}
    </label>
  );
}

const inputClass =
  "w-full border border-line bg-paper px-3 py-2.5 text-sm outline-none focus:border-ink";
