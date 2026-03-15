# Herbal Atelier Frontend

Production-ready standalone bilingual herbal wellness tea storefront built with Next.js App Router, TypeScript, Tailwind CSS, and MDX.

## What is included

- Premium bilingual Chinese / English storefront
- Data-driven shop and product detail pages from `products.json`
- Data-driven ingredient library from `ingredients.json`
- Scalable MDX article system from `content/articles/**`
- Prominent Helper AI integration at `/ai-guide`
- Persistent frontend cart with drawer + cart page
- Sign in, create account, forgot password, and account placeholder pages
- SEO-ready metadata, sitemap, robots, and JSON-LD

## Source of truth

The site is built around these repo files:

- `README.md`
- `project_goal.md`
- `sitemap.md`
- `integration.md`
- `products.json`
- `ingredients.json`
- `public/images/**`

## Stack

- Next.js `16`
- React `19`
- TypeScript
- Tailwind CSS `4`
- App Router
- `next-mdx-remote` for article rendering

## Run locally

```bash
npm install
npm run dev
```

Production validation:

```bash
npm run lint
npm run build
```

## Main routes

- `/en` and `/zh`
- `/[locale]/shop`
- `/[locale]/products/[slug]`
- `/[locale]/ingredients`
- `/[locale]/ingredients/[slug]`
- `/[locale]/articles`
- `/[locale]/articles/[slug]`
- `/[locale]/ai-guide`
- `/[locale]/about`
- `/[locale]/faq`
- `/[locale]/contact`
- `/[locale]/privacy`
- `/[locale]/terms`
- `/[locale]/disclaimer`
- `/[locale]/cart`
- `/[locale]/checkout`
- `/[locale]/sign-in`
- `/[locale]/create-account`
- `/[locale]/forgot-password`
- `/[locale]/account`

Routes without a locale prefix are redirected through `src/proxy.ts`.

## Architecture

- `src/app/`
  App Router pages, layouts, metadata routes, sitemap, robots, manifest
- `src/components/`
  Reusable layout, cart, cards, forms, content, and PDP modules
- `src/lib/`
  Typed data loaders, SEO helpers, taxonomies, utilities, and AI pathway config
- `src/i18n/`
  Locale config and UI dictionaries
- `content/articles/`
  File-based bilingual article content

## Adding products or ingredients

- Add or edit entries in `products.json`
- Add or edit entries in `ingredients.json`
- Place referenced images under `public/images/**`
- Product and ingredient routes will render automatically from the JSON data

Do not invent fields in the UI layer. Extend the source JSON shape first if new fields are needed.

## Adding articles

Create a new folder under `content/articles/`, for example:

```text
content/articles/my-new-article/
  meta.json
  en.mdx
  zh.mdx
```

`meta.json` must include:

- `slug`
- `title`
- `excerpt`
- `category`
- `tags`
- `coverImage`
- `featured`
- `publishedAt`
- `readingTheme`
- `relatedProducts`
- `relatedIngredients`

Example shape:

```json
{
  "slug": "my-new-article",
  "title": { "en": "Title", "zh": "标题" },
  "excerpt": { "en": "Excerpt", "zh": "摘要" },
  "category": { "en": "Category", "zh": "分类" },
  "tags": { "en": ["Tag"], "zh": ["标签"] },
  "coverImage": "/images/articles/example.jpg",
  "featured": false,
  "publishedAt": "2026-03-14",
  "readingTheme": "serif",
  "relatedProducts": ["zaoxi-vitality-tea"],
  "relatedIngredients": ["astragalus"]
}
```

No code changes are required when adding a correctly structured article folder.

## Helper AI integration

Source of truth: `integration.md`

- Dedicated brand route: `/[locale]/ai-guide`
- External Helper AI URL: `https://chat.swiftaihub.com/ui/herbal_advice`
- The existing tool is linked and embedded into the site as the signature recommendation experience

## Site URL

Set this for production metadata/canonical URLs:

```bash
NEXT_PUBLIC_SITE_URL=https://swiftaihub.com/product-page/herbal_tea_demo
```

If unset, the app falls back to `https://example.com`.
