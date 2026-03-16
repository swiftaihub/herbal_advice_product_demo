import "server-only";

import { cache } from "react";
import { readFile } from "node:fs/promises";
import path from "node:path";

import type { Ingredient } from "@/lib/types";

const ingredientsPath = path.join(process.cwd(), "ingredients.json");

export const getAllIngredients = cache(async () => {
  const file = await readFile(ingredientsPath, "utf8");
  const ingredients = JSON.parse(file) as Ingredient[];

  return ingredients;
});

export async function getIngredientBySlug(slug: string) {
  const ingredients = await getAllIngredients();

  return ingredients.find((ingredient) => ingredient.slug === slug);
}
