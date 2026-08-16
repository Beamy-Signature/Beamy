import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bag",
  description: "Review your BEAMY pieces and checkout on WhatsApp.",
};

export default function CartLayout({ children }: { children: React.ReactNode }) {
  return children;
}
