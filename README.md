# Herbal Atelier Frontend

Production-ready standalone bilingual herbal wellness tea storefront built with Next.js App Router, TypeScript, Tailwind CSS, and a filesystem-driven article content system.

## What is included

- Premium bilingual Chinese / English storefront
- Data-driven shop and product detail pages from `products.json`
- Data-driven ingredient library from `ingredients.json`
- Markdown-first article system from `content/articles/**`
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
- Filesystem article discovery with schema validation

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

The unprefixed root route is a static locale chooser. Canonical public pages live under locale-prefixed routes only.

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
  File-based bilingual article content discovered directly from locale files

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
  en.mdx
  zh.mdx
```

`.md` and `.mdx` are both supported. The folder name becomes the article slug automatically, so adding a new article never requires route registration, imports, or page code edits.

Each locale file uses frontmatter plus a Markdown body. Example `en.mdx`:

```md
---
title: "My New Article"
excerpt: "A short summary for cards, listings, and SEO."
category: "Daily wellness"
tags:
  - Morning rhythm
  - Ritual
coverImage: /images/articles/example.jpg
featured: false
publishedAt: 2026-03-14
updatedAt: 2026-03-16
readingTheme: serif
relatedProducts:
  - zaoxi-vitality-tea
relatedIngredients:
  - astragalus
seoTitle: "My New Article"
seoDescription: "A longer SEO summary if needed."
link: https://tea.swiftaihub.com/en/articles/my-new-article
---

## A real article heading

Write normal Markdown here.

- Lists
- Tables
- Images
- Inline links

> Callouts can be written as blockquotes or richer HTML blocks.

<aside data-callout="info">
  <p>Trusted repo content can use semantic HTML for richer layouts.</p>
</aside>
```

Required frontmatter fields:

- `title`
- `excerpt`
- `category`
- `coverImage`
- `publishedAt`

Optional frontmatter fields:

- `tags`
- `featured`
- `updatedAt`
- `readingTheme`
- `relatedProducts`
- `relatedIngredients`
- `seoTitle`
- `seoDescription`
- `link`

Supported body features:

- Headings, paragraphs, emphasis, strong text, and inline links
- Ordered and unordered lists
- Blockquotes and callout-style HTML blocks
- Tables via GitHub Flavored Markdown
- Inline and block code
- Images and figures
- Details/summary sections
- Semantic HTML for richer layouts, spacing, and content emphasis

No code changes are required when adding a correctly structured article folder. `npm run build` regenerates locale routes, validates frontmatter, and picks up every article automatically.

## Cloudflare deployment

Cloudflare-specific deployment and production hardening notes live in `docs/cloudflare-hardening.md`.

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

For LAN device testing in development, you can optionally allow extra dev origins:

```bash
NEXT_ALLOWED_DEV_ORIGINS=192.168.1.179,my-dev-host.local
```

The app already auto-allows `localhost`, `127.0.0.1`, and the machine's detected local IPv4 addresses.
