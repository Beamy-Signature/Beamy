"use client";

import Image from "next/image";
import { useState } from "react";

type Photo = { url: string; alt: string };

export function PhotoUploader({
  name = "image_url",
  altName = "image_alt",
  folder = "designs",
  value,
  multiple = false,
  label = "Photos",
  onUploaded,
  showList = true,
}: {
  name?: string;
  altName?: string;
  folder?: string;
  value?: Photo[];
  multiple?: boolean;
  label?: string;
  onUploaded?: (photos: Photo[]) => void;
  showList?: boolean;
}) {
  const [photos, setPhotos] = useState<Photo[]>(value?.filter((item) => item.url) ?? []);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function onFiles(files: FileList | null) {
    if (!files?.length) return;
    setBusy(true);
    setError("");
    try {
      const uploaded: Photo[] = [];
      for (const file of Array.from(files)) {
        const body = new FormData();
        body.append("file", file);
        body.append("folder", folder);
        const response = await fetch("/api/upload", { method: "POST", body });
        const data = (await response.json()) as { url?: string; error?: string };
        if (!response.ok || !data.url) {
          throw new Error(data.error || "We couldn’t add that photo just now. Please try again.");
        }
        uploaded.push({ url: data.url, alt: file.name.replace(/\.[^.]+$/, "") });
      }
      setPhotos((current) => {
        const next = multiple ? [...current, ...uploaded] : uploaded.slice(0, 1);
        onUploaded?.(uploaded);
        return next;
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "We couldn’t add that photo just now. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <p className="mb-2 text-sm">{label}</p>
      <label className="flex cursor-pointer flex-col items-center justify-center border border-dashed border-line bg-paper px-4 py-8 text-center">
        <span className="text-sm">
          {busy ? "Uploading…" : "Tap to add photos from your phone or computer"}
        </span>
        <span className="mt-1 text-xs text-muted">JPG, PNG or WEBP · up to 8MB</span>
        <input
          type="file"
          accept="image/*"
          multiple={multiple}
          className="sr-only"
          onChange={(event) => {
            void onFiles(event.target.files);
            event.target.value = "";
          }}
        />
      </label>
      {error ? <p className="mt-2 text-sm text-red-800">{error}</p> : null}
      {showList && photos.length > 0 ? (
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {photos.map((photo, index) => (
            <div key={`${photo.url}-${index}`} className="relative">
              <input type="hidden" name={name} value={photo.url} />
              <input type="hidden" name={altName} value={photo.alt} />
              <div className="relative aspect-square overflow-hidden bg-line">
                <Image src={photo.url} alt={photo.alt || "Uploaded photo"} fill className="object-cover" sizes="160px" />
              </div>
              <button
                type="button"
                className="mt-1 text-xs text-red-800 underline"
                onClick={() => setPhotos((current) => current.filter((_, i) => i !== index))}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      ) : null}
      {showList && photos.length === 0 ? <input type="hidden" name={name} value="" /> : null}
    </div>
  );
}
