"use client";

export default function ErrorPage({
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center px-5 text-center">
      <p className="text-[11px] tracking-[0.28em] text-gold uppercase">A moment, please</p>
      <h1 className="editorial-title mt-4 text-4xl md:text-5xl">This page needs a little pause.</h1>
      <p className="mt-4 max-w-md text-muted">
        Something interrupted the view. Your bag is safe. Please try again, or browse the collections while we settle.
      </p>
      <button
        onClick={reset}
        className="mt-8 border border-ink px-5 py-3 text-[11px] tracking-[0.18em] uppercase"
      >
        Try again
      </button>
    </div>
  );
}
