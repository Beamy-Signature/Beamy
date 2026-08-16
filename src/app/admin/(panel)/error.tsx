"use client";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="max-w-lg">
      <h1 className="font-serif text-3xl">Something went wrong</h1>
      <p className="mt-3 text-sm text-muted">{error.message}</p>
      <button onClick={reset} className="mt-6 border border-ink px-4 py-2 text-sm">
        Try again
      </button>
    </div>
  );
}
