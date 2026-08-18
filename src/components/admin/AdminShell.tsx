"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  ExternalLink,
  Image as ImageIcon,
  Layers,
  LayoutDashboard,
  LayoutGrid,
  LogOut,
  Quote,
  Settings,
  Shirt,
  Tags,
} from "lucide-react";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { AdminNotice } from "@/components/admin/AdminNotice";
import { logoutAction } from "@/lib/admin/actions";

const nav = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "Designs", icon: Shirt },
  { href: "/admin/collections", label: "Collections", icon: Layers },
  { href: "/admin/categories", label: "Categories", icon: Tags },
  { href: "/admin/homepage", label: "Homepage images", icon: ImageIcon },
  { href: "/admin/gallery", label: "Lookbook gallery", icon: LayoutGrid },
  { href: "/admin/testimonials", label: "Client notes", icon: Quote },
  { href: "/admin/settings", label: "Website details", icon: Settings },
];

function isActive(pathname: string, href: string) {
  return href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
}

function NavList({
  pathname,
  onNavigate,
}: {
  pathname: string;
  onNavigate?: () => void;
}) {
  return (
    <nav className="flex flex-col gap-0.5 px-3">
      {nav.map((item, index) => {
        const active = isActive(pathname, item.href);
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={`admin-nav-item flex items-center gap-3 border-l-2 px-3 py-2.5 text-sm ${
              active
                ? "border-gold bg-white/10 text-paper"
                : "border-transparent text-paper/65 hover:border-gold/40 hover:bg-white/5 hover:text-paper"
            }`}
            style={{ animationDelay: `${80 + index * 40}ms` }}
          >
            <Icon className={`h-4 w-4 shrink-0 ${active ? "text-gold" : "text-paper/50"}`} />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

export function AdminShell({
  children,
  configured,
  email,
  showWebsiteLink,
  websiteUrl,
}: {
  children: React.ReactNode;
  configured: boolean;
  email?: string | null;
  showWebsiteLink: boolean;
  websiteUrl: string;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const mainRef = useRef<HTMLElement>(null);

  useEffect(() => {
    setOpen(false);
    mainRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div className="admin-app flex h-dvh flex-col overflow-hidden bg-[#efe8dc] text-foreground">
      <div className="h-1 shrink-0 bg-gradient-to-r from-gold via-accent to-gold" />
      {!configured ? (
        <div className="shrink-0 bg-ink px-4 py-2.5 text-center text-[11px] leading-5 tracking-wide text-paper">
          You are working on this computer for now. Designs are saved here until the live catalogue is connected, so every photograph and piece stays on this PC only.
        </div>
      ) : null}

      <header className="sticky top-0 z-30 shrink-0 border-b border-line/70 bg-paper/90 backdrop-blur-md">
        <div className="flex items-center justify-between gap-3 px-4 py-2.5 sm:px-6 lg:px-8">
          <Link href="/admin" className="min-w-0 shrink" onClick={() => setOpen(false)}>
            <BrandLogo
              variant="lockup"
              align="left"
              priority
              className="h-10 w-44 sm:h-11 sm:w-[13.5rem] lg:h-12 lg:w-[16rem]"
            />
          </Link>
          <div className="flex items-center gap-3 sm:gap-5">
            <p className="hidden text-[11px] tracking-[0.22em] text-gold uppercase sm:block">Catalogue</p>
            <button
              type="button"
              className="flex h-11 w-11 items-center justify-center border border-line lg:hidden"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              onClick={() => setOpen((value) => !value)}
            >
              <span className="relative block h-3.5 w-5">
                <span className={`hamburger-bar top-0 ${open ? "translate-y-[7px] rotate-45" : ""}`} />
                <span className={`hamburger-bar top-[7px] ${open ? "scale-x-0 opacity-0" : ""}`} />
                <span className={`hamburger-bar top-[14px] ${open ? "-translate-y-[7px] -rotate-45" : ""}`} />
              </span>
            </button>
          </div>
        </div>
      </header>

      <div className="flex min-h-0 flex-1">
        <aside className="hidden w-[272px] shrink-0 flex-col overflow-y-auto bg-ink text-paper lg:flex">
          <p className="px-6 pt-8 pb-4 text-[11px] tracking-[0.28em] text-gold uppercase">Menu</p>
          <NavList pathname={pathname} />
          <div className="mt-auto border-t border-white/10 px-6 py-6 text-xs text-paper/55">
            {email ? <p className="mb-3 truncate">{email}</p> : null}
            <form action={logoutAction}>
              <button type="submit" className="inline-flex items-center gap-2 text-paper/70 transition-colors hover:text-gold">
                <LogOut className="h-3.5 w-3.5" />
                Log out
              </button>
            </form>
            {showWebsiteLink ? (
              <a
                href={websiteUrl}
                target={websiteUrl.startsWith("http") ? "_blank" : undefined}
                rel={websiteUrl.startsWith("http") ? "noopener noreferrer" : undefined}
                className="mt-3 inline-flex items-center gap-2 text-paper/70 transition-colors hover:text-gold"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                View website
              </a>
            ) : null}
          </div>
        </aside>

        <button
          type="button"
          aria-hidden={!open}
          tabIndex={open ? 0 : -1}
          className={`fixed inset-0 z-40 bg-ink/45 transition-opacity duration-500 lg:hidden ${
            open ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
          onClick={() => setOpen(false)}
        />
        <aside
          className={`fixed inset-y-0 left-0 z-50 flex w-[min(18.5rem,88vw)] flex-col overflow-y-auto bg-ink text-paper shadow-2xl transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] lg:hidden ${
            open ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="border-b border-white/10 bg-paper px-5 py-4">
            <BrandLogo variant="lockup" align="left" className="h-11 w-[13.5rem]" />
          </div>
          <p className="px-6 pt-6 pb-3 text-[11px] tracking-[0.28em] text-gold uppercase">Menu</p>
          <NavList pathname={pathname} onNavigate={() => setOpen(false)} />
          <div className="mt-auto border-t border-white/10 px-6 py-6 text-xs text-paper/55">
            {email ? <p className="mb-3 truncate">{email}</p> : null}
            <form action={logoutAction}>
              <button type="submit" className="inline-flex items-center gap-2 text-paper/70 hover:text-gold">
                <LogOut className="h-3.5 w-3.5" />
                Log out
              </button>
            </form>
            {showWebsiteLink ? (
              <a
                href={websiteUrl}
                target={websiteUrl.startsWith("http") ? "_blank" : undefined}
                rel={websiteUrl.startsWith("http") ? "noopener noreferrer" : undefined}
                className="mt-3 inline-flex items-center gap-2 text-paper/70 hover:text-gold"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                View website
              </a>
            ) : null}
          </div>
        </aside>

        <main ref={mainRef} className="admin-main min-w-0 flex-1 overflow-x-hidden overflow-y-auto">
          <AdminNotice />
          <div key={pathname} className="admin-page-enter p-4 sm:p-6 lg:p-10">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
