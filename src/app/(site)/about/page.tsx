import type { Metadata } from "next";
import { WhatsAppCta } from "@/components/site/WhatsAppCta";
import { SafeImage } from "@/components/site/SafeImage";
import { getGalleryImages, getHeroImages, getSiteSettings } from "@/lib/data/queries";

export const metadata: Metadata = {
  title: "About",
  description:
    "BEAMY is a premium Lagos-based unisex fashion brand creating contemporary bespoke and made-to-measure clothing.",
};

export default async function AboutPage() {
  const [settings, heroImages, gallery] = await Promise.all([
    getSiteSettings(),
    getHeroImages(),
    getGalleryImages(),
  ]);
  const paragraphs = settings.about_long.split("\n").filter((line) => line.trim());
  const banner = heroImages[0] ?? gallery[0];

  return (
    <>
      <section className="px-5 py-16 md:px-8 md:py-24">
        <div className="mx-auto max-w-4xl">
          <p className="text-[11px] tracking-[0.28em] text-gold uppercase">The brand</p>
          <h1 className="editorial-title mt-3 text-5xl md:text-7xl">About BEAMY</h1>
          <p className="mt-6 text-sm tracking-[0.2em] text-muted uppercase">
            Excellence · Discipline
          </p>
        </div>
      </section>
      {banner ? (
        <section className="relative h-[50vh] min-h-[320px] bg-ink">
          <SafeImage
            src={banner.url}
            alt={banner.alt}
            fill
            className="object-cover opacity-80"
            sizes="100vw"
          />
        </section>
      ) : null}
      <section className="px-5 py-16 md:px-8 md:py-24">
        <div className="mx-auto max-w-3xl space-y-6 text-base leading-8 text-foreground/90">
          {paragraphs.map((paragraph) => (
            <p key={paragraph.slice(0, 24)}>{paragraph}</p>
          ))}
        </div>
      </section>
      <WhatsAppCta
        settings={settings}
        heading="A piece, made around you."
        body="Whether it is a suit, a senator, a gown or a two-piece — we start with a conversation."
      />
    </>
  );
}
