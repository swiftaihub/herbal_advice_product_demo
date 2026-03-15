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
    pathname: "/create-account",
    title: copy.navigation.createAccount,
    description: copy.auth.createBody,
  });
}

export default async function CreateAccountPage({
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
          <Badge>{copy.navigation.createAccount}</Badge>
          <h1 className="font-display text-5xl text-[var(--color-ink)] md:text-6xl">
            {copy.auth.createTitle}
          </h1>
          <p className="max-w-xl text-base leading-8 text-[var(--color-copy)]">
            {copy.auth.createBody}
          </p>
          <p className="text-sm text-[var(--color-muted)]">
            {copy.auth.existingAccount}{" "}
            <LocaleLink href="/sign-in" locale={typedLocale} className="text-[var(--color-ink)] underline underline-offset-4">
              {copy.navigation.signIn}
            </LocaleLink>
          </p>
        </section>
        <AuthForm mode="create-account" copy={copy.auth} />
      </div>
    </div>
  );
}
