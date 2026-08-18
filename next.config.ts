import type { NextConfig } from "next";

const appTarget = process.env.APP_TARGET || process.env.NEXT_PUBLIC_APP_TARGET || "all";

const nextConfig: NextConfig = {
  env: {
    APP_TARGET: appTarget,
    NEXT_PUBLIC_APP_TARGET: process.env.NEXT_PUBLIC_APP_TARGET || appTarget,
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
    proxyClientMaxBodySize: "10mb",
  },
  images: {
    unoptimized: process.env.NODE_ENV === "development",
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "**.supabase.co",
      },
    ],
  },
};

export default nextConfig;
