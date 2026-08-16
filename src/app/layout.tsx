import type { Metadata } from "next";
import { Cormorant_Garamond, Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://beamy.fashion"),
  title: {
    default: "BEAMY | Urban Fashion",
    template: "%s | BEAMY",
  },
  description:
    "BEAMY is a premium Lagos-based unisex fashion brand creating contemporary bespoke and made-to-measure clothing for men and women.",
  openGraph: {
    type: "website",
    locale: "en_NG",
    siteName: "BEAMY",
    title: "BEAMY | Urban Fashion",
    description:
      "Contemporary bespoke fashion designed around your style, measurements and lifestyle.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} ${cormorant.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-background font-sans text-foreground">
        {children}
      </body>
    </html>
  );
}
