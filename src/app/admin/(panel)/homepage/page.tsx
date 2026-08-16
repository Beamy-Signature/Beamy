import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { HeroManager } from "@/components/admin/HeroManager";
import { getAdminHeroImages } from "@/lib/data/queries";

export default async function HomepageImagesPage() {
  const images = await getAdminHeroImages();

  return (
    <div>
      <AdminPageHeader
        title="Homepage images"
        description="These photos rotate in the large banner at the top of the website. Add, hide or reorder them here — no code needed."
      />
      <div className="mt-8">
        <HeroManager images={images} />
      </div>
    </div>
  );
}
