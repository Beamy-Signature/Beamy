import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { HeroManager } from "@/components/admin/HeroManager";
import { getAdminHeroImages } from "@/lib/data/queries";

export default async function HomepageImagesPage() {
  const images = await getAdminHeroImages();

  return (
    <div>
      <AdminPageHeader
        title="Homepage images"
        description="These photographs rotate in the large banner at the top of the website. Add as many as you like, hide any you are not ready to show, and save when the order looks right."
      />
      <div className="mt-8">
        <HeroManager images={images} />
      </div>
    </div>
  );
}
