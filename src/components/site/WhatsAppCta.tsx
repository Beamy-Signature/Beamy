import type { SiteSettings } from "@/lib/types";
import { whatsappLink } from "@/lib/whatsapp";

export function WhatsAppCta({
  settings,
  heading = "Begin your BEAMY piece.",
  body = "Tell us the occasion, the silhouette you have in mind, and we will guide the rest — cloth, measurements, finish.",
}: {
  settings: SiteSettings;
  heading?: string;
  body?: string;
}) {
  const href = whatsappLink(
    settings.whatsapp_number,
    "Hello BEAMY, I would like to start a bespoke enquiry.\n\n",
  );

  return (
    <section className="overflow-x-clip bg-ink px-5 py-20 text-paper md:px-8">
      <div className="mx-auto max-w-3xl text-center">
        <div className="gold-rule mx-auto mb-8 bg-gold" />
        <h2 className="editorial-title text-4xl md:text-6xl">{heading}</h2>
        <p className="mx-auto mt-6 max-w-xl text-sm leading-7 break-words text-paper/70">{body}</p>
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-10 inline-flex w-full max-w-xs items-center justify-center border border-gold bg-gold px-6 py-3.5 text-[11px] tracking-[0.16em] text-ink uppercase transition-colors duration-300 hover:bg-transparent hover:text-gold sm:w-auto sm:tracking-[0.2em]"
        >
          Chat on WhatsApp
        </a>
      </div>
    </section>
  );
}
