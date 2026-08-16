import Link from "next/link";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { getDashboardStats } from "@/lib/data/queries";

export default async function AdminDashboardPage() {
  const stats = await getDashboardStats();
  const cards = [
    { label: "Total designs", value: stats.totalProducts, href: "/admin/products" },
    { label: "Published", value: stats.publishedProducts, href: "/admin/products?status=published" },
    { label: "Drafts", value: stats.draftProducts, href: "/admin/products?status=draft" },
    { label: "Collections", value: stats.collections, href: "/admin/collections" },
    { label: "Featured", value: stats.featuredProducts, href: "/admin/products?status=featured" },
  ];

  return (
    <div>
      <AdminPageHeader
        title="Dashboard"
        description="Add designs, manage collections, and keep the website up to date."
        action={
          <Link href="/admin/products/new" className="admin-primary">
            Add New Design
          </Link>
        }
      />
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {cards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="admin-stat border border-line bg-paper p-5"
          >
            <p className="text-xs tracking-[0.16em] text-muted uppercase">{card.label}</p>
            <p className="mt-3 font-serif text-4xl text-ink">{card.value}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
