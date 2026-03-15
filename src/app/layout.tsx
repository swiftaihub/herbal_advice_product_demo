import type { Metadata } from "next";
import {
  Cormorant_Garamond,
  Manrope,
  Noto_Sans_SC,
  Noto_Serif_SC,
} from "next/font/google";

import "@/app/globals.css";

import { SiteProviders } from "@/components/providers/site-providers";
import {
  brandDescription,
  brandName,
  siteOrigin,
  toSitePath,
} from "@/lib/site";

const displayEn = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-display-en",
  weight: ["400", "500", "600", "700"],
});

const bodyEn = Manrope({
  subsets: ["latin"],
  variable: "--font-body-en",
});

const displayZh = Noto_Serif_SC({
  variable: "--font-display-zh",
  weight: ["400", "500", "600", "700"],
  preload: false,
});

const bodyZh = Noto_Sans_SC({
  variable: "--font-body-zh",
  weight: ["400", "500", "600", "700"],
  preload: false,
});

export const metadata: Metadata = {
  metadataBase: new URL(siteOrigin),
  title: brandName.en,
  description: brandDescription.en,
  icons: {
    icon: toSitePath("/images/brand/logo-mark.png"),
    shortcut: toSitePath("/images/brand/logo-mark.png"),
    apple: toSitePath("/images/brand/logo-mark.png"),
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${displayEn.variable} ${bodyEn.variable} ${displayZh.variable} ${bodyZh.variable} antialiased`}
      >
        <SiteProviders>{children}</SiteProviders>
      </body>
    </html>
  );
}
