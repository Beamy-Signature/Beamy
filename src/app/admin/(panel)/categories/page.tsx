import { AdminField } from "@/components/admin/AdminField";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { ConfirmDelete } from "@/components/admin/ConfirmDelete";
import { deleteCategoryAction, saveCategoryAction } from "@/lib/admin/actions";
import { getCategories } from "@/lib/data/queries";

export default async function AdminCategoriesPage() {
  const categories = await getCategories();
  const men = categories.filter((category) => category.gender === "men");
  const women = categories.filter((category) => category.gender === "women");

  return (
    <div>
      <AdminPageHeader
        title="Categories"
        description="Categories are smaller groups inside Men and Women — for example Agbada or Corporate Suits. Rename, add or remove them at any time."
      />
      <form action={saveCategoryAction} className="mt-8 grid gap-4 border border-line bg-paper p-5 md:grid-cols-2">
        <h2 className="font-serif text-2xl md:col-span-2">Add a category</h2>
        <p className="text-sm leading-6 text-muted md:col-span-2">
          Choose a clear name and whether it belongs with Men or Women.
        </p>
        <AdminField label="Name" description="What shoppers will tap to filter designs, such as Kaftans." as="label">
          <input name="name" required placeholder="Category name" className={inputClass} />
        </AdminField>
        <AdminField
          label="For"
          description="This category will only appear inside that side of the catalogue."
          as="label"
        >
          <select name="gender" defaultValue="men" className={inputClass}>
            <option value="men">Men</option>
            <option value="women">Women</option>
          </select>
        </AdminField>
        <details className="text-sm md:col-span-2">
          <summary className="cursor-pointer underline">More options</summary>
          <div className="mt-3 grid gap-4 md:grid-cols-2">
            <AdminField
              label="Web address"
              description="Leave blank and we will create one from the name."
              as="label"
            >
              <input name="slug" placeholder="Optional" className={inputClass} />
            </AdminField>
            <AdminField
              label="Display order"
              description="Lower numbers appear first in the filter row."
              as="label"
            >
              <input name="sort_order" type="number" defaultValue={0} className={inputClass} />
            </AdminField>
          </div>
        </details>
        <div className="md:col-span-2">
          <button className="admin-primary">Add category</button>
        </div>
      </form>
      <Group title="Men" items={men} />
      <Group title="Women" items={women} />
    </div>
  );
}

function Group({
  title,
  items,
}: {
  title: string;
  items: Awaited<ReturnType<typeof getCategories>>;
}) {
  return (
    <div className="mt-10">
      <h2 className="font-serif text-2xl">{title}</h2>
      <p className="mt-1 text-sm text-muted">Categories shown when visitors browse {title.toLowerCase()}.</p>
      <div className="mt-4 space-y-4">
        {items.length === 0 ? (
          <p className="border border-line bg-paper p-4 text-sm text-muted">No categories here yet.</p>
        ) : (
          items.map((category) => (
            <div key={category.id} className="border border-line bg-paper p-4">
              <form action={saveCategoryAction} className="grid gap-4 md:grid-cols-2">
                <input type="hidden" name="id" value={category.id} />
                <AdminField label="Name" description="The name shoppers see in the filter row." as="label">
                  <input name="name" defaultValue={category.name} className={inputClass} />
                </AdminField>
                <AdminField
                  label="For"
                  description="Move this category to Men or Women if needed."
                  as="label"
                >
                  <select name="gender" defaultValue={category.gender} className={inputClass}>
                    <option value="men">Men</option>
                    <option value="women">Women</option>
                  </select>
                </AdminField>
                <details className="text-sm md:col-span-2">
                  <summary className="cursor-pointer underline">More options</summary>
                  <div className="mt-3 grid gap-4 md:grid-cols-2">
                    <AdminField
                      label="Web address"
                      description="Leave as it is unless you need a different link."
                      as="label"
                    >
                      <input name="slug" defaultValue={category.slug} className={inputClass} />
                    </AdminField>
                    <AdminField
                      label="Display order"
                      description="Lower numbers appear first."
                      as="label"
                    >
                      <input name="sort_order" type="number" defaultValue={category.sort_order} className={inputClass} />
                    </AdminField>
                  </div>
                </details>
                <button className="admin-primary">Save category</button>
              </form>
              <div className="mt-2">
                <ConfirmDelete
                  action={deleteCategoryAction}
                  id={category.id}
                  title={`Remove ${category.name}?`}
                  message="The designs themselves will stay. They will simply no longer sit under this name."
                />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

const inputClass = "w-full border border-line bg-paper px-3 py-2.5 text-sm";
