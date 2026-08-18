import { CmsImageList } from "@/components/admin/CmsImageList";
import { saveHeroImagesAction } from "@/lib/admin/actions";
import type { HeroImage } from "@/lib/types";

export function HeroManager({ images }: { images: HeroImage[] }) {
  return (
    <CmsImageList
      images={images}
      action={saveHeroImagesAction}
      folder="hero"
      emptyCopy="The banner is waiting for photographs. Add a few above, then save."
      saveLabel="Save homepage images"
    />
  );
}
