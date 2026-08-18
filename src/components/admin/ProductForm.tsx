"use client";

import { useState } from "react";
import { AdminField } from "@/components/admin/AdminField";
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
      <AdminField
        label="Design name"
        description="The name shoppers will see on the website and in WhatsApp messages."
        as="label"
      >
        <input name="name" required defaultValue={product?.name} className={inputClass} />
      </AdminField>
      <PhotoUploader
        folder="designs"
        multiple
        label="Photos"
        description="Add as many photographs as you like. Any image from your phone or computer, up to 10MB each."
        value={product?.images.map((image) => ({
          id: image.id,
          url: image.url,
          alt: image.alt ?? "",
        }))}
      />
      <AdminField
        label="Description"
        description="A short story of the piece — fabric, occasion, or how it is made."
        as="label"
      >
        <textarea name="description" rows={5} required defaultValue={product?.description} className={inputClass} />
      </AdminField>
      <div className="grid gap-4 sm:grid-cols-2">
        <AdminField
          label="Price (Naira)"
          description="Leave blank if the price is on request."
          as="label"
        >
          <input name="price" type="number" min="0" defaultValue={product?.price ?? ""} className={inputClass} />
        </AdminField>
        <AdminField
          label="How the price appears"
          description="Choose a fixed amount, a starting price, or ‘price on request’."
          as="label"
        >
          <select name="price_display_mode" defaultValue={product?.price_display_mode ?? "fixed"} className={inputClass}>
            <option value="fixed">Fixed price</option>
            <option value="from">Starting from</option>
            <option value="on_request">Price on request</option>
          </select>
        </AdminField>
      </div>
      <AdminField
        label="For"
        description="Whether this piece is for men, women, or both."
        as="label"
      >
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
      </AdminField>
      <AdminField
        label="Collection"
        description="Where this piece lives on the website. Men and Women are always available."
        as="label"
      >
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
      </AdminField>
      <div className="space-y-4">
        <AdminField
          label="Show on the website"
          description="Tick this to make the design live. Untick to keep it as a private draft."
        >
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="published" defaultChecked={product?.published ?? true} />
            Published
          </label>
        </AdminField>
        <AdminField
          label="Show on the homepage"
          description="Featured designs appear in the highlighted row on the homepage."
        >
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="featured" defaultChecked={product?.featured ?? false} />
            Feature this design
          </label>
        </AdminField>
      </div>
      <details className="text-sm">
        <summary className="cursor-pointer underline">More options</summary>
        <div className="mt-5 space-y-5 border border-line bg-paper p-5">
          <AdminField
            label="Category"
            description="Optional grouping inside Men or Women, such as Agbada or Corporate Suits."
            as="label"
          >
            <select name="category_id" defaultValue={product?.category_id ?? ""} className={inputClass}>
              <option value="">None</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.gender === "men" ? "Men" : "Women"} — {category.name}
                </option>
              ))}
            </select>
          </AdminField>
          <AdminField
            label="Additional information"
            description="Care notes, lead time, or anything else shoppers should know."
            as="label"
          >
            <textarea name="additional_info" rows={3} defaultValue={product?.additional_info ?? ""} className={inputClass} />
          </AdminField>
          <AdminField
            label="Web address"
            description="Leave blank and we will create one from the design name."
            as="label"
          >
            <input name="slug" defaultValue={product?.slug} className={inputClass} />
          </AdminField>
          <AdminField
            label="Display order"
            description="Lower numbers appear first in the collection."
            as="label"
          >
            <input name="sort_order" type="number" defaultValue={product?.sort_order ?? 0} className={inputClass} />
          </AdminField>
          <AdminField
            label="Custom WhatsApp message"
            description="Leave blank to use the standard order message."
            as="label"
          >
            <textarea
              name="whatsapp_message"
              rows={3}
              defaultValue={product?.whatsapp_message ?? ""}
              placeholder="Leave blank to use the standard order message."
              className={inputClass}
            />
          </AdminField>
        </div>
      </details>
      <button type="submit" className="admin-primary">
        Save design
      </button>
    </form>
  );
}

const inputClass =
  "w-full border border-line bg-paper px-3 py-2.5 text-sm outline-none focus:border-ink";
