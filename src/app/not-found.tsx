import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-5 text-center">
      <p className="text-[11px] tracking-[0.28em] text-gold uppercase">404</p>
      <h1 className="editorial-title mt-4 text-5xl">This page is not in the collection.</h1>
      <p className="mt-4 max-w-md text-muted">The piece you are looking for may have been moved, or is still being made.</p>
      <Link
        href="/"
        className="mt-8 border border-ink px-5 py-3 text-[11px] tracking-[0.18em] uppercase"
      >
        Return home
      </Link>
    </div>
  );
}
