export const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;

const IMAGE_EXTENSIONS = /\.(jpe?g|png|gif|webp|avif|heic|heif|bmp|tiff?|svg|ico|jfif|jxl|tif)$/i;

export function bucketFor(folder: string) {
  if (folder === "collections") return "collection-images";
  if (folder === "testimonials") return "testimonial-images";
  if (folder === "hero" || folder === "gallery") return "hero-images";
  return "product-images";
}

export function storagePathFor(folder: string, filename: string) {
  return folder === "gallery" ? `gallery/${filename}` : filename;
}

export function isImageFile(file: File) {
  if (file.type.startsWith("image/")) return true;
  if (file.type && file.type !== "application/octet-stream") return false;
  return IMAGE_EXTENSIONS.test(file.name);
}

export function contentTypeFor(file: File) {
  if (file.type && file.type !== "application/octet-stream") return file.type;
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
  const map: Record<string, string> = {
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    jfif: "image/jpeg",
    png: "image/png",
    gif: "image/gif",
    webp: "image/webp",
    avif: "image/avif",
    heic: "image/heic",
    heif: "image/heif",
    bmp: "image/bmp",
    tif: "image/tiff",
    tiff: "image/tiff",
    svg: "image/svg+xml",
    ico: "image/x-icon",
    jxl: "image/jxl",
  };
  return map[ext] || "application/octet-stream";
}

export function filenameFor(file: File) {
  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const safeExt = ext.replace(/[^a-z0-9]/g, "") || "jpg";
  return `${Date.now()}-${crypto.randomUUID()}.${safeExt}`;
}
