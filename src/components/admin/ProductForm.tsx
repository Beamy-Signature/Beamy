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
  const [more, setMore] = useState(false);

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
        value={product?.images.map((image) => ({ url: image.url, alt: image.alt ?? "" }))}
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
        <select name="gender" defaultValue={product?.gender ?? "men"} className={inputClass}>
          <option value="men">Men</option>
          <option value="women">Women</option>
          <option value="unisex">Unisex</option>
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
      <button
        type="button"
        className="text-sm underline"
        onClick={() => setMore((value) => !value)}
      >
        {more ? "Hide extra options" : "More options"}
      </button>
      {more ? (
        <div className="space-y-5 border border-line bg-paper p-5">
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
          <Field label="Collection">
            <select name="collection_id" defaultValue={product?.collection_id ?? ""} className={inputClass}>
              <option value="">None</option>
              {collections.map((collection) => (
                <option key={collection.id} value={collection.id}>
                  {collection.name}
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
      ) : (
        <>
          <input type="hidden" name="category_id" value={product?.category_id ?? ""} />
          <input type="hidden" name="collection_id" value={product?.collection_id ?? ""} />
          <input type="hidden" name="additional_info" value={product?.additional_info ?? ""} />
          <input type="hidden" name="slug" value={product?.slug ?? ""} />
          <input type="hidden" name="sort_order" value={product?.sort_order ?? 0} />
          <input type="hidden" name="whatsapp_message" value={product?.whatsapp_message ?? ""} />
        </>
      )}
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
