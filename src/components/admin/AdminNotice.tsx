"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { ADMIN_NOTICES, isAdminNotice } from "@/lib/admin/notices";

function AdminNoticeInner() {
  const params = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const key = params.get("notice");
  const [message, setMessage] = useState("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!isAdminNotice(key)) return;
    setMessage(ADMIN_NOTICES[key]);
    setOpen(true);
    const next = new URLSearchParams(params.toString());
    next.delete("notice");
    const query = next.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
    const timer = window.setTimeout(() => setOpen(false), 4500);
    return () => window.clearTimeout(timer);
  }, [key, params, pathname, router]);

  if (!open || !message) return null;

  return (
    <div className="admin-toast" role="status">
      <p className="font-serif text-xl text-ink">Done</p>
      <p className="mt-2 text-sm leading-6 text-muted">{message}</p>
      <button type="button" className="mt-4 text-sm underline" onClick={() => setOpen(false)}>
        Close
      </button>
    </div>
  );
}

export function AdminNotice() {
  return (
    <Suspense fallback={null}>
      <AdminNoticeInner />
    </Suspense>
  );
}
