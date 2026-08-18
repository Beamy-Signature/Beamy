import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { CmsImageList } from "@/components/admin/CmsImageList";
import { saveGalleryImagesAction } from "@/lib/admin/actions";
import { getAdminGalleryImages } from "@/lib/data/queries";

export default async function GalleryPage() {
  const images = await getAdminGalleryImages();

  return (
    <div>
      <AdminPageHeader
        title="Lookbook gallery"
        description="These photographs sit in the grid on the homepage, below Why BEAMY. Add, hide or reorder them here."
      />
      <div className="mt-8">
        <CmsImageList
          images={images}
          action={saveGalleryImagesAction}
          folder="gallery"
          emptyCopy="The lookbook is waiting for photographs. Add a few above, then save."
          saveLabel="Save gallery"
        />
      </div>
    </div>
  );
}
