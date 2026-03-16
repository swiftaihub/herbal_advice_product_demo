import type { ArticleMeta, Locale } from "@/lib/types";

interface ArticleRecord {
  meta: ArticleMeta;
  source: Record<Locale, string>;
}

export const articleRecords: Record<string, ArticleRecord> = {
  "brewing-notes-for-a-lighter-routine": {
    meta: {
      slug: "brewing-notes-for-a-lighter-routine",
      title: {
        en: "Brewing Notes for a Lighter Routine",
        zh: "更轻盈日常的冲泡笔记",
      },
      excerpt: {
        en: "Placeholder editorial content on brewing temperature, pacing, and taste expectations for refined daily tea rituals.",
        zh: "占位编辑内容，围绕冲泡温度、节奏与风味预期，讨论更精致的日常茶饮体验。",
      },
      category: {
        en: "Brewing guide",
        zh: "冲泡指南",
      },
      tags: {
        en: ["Brewing", "Ritual", "Placeholder"],
        zh: ["冲泡", "仪式感", "占位内容"],
      },
      coverImage: "/images/articles/brewing-guide.jpg",
      featured: true,
      publishedAt: "2026-03-10",
      readingTheme: "sans",
      relatedProducts: [
        "golden-bloom-clear-gaze-tea",
        "golden-dew-balance-tea",
        "moon-dew-night-restore-tea",
      ],
      relatedIngredients: ["chrysanthemum", "honeysuckle", "maidong", "yuzhu"],
    },
    source: {
      en: `> Placeholder editorial content. Replace or expand this file by editing the MDX inside \`content/articles/brewing-notes-for-a-lighter-routine/\`.

Brewing guidance helps premium tea feel approachable. Even when customers are not measuring every gram, a well-written guide can set expectations around warmth, clarity, aroma, and refill potential.

## Temperature affects tone

Hotter water can create more body and extraction, while a slightly gentler approach may preserve a softer floral edge. The goal of this placeholder article is not to prescribe a single perfect method, but to show how content can help customers tune the experience.

## Pacing changes the ritual

A tea made for a quick reset may be brewed differently from one intended for a slower evening. The site architecture supports this kind of editorial framing because it connects brewing content back to products and ingredients.

## Placeholder additions for future content

Future versions may include:

- side-by-side brewing suggestions for different blend families
- serving vessel recommendations
- stronger internal linking to product detail pages and ingredient libraries`,
      zh: `> 占位编辑内容。后续只需编辑 \`content/articles/brewing-notes-for-a-lighter-routine/\` 内的 MDX 文件，即可替换或扩展本文。

好的冲泡指引，会让精品茶更容易被理解。即使用户并不会精确称量，每一篇清晰的说明也依然可以帮助他们建立对温度、香气、浓淡与续水表现的预期。

## 温度会影响整体调性

更高的水温通常会带来更明显的厚度与释出，而相对柔和的方式则可能保留花香与轻润感。本文作为占位内容，不是为了给出唯一标准答案，而是示范如何通过内容帮助用户微调饮用体验。

## 节奏也会改变这杯茶的意义

适合快速转换状态的茶，与适合夜晚慢慢饮用的茶，在冲泡节奏上可能并不相同。当前网站结构已经为这样的内容表达做好准备，可以自然链接回产品页与原料页。

## 后续可补充的编辑方向

未来可以继续补充:

- 不同配方家族之间的冲泡对照建议
- 适合的茶具与器皿提示
- 与产品详情页、原料页之间更完整的内部链接`,
    },
  },
  "daily-rituals-for-modern-energy": {
    meta: {
      slug: "daily-rituals-for-modern-energy",
      title: {
        en: "Daily Rituals for Modern Energy",
        zh: "现代节奏中的日常元气仪式",
      },
      excerpt: {
        en: "Placeholder editorial content exploring how gentle tea rituals can support more intentional mornings and steadier afternoons.",
        zh: "占位编辑内容，讨论如何通过温和的茶饮仪式让早晨更有节奏、午后更平稳。",
      },
      category: {
        en: "Daily wellness",
        zh: "日常养护",
      },
      tags: {
        en: ["Morning rhythm", "Energy", "Placeholder"],
        zh: ["晨间节奏", "元气", "占位内容"],
      },
      coverImage: "/images/articles/daily-wellness.jpg",
      featured: true,
      publishedAt: "2026-03-14",
      readingTheme: "serif",
      relatedProducts: ["zaoxi-vitality-tea", "amber-silk-restore-tea"],
      relatedIngredients: ["astragalus", "red-date", "goji"],
    },
    source: {
      en: `> Placeholder editorial content. Replace or expand this file by editing the MDX inside \`content/articles/daily-rituals-for-modern-energy/\`.

Daily wellness content often works best when it feels calm, practical, and easy to return to. Rather than asking a tea ritual to do everything at once, this placeholder article frames the category as a small design decision inside the day: a slower morning, a steadier afternoon, or a more thoughtful reset between tasks.

## Begin with rhythm, not urgency

A premium tea routine can support the feeling of intention around the day. That does not mean dramatic promises. It means helping users build a reliable sensory moment through aroma, warmth, and a predictable preparation ritual.

- Choose a blend with a flavor profile you genuinely enjoy.
- Keep the brewing steps visible and uncomplicated.
- Let the ritual feel repeatable on ordinary weekdays, not just ideal weekends.

## Ingredient storytelling matters

When a customer reads about astragalus, red date, or goji, they should understand the flavor direction, the traditional pairing context, and the tone of the blend. They should not feel like they are reading a clinical database or a loud supplement page.

For future editorial expansion, this article can be deepened with:

- interviews with formulators or sourcing partners
- serving suggestions for morning or early-afternoon routines
- links to related blends and ingredient detail pages

## Placeholder direction for future content

This seeded article exists to prove the content architecture. New articles can be added by creating a new folder with \`meta.json\`, \`en.mdx\`, and \`zh.mdx\`, without changing any page code.`,
      zh: `> 占位编辑内容。后续只需编辑 \`content/articles/daily-rituals-for-modern-energy/\` 内的 MDX 文件，即可替换或扩展本文。

日常养护内容最适合用平静、可执行、容易回到生活中的方式来呈现。与其让一杯茶承担过多期待，不如把它视作一天里一个有节奏的小决定: 让清晨更从容、午后更稳定，或在忙碌之间留出一个轻柔的停顿。

## 先建立节奏，而不是追求紧迫感

一套有质感的茶饮习惯，真正提供的是一种更有意图的日常感受，而不是夸张承诺。它帮助用户通过香气、温度与稳定的冲泡流程，获得可重复的舒缓体验。

- 先选择自己真正喜欢的风味方向。
- 让冲泡步骤清晰、简单、容易坚持。
- 让这套仪式适合普通工作日，而不是只存在于理想化场景。

## 原料叙事同样重要

当用户阅读黄芪、红枣或枸杞相关内容时，他们更需要理解的是风味走向、常见搭配语境与整体调性，而不是像在阅读临床数据库或夸张保健页面。

未来可以继续扩展的方向包括:

- 配方思路或原料来源访谈
- 适合晨间与午后饮用的情境建议
- 与茶品页、原料页之间的更深入链接

## 作为后续内容扩展的起点

这篇文章的存在，主要用于证明内容系统已经搭建完成。未来只需新增文件夹与对应的 \`meta.json\`、\`en.mdx\`、\`zh.mdx\` 文件，即可自动接入网站。`,
    },
  },
  "ingredient-pairing-notes": {
    meta: {
      slug: "ingredient-pairing-notes",
      title: {
        en: "Ingredient Pairing Notes for Balanced Blends",
        zh: "更平衡茶饮中的原料搭配笔记",
      },
      excerpt: {
        en: "Placeholder editorial content on pairing citrus, florals, roots, and fruits into tea blends with structure and elegance.",
        zh: "占位编辑内容，讨论如何将柑橘、花香、根茎与果材搭配成层次更完整的茶饮。",
      },
      category: {
        en: "Ingredient guide",
        zh: "原料指南",
      },
      tags: {
        en: ["Pairings", "Flavor", "Placeholder"],
        zh: ["搭配", "风味", "占位内容"],
      },
      coverImage: "/images/articles/ingredients-guide.jpg",
      featured: true,
      publishedAt: "2026-03-12",
      readingTheme: "serif",
      relatedProducts: [
        "citrus-cloud-harmony-tea",
        "citrus-rose-ease-tea",
        "amber-orchard-digest-tea",
      ],
      relatedIngredients: ["chenpi", "rose", "fo-shou", "poria"],
    },
    source: {
      en: `> Placeholder editorial content. Replace or expand this file by editing the MDX inside \`content/articles/ingredient-pairing-notes/\`.

Pairing ingredients in a premium herbal tea is partly about function, but just as importantly about structure, aroma, and aftertaste. This placeholder article introduces how a calmer editorial voice can help customers understand a blend without reducing it to a checklist.

## Start with a lead note

Some blends begin with warmth, some with floral lift, and some with a clearer citrus profile. A lead note helps anchor the user’s first impression. From there, supporting ingredients can soften edges, deepen the body, or leave a cleaner finish.

## Supporting ingredients create balance

Chenpi can shape the finish. Rose can soften and perfume the cup. Poria can help bring lightness to a richer profile. This kind of storytelling supports discovery because it gives customers language for how a tea might feel in the cup.

## Placeholder direction for future editorial depth

Future versions of this article might include:

- illustrated pairing maps
- blend design notes from a tea specialist
- links to ingredient pages for chenpi, rose, Buddha's hand citrus, and poria

As with the rest of the journal system, additional entries can be added without touching the site code.`,
      zh: `> 占位编辑内容。后续只需编辑 \`content/articles/ingredient-pairing-notes/\` 内的 MDX 文件，即可替换或扩展本文。

一款有质感的草本茶，配伍不仅关乎方向感，也关乎结构、香气与尾韵。本文作为占位内容，示范如何用更平静的编辑语言帮助用户理解配方，而不是把茶品简化成一串功效标签。

## 先确定主导风味

有些配方以温润开场，有些以花香提气，也有些以柑橘调带出清晰感。主导风味决定了用户对一杯茶的第一印象，之后再由其他原料补足厚度、修饰边缘、延长回甘。

## 支撑性原料决定平衡感

陈皮可以整理尾韵，玫瑰能柔化整体香气，茯苓则让配方显得更轻、更清。这样的叙事方式，有助于用户用“杯中的感受”来理解茶，而不是只关注表面标签。

## 未来可扩展的编辑方向

这篇文章后续可以继续拓展为:

- 更具视觉化的配伍示意图
- 来自茶饮策划者的配方思路说明
- 指向陈皮、玫瑰、佛手、茯苓原料页的延伸阅读

和整个文章系统一样，后续新增内容时无需修改任何页面代码。`,
    },
  },
  "tea-as-a-giftable-ritual": {
    meta: {
      slug: "tea-as-a-giftable-ritual",
      title: {
        en: "Tea as a Giftable Ritual",
        zh: "把茶饮做成适合礼赠的仪式体验",
      },
      excerpt: {
        en: "Placeholder editorial content about premium presentation, gifting occasions, and why tea can feel more personal than generic wellness products.",
        zh: "占位编辑内容，讨论精品呈现、礼赠场景，以及为什么茶比普通保健商品更有情感温度。",
      },
      category: {
        en: "Brand story",
        zh: "品牌故事",
      },
      tags: {
        en: ["Gifting", "Brand", "Placeholder"],
        zh: ["礼赠", "品牌", "占位内容"],
      },
      coverImage: "/images/articles/tea-ritual.jpg",
      featured: false,
      publishedAt: "2026-03-08",
      readingTheme: "serif",
      relatedProducts: [
        "crimson-gold-radiance-tea",
        "gilded-cordyceps-reserve-tea",
        "rosy-glow-nourish-tea",
      ],
      relatedIngredients: ["rose", "saffron", "cordyceps", "longan"],
    },
    source: {
      en: `> Placeholder editorial content. Replace or expand this file by editing the MDX inside \`content/articles/tea-as-a-giftable-ritual/\`.

Tea can become a more personal gift when it feels curated rather than generic. Presentation, naming, brew guidance, and supporting editorial all contribute to whether a blend feels memorable and worthy of sharing.

## A gift is also a story

Premium tea gifting works when the recipient can quickly understand what makes the blend special. That may come from ingredient stories, an elegant product detail page, or a clear prompt to use Helper AI when they are unsure what to choose.

## Calm conversion can still be effective

This storefront is designed to support refined gifting without relying on discount-heavy tactics. The visual system, cart flow, and article modules all reinforce that quieter luxury approach.

## Placeholder direction

This article can later expand into seasonal gifting guides, premium assortment recommendations, or editorial packages built around the reserve collection.`,
      zh: `> 占位编辑内容。后续只需编辑 \`content/articles/tea-as-a-giftable-ritual/\` 内的 MDX 文件，即可替换或扩展本文。

当一款茶被精心呈现，而不是像普通商品一样堆叠信息时，它就更容易成为一份有温度的礼物。包装感、命名、冲泡建议，以及围绕它展开的内容叙事，都会影响它是否足够值得分享。

## 礼物本身也是一个故事

真正有记忆点的精品茶礼，不只是“价格更高”而已，更重要的是收礼的人能迅速理解这款茶为什么特别。这种理解可能来自原料故事、产品详情页，也可能来自 Helper AI 提供的推荐式入口。

## 克制的转化方式同样有效

这个网站并不依赖喧闹的折扣话术来完成转化。整体视觉、购物车流程与文章模块，都在共同支撑一种更安静、更高级的礼赠体验。

## 未来可扩展方向

后续可以继续延展为节令礼赠指南、典藏系列推荐，或围绕高阶产品所设计的专题内容包。`,
    },
  },
};
