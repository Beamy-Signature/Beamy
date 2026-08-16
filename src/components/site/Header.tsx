"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { CartButton } from "@/components/site/CartDrawer";
import type { SiteSettings } from "@/lib/types";
import { whatsappLink } from "@/lib/whatsapp";

const links = [
  { href: "/collections", label: "Collections" },
  { href: "/collections/men", label: "Men" },
  { href: "/collections/women", label: "Women" },
  { href: "/how-it-works", label: "How it works" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function Header({ settings }: { settings: SiteSettings }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const enquiry = whatsappLink(
    settings.whatsapp_number,
    "Hello BEAMY, I would like to make an enquiry.\n\n",
  );

  return (
    <header className="sticky top-0 z-50 border-b border-line/70 bg-paper/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-3 md:px-8">
        <Link href="/" className="shrink-0" onClick={() => setOpen(false)}>
          <BrandLogo
            variant="lockup"
            align="left"
            priority
            className="h-11 w-[13.5rem] md:h-14 md:w-[17.5rem]"
          />
        </Link>

        <nav className="hidden items-center gap-7 lg:flex">
          {links.map((link) => {
            const active =
              pathname === link.href ||
              (link.href !== "/collections" && pathname.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-[11px] tracking-[0.22em] uppercase transition-colors duration-300 ${
                  active ? "text-foreground" : "text-muted hover:text-foreground"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-1 sm:gap-3">
          <CartButton />
          <a
            href={enquiry}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden border border-ink bg-ink px-4 py-2.5 text-[11px] tracking-[0.18em] text-paper uppercase transition-colors duration-300 hover:bg-transparent hover:text-ink md:inline-flex"
          >
            Chat on WhatsApp
          </a>
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

      <div className={`mobile-panel lg:hidden ${open ? "open" : ""}`}>
        <div>
          <nav className="border-t border-line bg-paper px-5 py-8">
            <div className="flex flex-col gap-5">
              {links.map((link, index) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="mobile-link font-serif text-3xl tracking-tight"
                  style={{ transitionDelay: open ? `${80 + index * 50}ms` : "0ms" }}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/cart"
                onClick={() => setOpen(false)}
                className="mobile-link font-serif text-3xl tracking-tight"
                style={{ transitionDelay: open ? `${80 + links.length * 50}ms` : "0ms" }}
              >
                Bag
              </Link>
              <a
                href={enquiry}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex w-fit border border-ink bg-ink px-5 py-3 text-[11px] tracking-[0.18em] text-paper uppercase"
              >
                Chat on WhatsApp
              </a>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}
