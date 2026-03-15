import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { defaultLocale, isLocale, localeCookieName } from "@/i18n/config";

export function proxy(request: NextRequest) {
  const basePath = request.nextUrl.basePath || "";
  const pathname = request.nextUrl.pathname.startsWith(basePath)
    ? request.nextUrl.pathname.slice(basePath.length) || "/"
    : request.nextUrl.pathname;

  if (pathname.startsWith("/_next") || pathname.includes(".")) {
    return NextResponse.next();
  }

  const pathnameHasLocale = pathname
    .split("/")
    .filter(Boolean)
    .some((segment, index) => index === 0 && isLocale(segment));

  if (pathnameHasLocale) {
    return NextResponse.next();
  }

  const cookieLocale = request.cookies.get(localeCookieName)?.value;
  const locale = cookieLocale && isLocale(cookieLocale) ? cookieLocale : defaultLocale;

  const nextUrl = request.nextUrl.clone();
  nextUrl.pathname =
    pathname === "/"
      ? `${basePath}/${locale}`
      : `${basePath}/${locale}${pathname}`;

  return NextResponse.redirect(nextUrl);
}

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
