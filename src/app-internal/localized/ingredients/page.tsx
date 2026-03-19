import type { Metadata } from "next";

import { IngredientCard } from "@/components/cards/ingredient-card";
import { SectionHeading } from "@/components/ui/section-heading";
import { getAllIngredients } from "@/lib/data/ingredients";
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
    pathname: "/ingredients",
    title: copy.navigation.ingredients,
    description: copy.ingredient.title,
  });
}

export default async function IngredientsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const typedLocale = locale as Locale;
  const copy = getMessages(typedLocale);
  const ingredients = await getAllIngredients();

  return (
    <div className="page-section py-10 sm:py-12 md:py-20">
      <div className="mx-auto max-w-7xl space-y-8 md:space-y-10">
        <SectionHeading
          eyebrow={copy.ingredient.eyebrow}
          title={copy.ingredient.title}
          description={copy.home.ingredientsBody}
        />
        <div className="grid gap-4 min-[360px]:grid-cols-2 xl:grid-cols-3 sm:gap-5 xl:gap-6">
          {ingredients.map((ingredient) => (
            <IngredientCard
              key={ingredient.slug}
              ingredient={ingredient}
              locale={typedLocale}
              label={copy.navigation.ingredients}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
