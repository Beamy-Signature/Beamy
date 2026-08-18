"use client";

import { useSite } from "@/components/site/SiteProvider";
import { productWhatsAppMessage, whatsappLink } from "@/lib/whatsapp";

export function OrderButton({
  productName,
  customMessage,
  className = "",
  variant = "outline",
}: {
  productName: string;
  customMessage?: string | null;
  className?: string;
  variant?: "solid" | "light" | "overlay" | "outline" | "quiet";
}) {
  const { whatsappNumber } = useSite();
  const href = whatsappLink(
    whatsappNumber,
    productWhatsAppMessage(productName, customMessage),
  );

  const styles = {
    solid:
      "border border-ink bg-ink text-paper hover:bg-transparent hover:text-ink",
    outline:
      "border border-ink bg-transparent text-ink hover:bg-ink hover:text-paper",
    quiet:
      "border-0 bg-transparent px-0 py-2 text-muted underline-offset-4 hover:text-ink hover:underline",
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
      className={`inline-flex items-center justify-center text-[11px] tracking-[0.18em] uppercase transition-colors duration-300 ${
        variant === "quiet" ? "px-0 py-2" : "px-5 py-3"
      } ${styles} ${className}`}
    >
      Click to order
    </a>
  );
}
