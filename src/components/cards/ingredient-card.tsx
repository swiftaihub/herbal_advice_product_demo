import Image from "next/image";

import { LocaleLink } from "@/components/layout/locale-link";
import { Badge } from "@/components/ui/badge";
import { getContentPath } from "@/lib/content-links";
import type { Ingredient, Locale } from "@/lib/types";

export function IngredientCard({
  ingredient,
  locale,
  label,
}: {
  ingredient: Ingredient;
  locale: Locale;
  label: string;
}) {
  const ingredientHref = getContentPath(ingredient, "ingredients", locale);

  return (
    <article className="group min-w-0 overflow-hidden rounded-[1.55rem] border border-[rgba(111,89,64,0.12)] bg-white/80 shadow-[0_12px_32px_rgba(24,21,17,0.04)] transition duration-300 hover:-translate-y-1 sm:rounded-[2rem]">
      <LocaleLink href={ingredientHref} locale={locale} className="block">
        <div className="relative aspect-[4/3.2] overflow-hidden bg-[var(--color-surface)] sm:aspect-[4/3]">
          <Image
            src={ingredient.images[0]}
            alt={ingredient.name[locale]}
            fill
            className="object-cover transition duration-500 group-hover:scale-[1.03]"
            sizes="(max-width: 640px) 50vw, 33vw"
          />
        </div>
      </LocaleLink>
      <div className="space-y-3 p-4 sm:space-y-4 sm:p-5">
        <Badge>{label}</Badge>
        <div className="min-w-0">
          <h3 className="font-display text-[1.5rem] leading-[1.05] text-[var(--color-ink)] sm:text-3xl">
            {ingredient.name[locale]}
          </h3>
          <p className="mt-2 text-[13px] leading-5 text-[var(--color-copy)] sm:mt-3 sm:text-sm sm:leading-7">
            {ingredient.summary[locale]}
          </p>
        </div>
      </div>
    </article>
  );
}
