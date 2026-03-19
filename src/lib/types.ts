export type Locale = "en" | "zh";

export type LocalizedString = Record<Locale, string>;
export type LocalizedStringList = Record<Locale, string[]>;
export type LocalizedLinks = Partial<Record<Locale, string>>;

export interface Product {
  slug: string;
  name: LocalizedString;
  tagline: LocalizedString;
  category: string;
  price: number;
  currency: string;
  size: string;
  summary: LocalizedString;
  ingredients: string[];
  benefit_tags: string[];
  flavor_notes: LocalizedStringList;
  brew_guide: LocalizedString;
  constitution_types: string[];
  recent_discomforts: string[];
  target_users: LocalizedStringList;
  cautions: LocalizedString;
  disclaimer: LocalizedString;
  images: string[];
  buy_link: string;
  links?: LocalizedLinks;
  status: string;
}

export interface Ingredient {
  slug: string;
  name: LocalizedString;
  aliases: LocalizedStringList;
  summary: LocalizedString;
  nutrition_focus: LocalizedStringList;
  traditional_use: LocalizedString;
  flavor_profile: LocalizedStringList;
  pairings: string[];
  cautions: LocalizedString;
  images: string[];
  links?: LocalizedLinks;
}

export interface ArticleMeta {
  slug: string;
  locale: Locale;
  availableLocales: Locale[];
  title: string;
  excerpt: string;
  category: string;
  tags: string[];
  coverImage: string;
  featured: boolean;
  publishedAt: string;
  updatedAt?: string;
  readingTheme: "serif" | "sans";
  relatedProducts: string[];
  relatedIngredients: string[];
  seoTitle?: string;
  seoDescription?: string;
  links?: LocalizedLinks;
}

export interface Article extends ArticleMeta {
  body: string;
  readingMinutes: number;
}

export interface CartLineItem {
  slug: string;
  quantity: number;
  name: LocalizedString;
  tagline: LocalizedString;
  price: number;
  currency: string;
  size: string;
  image: string;
}
