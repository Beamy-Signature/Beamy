"use client";

import { friendlySaveError } from "@/lib/friendly-error";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="max-w-lg">
      <p className="text-[11px] tracking-[0.28em] text-gold uppercase">BEAMY Catalogue</p>
      <h1 className="mt-3 font-serif text-3xl">We could not finish that just now.</h1>
      <div className="gold-rule mt-4" />
      <p className="mt-4 text-sm leading-6 text-muted">{friendlySaveError(error.message)}</p>
      <button onClick={reset} className="admin-primary mt-6">
        Try again
      </button>
    </div>
  );
}
