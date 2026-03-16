import os from "node:os";

import type { NextConfig } from "next";

const configuredSiteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.trim() || "https://example.com";
const parsedSiteUrl = new URL(configuredSiteUrl);
const basePath =
  parsedSiteUrl.pathname !== "/" ? parsedSiteUrl.pathname.replace(/\/+$/, "") : "";

function normalizeAllowedDevOrigin(value: string): string | null {
  const trimmed = value.trim();
  if (!trimmed) {
    return null;
  }

  if (trimmed.startsWith("*.")) {
    return trimmed;
  }

  return trimmed.replace(/^https?:\/\//, "").replace(/\/.*$/, "") || null;
}

function getLocalDevOrigins(): string[] {
  const discoveredOrigins = new Set<string>([
    "localhost",
    "127.0.0.1",
    parsedSiteUrl.hostname,
  ]);

  for (const addresses of Object.values(os.networkInterfaces())) {
    for (const address of addresses ?? []) {
      const isIpv4 = address.family === "IPv4";
      if (isIpv4 && !address.internal) {
        discoveredOrigins.add(address.address);
      }
    }
  }

  const configuredOrigins = (process.env.NEXT_ALLOWED_DEV_ORIGINS ?? "")
    .split(",")
    .map(normalizeAllowedDevOrigin)
    .filter((value): value is string => Boolean(value));

  for (const origin of configuredOrigins) {
    discoveredOrigins.add(origin);
  }

  return [...discoveredOrigins];
}

const allowedDevOrigins = getLocalDevOrigins();

const nextConfig: NextConfig = {
  allowedDevOrigins,
  basePath,
  poweredByHeader: false,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;

import('@opennextjs/cloudflare').then(m => m.initOpenNextCloudflareForDev());
