import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { ConfirmDelete } from "@/components/admin/ConfirmDelete";
import { PhotoUploader } from "@/components/admin/PhotoUploader";
import { deleteCollectionAction, saveCollectionAction } from "@/lib/admin/actions";
import { getCollections } from "@/lib/data/queries";

export default async function AdminCollectionsPage() {
  const collections = await getCollections({ publishedOnly: false });

  return (
    <div>
      <AdminPageHeader
        title="Collections"
        description="Create, rename or hide collections. Men and Women cannot be deleted because the website needs them."
      />
      <form action={saveCollectionAction} className="mt-8 space-y-3 border border-line bg-paper p-5">
        <h2 className="font-serif text-2xl">Create collection</h2>
        <input name="name" required placeholder="Name" className={inputClass} />
        <textarea name="description" placeholder="Short description" className={inputClass} />
        <PhotoUploader name="image_url" folder="collections" label="Collection photo" />
        <select name="gender" className={inputClass} defaultValue="">
          <option value="">Mixed / unisex</option>
          <option value="men">Men</option>
          <option value="women">Women</option>
          <option value="unisex">Unisex</option>
        </select>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="published" defaultChecked /> Published
        </label>
        <details className="text-sm">
          <summary className="cursor-pointer underline">More options</summary>
          <div className="mt-3 grid gap-3">
            <input name="slug" placeholder="Web address (optional)" className={inputClass} />
            <input name="sort_order" type="number" defaultValue={0} className={inputClass} />
          </div>
        </details>
        <button className="admin-primary">
          Save collection
        </button>
      </form>
      <div className="mt-8 space-y-6">
        {collections.map((collection) => {
          const locked = collection.slug === "men" || collection.slug === "women";
          return (
            <div key={collection.id} className="border border-line bg-paper p-5">
              <form action={saveCollectionAction} className="grid gap-3 md:grid-cols-2">
                <input type="hidden" name="id" value={collection.id} />
                <input name="name" defaultValue={collection.name} className={inputClass} />
                <select name="gender" defaultValue={collection.gender ?? ""} className={inputClass}>
                  <option value="">Mixed / unisex</option>
                  <option value="men">Men</option>
                  <option value="women">Women</option>
                  <option value="unisex">Unisex</option>
                </select>
                <textarea name="description" defaultValue={collection.description ?? ""} className={`${inputClass} md:col-span-2`} />
                <div className="md:col-span-2">
                  <PhotoUploader
                    name="image_url"
                    folder="collections"
                    label="Collection photo"
                    value={collection.image_url ? [{ url: collection.image_url, alt: collection.name }] : []}
                  />
                </div>
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" name="published" defaultChecked={collection.published} /> Published
                </label>
                <details className="text-sm md:col-span-2">
                  <summary className="cursor-pointer underline">More options</summary>
                  <div className="mt-3 grid gap-3 md:grid-cols-2">
                    <input name="slug" defaultValue={collection.slug} className={inputClass} />
                    <input name="sort_order" type="number" defaultValue={collection.sort_order} className={inputClass} />
                  </div>
                </details>
                <button className="admin-primary">Save</button>
              </form>
              <div className="mt-3">
                {locked ? (
                  <p className="text-xs text-muted">This collection cannot be deleted.</p>
                ) : (
                  <ConfirmDelete
                    action={deleteCollectionAction}
                    id={collection.id}
                    title={`Delete ${collection.name}?`}
                    message="This collection will be removed. Designs inside it will remain, but will no longer sit in this collection."
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const inputClass = "w-full border border-line bg-paper px-3 py-2.5 text-sm";
