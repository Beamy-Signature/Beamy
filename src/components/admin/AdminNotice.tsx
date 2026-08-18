"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { AdminPopup } from "@/components/admin/AdminPopup";
import { ADMIN_NOTICES, isAdminNotice } from "@/lib/admin/notices";
import { ADMIN_POPUP_EVENT, type AdminPopupDetail } from "@/lib/admin/popup";

function AdminNoticeInner() {
  const params = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const key = params.get("notice");
  const [popup, setPopup] = useState<AdminPopupDetail | null>(null);

  useEffect(() => {
    if (!isAdminNotice(key)) return;
    setPopup(ADMIN_NOTICES[key]);
    const next = new URLSearchParams(params.toString());
    next.delete("notice");
    const query = next.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  }, [key, params, pathname, router]);

  useEffect(() => {
    function onPopup(event: Event) {
      const detail = (event as CustomEvent<AdminPopupDetail>).detail;
      if (!detail?.title) return;
      setPopup(detail);
    }
    window.addEventListener(ADMIN_POPUP_EVENT, onPopup);
    return () => window.removeEventListener(ADMIN_POPUP_EVENT, onPopup);
  }, []);

  if (!popup) return null;

  return (
    <AdminPopup
      title={popup.title}
      message={popup.message}
      onClose={() => setPopup(null)}
    />
  );
}

export function AdminNotice() {
  return (
    <Suspense fallback={null}>
      <AdminNoticeInner />
    </Suspense>
  );
}
