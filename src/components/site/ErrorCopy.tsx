"use client";

import Link from "next/link";
import { BrandLogo } from "@/components/brand/BrandLogo";

export function ErrorCopy({ reset }: { reset: () => void }) {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center px-5 text-center">
      <p className="text-[11px] tracking-[0.28em] text-gold uppercase">A moment, please</p>
      <h1 className="editorial-title mt-4 text-4xl md:text-5xl">This page needs a little pause.</h1>
      <p className="mt-4 max-w-md text-muted">
        Something interrupted the page. Your bag is safe. Please try again, or browse the collections while we settle.
      </p>
      <div className="mt-8 flex w-full max-w-sm flex-col gap-3 sm:max-w-none sm:flex-row sm:flex-wrap sm:justify-center">
        <button
          type="button"
          onClick={reset}
          className="border border-ink bg-ink px-5 py-3 text-[11px] tracking-[0.18em] text-paper uppercase"
        >
          Try again
        </button>
        <Link href="/collections" className="border border-ink px-5 py-3 text-[11px] tracking-[0.18em] uppercase">
          Browse collections
        </Link>
      </div>
    </div>
  );
}

export function BareSiteFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-full max-w-full flex-col overflow-x-clip bg-background text-foreground">
      <header className="sticky top-0 z-50 border-b border-line/70 bg-paper/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-2 px-4 py-3 sm:gap-4 sm:px-5 md:px-8">
          <Link href="/" className="min-w-0">
            <BrandLogo
              variant="lockup"
              align="left"
              priority
              className="h-9 w-[clamp(8.75rem,42vw,13.5rem)] sm:h-11 sm:w-[13.5rem] md:h-14 md:w-[17.5rem]"
            />
          </Link>
          <nav className="hidden items-center gap-7 lg:flex">
            <Link href="/collections" className="text-[11px] tracking-[0.22em] uppercase">
              Collections
            </Link>
            <Link href="/contact" className="text-[11px] tracking-[0.22em] uppercase">
              Contact
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="border-t border-line bg-ink px-5 py-5 text-center text-[10px] leading-relaxed tracking-[0.1em] text-paper/40 uppercase sm:text-[11px] sm:tracking-[0.16em]">
        © {new Date().getFullYear()} BEAMY. All rights reserved.
      </footer>
    </div>
  );
}
