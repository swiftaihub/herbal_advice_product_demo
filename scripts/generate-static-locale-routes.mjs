import fs from "node:fs";
import path from "node:path";

const repoRoot = process.cwd();
const sharedRoot = path.join(repoRoot, "src", "app-internal", "localized");
const appRoot = path.join(repoRoot, "src", "app");
const articlesRoot = path.join(repoRoot, "content", "articles");
const productsFile = path.join(repoRoot, "products.json");
const ingredientsFile = path.join(repoRoot, "ingredients.json");
const locales = ["en", "zh"];

const routeDefinitions = [
  { kind: "layout", source: "layout.tsx", target: "layout.tsx" },
  { kind: "loading", source: "loading.tsx", target: "loading.tsx" },
  { kind: "page", source: "page.tsx", target: "page.tsx" },
  { kind: "page", source: "about/page.tsx", target: "about/page.tsx" },
  { kind: "page", source: "account/page.tsx", target: "account/page.tsx" },
  { kind: "page", source: "ai-guide/page.tsx", target: "ai-guide/page.tsx" },
  { kind: "page", source: "articles/page.tsx", target: "articles/page.tsx" },
  { kind: "page", source: "cart/page.tsx", target: "cart/page.tsx" },
  { kind: "page", source: "checkout/page.tsx", target: "checkout/page.tsx" },
  { kind: "page", source: "contact/page.tsx", target: "contact/page.tsx" },
  {
    kind: "page",
    source: "create-account/page.tsx",
    target: "create-account/page.tsx",
  },
  {
    kind: "page",
    source: "disclaimer/page.tsx",
    target: "disclaimer/page.tsx",
  },
  { kind: "page", source: "faq/page.tsx", target: "faq/page.tsx" },
  {
    kind: "page",
    source: "forgot-password/page.tsx",
    target: "forgot-password/page.tsx",
  },
  {
    kind: "page",
    source: "ingredients/page.tsx",
    target: "ingredients/page.tsx",
  },
  {
    kind: "page",
    source: "privacy/page.tsx",
    target: "privacy/page.tsx",
  },
  { kind: "page", source: "shop/page.tsx", target: "shop/page.tsx" },
  {
    kind: "page",
    source: "sign-in/page.tsx",
    target: "sign-in/page.tsx",
  },
  { kind: "page", source: "terms/page.tsx", target: "terms/page.tsx" },
];

const slugRouteDefinitions = [
  {
    source: "articles/[slug]/page.tsx",
    targetBase: "articles",
    getSlugs: getArticleSlugs,
  },
  {
    source: "ingredients/[slug]/page.tsx",
    targetBase: "ingredients",
    getSlugs: getIngredientSlugs,
  },
  {
    source: "products/[slug]/page.tsx",
    targetBase: "products",
    getSlugs: getProductSlugs,
  },
];

function toAliasPath(relativeFilePath) {
  return `@/app-internal/localized/${relativeFilePath.replace(/\\/g, "/").replace(/\.tsx$/, "")}`;
}

function ensureDirectory(filePath) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
}

function pageWrapper(locale, sourceAlias, includeStaticParams) {
  const imports = [
    `import Impl, { generateMetadata as generateSourceMetadata${
      includeStaticParams
        ? ", generateStaticParams as generateSourceStaticParams"
        : ""
    } } from "${sourceAlias}";`,
    `import { wrapLocaleMetadata, wrapLocalePage${
      includeStaticParams ? ", wrapLocaleStaticParams" : ""
    } } from "@/lib/locale-route-wrappers";`,
  ];

  const exports = [
    `export const dynamic = "force-static";`,
    includeStaticParams ? `export const dynamicParams = false;` : "",
    `export const generateMetadata = wrapLocaleMetadata("${locale}", generateSourceMetadata);`,
    includeStaticParams
      ? `export const generateStaticParams = wrapLocaleStaticParams("${locale}", generateSourceStaticParams);`
      : "",
    `export default wrapLocalePage("${locale}", Impl);`,
  ].filter(Boolean);

  return `${imports.join("\n")}\n\n${exports.join("\n")}\n`;
}

function explicitDetailWrapper(locale, sourceAlias, paramsLiteral) {
  return `import Impl, { generateMetadata as generateSourceMetadata } from "${sourceAlias}";
import { wrapFixedLocaleMetadata, wrapFixedLocalePage } from "@/lib/locale-route-wrappers";

export const dynamic = "force-static";
export const generateMetadata = wrapFixedLocaleMetadata("${locale}", ${paramsLiteral}, generateSourceMetadata);
export default wrapFixedLocalePage("${locale}", ${paramsLiteral}, Impl);
`;
}

function layoutWrapper(locale, sourceAlias) {
  return `import Impl, { generateMetadata as generateSourceMetadata } from "${sourceAlias}";
import { wrapLocaleLayout, wrapLocaleMetadata } from "@/lib/locale-route-wrappers";

export const dynamic = "force-static";
export const generateMetadata = wrapLocaleMetadata("${locale}", generateSourceMetadata);
export default wrapLocaleLayout("${locale}", Impl);
`;
}

function loadingWrapper(sourceAlias) {
  return `export { default } from "${sourceAlias}";
`;
}

function buildWrapperContent(locale, routeDefinition) {
  const sourceAlias = toAliasPath(routeDefinition.source);

  switch (routeDefinition.kind) {
    case "layout":
      return layoutWrapper(locale, sourceAlias);
    case "loading":
      return loadingWrapper(sourceAlias);
    case "slug-page":
      return pageWrapper(locale, sourceAlias, true);
    case "page":
      return pageWrapper(locale, sourceAlias, false);
    default:
      throw new Error(`Unsupported route definition kind: ${routeDefinition.kind}`);
  }
}

function verifySharedSources() {
  for (const routeDefinition of routeDefinitions) {
    const fullPath = path.join(sharedRoot, routeDefinition.source);
    if (!fs.existsSync(fullPath)) {
      throw new Error(`Missing shared locale source: ${fullPath}`);
    }
  }

  for (const routeDefinition of slugRouteDefinitions) {
    const fullPath = path.join(sharedRoot, routeDefinition.source);
    if (!fs.existsSync(fullPath)) {
      throw new Error(`Missing shared locale source: ${fullPath}`);
    }
  }
}

function getArticleSlugs() {
  return fs
    .readdirSync(articlesRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();
}

function getIngredientSlugs() {
  const ingredients = JSON.parse(fs.readFileSync(ingredientsFile, "utf8"));

  return ingredients.map((ingredient) => ingredient.slug).sort();
}

function getProductSlugs() {
  const products = JSON.parse(fs.readFileSync(productsFile, "utf8"));

  return products
    .filter((product) => product.status === "active")
    .map((product) => product.slug)
    .sort();
}

function main() {
  verifySharedSources();

  for (const locale of locales) {
    const localeRoot = path.join(appRoot, locale);
    fs.rmSync(localeRoot, { recursive: true, force: true });

    for (const routeDefinition of routeDefinitions) {
      const outputPath = path.join(localeRoot, routeDefinition.target);
      ensureDirectory(outputPath);
      fs.writeFileSync(outputPath, buildWrapperContent(locale, routeDefinition), "utf8");
    }

    for (const routeDefinition of slugRouteDefinitions) {
      const sourceAlias = toAliasPath(routeDefinition.source);

      for (const slug of routeDefinition.getSlugs()) {
        const outputPath = path.join(localeRoot, routeDefinition.targetBase, slug, "page.tsx");
        const paramsLiteral = JSON.stringify({ slug });

        ensureDirectory(outputPath);
        fs.writeFileSync(
          outputPath,
          explicitDetailWrapper(locale, sourceAlias, paramsLiteral),
          "utf8",
        );
      }
    }
  }
}

main();
