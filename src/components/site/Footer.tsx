import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { InstagramIcon } from "@/components/icons/InstagramIcon";
import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";
import type { SiteSettings } from "@/lib/types";
import { formatPhone } from "@/lib/format";
import { whatsappLink } from "@/lib/whatsapp";

export function Footer({ settings }: { settings: SiteSettings }) {
  const enquiry = whatsappLink(
    settings.whatsapp_number,
    "Hello BEAMY, I would like to make an enquiry.",
  );

  return (
    <footer className="border-t border-line bg-ink text-paper">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 md:grid-cols-4 md:px-8">
        <div className="md:col-span-2">
          <p className="max-w-md text-sm leading-7 text-paper/70">
            {settings.footer_tagline} {settings.about_short}
          </p>
        </div>

        <div>
          <p className="mb-4 text-[11px] tracking-[0.22em] text-gold uppercase">Explore</p>
          <div className="flex flex-col gap-3 text-sm text-paper/80">
            <Link href="/collections/men">Men</Link>
            <Link href="/collections/women">Women</Link>
            <Link href="/about">About</Link>
            <Link href="/how-it-works">How it works</Link>
            <Link href="/contact">Contact</Link>
          </div>
        </div>

        <div>
          <p className="mb-4 text-[11px] tracking-[0.22em] text-gold uppercase">Contact</p>
          <div className="flex min-w-0 flex-col gap-3.5 text-sm text-paper/80">
            <p className="flex min-w-0 items-start gap-3">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
              <span className="min-w-0 break-words">{settings.address}</span>
            </p>
            <a href={`tel:${settings.phone}`} className="flex min-w-0 items-start gap-3 hover:text-gold">
              <Phone className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
              <span className="min-w-0 break-words">{formatPhone(settings.phone)}</span>
            </a>
            <a href={`mailto:${settings.email}`} className="flex min-w-0 items-start gap-3 hover:text-gold">
              <Mail className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
              <span className="min-w-0 break-all">{settings.email}</span>
            </a>
            <a
              href={settings.instagram_fashion}
              target="_blank"
              rel="noopener noreferrer"
              className="flex min-w-0 items-start gap-3 hover:text-gold"
            >
              <InstagramIcon className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
              <span className="min-w-0 break-all">@Beamy_fashion</span>
            </a>
            <a
              href={settings.instagram_woman}
              target="_blank"
              rel="noopener noreferrer"
              className="flex min-w-0 items-start gap-3 hover:text-gold"
            >
              <InstagramIcon className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
              <span className="min-w-0 break-all">@Beamy_woman</span>
            </a>
            <a
              href={enquiry}
              target="_blank"
              rel="noopener noreferrer"
              className="flex min-w-0 items-start gap-3 text-gold hover:text-gold-soft"
            >
              <WhatsAppIcon className="mt-0.5 h-4 w-4 shrink-0" />
              Chat on WhatsApp
            </a>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 px-5 py-5 text-center text-[10px] leading-relaxed tracking-[0.1em] text-paper/40 uppercase sm:text-[11px] sm:tracking-[0.16em] md:px-8">
        © {new Date().getFullYear()} BEAMY. Beamsssy Signature. All rights reserved.
      </div>
    </footer>
  );
}
