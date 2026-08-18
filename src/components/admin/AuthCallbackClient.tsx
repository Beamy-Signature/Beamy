"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { AuthShell } from "@/components/admin/AuthShell";
import { createClient } from "@/lib/supabase/client";
import type { EmailOtpType } from "@supabase/supabase-js";

const OTP_TYPES = new Set<EmailOtpType>([
  "signup",
  "invite",
  "magiclink",
  "recovery",
  "email_change",
  "email",
]);

function safeNext(value: string | null, type: string | null) {
  if (type === "recovery") return "/admin/reset-password";
  if (value && value.startsWith("/admin")) return value;
  return "/admin";
}

function isOtpType(value: string | null): value is EmailOtpType {
  return Boolean(value && OTP_TYPES.has(value as EmailOtpType));
}

export function AuthCallbackClient() {
  const router = useRouter();
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;

    const params = new URLSearchParams(window.location.search);
    const hash = new URLSearchParams(window.location.hash.replace(/^#/, ""));
    const code = params.get("code");
    const tokenHash = params.get("token_hash") || hash.get("token_hash");
    const type = params.get("type") || hash.get("type");
    const next = safeNext(params.get("next"), type);
    const confirmedLogin = "/admin/login?notice=confirmed";
    const failLogin = "/admin/login?error=" + encodeURIComponent(
      "This sign-in link is no longer valid. Please try again.",
    );

    async function finish() {
      const supabase = createClient();

      try {
        if (code) {
          await Promise.race([
            supabase.auth.exchangeCodeForSession(code),
            new Promise<never>((_, reject) =>
              window.setTimeout(() => reject(new Error("timeout")), 8000),
            ),
          ]);
        } else if (tokenHash && isOtpType(type)) {
          await Promise.race([
            supabase.auth.verifyOtp({ type, token_hash: tokenHash }),
            new Promise<never>((_, reject) =>
              window.setTimeout(() => reject(new Error("timeout")), 8000),
            ),
          ]);
        }
      } catch {
        // Confirming the email can succeed on Supabase even if this page
        // never finishes exchanging the session. Send them to sign in.
      }

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session && type === "recovery") {
        window.location.replace("/admin/reset-password");
        return;
      }
      if (session) {
        window.location.replace(next);
        return;
      }

      window.location.replace(type === "recovery" ? failLogin : confirmedLogin);
    }

    void finish().catch(() => {
      router.replace(confirmedLogin);
    });
  }, [router]);

  return (
    <AuthShell title="One moment">
      <p className="mt-4 text-sm leading-6 text-muted">
        Confirming your email and opening the catalogue. If this stays here, close the tab and sign in — your email is already confirmed.
      </p>
    </AuthShell>
  );
}
