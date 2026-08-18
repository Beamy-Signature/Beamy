"use client";

import { ErrorCopy } from "@/components/site/ErrorCopy";

export default function SiteError({
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return <ErrorCopy reset={reset} />;
}
