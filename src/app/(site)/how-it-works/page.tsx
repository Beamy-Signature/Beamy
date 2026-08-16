import type { Metadata } from "next";
import { WhatsAppCta } from "@/components/site/WhatsAppCta";
import { getSiteSettings } from "@/lib/data/queries";

export const metadata: Metadata = {
  title: "How it works",
  description: "How BEAMY bespoke and made-to-measure clothing is created — from consultation to finishing.",
};

const steps = [
  {
    num: "01",
    title: "Consultation",
    body: "Start on WhatsApp. Tell us the occasion, the silhouette you have in mind, and any references. We will advise on cloth, cut and timing.",
  },
  {
    num: "02",
    title: "Measurements",
    body: "We take a full set of measurements, or work from a measurement guide if you are not in Lagos. Fit is the foundation of every BEAMY piece.",
  },
  {
    num: "03",
    title: "Cloth and design",
    body: "Together we choose fabric, lining, finishing and details. Nothing is standardised for the sake of speed.",
  },
  {
    num: "04",
    title: "Making",
    body: "The garment is cut and constructed in the atelier. Structure, drape and finishing are checked at every stage.",
  },
  {
    num: "05",
    title: "Fitting and finish",
    body: "We refine the fit, complete the finish, and release a piece that holds its own — at work, at a wedding, or in the everyday.",
  },
];

export default async function HowItWorksPage() {
  const settings = await getSiteSettings();

  return (
    <>
      <section className="px-5 py-16 md:px-8 md:py-24">
        <div className="mx-auto max-w-7xl">
          <p className="text-[11px] tracking-[0.28em] text-gold uppercase">Process</p>
          <h1 className="editorial-title mt-3 max-w-3xl text-5xl md:text-7xl">
            Bespoke, without the mystery.
          </h1>
          <p className="mt-6 max-w-xl text-muted">
            BEAMY clothing is made around you — your measurements, your style, your calendar.
          </p>
          <div className="mt-16 grid gap-12 md:grid-cols-2 lg:grid-cols-5">
            {steps.map((step) => (
              <div key={step.num}>
                <p className="text-[11px] tracking-[0.2em] text-gold">{step.num}</p>
                <h2 className="mt-3 font-serif text-3xl">{step.title}</h2>
                <p className="mt-3 text-sm leading-7 text-muted">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <WhatsAppCta settings={settings} heading="Ready when you are." />
    </>
  );
}
