"use client";

import Image from "next/image";
import { useState } from "react";
import { PhotoUploader } from "@/components/admin/PhotoUploader";
import { saveHeroImagesAction } from "@/lib/admin/actions";
import type { HeroImage } from "@/lib/types";

export function HeroManager({ images }: { images: HeroImage[] }) {
  const [items, setItems] = useState(images);

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

  return (
    <div className="max-w-3xl">
      <div className="border border-line bg-paper p-5">
        <PhotoUploader
          folder="hero"
          multiple
          showList={false}
          label="Add homepage photos"
          onUploaded={(photos) => {
            setItems((current) => [
              ...current,
              ...photos.map((photo, index) => ({
                id: crypto.randomUUID(),
                url: photo.url,
                alt: photo.alt || "BEAMY homepage image",
                sort_order: current.length + index + 1,
                published: true,
              })),
            ]);
          }}
        />
      </div>

      <form action={saveHeroImagesAction} className="mt-8 space-y-4">
        <input type="hidden" name="payload" value={JSON.stringify(items)} />
        {items.length === 0 ? (
          <p className="text-sm text-muted">The banner is waiting for photographs. Add a few above, then save.</p>
        ) : null}
        {items.map((item, index) => (
          <div key={item.id} className="flex gap-4 border border-line bg-paper p-4">
            <div className="relative h-24 w-20 shrink-0 overflow-hidden bg-line">
              <Image src={item.url} alt={item.alt} fill className="object-cover" sizes="80px" />
            </div>
            <div className="min-w-0 flex-1">
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
              <label className="mt-2 flex items-center gap-2 text-sm">
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
                Show on homepage
              </label>
              <div className="mt-3 flex gap-3 text-sm">
                <button type="button" className="underline" onClick={() => move(index, -1)}>
                  Move up
                </button>
                <button type="button" className="underline" onClick={() => move(index, 1)}>
                  Move down
                </button>
                <button
                  type="button"
                  className="text-red-800 underline"
                  onClick={() => setItems((current) => current.filter((entry) => entry.id !== item.id))}
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        ))}
        <button className="admin-primary">
          Save homepage images
        </button>
      </form>
    </div>
  );
}
