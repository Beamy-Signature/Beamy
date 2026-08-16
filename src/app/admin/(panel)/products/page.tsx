import Link from "next/link";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { ConfirmDelete } from "@/components/admin/ConfirmDelete";
import { deleteProductAction, toggleProductFlag } from "@/lib/admin/actions";
import { getProducts } from "@/lib/data/queries";
import { formatPrice } from "@/lib/format";

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string }>;
}) {
  const { q = "", status = "all" } = await searchParams;
  const products = await getProducts({ publishedOnly: false });
  const filtered = products.filter((product) => {
    const matchesQuery = product.name.toLowerCase().includes(q.toLowerCase());
    const matchesStatus =
      status === "published"
        ? product.published
        : status === "draft"
          ? !product.published
          : status === "featured"
            ? product.featured
            : true;
    return matchesQuery && matchesStatus;
  });

  return (
    <div>
      <AdminPageHeader
        title="All Designs"
        description="Publish, feature or edit pieces. Changes appear on the website automatically."
        action={
          <Link href="/admin/products/new" className="admin-primary">
            Add New Design
          </Link>
        }
      />
      <form className="mt-8 flex flex-wrap gap-3">
        <input
          name="q"
          defaultValue={q}
          placeholder="Search designs"
          className="min-w-0 w-full flex-1 border border-line bg-paper px-3 py-2.5 text-sm sm:min-w-[200px]"
        />
        <select name="status" defaultValue={status} className="border border-line bg-paper px-3 py-2.5 text-sm">
          <option value="all">All</option>
          <option value="published">Published</option>
          <option value="draft">Drafts</option>
          <option value="featured">Featured</option>
        </select>
        <button className="border border-ink px-4 py-2.5 text-sm">Filter</button>
      </form>
      <div className="mt-8 divide-y divide-line border border-line bg-paper">
        {filtered.length === 0 ? (
          <p className="p-8 text-muted">Nothing matches that search just yet. Try another name, or add a new design.</p>
        ) : (
          filtered.map((product) => (
            <div key={product.id} className="flex flex-col gap-3 p-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="font-medium">{product.name}</p>
                <p className="text-sm text-muted">
                  {product.category?.name ?? "Uncategorised"} · {formatPrice(product.price, product.price_display_mode)}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2 text-sm">
                <span className={`px-2 py-1 text-xs ${product.published ? "bg-ink text-paper" : "bg-line"}`}>
                  {product.published ? "Published" : "Draft"}
                </span>
                {product.featured ? <span className="bg-gold/30 px-2 py-1 text-xs">Featured</span> : null}
                <Link href={`/admin/products/${product.id}`} className="underline">
                  Edit
                </Link>
                <form action={toggleProductFlag}>
                  <input type="hidden" name="id" value={product.id} />
                  <input type="hidden" name="field" value="published" />
                  <input type="hidden" name="value" value={product.published ? "false" : "true"} />
                  <button className="underline">{product.published ? "Unpublish" : "Publish"}</button>
                </form>
                <form action={toggleProductFlag}>
                  <input type="hidden" name="id" value={product.id} />
                  <input type="hidden" name="field" value="featured" />
                  <input type="hidden" name="value" value={product.featured ? "false" : "true"} />
                  <button className="underline">{product.featured ? "Unfeature" : "Feature"}</button>
                </form>
                <ConfirmDelete
                  action={deleteProductAction}
                  id={product.id}
                  title="Remove this design?"
                  message={`“${product.name}” will leave the catalogue. This cannot be undone, so only continue if you are sure.`}
                />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
