import Link from "next/link";
import { HeroSlideshow } from "@/components/site/HeroSlideshow";
import { ProductCard } from "@/components/site/ProductCard";
import { Reveal } from "@/components/site/Reveal";
import { SafeImage } from "@/components/site/SafeImage";
import { Testimonials } from "@/components/site/Testimonials";
import { WhatsAppCta } from "@/components/site/WhatsAppCta";
import {
  getCollections,
  getGalleryImages,
  getHeroImages,
  getProducts,
  getSiteSettings,
  getTestimonials,
} from "@/lib/data/queries";
import { whatsappLink } from "@/lib/whatsapp";

export default async function HomePage() {
  const [settings, collections, featured, testimonials, gallery, heroImages] = await Promise.all([
    getSiteSettings(),
    getCollections(),
    getProducts({ featured: true }),
    getTestimonials(),
    getGalleryImages(),
    getHeroImages(),
  ]);

  const enquiry = whatsappLink(
    settings.whatsapp_number,
    "Hello BEAMY, I would like to make an enquiry.\n\n",
  );
  const men = collections.find((collection) => collection.slug === "men");
  const women = collections.find((collection) => collection.slug === "women");
  const storyImage =
    heroImages[0] ??
    gallery[0] ??
    (men?.image_url ? { url: men.image_url, alt: men.name } : null) ??
    (women?.image_url ? { url: women.image_url, alt: women.name } : null);

  return (
    <>
      <HeroSlideshow images={heroImages.map((image) => ({ url: image.url, alt: image.alt }))}>
        <p className="hero-copy max-w-full text-[11px] tracking-[0.16em] text-gold uppercase sm:tracking-[0.32em]">
          Lagos · Unisex · Bespoke
        </p>
        <h1 className="hero-copy editorial-title mt-4 max-w-3xl text-[2.5rem] leading-[0.95] sm:text-5xl md:text-7xl lg:text-8xl">
          {settings.hero_headline}
        </h1>
        <p className="hero-copy mt-6 max-w-xl text-sm leading-7 text-paper/75 md:text-base">
          {settings.hero_subheadline}
        </p>
        <div className="hero-copy mt-10 flex w-full min-w-0 flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-4">
          <Link
            href="/collections"
            className="border border-paper bg-paper px-6 py-3.5 text-center text-[11px] tracking-[0.16em] text-ink uppercase transition-colors duration-300 hover:bg-transparent hover:text-paper sm:tracking-[0.2em]"
          >
            Explore Collection
          </Link>
          <a
            href={enquiry}
            target="_blank"
            rel="noopener noreferrer"
            className="border border-paper/40 px-6 py-3.5 text-center text-[11px] tracking-[0.16em] text-paper uppercase transition-colors duration-300 hover:border-gold hover:text-gold sm:tracking-[0.2em]"
          >
            Chat on WhatsApp
          </a>
        </div>
      </HeroSlideshow>

      <section className="px-5 py-20 md:px-8 md:py-28">
        <div className="mx-auto max-w-7xl">
          <Reveal>
            <p className="text-[11px] tracking-[0.28em] text-gold uppercase">Collections</p>
            <h2 className="editorial-title mt-3 text-4xl md:text-6xl">Made for men. Made for women.</h2>
          </Reveal>
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {[men, women].filter(Boolean).map((collection, index) => (
              <Reveal key={collection!.id} delay={index * 120}>
                <Link
                  href={`/collections/${collection!.slug}`}
                  className="group relative block min-h-[420px] overflow-hidden bg-ink text-paper md:min-h-[520px]"
                >
                  {collection!.image_url ? (
                    <SafeImage
                      src={collection!.image_url}
                      alt={collection!.name}
                      fill
                      className="object-cover opacity-70 transition-transform duration-700 ease-out group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  ) : null}
                  <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-transparent" />
                  <div className="absolute right-0 bottom-0 left-0 p-5 sm:p-8">
                    <h3 className="editorial-title text-4xl md:text-5xl">{collection!.name}</h3>
                    <p className="mt-3 max-w-sm text-sm text-paper/75">{collection!.description}</p>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {featured.length > 0 ? (
        <section className="bg-paper px-5 py-20 md:px-8 md:py-28">
          <div className="mx-auto max-w-7xl">
            <Reveal>
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                  <p className="text-[11px] tracking-[0.28em] text-gold uppercase">Featured pieces</p>
                  <h2 className="editorial-title mt-3 text-4xl md:text-6xl">Selected for presence.</h2>
                </div>
                <Link
                  href="/collections"
                  className="hidden text-[11px] tracking-[0.2em] uppercase transition-colors hover:text-gold md:inline"
                >
                  View all
                </Link>
              </div>
            </Reveal>
            <div className="mt-12 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
              {featured.slice(0, 6).map((product, index) => (
                <Reveal key={product.id} delay={index * 80}>
                  <ProductCard product={product} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section className={storyImage ? "grid md:grid-cols-2" : ""}>
        {storyImage ? (
        <div className="relative min-h-[420px] overflow-hidden bg-ink md:min-h-[560px]">
          <SafeImage
            src={storyImage.url}
            alt={storyImage.alt}
            fill
            className="object-cover opacity-80 transition-transform duration-[1200ms] hover:scale-105"
            sizes="50vw"
          />
        </div>
        ) : null}
        <div className="flex flex-col justify-center px-6 py-16 md:px-14">
          <Reveal>
            <p className="text-[11px] tracking-[0.28em] text-gold uppercase">About BEAMY</p>
            <h2 className="editorial-title mt-3 text-4xl md:text-5xl">Clothing that holds its own.</h2>
            <p className="mt-6 max-w-lg text-sm leading-7 text-muted">{settings.about_short}</p>
            <Link
              href="/about"
              className="mt-8 inline-flex w-full justify-center border border-ink px-5 py-3 text-center text-[11px] tracking-[0.18em] uppercase transition-colors duration-300 hover:bg-ink hover:text-paper sm:w-fit"
            >
              Discover BEAMY
            </Link>
          </Reveal>
        </div>
      </section>

      <section className="px-5 py-20 md:px-8 md:py-28">
        <div className="mx-auto max-w-7xl">
          <Reveal>
            <p className="text-[11px] tracking-[0.28em] text-gold uppercase">Why BEAMY</p>
            <h2 className="editorial-title mt-3 max-w-2xl text-4xl md:text-6xl">
              Excellence, with discipline in every seam.
            </h2>
          </Reveal>
          <div className="mt-14 grid gap-10 md:grid-cols-5">
            {[
              ["01", "Bespoke craftsmanship", "Each piece is built around the wearer, not a standard size chart."],
              ["02", "Refined tailoring", "Clean shoulders, considered proportions, and a silhouette that stands."],
              ["03", "Quality fabrics", "Cloth is chosen for drape, durability and how it lives in Lagos heat."],
              ["04", "Clean finishing", "Quiet construction. No loose ends. Nothing louder than the person wearing it."],
              ["05", "Personalised fit", "Measurements, lifestyle and occasion shape the final garment."],
            ].map(([num, title, body], index) => (
              <Reveal key={num} delay={index * 90}>
                <p className="text-[11px] tracking-[0.2em] text-gold">{num}</p>
                <h3 className="mt-3 font-serif text-2xl">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-muted">{body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {gallery.length > 0 ? (
        <section className="overflow-hidden bg-ink">
          <div className="grid grid-cols-2 md:grid-cols-3">
            {gallery.map((image) => (
              <div key={image.id} className="group relative aspect-[4/5] overflow-hidden">
                <SafeImage
                  src={image.url}
                  alt={image.alt}
                  fill
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  sizes="(max-width: 768px) 50vw, 33vw"
                />
              </div>
            ))}
          </div>
        </section>
      ) : null}

      <Testimonials items={testimonials} />
      <WhatsAppCta settings={settings} />
    </>
  );
}
