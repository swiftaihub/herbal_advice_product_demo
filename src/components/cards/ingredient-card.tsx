import Image from "next/image";

import { LocaleLink } from "@/components/layout/locale-link";
import { Badge } from "@/components/ui/badge";
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
  return (
    <article className="group overflow-hidden rounded-[2rem] border border-[rgba(111,89,64,0.12)] bg-white/80 shadow-[0_12px_32px_rgba(24,21,17,0.04)] transition duration-300 hover:-translate-y-1">
      <LocaleLink href={`/ingredients/${ingredient.slug}`} locale={locale} className="block">
        <div className="relative aspect-[4/3] overflow-hidden bg-[var(--color-surface)]">
          <Image
            src={ingredient.images[0]}
            alt={ingredient.name[locale]}
            fill
            className="object-cover transition duration-500 group-hover:scale-[1.03]"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        </div>
      </LocaleLink>
      <div className="space-y-4 p-5">
        <Badge>{label}</Badge>
        <div>
          <h3 className="font-display text-3xl text-[var(--color-ink)]">
            {ingredient.name[locale]}
          </h3>
          <p className="mt-3 text-sm leading-7 text-[var(--color-copy)]">
            {ingredient.summary[locale]}
          </p>
        </div>
      </div>
    </article>
  );
}
