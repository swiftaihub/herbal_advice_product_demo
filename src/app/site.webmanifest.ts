import type { MetadataRoute } from "next";

import { toSitePath } from "@/lib/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Herbal Atelier",
    short_name: "Herbal Atelier",
    description: "Premium bilingual herbal wellness tea storefront.",
    start_url: toSitePath("/en"),
    display: "standalone",
    background_color: "#f8f3eb",
    theme_color: "#f8f3eb",
    icons: [
      {
        src: toSitePath("/images/brand/logo-mark.png"),
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
