"use client";

import { Minus, Plus } from "lucide-react";

import { cn } from "@/lib/utils";

interface QuantityStepperProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  allowBelowMin?: boolean;
  className?: string;
}

export function QuantityStepper({
  value,
  onChange,
  min = 1,
  allowBelowMin = false,
  className,
}: QuantityStepperProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border border-[var(--color-line)] bg-white/85 p-1",
        className,
      )}
    >
      <button
        type="button"
        className="flex h-9 w-9 items-center justify-center rounded-full text-[var(--color-muted)] transition hover:bg-[rgba(111,89,64,0.08)] hover:text-[var(--color-ink)]"
        onClick={() =>
          onChange(allowBelowMin ? value - 1 : Math.max(min, value - 1))
        }
        aria-label="Decrease quantity"
      >
        <Minus className="h-4 w-4" />
      </button>
      <span className="min-w-10 text-center text-sm font-medium text-[var(--color-ink)]">
        {value}
      </span>
      <button
        type="button"
        className="flex h-9 w-9 items-center justify-center rounded-full text-[var(--color-muted)] transition hover:bg-[rgba(111,89,64,0.08)] hover:text-[var(--color-ink)]"
        onClick={() => onChange(value + 1)}
        aria-label="Increase quantity"
      >
        <Plus className="h-4 w-4" />
      </button>
    </div>
  );
}
