import { type NextRequest } from "next/server";
import { handleAuthCallback } from "@/lib/admin/auth-callback";

export async function GET(request: NextRequest) {
  return handleAuthCallback(request);
}
