"use client";

import Image from "next/image";
import { useState } from "react";
import { AdminField } from "@/components/admin/AdminField";
import { AdminPopup } from "@/components/admin/AdminPopup";
import { PhotoUploader } from "@/components/admin/PhotoUploader";

export type ManagedImage = {
  id: string;
  url: string;
  alt: string;
  sort_order: number;
  published: boolean;
};

export function CmsImageList({
  images,
  action,
  folder,
  emptyCopy,
  saveLabel,
  photoLabel = "Add photos",
  photoDescription = "Any photograph from your phone or computer, up to 10MB. Save the page afterwards so they stay on the website.",
}: {
  images: ManagedImage[];
  action: (formData: FormData) => void | Promise<void>;
  folder: string;
  emptyCopy: string;
  saveLabel: string;
  photoLabel?: string;
  photoDescription?: string;
}) {
  const [items, setItems] = useState(images);
  const [pendingRemove, setPendingRemove] = useState<string | null>(null);

  function move(index: number, direction: -1 | 1) {
    const next = index + direction;
    if (next < 0 || next >= items.length) return;
    setItems((current) => {
      const copy = [...current];
      const [removed] = copy.splice(index, 1);
      copy.splice(next, 0, removed!);
      return copy.map((item, order) => ({ ...item, sort_order: order + 1 }));
    });
  }

  const removing = items.find((item) => item.id === pendingRemove);

  return (
    <div className="max-w-3xl">
      <div className="border border-line bg-paper p-5">
        <PhotoUploader
          folder={folder}
          multiple
          showList={false}
          label={photoLabel}
          description={photoDescription}
          onUploaded={(photos) => {
            setItems((current) => [
              ...current,
              ...photos.map((photo, index) => ({
                id: crypto.randomUUID(),
                url: photo.url,
                alt: photo.alt || "BEAMY photograph",
                sort_order: current.length + index + 1,
                published: true,
              })),
            ]);
          }}
        />
      </div>

      <form action={action} className="mt-8 space-y-4">
        <input type="hidden" name="payload" value={JSON.stringify(items)} />
        {items.length === 0 ? <p className="text-sm text-muted">{emptyCopy}</p> : null}
        {items.map((item, index) => (
          <div key={item.id} className="flex gap-4 border border-line bg-paper p-4">
            <div className="relative h-24 w-20 shrink-0 overflow-hidden bg-line">
              <Image src={item.url} alt={item.alt} fill className="object-cover" sizes="80px" />
            </div>
            <div className="min-w-0 flex-1 space-y-3">
              <AdminField
                label="Caption"
                description="A few words describing the photograph, for visitors who cannot see the image."
              >
                <input
                  className="w-full border border-line bg-paper px-3 py-2 text-sm"
                  value={item.alt}
                  onChange={(event) =>
                    setItems((current) =>
                      current.map((entry) =>
                        entry.id === item.id ? { ...entry, alt: event.target.value } : entry,
                      ),
                    )
                  }
                />
              </AdminField>
              <AdminField
                label="Show on the website"
                description="Untick to keep the photograph in this list without showing it publicly."
              >
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={item.published}
                    onChange={(event) =>
                      setItems((current) =>
                        current.map((entry) =>
                          entry.id === item.id ? { ...entry, published: event.target.checked } : entry,
                        ),
                      )
                    }
                  />
                  Show on website
                </label>
              </AdminField>
              <AdminField
                label="Order"
                description="Move this photograph up or down in the rotation."
              >
                <div className="flex flex-wrap gap-3 text-sm">
                  <button type="button" className="underline" onClick={() => move(index, -1)}>
                    Move up
                  </button>
                  <button type="button" className="underline" onClick={() => move(index, 1)}>
                    Move down
                  </button>
                  <button
                    type="button"
                    className="text-red-800 underline"
                    onClick={() => setPendingRemove(item.id)}
                  >
                    Remove
                  </button>
                </div>
              </AdminField>
            </div>
          </div>
        ))}
        <button className="admin-primary">{saveLabel}</button>
      </form>
      {removing ? (
        <AdminPopup
          title="Remove this photograph?"
          message="It will leave this list. Save the page afterwards so the website stays in step."
          onClose={() => setPendingRemove(null)}
        >
          <div className="mt-8 flex flex-wrap justify-end gap-3">
            <button type="button" className="border border-line px-4 py-2.5 text-sm" onClick={() => setPendingRemove(null)}>
              Keep this
            </button>
            <button
              type="button"
              className="bg-ink px-4 py-2.5 text-[11px] tracking-[0.16em] text-paper uppercase"
              onClick={() => {
                setItems((current) => current.filter((entry) => entry.id !== removing.id));
                setPendingRemove(null);
              }}
            >
              Remove
            </button>
          </div>
        </AdminPopup>
      ) : null}
    </div>
  );
}
