import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { ProductForm } from "@/components/admin/ProductForm";
import { saveProductAction } from "@/lib/admin/actions";
import { getCategories, getCollections } from "@/lib/data/queries";

export default async function NewProductPage() {
  const [categories, collections] = await Promise.all([
    getCategories(),
    getCollections({ publishedOnly: false }),
  ]);

  return (
    <div>
      <AdminPageHeader title="Add New Design" description="Name, photos, price and whether it is for men or women." />
      <div className="mt-8">
        <ProductForm categories={categories} collections={collections} action={saveProductAction} />
      </div>
    </div>
  );
}
