import type { Locale, LocalizedString } from "@/lib/types";

const benefitLabels: Record<string, LocalizedString> = {
  "beauty-wellness": { en: "Beauty ritual", zh: "焕采养颜" },
  "blood-support": { en: "Nourishing warmth", zh: "温养调和" },
  "breath-support": { en: "Breathful support", zh: "呼吸舒缓" },
  "caffeine-free": { en: "Caffeine free", zh: "无咖啡因" },
  "circulation-support": { en: "Circulation ritual", zh: "舒展循环" },
  "cold-relief": { en: "Cold weather comfort", zh: "暖身安适" },
  cooling: { en: "Cooling profile", zh: "清润调和" },
  "daily-wellness": { en: "Daily wellness", zh: "日常养护" },
  "damp-heat-balance": { en: "Fresh balance", zh: "清衡轻养" },
  "digestive-comfort": { en: "Digestive comfort", zh: "餐后轻松" },
  "dryness-relief": { en: "Dryness comfort", zh: "润养舒缓" },
  "eye-comfort": { en: "Eye comfort", zh: "清眸舒眼" },
  floral: { en: "Floral profile", zh: "花香调" },
  "gentle-tonic": { en: "Gentle tonic", zh: "温和调养" },
  "gently-sweet": { en: "Soft sweetness", zh: "轻甜回甘" },
  "gently-warming": { en: "Gentle warming", zh: "温暖顺口" },
  "light-body": { en: "Light body", zh: "清轻口感" },
  "light-cooling": { en: "Light cooling", zh: "轻清润感" },
  "mood-support": { en: "Mood ritual", zh: "舒心松弛" },
  "night-recovery": { en: "Evening restore", zh: "夜间修养" },
  "overwork-support": { en: "Overwork reset", zh: "忙碌修护" },
  "post-meal": { en: "Post-meal ritual", zh: "餐后之选" },
  premium: { en: "Reserve collection", zh: "典藏配方" },
  "qi-move": { en: "Flow support", zh: "舒展轻和" },
  "qi-support": { en: "Vitality support", zh: "元气轻养" },
  "qi-yin-balance": { en: "Balance support", zh: "轻衡调润" },
  restorative: { en: "Restorative blend", zh: "修元养护" },
  "skin-friendly": { en: "Skin-friendly ritual", zh: "肤感友好" },
  "spleen-support": { en: "Gentle grounding", zh: "轻养脾胃" },
  "sweet-profile": { en: "Rounded sweetness", zh: "甜润口感" },
  warming: { en: "Warming profile", zh: "温养风味" },
  "yin-support": { en: "Nourishing support", zh: "润养支持" },
};

const constitutionLabels: Record<string, LocalizedString> = {
  气滞: { en: "stagnation-prone", zh: "气滞" },
  气虚: { en: "low-energy", zh: "气虚" },
  气血两虚: { en: "qi and blood deficiency", zh: "气血两虚" },
  湿热: { en: "damp heat", zh: "湿热" },
  痰湿: { en: "dampness-prone", zh: "痰湿" },
  血瘀: { en: "circulation stagnation", zh: "血瘀" },
  阳虚: { en: "cold-sensitive", zh: "阳虚" },
  阴虚: { en: "dryness-prone", zh: "阴虚" },
};

const discomfortLabels: Record<string, string> = {
  久劳后虚弱感: "fatigue after long periods of exertion",
  体力恢复慢: "slow physical recovery",
  便秘偏干: "dry constipation tendencies",
  刺痛固定: "fixed discomfort",
  午后疲倦: "afternoon fatigue",
  口干: "dry mouth",
  口干咽燥: "dry mouth and throat",
  口干食少: "dryness with low appetite",
  口臭: "strong breath after meals",
  口苦: "bitter taste",
  吃冷易拉: "sensitivity to cold foods",
  嗳气: "belching",
  头晕: "lightheadedness",
  头目不清爽: "heavy-headed feeling",
  容易瘀青: "bruise easily",
  容易积食: "feeling heavy after eating",
  小便黄: "dark yellow urine",
  循环差: "sluggish circulation",
  心悸: "palpitations",
  心烦: "restless irritation",
  恢复慢: "slow recovery",
  情绪压抑: "low mood",
  手脚偏冷: "cool hands and feet",
  手脚冰凉: "cold hands and feet",
  易疲劳: "low energy",
  气短: "shortness of breath",
  熬夜后眼涩: "tired eyes after late nights",
  熬夜后肤色差: "dull complexion after late nights",
  爱叹气: "frequent sighing",
  用眼疲劳: "eye strain",
  用脑后疲惫: "mental fatigue",
  畏寒: "sensitivity to cold",
  痘痘多: "breakout-prone skin",
  皮肤干燥: "dry skin",
  眼干: "dry eyes",
  睡眠浅: "light sleep",
  经血有块: "clotting during cycle",
  胃口受影响: "reduced appetite",
  胃口弱: "gentle appetite support needed",
  胃寒不适: "cold stomach discomfort",
  胸闷: "chest tightness",
  脑雾: "brain fog",
  腹胀嗳气: "bloating with belching",
  说话无力: "low speaking energy",
  身体困重: "heavy body feeling",
  轻度乏力: "mild fatigue",
  轻度口干: "mild dryness",
  轻度腹胀: "mild bloating",
  长期过劳: "long-term overwork",
  面色偏淡: "paler complexion",
  面色暗淡: "dull complexion",
  面部出油: "oilier skin",
  食欲不振: "low appetite",
  食欲差: "reduced appetite",
  餐后困倦: "post-meal sleepiness",
  餐后胀气: "post-meal gas",
  餐后腹胀: "post-meal bloating",
};

const categoryLabels: Record<string, LocalizedString> = {
  "herbal-tea": { en: "Herbal tea", zh: "草本茶" },
};

export function getBenefitLabel(key: string, locale: Locale) {
  return benefitLabels[key]?.[locale] ?? key;
}

export function getConstitutionLabel(key: string, locale: Locale) {
  return constitutionLabels[key]?.[locale] ?? key;
}

export function getDiscomfortLabel(key: string, locale: Locale) {
  return locale === "zh" ? key : discomfortLabels[key] ?? key;
}

export function getCategoryLabel(key: string, locale: Locale) {
  return categoryLabels[key]?.[locale] ?? key;
}
