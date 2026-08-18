import { notFound } from "next/navigation";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { ProductForm } from "@/components/admin/ProductForm";
import { saveProductAction } from "@/lib/admin/actions";
import { getCategories, getCollections, getProductById } from "@/lib/data/queries";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [product, categories, collections] = await Promise.all([
    getProductById(id),
    getCategories(),
    getCollections({ publishedOnly: false }),
  ]);
  if (!product) notFound();

  return (
    <div>
      <AdminPageHeader title="Edit design" description="Update this piece whenever you like. Save to send the changes to the website. Hide it if you need it off the public pages for a while." />
      <div className="mt-8">
        <ProductForm
          product={product}
          categories={categories}
          collections={collections}
          action={saveProductAction}
        />
      </div>
    </div>
  );
}
