import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { friendlyUploadError } from "@/lib/friendly-error";
import {
  bucketFor,
  contentTypeFor,
  filenameFor,
  isImageFile,
  MAX_UPLOAD_BYTES,
  storagePathFor,
} from "@/lib/admin/upload";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export const runtime = "nodejs";

function jsonError(message: string, status: number) {
  return NextResponse.json({ error: friendlyUploadError(message) }, { status });
}

export async function POST(request: Request) {
  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return jsonError("That photo is a little large. Please keep it under 10MB.", 413);
  }

  const file = formData.get("file");
  const folder = String(formData.get("folder") || "designs");

  if (!(file instanceof File) || file.size === 0) {
    return jsonError("Choose a photo.", 400);
  }
  if (!isImageFile(file)) {
    return jsonError("Please choose a photo.", 400);
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    return jsonError("Keep photos under 10MB.", 400);
  }

  const filename = filenameFor(file);
  const storagePath = storagePathFor(folder, filename);
  const contentType = contentTypeFor(file);

  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return jsonError("Sign in to upload.", 401);
    }
    const bucket = bucketFor(folder);
    const { error } = await supabase.storage.from(bucket).upload(storagePath, file, {
      contentType,
      upsert: false,
    });
    if (error) {
      return jsonError(error.message, 500);
    }
    const { data } = supabase.storage.from(bucket).getPublicUrl(storagePath);
    return NextResponse.json({ url: data.publicUrl });
  }

  const dir = path.join(process.cwd(), "public", "uploads", folder);
  await fs.mkdir(dir, { recursive: true });
  const buffer = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(path.join(dir, filename), buffer);
  return NextResponse.json({ url: `/uploads/${folder}/${filename}` });
}
