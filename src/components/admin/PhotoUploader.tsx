"use client";

import Image from "next/image";
import { useState } from "react";
import { AdminField } from "@/components/admin/AdminField";
import { friendlyUploadError } from "@/lib/friendly-error";
import { showAdminPopup } from "@/lib/admin/popup";
import {
  bucketFor,
  contentTypeFor,
  filenameFor,
  isImageFile,
  MAX_UPLOAD_BYTES,
  storagePathFor,
} from "@/lib/admin/upload";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";

type Photo = { id?: string; url: string; alt: string };

async function readUploadResponse(response: Response) {
  const text = await response.text();
  try {
    return JSON.parse(text) as { url?: string; error?: string };
  } catch {
    throw new Error(friendlyUploadError(text || `Upload failed with ${response.status}`));
  }
}

async function uploadThroughApi(file: File, folder: string) {
  const body = new FormData();
  body.append("file", file);
  body.append("folder", folder);
  const response = await fetch("/api/upload", { method: "POST", body });
  const data = await readUploadResponse(response);
  if (!response.ok || !data.url) {
    throw new Error(friendlyUploadError(data.error || `Upload failed with ${response.status}`));
  }
  return data.url;
}

async function uploadToStorage(file: File, folder: string) {
  const supabase = createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) {
    throw new Error("Please sign in again, then add the photo.");
  }
  const filename = filenameFor(file);
  const storagePath = storagePathFor(folder, filename);
  const bucket = bucketFor(folder);
  const { error } = await supabase.storage.from(bucket).upload(storagePath, file, {
    contentType: contentTypeFor(file),
    upsert: false,
  });
  if (error) throw new Error(friendlyUploadError(error.message));
  const { data } = supabase.storage.from(bucket).getPublicUrl(storagePath);
  return data.publicUrl;
}

async function uploadPhoto(file: File, folder: string) {
  if (!isImageFile(file)) {
    throw new Error("Please choose a photo. Any image from your phone or computer will do.");
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    throw new Error("That photo is a little large. Please keep it under 10MB.");
  }
  if (isSupabaseConfigured()) {
    return uploadToStorage(file, folder);
  }
  return uploadThroughApi(file, folder);
}

export function PhotoUploader({
  name = "image_url",
  altName = "image_alt",
  folder = "designs",
  value,
  multiple = false,
  label = "Photos",
  description = "Any photo from your phone or computer, up to 10MB.",
  onUploaded,
  showList = true,
}: {
  name?: string;
  altName?: string;
  folder?: string;
  value?: Photo[];
  multiple?: boolean;
  label?: string;
  description?: string;
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
        const url = await uploadPhoto(file, folder);
        uploaded.push({ url, alt: file.name.replace(/\.[^.]+$/, "") });
      }
      setPhotos((current) => {
        const next = multiple ? [...current, ...uploaded] : uploaded.slice(0, 1);
        onUploaded?.(uploaded);
        return next;
      });
      showAdminPopup(
        uploaded.length > 1 ? "Photos added" : "Photo added",
        uploaded.length > 1
          ? "Those photographs are ready. Save this page so they stay on the website."
          : "That photograph is ready. Save this page so it stays on the website.",
      );
    } catch (err) {
      setError(friendlyUploadError(err instanceof Error ? err.message : "We couldn’t add that photo just now."));
    } finally {
      setBusy(false);
    }
  }

  return (
    <AdminField label={label} description={description}>
      <label className="flex cursor-pointer flex-col items-center justify-center border border-dashed border-line bg-paper px-4 py-8 text-center">
        <span className="text-sm">
          {busy ? "Adding your photo…" : "Tap to add photos from your phone or computer"}
        </span>
        <span className="mt-1 text-xs text-muted">Any image type · up to 10MB</span>
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
              <input type="hidden" name="image_id" value={photo.id ?? ""} />
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
    </AdminField>
  );
}
