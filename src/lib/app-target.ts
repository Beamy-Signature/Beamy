export type AppTarget = "web" | "admin" | "all";

export function getAppTarget(): AppTarget {
  const value =
    process.env.APP_TARGET || process.env.NEXT_PUBLIC_APP_TARGET || "all";
  if (value === "web" || value === "admin") return value;
  return "all";
}

export function isWebApp() {
  const target = getAppTarget();
  return target === "all" || target === "web";
}

export function isAdminApp() {
  const target = getAppTarget();
  return target === "all" || target === "admin";
}
