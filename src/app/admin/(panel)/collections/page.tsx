import { AdminField } from "@/components/admin/AdminField";
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
        description="Collections are the groups visitors browse — Men, Women, and any extra stories you add. Create, rename, hide, or photograph them here."
      />
      <form action={saveCollectionAction} className="mt-8 space-y-4 border border-line bg-paper p-5">
        <h2 className="font-serif text-2xl">Create a collection</h2>
        <p className="text-sm leading-6 text-muted">
          Give it a name people will recognise, a short description, and a photograph if you have one.
        </p>
        <AdminField label="Name" description="The title shown on the website, such as Executive 2026." as="label">
          <input name="name" required placeholder="Name" className={inputClass} />
        </AdminField>
        <AdminField
          label="Description"
          description="A sentence or two about this group of pieces."
          as="label"
        >
          <textarea name="description" placeholder="Short description" className={inputClass} />
        </AdminField>
        <PhotoUploader
          name="image_url"
          folder="collections"
          label="Collection photo"
          description="The image visitors see when they open this collection. Any photo up to 10MB."
        />
        <AdminField
          label="Who it is for"
          description="Choose Men, Women, unisex, or mixed if the pieces sit together."
          as="label"
        >
          <select name="gender" className={inputClass} defaultValue="">
            <option value="">Mixed / unisex</option>
            <option value="men">Men</option>
            <option value="women">Women</option>
            <option value="unisex">Unisex</option>
          </select>
        </AdminField>
        <AdminField
          label="Show on the website"
          description="Untick to keep this collection private until you are ready."
        >
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="published" defaultChecked /> Published
          </label>
        </AdminField>
        <details className="text-sm">
          <summary className="cursor-pointer underline">More options</summary>
          <div className="mt-3 grid gap-4">
            <AdminField
              label="Web address"
              description="Leave blank and we will create one from the name."
              as="label"
            >
              <input name="slug" placeholder="Optional" className={inputClass} />
            </AdminField>
            <AdminField
              label="Display order"
              description="Lower numbers appear first on the collections page."
              as="label"
            >
              <input name="sort_order" type="number" defaultValue={0} className={inputClass} />
            </AdminField>
          </div>
        </details>
        <button className="admin-primary">Create collection</button>
      </form>
      <div className="mt-8 space-y-6">
        {collections.map((collection) => {
          const locked = collection.slug === "men" || collection.slug === "women";
          return (
            <div key={collection.id} className="border border-line bg-paper p-5">
              <form action={saveCollectionAction} className="grid gap-4 md:grid-cols-2">
                <input type="hidden" name="id" value={collection.id} />
                <AdminField label="Name" description="The title shown on the website." as="label">
                  <input name="name" defaultValue={collection.name} className={inputClass} />
                </AdminField>
                <AdminField
                  label="Who it is for"
                  description="Men, Women, unisex, or mixed."
                  as="label"
                >
                  <select name="gender" defaultValue={collection.gender ?? ""} className={inputClass}>
                    <option value="">Mixed / unisex</option>
                    <option value="men">Men</option>
                    <option value="women">Women</option>
                    <option value="unisex">Unisex</option>
                  </select>
                </AdminField>
                <div className="md:col-span-2">
                  <AdminField
                    label="Description"
                    description="A short note visitors read under the collection name."
                    as="label"
                  >
                    <textarea name="description" defaultValue={collection.description ?? ""} className={inputClass} />
                  </AdminField>
                </div>
                <div className="md:col-span-2">
                  <PhotoUploader
                    name="image_url"
                    folder="collections"
                    label="Collection photo"
                    description="The image visitors see for this collection. Any photo up to 10MB."
                    value={collection.image_url ? [{ url: collection.image_url, alt: collection.name }] : []}
                  />
                </div>
                <AdminField
                  label="Show on the website"
                  description="Untick to hide this collection from visitors."
                >
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" name="published" defaultChecked={collection.published} /> Published
                  </label>
                </AdminField>
                <details className="text-sm md:col-span-2">
                  <summary className="cursor-pointer underline">More options</summary>
                  <div className="mt-3 grid gap-4 md:grid-cols-2">
                    <AdminField
                      label="Web address"
                      description={
                        locked
                          ? "Men and Women keep their web addresses so existing links keep working."
                          : "Leave as it is unless you need a different link."
                      }
                      as="label"
                    >
                      <input
                        name="slug"
                        defaultValue={collection.slug}
                        readOnly={locked}
                        className={inputClass}
                      />
                    </AdminField>
                    <AdminField
                      label="Display order"
                      description="Lower numbers appear first."
                      as="label"
                    >
                      <input name="sort_order" type="number" defaultValue={collection.sort_order} className={inputClass} />
                    </AdminField>
                  </div>
                </details>
                <button className="admin-primary">Save collection</button>
              </form>
              <div className="mt-3">
                {locked ? (
                  <p className="text-xs text-muted">
                    Men and Women stay in the catalogue. You can hide them, but you cannot remove them.
                  </p>
                ) : (
                  <ConfirmDelete
                    action={deleteCollectionAction}
                    id={collection.id}
                    title={`Remove ${collection.name}?`}
                    message="This collection will leave the list. The designs inside it will stay — they will simply no longer sit here."
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
