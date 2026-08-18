import { Suspense } from "react";
import { AuthCallbackClient } from "@/components/admin/AuthCallbackClient";
import { AuthShell } from "@/components/admin/AuthShell";

export const dynamic = "force-dynamic";

function CallbackFallback() {
  return (
    <AuthShell title="One moment">
      <p className="mt-4 text-sm leading-6 text-muted">Confirming your email.</p>
    </AuthShell>
  );
}

export default function AdminAuthCallbackPage() {
  return (
    <Suspense fallback={<CallbackFallback />}>
      <AuthCallbackClient />
    </Suspense>
  );
}
