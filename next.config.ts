import type { NextConfig } from "next";

const configuredSiteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.trim() || "https://example.com";
const parsedSiteUrl = new URL(configuredSiteUrl);
const basePath =
  parsedSiteUrl.pathname !== "/" ? parsedSiteUrl.pathname.replace(/\/+$/, "") : "";

const nextConfig: NextConfig = {
  basePath,
  images: {
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
