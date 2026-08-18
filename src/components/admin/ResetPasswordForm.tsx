"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AuthShell, authInputClass } from "@/components/admin/AuthShell";
import { createClient } from "@/lib/supabase/client";

export function ResetPasswordForm() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [hasSession, setHasSession] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    void supabase.auth.getUser().then(({ data }) => {
      setHasSession(Boolean(data.user));
      setReady(true);
    });
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY" || session) {
        setHasSession(true);
        setReady(true);
      }
    });
    return () => data.subscription.unsubscribe();
  }, []);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    const form = new FormData(event.currentTarget);
    const password = String(form.get("password") ?? "");
    const confirm = String(form.get("confirm") ?? "");
    if (password.length < 8) {
      setError("Please choose a password of at least 8 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Those passwords do not match. Please try again.");
      return;
    }
    setBusy(true);
    const supabase = createClient();
    const { error: updateError } = await supabase.auth.updateUser({ password });
    setBusy(false);
    if (updateError) {
      setError("We could not update that password just now. Please request a new reset email.");
      return;
    }
    router.replace("/admin?notice=saved");
    router.refresh();
  }

  if (!ready) {
    return (
      <AuthShell title="New password">
        <p className="mt-4 text-sm text-muted">A moment, please.</p>
      </AuthShell>
    );
  }

  if (!hasSession) {
    return (
      <AuthShell title="New password">
        <p className="mt-4 text-sm leading-6 text-muted">
          This reset link has expired, or it has already been used. Please request a new one.
        </p>
        <a href="/admin/forgot-password" className="mt-8 inline-block text-sm underline">
          Send a new reset email
        </a>
      </AuthShell>
    );
  }

  return (
    <AuthShell title="New password">
      <p className="mt-4 text-sm text-muted">Choose a password you will remember for the catalogue.</p>
      <form onSubmit={onSubmit} className="mt-8 space-y-4">
        <label className="block text-sm">
          New password
          <input name="password" type="password" required minLength={8} className={authInputClass} />
        </label>
        <label className="block text-sm">
          Confirm password
          <input name="confirm" type="password" required minLength={8} className={authInputClass} />
        </label>
        {error ? <p className="text-sm text-gold">{error}</p> : null}
        <button type="submit" disabled={busy} className="admin-primary w-full">
          {busy ? "Saving…" : "Save password"}
        </button>
      </form>
    </AuthShell>
  );
}
