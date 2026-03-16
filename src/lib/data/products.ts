import "server-only";

import { cache } from "react";
import { readFile } from "node:fs/promises";
import path from "node:path";

import type { Product } from "@/lib/types";

const productsPath = path.join(process.cwd(), "products.json");

export const getAllProducts = cache(async () => {
  const file = await readFile(productsPath, "utf8");
  const products = JSON.parse(file) as Product[];

  return products;
});

export async function getActiveProducts() {
  const products = await getAllProducts();

  return products.filter((product) => product.status === "active");
}

export async function getProductBySlug(slug: string) {
  const products = await getAllProducts();

  return products.find((product) => product.slug === slug);
}

export async function getFeaturedProducts() {
  const products = await getActiveProducts();

  return [...products].sort((a, b) => b.price - a.price).slice(0, 4);
}

export async function getRelatedProducts(product: Product, limit = 4) {
  const products = await getActiveProducts();

  return products
    .filter((candidate) => candidate.slug !== product.slug)
    .map((candidate) => {
      const ingredientOverlap = candidate.ingredients.filter((ingredient) =>
        product.ingredients.includes(ingredient),
      ).length;
      const tagOverlap = candidate.benefit_tags.filter((tag) =>
        product.benefit_tags.includes(tag),
      ).length;

      return {
        candidate,
        score: ingredientOverlap * 2 + tagOverlap,
      };
    })
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score || a.candidate.price - b.candidate.price)
    .slice(0, limit)
    .map((entry) => entry.candidate);
}

export async function getProductsByIngredient(ingredientSlug: string) {
  const products = await getActiveProducts();

  return products.filter((product) => product.ingredients.includes(ingredientSlug));
}

export async function getShopTaxonomy() {
  const products = await getActiveProducts();

  return {
    benefitTags: [...new Set(products.flatMap((product) => product.benefit_tags))].sort(),
    constitutions: [
      ...new Set(products.flatMap((product) => product.constitution_types)),
    ].sort(),
    discomforts: [
      ...new Set(products.flatMap((product) => product.recent_discomforts)),
    ].sort(),
  };
}
