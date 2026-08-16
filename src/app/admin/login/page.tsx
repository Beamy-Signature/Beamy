import Link from "next/link";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { loginAction } from "@/lib/admin/actions";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; next?: string }>;
}) {
  const { error, next } = await searchParams;
  const configured = isSupabaseConfigured();

  return (
    <div className="admin-app relative flex min-h-dvh flex-col items-center justify-center overflow-x-hidden bg-[#efe8dc] px-5 py-12 text-foreground">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-gold via-accent to-gold" />
      <div className="admin-page-enter w-full max-w-sm">
        <BrandLogo variant="lockup" className="mx-auto mb-8 h-14 w-[17.5rem]" />
        <div className="border border-line bg-paper p-6 sm:p-8">
          <p className="text-[11px] tracking-[0.28em] text-gold uppercase">BEAMY Catalogue</p>
          <h1 className="mt-3 font-serif text-3xl">Sign in</h1>
          <div className="gold-rule mt-4" />
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
            <form action={loginAction} className="mt-8 space-y-4">
              <input type="hidden" name="next" value={next || "/admin"} />
              <label className="block text-sm">
                Email
                <input
                  name="email"
                  type="email"
                  required
                  className="mt-2 w-full border border-line bg-white px-3 py-2.5 outline-none focus:border-gold"
                />
              </label>
              <label className="block text-sm">
                Password
                <input
                  name="password"
                  type="password"
                  required
                  className="mt-2 w-full border border-line bg-white px-3 py-2.5 outline-none focus:border-gold"
                />
              </label>
              {error ? <p className="text-sm text-gold">{error}</p> : null}
              <button type="submit" className="admin-primary w-full">
                Sign in
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
