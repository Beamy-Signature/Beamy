import Link from "next/link";
import { AuthShell, authInputClass } from "@/components/admin/AuthShell";
import { loginAction } from "@/lib/admin/actions";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; next?: string; notice?: string }>;
}) {
  const { error, next, notice } = await searchParams;
  const configured = isSupabaseConfigured();

  return (
    <AuthShell title="Sign in">
      <p className="mt-4 text-sm text-muted">A quiet space to keep the BEAMY collection current.</p>
      {!configured ? (
        <p className="mt-6 text-sm leading-6 text-gold">
          The catalogue is running on this computer for now, so you can go straight in.{" "}
          <Link href="/admin" className="underline">
            Open the catalogue
          </Link>
          .
        </p>
      ) : (
        <>
          {notice === "check-email" ? (
            <p className="mt-6 text-sm leading-6 text-gold">
              Please check your email to confirm this account, then sign in.
            </p>
          ) : null}
          {notice === "reset-sent" ? (
            <p className="mt-6 text-sm leading-6 text-gold">
              If that email is in the catalogue, a reset link is on its way.
            </p>
          ) : null}
          <form action={loginAction} className="mt-8 space-y-4">
            <input type="hidden" name="next" value={next || "/admin"} />
            <label className="block text-sm">
              Email
              <input name="email" type="email" required className={authInputClass} />
            </label>
            <label className="block text-sm">
              Password
              <input name="password" type="password" required className={authInputClass} />
            </label>
            {error ? <p className="text-sm text-gold">{error}</p> : null}
            <button type="submit" className="admin-primary w-full">
              Sign in
            </button>
          </form>
          <div className="mt-6 flex flex-col gap-2 text-sm">
            <Link href="/admin/forgot-password" className="underline">
              Forgot password?
            </Link>
            <Link href="/admin/signup" className="underline">
              Create a catalogue account
            </Link>
          </div>
        </>
      )}
    </AuthShell>
  );
}
