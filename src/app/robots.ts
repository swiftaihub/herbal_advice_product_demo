import type { MetadataRoute } from "next";

import { absoluteUrl } from "@/lib/utils";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/api/",
        "/en/account",
        "/en/cart",
        "/en/checkout",
        "/en/create-account",
        "/en/forgot-password",
        "/en/sign-in",
        "/zh/account",
        "/zh/cart",
        "/zh/checkout",
        "/zh/create-account",
        "/zh/forgot-password",
        "/zh/sign-in",
      ],
    },
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
