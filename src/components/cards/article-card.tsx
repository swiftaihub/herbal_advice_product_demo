import Image from "next/image";

import { LocaleLink } from "@/components/layout/locale-link";
import { Badge } from "@/components/ui/badge";
import { getContentPath } from "@/lib/content-links";
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
  const articleHref = getContentPath(article, "articles", locale);

  return (
    <article className="group flex h-full min-w-0 flex-col overflow-hidden rounded-[1.55rem] border border-[rgba(111,89,64,0.12)] bg-white/82 shadow-[0_12px_34px_rgba(24,21,17,0.05)] transition duration-300 hover:-translate-y-1 sm:rounded-[2rem]">
      <LocaleLink href={articleHref} locale={locale} className="block">
        <div className="relative aspect-[16/11.5] overflow-hidden bg-[var(--color-surface)] sm:aspect-[16/10]">
          <Image
            src={article.coverImage}
            alt={article.title}
            fill
            className="object-cover transition duration-500 group-hover:scale-[1.02]"
            sizes="(max-width: 640px) 50vw, 33vw"
          />
        </div>
      </LocaleLink>
      <div className="flex flex-1 flex-col gap-3 p-4 sm:gap-4 sm:p-5">
        <div className="flex items-center justify-between gap-3">
          <Badge>{article.category}</Badge>
          <span className="text-[10px] uppercase tracking-[0.14em] text-[var(--color-muted)] sm:text-xs sm:tracking-[0.16em]">
            {formatDate(article.publishedAt, locale)}
          </span>
        </div>
        <div className="min-w-0 space-y-2.5 sm:space-y-3">
          <h3 className="font-display text-[1.5rem] leading-[1.05] text-[var(--color-ink)] sm:text-3xl">
            {article.title}
          </h3>
          <p className="text-[13px] leading-5 text-[var(--color-copy)] sm:text-sm sm:leading-7">
            {article.excerpt}
          </p>
        </div>
        <LocaleLink
          href={articleHref}
          locale={locale}
          className="mt-auto text-[13px] font-medium text-[var(--color-ink)] underline decoration-[rgba(176,136,74,0.4)] underline-offset-4 sm:text-sm"
        >
          {label}
        </LocaleLink>
      </div>
    </article>
  );
}
