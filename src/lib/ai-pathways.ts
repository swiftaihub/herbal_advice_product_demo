import type { LocalizedString } from "@/lib/types";

export interface AiPathway {
  id: string;
  title: LocalizedString;
  description: LocalizedString;
  productSlugs: string[];
}

export const aiPathways: AiPathway[] = [
  {
    id: "fatigue-reset",
    title: {
      en: "For low energy and slow recovery",
      zh: "适合疲惫与恢复偏慢时",
    },
    description: {
      en: "A gentle starting path for users exploring steady daily vitality support.",
      zh: "适合寻找温和日常元气支持的人群。",
    },
    productSlugs: ["zaoxi-vitality-tea", "amber-silk-restore-tea"],
  },
  {
    id: "cool-balance",
    title: {
      en: "For a lighter, fresher daily balance",
      zh: "适合偏清润轻衡的日常状态",
    },
    description: {
      en: "Useful when someone wants a crisp, calming blend without heaviness.",
      zh: "适合想要口感清润、节奏更轻盈的茶饮选择。",
    },
    productSlugs: ["golden-dew-balance-tea", "golden-bloom-clear-gaze-tea"],
  },
  {
    id: "ritual-comfort",
    title: {
      en: "For mood, digestion, and everyday ease",
      zh: "适合情绪舒展与餐后轻松",
    },
    description: {
      en: "A pathway built around comforting florals, citrus notes, and post-meal rituals.",
      zh: "围绕花香、柑橘调与餐后舒适感展开的轻松路径。",
    },
    productSlugs: ["citrus-rose-ease-tea", "amber-orchard-digest-tea"],
  },
  {
    id: "reserve-collection",
    title: {
      en: "For premium reserve gifting or elevated routines",
      zh: "适合作为高阶典藏与礼赠之选",
    },
    description: {
      en: "Highlights the most premium blends for gifting, ceremony, and elevated wellness rituals.",
      zh: "聚焦更具仪式感与礼赠属性的高阶配方。",
    },
    productSlugs: ["crimson-gold-radiance-tea", "gilded-cordyceps-reserve-tea"],
  },
];
