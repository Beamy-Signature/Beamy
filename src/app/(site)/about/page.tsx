import type { Metadata } from "next";
import Image from "next/image";
import { WhatsAppCta } from "@/components/site/WhatsAppCta";
import { getSiteSettings } from "@/lib/data/queries";

export const metadata: Metadata = {
  title: "About",
  description:
    "BEAMY is a premium Lagos-based unisex fashion brand creating contemporary bespoke and made-to-measure clothing.",
};

export default async function AboutPage() {
  const settings = await getSiteSettings();
  const paragraphs = settings.about_long.split("\n").filter((line) => line.trim());

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
      <section className="relative h-[50vh] min-h-[320px] bg-ink">
        <Image
          src="https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?auto=format&fit=crop&w=2000&q=80"
          alt="BEAMY tailoring"
          fill
          className="object-cover opacity-80"
          sizes="100vw"
        />
      </section>
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
