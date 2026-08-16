"use client";

export default function ErrorPage({
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center px-5 text-center">
      <h1 className="editorial-title text-4xl">Something went wrong</h1>
      <button
        onClick={reset}
        className="mt-6 border border-ink px-5 py-3 text-[11px] tracking-[0.18em] uppercase"
      >
        Try again
      </button>
    </div>
  );
}
