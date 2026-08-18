"use client";

import { useState } from "react";
import { AdminPopup } from "@/components/admin/AdminPopup";

export function ConfirmDelete({
  action,
  id,
  label = "Remove",
  title,
  message,
}: {
  action: (formData: FormData) => void | Promise<void>;
  id: string;
  label?: string;
  title: string;
  message: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button type="button" className="text-sm text-red-800 underline" onClick={() => setOpen(true)}>
        {label}
      </button>
      {open ? (
        <AdminPopup title={title} message={message} onClose={() => setOpen(false)}>
          <div className="mt-8 flex flex-wrap justify-end gap-3">
            <button type="button" className="border border-line px-4 py-2.5 text-sm" onClick={() => setOpen(false)}>
              Keep this
            </button>
            <form action={action}>
              <input type="hidden" name="id" value={id} />
              <button className="bg-ink px-4 py-2.5 text-[11px] tracking-[0.16em] text-paper uppercase">
                {label}
              </button>
            </form>
          </div>
        </AdminPopup>
      ) : null}
    </>
  );
}
