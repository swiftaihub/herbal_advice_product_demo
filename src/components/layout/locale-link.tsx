import Link, { type LinkProps } from "next/link";
import type { ReactNode } from "react";

import { withLocale } from "@/i18n/config";
import type { Locale } from "@/lib/types";

interface LocaleLinkProps extends Omit<LinkProps, "href"> {
  href: string;
  locale: Locale;
  className?: string;
  children: ReactNode;
}

export function LocaleLink({
  href,
  locale,
  className,
  children,
  ...props
}: LocaleLinkProps) {
  return (
    <Link href={withLocale(href, locale)} className={className} {...props}>
      {children}
    </Link>
  );
}
