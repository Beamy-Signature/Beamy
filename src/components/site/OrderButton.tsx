"use client";

import { useSite } from "@/components/site/SiteProvider";
import { productWhatsAppMessage, whatsappLink } from "@/lib/whatsapp";

export function OrderButton({
  productName,
  customMessage,
  className = "",
  variant = "solid",
}: {
  productName: string;
  customMessage?: string | null;
  className?: string;
  variant?: "solid" | "light" | "overlay";
}) {
  const { whatsappNumber } = useSite();
  const href = whatsappLink(
    whatsappNumber,
    productWhatsAppMessage(productName, customMessage),
  );

  const styles = {
    solid:
      "border border-ink bg-ink text-paper hover:bg-transparent hover:text-ink",
    light:
      "border border-paper bg-paper text-ink hover:bg-transparent hover:text-paper",
    overlay:
      "border border-paper bg-paper/95 text-ink hover:bg-gold hover:border-gold",
  }[variant];

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={(event) => event.stopPropagation()}
      className={`inline-flex items-center justify-center px-5 py-3 text-[11px] tracking-[0.18em] uppercase transition-colors duration-300 ${styles} ${className}`}
    >
      Click to order
    </a>
  );
}
