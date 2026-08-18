import { headers } from "next/headers";
import { getSiteUrl } from "@/lib/site-url";

export async function getRequestOrigin() {
  const headerList = await headers();
  const host = headerList.get("x-forwarded-host") || headerList.get("host");
  if (!host) return getSiteUrl();
  const hostname = host.split(",")[0]!.trim();
  const proto =
    headerList.get("x-forwarded-proto") ||
    (hostname.includes("localhost") ? "http" : "https");
  return `${proto}://${hostname}`;
}
