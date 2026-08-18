import type { Metadata } from "next";
import Link from "next/link";
import { HeroSlideshow } from "@/components/site/HeroSlideshow";
import { Reveal } from "@/components/site/Reveal";
import { SafeImage } from "@/components/site/SafeImage";
import { WhatsAppCta } from "@/components/site/WhatsAppCta";
import {
  getCollections,
  getGalleryImages,
  getHeroImages,
  getSiteSettings,
} from "@/lib/data/queries";

export const metadata: Metadata = {
  title: "About",
  description:
    "BEAMY is a premium Lagos-based unisex fashion brand creating contemporary bespoke and made-to-measure clothing.",
};

const values = [
  {
    num: "01",
    title: "Bespoke craftsmanship",
    body: "Each piece is built around the wearer, not a standard size chart.",
  },
  {
    num: "02",
    title: "Refined tailoring",
    body: "Clean shoulders, considered proportions, and a silhouette that stands.",
  },
  {
    num: "03",
    title: "Quality fabrics",
    body: "Cloth is chosen for drape, durability and how it lives in Lagos heat.",
  },
  {
    num: "04",
    title: "Clean finishing",
    body: "Quiet construction. No loose ends. Nothing louder than the person wearing it.",
  },
  {
    num: "05",
    title: "Personalised fit",
    body: "Measurements, lifestyle and occasion shape the final garment.",
  },
];

const occasions = [
  "Work",
  "Weddings",
  "Special occasions",
  "Professional engagements",
  "Refined everyday wear",
];

const clients = [
  "Professionals",
  "Entrepreneurs",
  "Executives",
  "Grooms & brides",
  "Wedding guests",
  "Corporate women",
];

const processPreview = [
  { num: "01", title: "Consultation" },
  { num: "02", title: "Measurements" },
  { num: "03", title: "Cloth and design" },
  { num: "04", title: "Making" },
  { num: "05", title: "Fitting and finish" },
];

type Photo = { url: string; alt: string };

function pickImage(...candidates: Array<Photo | null | undefined>) {
  return candidates.find((item) => item?.url) ?? null;
}

function pickDistinct(used: string | undefined, ...candidates: Array<Photo | null | undefined>) {
  return candidates.find((item) => item?.url && item.url !== used) ?? pickImage(...candidates);
}

function storyParagraphs(aboutShort: string, aboutLong: string) {
  const paragraphs = aboutLong
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
  const lead = aboutShort.trim().slice(0, 48);
  const rest = paragraphs.filter((paragraph, index) => {
    if (index !== 0 || !lead) return true;
    return !paragraph.startsWith(lead);
  });
  return rest.length > 0 ? rest : paragraphs;
}

export default async function AboutPage() {
  const [settings, heroImages, gallery, collections] = await Promise.all([
    getSiteSettings(),
    getHeroImages(),
    getGalleryImages(),
    getCollections(),
  ]);

  const paragraphs = storyParagraphs(settings.about_short, settings.about_long);
  const men = collections.find((collection) => collection.slug === "men");
  const women = collections.find((collection) => collection.slug === "women");
  const menPhoto = men?.image_url ? { url: men.image_url, alt: men.name } : null;
  const womenPhoto = women?.image_url ? { url: women.image_url, alt: women.name } : null;

  const portrait = pickImage(heroImages[1], gallery[1], womenPhoto, heroImages[0], gallery[0], menPhoto);
  const atelier = pickDistinct(
    portrait?.url,
    gallery[2],
    heroImages[2],
    menPhoto,
    gallery[0],
    heroImages[0],
    womenPhoto,
  );
  const mosaic = [...heroImages, ...gallery]
    .filter((image, index, list) => list.findIndex((item) => item.url === image.url) === index)
    .slice(0, 6);
  const slides = (heroImages.length > 0 ? heroImages : gallery).map((image) => ({
    url: image.url,
    alt: image.alt,
  }));

  return (
    <>
      <HeroSlideshow images={slides}>
        <p className="hero-copy max-w-full text-[11px] tracking-[0.16em] text-gold uppercase sm:tracking-[0.32em]">
          Lagos · Unisex · Bespoke
        </p>
        <h1 className="hero-copy editorial-title mt-5 max-w-4xl text-[2.5rem] leading-[0.95] sm:text-5xl md:text-7xl lg:text-8xl">
          Clothing that holds its own.
        </h1>
        <div className="hero-copy gold-rule mt-8 bg-gold" />
        <p className="hero-copy mt-8 max-w-xl text-sm leading-7 text-paper/75 md:text-base">
          A Lagos house for contemporary tailoring — made around your measurements, your style, and the rooms you walk into.
        </p>
      </HeroSlideshow>

      <section className="bg-paper px-5 py-20 md:px-8 md:py-28">
        <div className="mx-auto max-w-4xl text-center">
          <Reveal>
            <p className="text-[11px] tracking-[0.28em] text-gold uppercase">The house</p>
            <h2 className="editorial-title mt-5 text-4xl md:text-6xl">About BEAMY</h2>
            <div className="gold-rule mx-auto mt-6" />
            <p className="mx-auto mt-10 max-w-2xl font-serif text-2xl leading-snug text-ink md:text-3xl">
              {settings.about_short}
            </p>
            <p className="mt-8 text-[11px] tracking-[0.16em] text-muted uppercase sm:tracking-[0.28em]">
              Excellence · Discipline
            </p>
          </Reveal>
        </div>
      </section>

      <section className={portrait ? "grid md:grid-cols-2" : ""}>
        {portrait ? (
          <div className="relative min-h-[460px] overflow-hidden bg-ink md:min-h-[720px]">
            <SafeImage
              src={portrait.url}
              alt={portrait.alt}
              fill
              className="object-cover opacity-90 transition-transform duration-[1200ms] hover:scale-105"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        ) : null}
        <div className="flex flex-col justify-center bg-background px-6 py-16 md:px-14 lg:px-20">
          <Reveal>
            <p className="text-[11px] tracking-[0.28em] text-gold uppercase">The story</p>
            <h2 className="editorial-title mt-4 text-4xl md:text-5xl">Made to be worn with presence.</h2>
            <div className="gold-rule mt-6" />
            <div className="mt-8 max-w-xl space-y-6 text-sm leading-7 text-muted md:text-base">
              {paragraphs.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
            <Link
              href="/collections"
              className="mt-10 inline-flex w-full justify-center border border-ink px-5 py-3 text-center text-[11px] tracking-[0.18em] uppercase transition-colors duration-300 hover:bg-ink hover:text-paper sm:w-fit"
            >
              Explore the collection
            </Link>
          </Reveal>
        </div>
      </section>

      <section className="px-5 py-20 md:px-8 md:py-28">
        <div className="mx-auto max-w-7xl">
          <Reveal>
            <p className="text-[11px] tracking-[0.28em] text-gold uppercase">Who we dress</p>
            <h2 className="editorial-title mt-3 max-w-3xl text-4xl md:text-6xl">
              For the rooms that ask something of you.
            </h2>
          </Reveal>
          <div className="mt-12 grid gap-12 lg:grid-cols-2">
            <Reveal delay={80}>
              <p className="text-[11px] tracking-[0.2em] text-gold uppercase">Occasions</p>
              <ul className="mt-6 divide-y divide-line border-y border-line">
                {occasions.map((item) => (
                  <li key={item} className="flex items-center justify-between gap-4 py-4">
                    <span className="min-w-0 font-serif text-2xl break-words">{item}</span>
                    <span className="h-px w-8 shrink-0 bg-gold sm:w-10" />
                  </li>
                ))}
              </ul>
            </Reveal>
            <Reveal delay={160}>
              <p className="text-[11px] tracking-[0.2em] text-gold uppercase">Our clients</p>
              <div className="mt-6 grid grid-cols-2 gap-3">
                {clients.map((item) => (
                  <p
                    key={item}
                    className="min-w-0 border border-line bg-paper px-3 py-5 text-center font-serif text-lg leading-tight break-words sm:px-4 sm:py-6 sm:text-xl"
                  >
                    {item}
                  </p>
                ))}
              </div>
              <p className="mt-6 text-sm leading-6 text-muted">
                People who value quality, sophistication, personal expression, and a dependable fashion experience.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="bg-ink px-5 py-20 text-paper md:px-8 md:py-28">
        <div className="mx-auto max-w-7xl">
          <Reveal>
            <p className="text-[11px] tracking-[0.28em] text-gold uppercase">The craft</p>
            <h2 className="editorial-title mt-3 max-w-2xl text-4xl md:text-6xl">
              Excellence, with discipline in every seam.
            </h2>
          </Reveal>
          <div className="mt-16 grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
            {values.map((value, index) => (
              <Reveal key={value.num} delay={index * 80}>
                <p className="text-[11px] tracking-[0.2em] text-gold">{value.num}</p>
                <h3 className="mt-4 font-serif text-2xl">{value.title}</h3>
                <p className="mt-3 text-sm leading-6 text-paper/65">{value.body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {mosaic.length > 0 ? (
        <section className="overflow-hidden bg-ink">
          <div className="grid grid-cols-2 md:grid-cols-3">
            {mosaic.map((image, index) => {
              const featured = index === 0 && mosaic.length >= 4;
              return (
                <div
                  key={`${image.url}-${index}`}
                  className={`group relative overflow-hidden ${
                    featured
                      ? "aspect-[3/4] md:col-span-2 md:row-span-2 md:aspect-auto md:min-h-[640px]"
                      : "aspect-[4/5]"
                  }`}
                >
                  <SafeImage
                    src={image.url}
                    alt={image.alt}
                    fill
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    sizes={featured ? "(max-width: 768px) 100vw, 66vw" : "(max-width: 768px) 50vw, 33vw"}
                  />
                </div>
              );
            })}
          </div>
        </section>
      ) : null}

      <section className={atelier ? "grid md:grid-cols-2" : ""}>
        <div className="order-2 flex flex-col justify-center px-6 py-16 md:order-1 md:px-14 lg:px-20">
          <Reveal>
            <p className="text-[11px] tracking-[0.28em] text-gold uppercase">The atelier</p>
            <h2 className="editorial-title mt-4 text-4xl md:text-5xl">Lagos, with a careful hand.</h2>
            <div className="gold-rule mt-6" />
            <p className="mt-8 max-w-md text-sm leading-7 text-muted md:text-base">
              {settings.address}. Enquiries, fittings and commissions begin on WhatsApp. We typically respond within the day.
            </p>
            <div className="mt-10 flex w-full min-w-0 flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link
                href="/how-it-works"
                className="border border-ink bg-ink px-5 py-3 text-center text-[11px] tracking-[0.18em] text-paper uppercase transition-colors duration-300 hover:bg-transparent hover:text-ink"
              >
                How it works
              </Link>
              <Link
                href="/contact"
                className="border border-ink px-5 py-3 text-center text-[11px] tracking-[0.18em] uppercase transition-colors duration-300 hover:bg-ink hover:text-paper"
              >
                Visit contact
              </Link>
            </div>
          </Reveal>
        </div>
        {atelier ? (
          <div className="relative order-1 min-h-[420px] overflow-hidden bg-ink md:order-2 md:min-h-[640px]">
            <SafeImage
              src={atelier.url}
              alt={atelier.alt}
              fill
              className="object-cover opacity-85 transition-transform duration-[1200ms] hover:scale-105"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        ) : null}
      </section>

      <section className="border-t border-line bg-paper px-5 py-16 md:px-8 md:py-20">
        <div className="mx-auto max-w-7xl">
          <Reveal>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-[11px] tracking-[0.28em] text-gold uppercase">Process</p>
                <h2 className="editorial-title mt-3 text-3xl md:text-5xl">Bespoke, without the mystery.</h2>
              </div>
              <Link
                href="/how-it-works"
                className="text-[11px] tracking-[0.2em] uppercase transition-colors hover:text-gold"
              >
                Full process
              </Link>
            </div>
          </Reveal>
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
            {processPreview.map((step, index) => (
              <Reveal key={step.num} delay={index * 70}>
                <p className="text-[11px] tracking-[0.2em] text-gold">{step.num}</p>
                <h3 className="mt-3 font-serif text-2xl">{step.title}</h3>
              </Reveal>
            ))}
          </div>
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
