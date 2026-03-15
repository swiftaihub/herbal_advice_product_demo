import type { Metadata } from "next";

import { AuthForm } from "@/components/forms/auth-form";
import { LocaleLink } from "@/components/layout/locale-link";
import { Badge } from "@/components/ui/badge";
import { getMessages } from "@/i18n/messages";
import { buildMetadata } from "@/lib/seo";
import type { Locale } from "@/lib/types";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const typedLocale = locale as Locale;
  const copy = getMessages(typedLocale);

  return buildMetadata({
    locale: typedLocale,
    pathname: "/sign-in",
    title: copy.navigation.signIn,
    description: copy.auth.signInBody,
  });
}

export default async function SignInPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const typedLocale = locale as Locale;
  const copy = getMessages(typedLocale);

  return (
    <div className="page-section py-14 md:py-20">
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <section className="space-y-6 rounded-[2.75rem] border border-[rgba(111,89,64,0.12)] bg-white/80 p-8 shadow-[0_18px_48px_rgba(24,21,17,0.06)] md:p-10">
          <Badge>{copy.navigation.signIn}</Badge>
          <h1 className="font-display text-5xl text-[var(--color-ink)] md:text-6xl">
            {copy.auth.signInTitle}
          </h1>
          <p className="max-w-xl text-base leading-8 text-[var(--color-copy)]">
            {copy.auth.signInBody}
          </p>
          <div className="space-y-3 text-sm leading-7 text-[var(--color-copy)]">
            <p>{copy.auth.forgotLink}</p>
            <LocaleLink href="/forgot-password" locale={typedLocale} className="text-[var(--color-accent)] underline underline-offset-4">
              {copy.navigation.forgotPassword}
            </LocaleLink>
          </div>
          <p className="text-sm text-[var(--color-muted)]">
            {copy.auth.noAccount}{" "}
            <LocaleLink href="/create-account" locale={typedLocale} className="text-[var(--color-ink)] underline underline-offset-4">
              {copy.navigation.createAccount}
            </LocaleLink>
          </p>
        </section>
        <AuthForm mode="sign-in" copy={copy.auth} />
      </div>
    </div>
  );
}
