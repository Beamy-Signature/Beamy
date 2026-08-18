export function getSiteUrl(): string {
  const raw =
    process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
    process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim() ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "");

  if (!raw) return "http://localhost:3000";

  try {
    const url = raw.includes("://") ? new URL(raw) : new URL(`https://${raw}`);
    return url.origin;
  } catch {
    return "http://localhost:3000";
  }
}
