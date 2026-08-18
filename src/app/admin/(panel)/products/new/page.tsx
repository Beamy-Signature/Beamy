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
      <AdminPageHeader title="Add New Design" description="Name the piece, add photographs, set a price, and choose whether it is for men or women. Save when you are ready — you can keep it as a draft until it should appear on the website." />
      <div className="mt-8">
        <ProductForm categories={categories} collections={collections} action={saveProductAction} />
      </div>
    </div>
  );
}
