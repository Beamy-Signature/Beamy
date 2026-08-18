import Link from "next/link";
import { AuthShell, authInputClass } from "@/components/admin/AuthShell";
import { forgotPasswordAction } from "@/lib/admin/actions";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export default async function ForgotPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const configured = isSupabaseConfigured();

  return (
    <AuthShell title="Forgot password">
      <p className="mt-4 text-sm text-muted">
        Enter the email for your catalogue account. If it is on file, we will send a reset link.
      </p>
      {!configured ? (
        <p className="mt-6 text-sm leading-6 text-gold">
          Password reset is available once the live catalogue is connected.
        </p>
      ) : (
        <form action={forgotPasswordAction} className="mt-8 space-y-4">
          <label className="block text-sm">
            Email
            <input name="email" type="email" required className={authInputClass} />
          </label>
          {error ? <p className="text-sm text-gold">{error}</p> : null}
          <button type="submit" className="admin-primary w-full">
            Send reset email
          </button>
        </form>
      )}
      <p className="mt-6 text-sm">
        <Link href="/admin/login" className="underline">
          Back to sign in
        </Link>
      </p>
    </AuthShell>
  );
}
