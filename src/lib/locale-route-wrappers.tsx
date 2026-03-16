import type { Metadata } from "next";
import type { ReactNode } from "react";

import type { Locale } from "@/lib/types";

type RouteParams = Record<string, string>;
type ParamsPromise<T extends RouteParams> = Promise<T>;
type WrappedPageProps<T extends RouteParams> = {
  params?: ParamsPromise<T>;
};

type LocaleLayoutComponent = (props: {
  children: ReactNode;
  params: ParamsPromise<{ locale: string }>;
}) => ReactNode | Promise<ReactNode>;

type LocalePageComponent<T extends RouteParams> = (props: {
  params: ParamsPromise<T & { locale: string }>;
}) => ReactNode | Promise<ReactNode>;

type LocaleMetadataFactory<T extends RouteParams> = (props: {
  params: ParamsPromise<T & { locale: string }>;
}) => Metadata | Promise<Metadata>;

function injectLocale<T extends RouteParams>(locale: Locale, params: T) {
  return Promise.resolve({
    ...params,
    locale,
  }) as ParamsPromise<T & { locale: string }>;
}

export function wrapLocaleLayout(locale: Locale, Layout: LocaleLayoutComponent) {
  return function WrappedLocaleLayout({
    children,
  }: {
    children: ReactNode;
  }) {
    return Layout({
      children,
      params: Promise.resolve({ locale }),
    });
  };
}

export function wrapLocalePage<T extends RouteParams = Record<string, never>>(
  locale: Locale,
  Page: LocalePageComponent<T>,
) {
  return async function WrappedLocalePage({
    params,
  }: WrappedPageProps<T> = {}) {
    const resolvedParams = (params ? await params : {}) as T;

    return Page({
      params: injectLocale(locale, resolvedParams),
    });
  };
}

export function wrapLocaleMetadata<T extends RouteParams = Record<string, never>>(
  locale: Locale,
  generateMetadata: LocaleMetadataFactory<T>,
) {
  return async function WrappedLocaleMetadata({
    params,
  }: WrappedPageProps<T> = {}) {
    const resolvedParams = (params ? await params : {}) as T;

    return generateMetadata({
      params: injectLocale(locale, resolvedParams),
    });
  };
}

export function wrapLocaleStaticParams<T extends RouteParams>(
  locale: Locale,
  generateStaticParams: () =>
    | Array<T & Partial<{ locale: string }>>
    | Promise<Array<T & Partial<{ locale: string }>>>,
) {
  return async function WrappedStaticParams() {
    const paramsList = await generateStaticParams();

    return paramsList.flatMap((entry) => {
      if ("locale" in entry && entry.locale && entry.locale !== locale) {
        return [];
      }

      const rest = { ...(entry as T & { locale?: string }) };
      delete rest.locale;

      return [rest as T];
    });
  };
}

export function wrapFixedLocalePage<T extends RouteParams>(
  locale: Locale,
  fixedParams: T,
  Page: LocalePageComponent<T>,
) {
  return function WrappedFixedLocalePage() {
    return Page({
      params: injectLocale(locale, fixedParams),
    });
  };
}

export function wrapFixedLocaleMetadata<T extends RouteParams>(
  locale: Locale,
  fixedParams: T,
  generateMetadata: LocaleMetadataFactory<T>,
) {
  return function WrappedFixedLocaleMetadata() {
    return generateMetadata({
      params: injectLocale(locale, fixedParams),
    });
  };
}
