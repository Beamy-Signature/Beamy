import { CartDrawer } from "@/components/site/CartDrawer";
import { CartProvider } from "@/components/site/CartProvider";
import { Footer } from "@/components/site/Footer";
import { Header } from "@/components/site/Header";
import { SiteProvider } from "@/components/site/SiteProvider";
import { WhatsAppFloat } from "@/components/site/WhatsAppFloat";
import { getSiteSettings } from "@/lib/data/queries";

export const revalidate = 60;

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSiteSettings();

  return (
    <SiteProvider whatsappNumber={settings.whatsapp_number}>
      <CartProvider>
        <div className="flex min-h-full flex-col">
          <Header settings={settings} />
          <main className="flex-1">{children}</main>
          <Footer settings={settings} />
          <WhatsAppFloat settings={settings} />
          <CartDrawer />
        </div>
      </CartProvider>
    </SiteProvider>
  );
}
