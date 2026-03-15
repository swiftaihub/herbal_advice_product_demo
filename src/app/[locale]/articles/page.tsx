import type { Metadata } from "next";

import { ArticleCard } from "@/components/cards/article-card";
import { Badge } from "@/components/ui/badge";
import { SectionHeading } from "@/components/ui/section-heading";
import { getAllArticleMeta } from "@/lib/data/articles";
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
    pathname: "/articles",
    title: copy.navigation.articles,
    description: copy.articles.description,
  });
}

export default async function ArticlesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const typedLocale = locale as Locale;
  const copy = getMessages(typedLocale);
  const articles = await getAllArticleMeta();
  const tagSet = [...new Set(articles.flatMap((article) => article.tags[typedLocale]))];

  return (
    <div className="page-section py-14 md:py-20">
      <div className="mx-auto max-w-7xl space-y-10">
        <SectionHeading
          eyebrow={copy.articles.eyebrow}
          title={copy.articles.title}
          description={copy.articles.description}
        />
        <div className="rounded-[2.25rem] border border-[rgba(111,89,64,0.12)] bg-white/80 p-6 shadow-[0_14px_36px_rgba(24,21,17,0.05)]">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-accent)]">
            {copy.articles.tags}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {tagSet.map((tag) => (
              <Badge key={tag}>{tag}</Badge>
            ))}
          </div>
        </div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {articles.map((article) => (
            <ArticleCard
              key={article.slug}
              article={article}
              locale={typedLocale}
              label={copy.common.readArticle}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
