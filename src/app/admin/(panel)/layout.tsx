import { redirect } from "next/navigation";
import { AdminShell } from "@/components/admin/AdminShell";
import { getAppTarget } from "@/lib/app-target";
import { isAllowedAdminEmail } from "@/lib/admin/guard";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { friendlyAuthError } from "@/lib/friendly-error";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const configured = isSupabaseConfigured();
  let email: string | null = null;

  if (configured) {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) redirect("/admin/login");
    if (!isAllowedAdminEmail(user.email)) {
      await supabase.auth.signOut();
      redirect(
        `/admin/login?error=${encodeURIComponent(friendlyAuthError("This account cannot open the catalogue."))}`,
      );
    }
    email = user.email ?? null;
  }

  const target = getAppTarget();
  const websiteUrl = process.env.NEXT_PUBLIC_SITE_URL || "/";
  const showWebsiteLink = target !== "admin" || Boolean(process.env.NEXT_PUBLIC_SITE_URL);

  return (
    <AdminShell
      configured={configured}
      email={email}
      showWebsiteLink={showWebsiteLink}
      websiteUrl={websiteUrl}
    >
      {children}
    </AdminShell>
  );
}
