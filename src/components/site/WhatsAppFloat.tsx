import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";
import type { SiteSettings } from "@/lib/types";
import { whatsappLink } from "@/lib/whatsapp";

export function WhatsAppFloat({ settings }: { settings: SiteSettings }) {
  const href = whatsappLink(
    settings.whatsapp_number,
    "Hello BEAMY, I would like to make an enquiry.\n\n",
  );

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed right-4 bottom-4 z-40 flex h-12 max-w-[calc(100vw-2rem)] items-center gap-2 bg-[#25D366] px-3 text-[10px] font-medium tracking-[0.12em] text-white uppercase shadow-lg transition-transform duration-300 hover:-translate-y-0.5 sm:h-14 sm:px-4 sm:text-[11px] sm:tracking-[0.14em] md:right-6 md:bottom-6"
      aria-label="Chat on WhatsApp"
    >
      <WhatsAppIcon className="h-5 w-5" />
      WhatsApp
    </a>
  );
}
