import type { Metadata } from "next";

import { ContactForm } from "@/components/forms/contact-form";
import { Badge } from "@/components/ui/badge";
import { aiGuideUrl, contactEmail } from "@/lib/site";
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
    pathname: "/contact",
    title: copy.navigation.contact,
    description: copy.contact.description,
  });
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const typedLocale = locale as Locale;
  const copy = getMessages(typedLocale);
  const infoRows =
    typedLocale === "zh"
      ? [
          ["客服邮箱", contactEmail],
          ["批发与合作", "studio@herbalatelier.com"],
          ["Helper AI", aiGuideUrl],
        ]
      : [
          ["Support", contactEmail],
          ["Wholesale and partnerships", "studio@herbalatelier.com"],
          ["Helper AI", aiGuideUrl],
        ];

  return (
    <div className="page-section py-14 md:py-20">
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <section className="space-y-6 rounded-[2.75rem] border border-[rgba(111,89,64,0.12)] bg-white/80 p-8 shadow-[0_18px_48px_rgba(24,21,17,0.06)] md:p-10">
          <Badge>{copy.contact.eyebrow}</Badge>
          <h1 className="font-display text-5xl leading-tight text-[var(--color-ink)] md:text-6xl">
            {copy.contact.title}
          </h1>
          <p className="max-w-xl text-base leading-8 text-[var(--color-copy)]">
            {copy.contact.description}
          </p>
          <div className="space-y-3">
            {infoRows.map(([label, value]) => (
              <div
                key={label}
                className="rounded-[1.75rem] bg-[rgba(248,243,235,0.82)] px-5 py-4"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-accent)]">
                  {label}
                </p>
                <p className="mt-2 break-all text-sm leading-7 text-[var(--color-copy)]">
                  {value}
                </p>
              </div>
            ))}
          </div>
        </section>
        <ContactForm copy={copy.contact} />
      </div>
    </div>
  );
}
