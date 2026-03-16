import "server-only";

import { cache } from "react";

import ingredientsData from "../../../ingredients.json";
import type { Ingredient } from "@/lib/types";

export const getAllIngredients = cache(async () => {
  return ingredientsData as Ingredient[];
});

export async function getIngredientBySlug(slug: string) {
  const ingredients = await getAllIngredients();

  return ingredients.find((ingredient) => ingredient.slug === slug);
}
