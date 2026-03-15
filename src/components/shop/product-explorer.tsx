"use client";

import { useDeferredValue, useState } from "react";

import { ProductCard } from "@/components/cards/product-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getBenefitLabel, getConstitutionLabel, getDiscomfortLabel } from "@/lib/taxonomies";
import type { Locale, Product } from "@/lib/types";

type SortOption = "featured" | "price-low" | "price-high";

interface ProductExplorerProps {
  locale: Locale;
  products: Product[];
  benefitTags: string[];
  constitutions: string[];
  discomforts: string[];
  copy: {
    addToCart: string;
    viewDetails: string;
    noResults: string;
    resetFilters: string;
    searchLabel: string;
    benefitsLabel: string;
    constitutionsLabel: string;
    discomfortsLabel: string;
    sortLabel: string;
    sortFeatured: string;
    sortPriceLow: string;
    sortPriceHigh: string;
  };
}

export function ProductExplorer({
  locale,
  products,
  benefitTags,
  constitutions,
  discomforts,
  copy,
}: ProductExplorerProps) {
  const [query, setQuery] = useState("");
  const [selectedBenefit, setSelectedBenefit] = useState<string | null>(null);
  const [selectedConstitution, setSelectedConstitution] = useState<string | null>(null);
  const [selectedDiscomfort, setSelectedDiscomfort] = useState<string | null>(null);
  const [sort, setSort] = useState<SortOption>("featured");
  const deferredQuery = useDeferredValue(query);

  const filteredProducts = [...products]
    .filter((product) => {
      const text =
        `${product.name.en} ${product.name.zh} ${product.tagline.en} ${product.tagline.zh}`
          .toLowerCase();
      const queryMatches = text.includes(deferredQuery.toLowerCase());
      const benefitMatches = selectedBenefit
        ? product.benefit_tags.includes(selectedBenefit)
        : true;
      const constitutionMatches = selectedConstitution
        ? product.constitution_types.includes(selectedConstitution)
        : true;
      const discomfortMatches = selectedDiscomfort
        ? product.recent_discomforts.includes(selectedDiscomfort)
        : true;

      return queryMatches && benefitMatches && constitutionMatches && discomfortMatches;
    })
    .sort((a, b) => {
      if (sort === "price-low") {
        return a.price - b.price;
      }

      if (sort === "price-high") {
        return b.price - a.price;
      }

      return b.price - a.price;
    });

  return (
    <div className="grid gap-10 lg:h-[calc(100vh-8rem)] lg:grid-cols-[minmax(18rem,0.34fr)_minmax(0,0.66fr)] lg:items-start lg:overflow-hidden">
      <aside className="space-y-6 rounded-[2rem] border border-[rgba(111,89,64,0.12)] bg-white/75 p-6 shadow-[0_12px_34px_rgba(24,21,17,0.04)] lg:h-full lg:min-h-0 lg:overflow-y-auto lg:overscroll-contain lg:pr-4">
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-accent)]">
            {copy.searchLabel}
          </label>
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={copy.searchLabel}
          />
        </div>
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-accent)]">
            {copy.sortLabel}
          </p>
          <div className="grid gap-2">
            {[
              { value: "featured", label: copy.sortFeatured },
              { value: "price-low", label: copy.sortPriceLow },
              { value: "price-high", label: copy.sortPriceHigh },
            ].map((option) => (
              <button
                key={option.value}
                type="button"
                className={`rounded-2xl border px-4 py-3 text-left text-sm transition ${sort === option.value ? "border-[var(--color-accent)] bg-[rgba(176,136,74,0.08)] text-[var(--color-ink)]" : "border-[var(--color-line)] text-[var(--color-muted)] hover:border-[var(--color-accent)]"}`}
                onClick={() => setSort(option.value as SortOption)}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
        <FilterGroup
          label={copy.benefitsLabel}
          items={benefitTags}
          selected={selectedBenefit}
          onSelect={setSelectedBenefit}
          renderLabel={(value) => getBenefitLabel(value, locale)}
        />
        <FilterGroup
          label={copy.constitutionsLabel}
          items={constitutions}
          selected={selectedConstitution}
          onSelect={setSelectedConstitution}
          renderLabel={(value) => getConstitutionLabel(value, locale)}
        />
        <FilterGroup
          label={copy.discomfortsLabel}
          items={discomforts}
          selected={selectedDiscomfort}
          onSelect={setSelectedDiscomfort}
          renderLabel={(value) => getDiscomfortLabel(value, locale)}
        />
        <Button
          type="button"
          variant="ghost"
          className="w-full"
          onClick={() => {
            setQuery("");
            setSelectedBenefit(null);
            setSelectedConstitution(null);
            setSelectedDiscomfort(null);
            setSort("featured");
          }}
        >
          {copy.resetFilters}
        </Button>
      </aside>
      <div className="lg:h-full lg:min-h-0 lg:overflow-y-auto lg:overscroll-contain lg:pr-4">
        {filteredProducts.length === 0 ? (
          <div className="rounded-[2rem] border border-dashed border-[rgba(111,89,64,0.22)] bg-white/55 px-8 py-14 text-center text-[var(--color-muted)]">
            {copy.noResults}
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-2">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.slug}
                product={product}
                locale={locale}
                addToCartLabel={copy.addToCart}
                detailLabel={copy.viewDetails}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function FilterGroup({
  label,
  items,
  selected,
  onSelect,
  renderLabel,
}: {
  label: string;
  items: string[];
  selected: string | null;
  onSelect: (value: string | null) => void;
  renderLabel: (value: string) => string;
}) {
  return (
    <div className="space-y-3">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-accent)]">
        {label}
      </p>
      <div className="flex flex-wrap gap-2">
        {items.map((item) => {
          const active = selected === item;
          return (
            <button
              key={item}
              type="button"
              className={`rounded-full border px-4 py-2 text-sm transition ${active ? "border-[var(--color-accent)] bg-[rgba(176,136,74,0.1)] text-[var(--color-ink)]" : "border-[var(--color-line)] bg-white/70 text-[var(--color-muted)] hover:border-[var(--color-accent)] hover:text-[var(--color-ink)]"}`}
              onClick={() => onSelect(active ? null : item)}
            >
              {renderLabel(item)}
            </button>
          );
        })}
      </div>
    </div>
  );
}
