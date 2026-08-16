import type { Metadata } from "next";
import { Mail, MapPin, Phone } from "lucide-react";
import { InstagramIcon } from "@/components/icons/InstagramIcon";
import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";
import { formatPhone } from "@/lib/format";
import { getSiteSettings } from "@/lib/data/queries";
import { whatsappLink } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact BEAMY in Lagos — WhatsApp, email and Instagram.",
};

export default async function ContactPage() {
  const settings = await getSiteSettings();
  const enquiry = whatsappLink(
    settings.whatsapp_number,
    "Hello BEAMY, I would like to make an enquiry.",
  );

  return (
    <section className="px-5 py-16 md:px-8 md:py-24">
      <div className="mx-auto grid max-w-7xl gap-16 lg:grid-cols-2">
        <div>
          <p className="text-[11px] tracking-[0.28em] text-gold uppercase">Lagos</p>
          <h1 className="editorial-title mt-3 text-5xl md:text-7xl">Contact BEAMY</h1>
          <p className="mt-6 max-w-md text-muted">
            Enquiries, fittings and commissions begin on WhatsApp. We typically respond within the day.
          </p>
          <a
            href={enquiry}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-10 inline-flex items-center gap-2 border border-ink bg-ink px-6 py-3.5 text-[11px] tracking-[0.2em] text-paper uppercase"
          >
            <WhatsAppIcon className="h-4 w-4" />
            Chat on WhatsApp
          </a>
        </div>
        <div className="space-y-8 border-t border-line pt-8 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-16">
          <div className="flex items-start gap-4">
            <MapPin className="mt-1 h-5 w-5 shrink-0 text-gold" />
            <div>
              <p className="text-[11px] tracking-[0.2em] text-gold uppercase">Studio</p>
              <p className="mt-2">{settings.address}</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <Phone className="mt-1 h-5 w-5 shrink-0 text-gold" />
            <div>
              <p className="text-[11px] tracking-[0.2em] text-gold uppercase">Phone</p>
              <a href={`tel:${settings.phone}`} className="mt-2 block">
                {formatPhone(settings.phone)}
              </a>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <Mail className="mt-1 h-5 w-5 shrink-0 text-gold" />
            <div>
              <p className="text-[11px] tracking-[0.2em] text-gold uppercase">Email</p>
              <a href={`mailto:${settings.email}`} className="mt-2 block">
                {settings.email}
              </a>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <InstagramIcon className="mt-1 h-5 w-5 shrink-0 text-gold" />
            <div>
              <p className="text-[11px] tracking-[0.2em] text-gold uppercase">Instagram</p>
              <a href={settings.instagram_fashion} className="mt-2 block" target="_blank" rel="noopener noreferrer">
                @Beamy_fashion
              </a>
              <a href={settings.instagram_woman} className="mt-1 block" target="_blank" rel="noopener noreferrer">
                @Beamy_woman
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
