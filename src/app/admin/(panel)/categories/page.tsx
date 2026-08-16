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
        description="These group designs inside Men and Women. You can rename, add or remove them at any time."
      />
      <form action={saveCategoryAction} className="mt-8 grid gap-3 border border-line bg-paper p-5 md:grid-cols-4">
        <input name="name" required placeholder="Category name" className={inputClass} />
        <select name="gender" defaultValue="men" className={inputClass}>
          <option value="men">Men</option>
          <option value="women">Women</option>
        </select>
        <button className="admin-primary">
          Add category
        </button>
        <details className="text-sm md:col-span-4">
          <summary className="cursor-pointer underline">More options</summary>
          <div className="mt-3 grid gap-3 md:grid-cols-2">
            <input name="slug" placeholder="Web address (optional)" className={inputClass} />
            <input name="sort_order" type="number" defaultValue={0} className={inputClass} />
          </div>
        </details>
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
      <div className="mt-4 space-y-4">
        {items.map((category) => (
          <div key={category.id} className="border border-line bg-paper p-4">
            <form action={saveCategoryAction} className="grid gap-3 md:grid-cols-2">
              <input type="hidden" name="id" value={category.id} />
              <input name="name" defaultValue={category.name} className={inputClass} />
              <select name="gender" defaultValue={category.gender} className={inputClass}>
                <option value="men">Men</option>
                <option value="women">Women</option>
              </select>
              <details className="text-sm md:col-span-2">
                <summary className="cursor-pointer underline">More options</summary>
                <div className="mt-3 grid gap-3 md:grid-cols-2">
                  <input name="slug" defaultValue={category.slug} className={inputClass} />
                  <input name="sort_order" type="number" defaultValue={category.sort_order} className={inputClass} />
                </div>
              </details>
              <button className="admin-primary">Save</button>
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
        ))}
      </div>
    </div>
  );
}

const inputClass = "w-full border border-line bg-paper px-3 py-2.5 text-sm";
