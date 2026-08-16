import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { friendlyUploadError } from "@/lib/friendly-error";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export const runtime = "nodejs";

const ALLOWED = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"];

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get("file");
  const folder = String(formData.get("folder") || "designs");

  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json({ error: friendlyUploadError("Choose a photo.") }, { status: 400 });
  }
  if (!ALLOWED.includes(file.type)) {
    return NextResponse.json({ error: friendlyUploadError("Use a JPG, PNG or WEBP photo.") }, { status: 400 });
  }
  if (file.size > 8 * 1024 * 1024) {
    return NextResponse.json({ error: friendlyUploadError("Keep photos under 8MB.") }, { status: 400 });
  }

  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const filename = `${Date.now()}-${crypto.randomUUID()}.${ext}`;

  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: friendlyUploadError("Sign in to upload.") }, { status: 401 });
    }
    const bucket =
      folder === "collections"
        ? "collection-images"
        : folder === "testimonials"
          ? "testimonial-images"
          : folder === "hero"
            ? "hero-images"
            : "product-images";
    const { error } = await supabase.storage.from(bucket).upload(filename, file, {
      contentType: file.type,
      upsert: false,
    });
    if (error) {
      return NextResponse.json({ error: friendlyUploadError(error.message) }, { status: 500 });
    }
    const { data } = supabase.storage.from(bucket).getPublicUrl(filename);
    return NextResponse.json({ url: data.publicUrl });
  }

  const dir = path.join(process.cwd(), "public", "uploads", folder);
  await fs.mkdir(dir, { recursive: true });
  const buffer = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(path.join(dir, filename), buffer);
  return NextResponse.json({ url: `/uploads/${folder}/${filename}` });
}
