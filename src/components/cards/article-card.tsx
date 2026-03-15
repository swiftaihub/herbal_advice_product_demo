import Image from "next/image";

import { LocaleLink } from "@/components/layout/locale-link";
import { Badge } from "@/components/ui/badge";
import type { ArticleMeta, Locale } from "@/lib/types";
import { formatDate } from "@/lib/utils";

export function ArticleCard({
  article,
  locale,
  label,
}: {
  article: ArticleMeta;
  locale: Locale;
  label: string;
}) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-[2rem] border border-[rgba(111,89,64,0.12)] bg-white/82 shadow-[0_12px_34px_rgba(24,21,17,0.05)] transition duration-300 hover:-translate-y-1">
      <LocaleLink href={`/articles/${article.slug}`} locale={locale} className="block">
        <div className="relative aspect-[16/10] overflow-hidden bg-[var(--color-surface)]">
          <Image
            src={article.coverImage}
            alt={article.title[locale]}
            fill
            className="object-cover transition duration-500 group-hover:scale-[1.02]"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        </div>
      </LocaleLink>
      <div className="flex flex-1 flex-col gap-4 p-5">
        <div className="flex items-center justify-between gap-4">
          <Badge>{article.category[locale]}</Badge>
          <span className="text-xs uppercase tracking-[0.16em] text-[var(--color-muted)]">
            {formatDate(article.publishedAt, locale)}
          </span>
        </div>
        <div className="space-y-3">
          <h3 className="font-display text-3xl leading-tight text-[var(--color-ink)]">
            {article.title[locale]}
          </h3>
          <p className="text-sm leading-7 text-[var(--color-copy)]">
            {article.excerpt[locale]}
          </p>
        </div>
        <LocaleLink
          href={`/articles/${article.slug}`}
          locale={locale}
          className="mt-auto text-sm font-medium text-[var(--color-ink)] underline decoration-[rgba(176,136,74,0.4)] underline-offset-4"
        >
          {label}
        </LocaleLink>
      </div>
    </article>
  );
}
