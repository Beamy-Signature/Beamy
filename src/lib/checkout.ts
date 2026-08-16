import type { CartItem, CheckoutDetails, PriceDisplayMode } from "@/lib/types";
import { formatNaira, formatPrice } from "@/lib/format";
import { toInternationalWhatsApp } from "@/lib/whatsapp";

function lineTotal(item: CartItem): number | null {
  if (item.price == null || item.priceDisplayMode === "on_request") return null;
  return item.price * item.quantity;
}

export function cartTotals(items: CartItem[]) {
  const priced = items.filter(
    (item) => item.price != null && item.priceDisplayMode !== "on_request",
  );
  const hasOnRequest = items.some(
    (item) => item.price == null || item.priceDisplayMode === "on_request",
  );
  const subtotal = priced.reduce((sum, item) => sum + (item.price ?? 0) * item.quantity, 0);
  return { subtotal, hasOnRequest, itemCount: items.reduce((sum, item) => sum + item.quantity, 0) };
}

export function buildCheckoutMessage(items: CartItem[], details: CheckoutDetails): string {
  const { subtotal, hasOnRequest } = cartTotals(items);
  const lines = items.map((item, index) => {
    const unit = formatPrice(item.price, item.priceDisplayMode);
    const total = lineTotal(item);
    return [
      `${index + 1}. ${item.name}`,
      `   • Quantity: ${item.quantity}`,
      `   • Unit price: ${unit}`,
      `   • Line total: ${total == null ? "To be confirmed" : formatNaira(total)}`,
    ].join("\n");
  });

  const totalLine = hasOnRequest
    ? `ESTIMATED TOTAL: ${formatNaira(subtotal)}\nSome pieces are priced on request and will be confirmed.`
    : `TOTAL: ${formatNaira(subtotal)}`;

  return [
    "Hello BEAMY, I would like to place an order.",
    "",
    "————————————",
    "ORDER SUMMARY",
    "————————————",
    "",
    lines.join("\n\n"),
    "",
    "————————————",
    totalLine,
    "————————————",
    "",
    "CUSTOMER DETAILS",
    `• Name: ${details.name || ""}`,
    `• Phone: ${details.phone || ""}`,
    `• Delivery address: ${details.address || ""}`,
    `• Occasion / date needed: ${details.occasion || ""}`,
    `• Notes: ${details.notes || ""}`,
    "",
    "Please confirm availability, fitting date, payment details and delivery timeline.",
    "",
  ].join("\n");
}

export function checkoutWhatsAppLink(
  number: string,
  items: CartItem[],
  details: CheckoutDetails,
): string {
  const intl = toInternationalWhatsApp(number);
  return `https://wa.me/${intl}?text=${encodeURIComponent(buildCheckoutMessage(items, details))}`;
}

export function unitLabel(mode: PriceDisplayMode): string {
  if (mode === "from") return "starting from";
  if (mode === "on_request") return "on request";
  return "fixed";
}
