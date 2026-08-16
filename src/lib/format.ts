import type { PriceDisplayMode } from "@/lib/types";

export function formatPrice(
  price: number | null,
  mode: PriceDisplayMode,
): string {
  if (mode === "on_request" || price == null) {
    return "Price on Request";
  }

  const formatted = new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(price);

  if (mode === "from") {
    return `From ${formatted}`;
  }

  return formatted;
}

export function formatNaira(amount: number): string {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatPhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 11 && digits.startsWith("0")) {
    return `${digits.slice(0, 4)} ${digits.slice(4, 7)} ${digits.slice(7)}`;
  }
  return phone;
}
