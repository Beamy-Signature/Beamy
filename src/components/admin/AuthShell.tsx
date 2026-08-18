import Link from "next/link";
import { BrandLogo } from "@/components/brand/BrandLogo";

export function AuthShell({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="admin-app relative flex min-h-dvh flex-col items-center justify-center overflow-x-hidden bg-[#efe8dc] px-5 py-12 text-foreground">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-gold via-accent to-gold" />
      <div className="admin-page-enter w-full max-w-sm">
        <Link href="/admin/login" className="block">
          <BrandLogo variant="lockup" className="mx-auto mb-8 h-14 w-[17.5rem]" />
        </Link>
        <div className="border border-line bg-paper p-6 sm:p-8">
          <p className="text-[11px] tracking-[0.28em] text-gold uppercase">BEAMY Catalogue</p>
          <h1 className="mt-3 font-serif text-3xl">{title}</h1>
          <div className="gold-rule mt-4" />
          {children}
        </div>
      </div>
    </div>
  );
}

export const authInputClass =
  "mt-2 w-full border border-line bg-white px-3 py-2.5 outline-none focus:border-gold";
