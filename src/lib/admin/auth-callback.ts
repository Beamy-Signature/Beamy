import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { friendlyAuthError } from "@/lib/friendly-error";
import { isSupabaseConfigured } from "@/lib/supabase/config";

function safeNext(value: string | null) {
  if (!value || !value.startsWith("/admin")) return "/admin";
  return value;
}

export async function handleAuthCallback(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = safeNext(searchParams.get("next"));
  const fail = new URL("/admin/login", origin);
  fail.searchParams.set(
    "error",
    friendlyAuthError("This sign-in link is no longer valid. Please try again."),
  );

  if (!code || !isSupabaseConfigured()) {
    return NextResponse.redirect(fail);
  }

  const success = NextResponse.redirect(new URL(next, origin));
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          cookiesToSet.forEach(({ name, value, options }) =>
            success.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (!error) return success;
  return NextResponse.redirect(fail);
}
