import { type NextRequest, NextResponse } from "next/server";
import { getAppTarget } from "@/lib/app-target";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  const target = getAppTarget();
  const { pathname } = request.nextUrl;
  const isAdminPath = pathname.startsWith("/admin");
  const isApiPath = pathname.startsWith("/api");
  const isAuthCallback = pathname === "/auth/callback" || pathname.startsWith("/auth/callback/");
  const isMetaPath = pathname === "/robots.txt" || pathname === "/sitemap.xml";

  if (target === "web" && isAdminPath) {
    return NextResponse.rewrite(new URL("/not-found", request.url));
  }

  if (target === "admin" && !isAdminPath && !isApiPath && !isMetaPath && !isAuthCallback) {
    const url = request.nextUrl.clone();
    const hasAuthParams =
      url.searchParams.has("code") || url.searchParams.has("token_hash");
    if (hasAuthParams) {
      url.pathname = "/admin/auth/callback";
      return NextResponse.redirect(url);
    }
    url.pathname = "/admin";
    url.search = "";
    return NextResponse.redirect(url);
  }

  return updateSession(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|brand/|uploads/|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
