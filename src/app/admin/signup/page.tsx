import Link from "next/link";
import { AuthShell, authInputClass } from "@/components/admin/AuthShell";
import { PasswordField } from "@/components/admin/PasswordField";
import { signupAction } from "@/lib/admin/actions";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const configured = isSupabaseConfigured();

  return (
    <AuthShell title="Create an account">
      <p className="mt-4 text-sm text-muted">
        Anyone with an account can keep the BEAMY catalogue current.
      </p>
      {!configured ? (
        <p className="mt-6 text-sm leading-6 text-gold">
          Sign up is available once the live catalogue is connected.{" "}
          <Link href="/admin" className="underline">
            Open the catalogue
          </Link>
          .
        </p>
      ) : (
        <form action={signupAction} className="mt-8 space-y-4">
          <label className="block text-sm">
            Email
            <input name="email" type="email" required autoComplete="email" className={authInputClass} />
          </label>
          <PasswordField name="password" label="Password" required minLength={8} autoComplete="new-password" />
          <PasswordField name="confirm" label="Confirm password" required minLength={8} autoComplete="new-password" />
          {error ? <p className="text-sm text-gold">{error}</p> : null}
          <button type="submit" className="admin-primary w-full">
            Create account
          </button>
        </form>
      )}
      <p className="mt-6 text-sm">
        Already have an account?{" "}
        <Link href="/admin/login" className="underline">
          Sign in
        </Link>
      </p>
    </AuthShell>
  );
}
