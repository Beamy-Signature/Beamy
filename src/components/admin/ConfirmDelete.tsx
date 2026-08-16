"use client";

import { useState } from "react";

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
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-ink/50 px-5">
          <div className="w-full max-w-md border border-line bg-paper p-6">
            <h2 className="font-serif text-2xl">{title}</h2>
            <p className="mt-3 text-sm leading-6 text-muted">{message}</p>
            <div className="mt-6 flex justify-end gap-3">
              <button type="button" className="px-4 py-2 text-sm" onClick={() => setOpen(false)}>
                Keep this
              </button>
              <form action={action}>
                <input type="hidden" name="id" value={id} />
                <button className="bg-red-800 px-4 py-2 text-sm text-white">{label}</button>
              </form>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
