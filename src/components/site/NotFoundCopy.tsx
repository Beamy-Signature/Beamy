import Link from "next/link";

export function NotFoundCopy() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-5 text-center">
      <p className="text-[11px] tracking-[0.28em] text-gold uppercase">Just missed</p>
      <h1 className="editorial-title mt-4 text-5xl">This page is not in the collection.</h1>
      <p className="mt-4 max-w-md text-muted">
        The piece you are looking for may have been moved, or it is still being made. We would love to help you find the right one — browse the collections, or write to us on WhatsApp.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/" className="border border-ink bg-ink px-5 py-3 text-[11px] tracking-[0.18em] text-paper uppercase">
          Return home
        </Link>
        <Link href="/collections" className="border border-ink px-5 py-3 text-[11px] tracking-[0.18em] uppercase">
          Browse collections
        </Link>
      </div>
    </div>
  );
}
