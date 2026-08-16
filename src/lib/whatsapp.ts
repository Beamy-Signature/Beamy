export function toInternationalWhatsApp(number: string): string {
  const digits = number.replace(/\D/g, "");
  if (digits.startsWith("234")) return digits;
  if (digits.startsWith("0")) return `234${digits.slice(1)}`;
  return digits;
}

export function productWhatsAppMessage(
  productName: string,
  custom?: string | null,
): string {
  const trimmed = custom?.trim();
  if (trimmed) {
    return `${trimmed}\n\n`;
  }

  return `Hello BEAMY, I would like to order the ${productName}.\n\n`;
}

export function whatsappLink(number: string, message: string): string {
  const intl = toInternationalWhatsApp(number);
  return `https://wa.me/${intl}?text=${encodeURIComponent(message)}`;
}
