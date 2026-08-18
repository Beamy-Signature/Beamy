export function isUsableImageUrl(url?: string | null): url is string {
  if (!url?.trim()) return false;
  const value = url.trim().toLowerCase();
  if (value.includes("unsplash.com")) return false;
  return true;
}

export function usableImageUrl(url?: string | null) {
  return isUsableImageUrl(url) ? url.trim() : null;
}
