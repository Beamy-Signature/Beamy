"use client";

import { BareSiteFrame, ErrorCopy } from "@/components/site/ErrorCopy";

export default function ErrorPage({
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <BareSiteFrame>
      <ErrorCopy reset={reset} />
    </BareSiteFrame>
  );
}
