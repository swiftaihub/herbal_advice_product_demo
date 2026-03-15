"use client";

import { Check, ChevronDown } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";

import { cn } from "@/lib/utils";

interface FilterSelectOption {
  value: string;
  label: string;
}

interface FilterSelectProps {
  label: string;
  value: string | null;
  onChange: (value: string | null) => void;
  options: FilterSelectOption[];
  placeholder: string;
  clearLabel: string;
}

export function FilterSelect({
  label,
  value,
  onChange,
  options,
  placeholder,
  clearLabel,
}: FilterSelectProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const listboxId = useId();
  const selectedOption = options.find((option) => option.value === value) ?? null;

  useEffect(() => {
    if (!open) {
      return;
    }

    function handlePointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    window.addEventListener("mousedown", handlePointerDown);
    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("mousedown", handlePointerDown);
      window.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="space-y-3">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-accent)]">
        {label}
      </p>
      <div className="space-y-3">
        <button
          type="button"
          className={cn(
            "group flex w-full items-center justify-between gap-4 rounded-[1.75rem] border border-[rgba(111,89,64,0.14)] bg-[linear-gradient(180deg,rgba(255,252,247,0.96),rgba(244,234,219,0.84))] px-4 py-3.5 text-left shadow-[0_14px_30px_rgba(27,22,17,0.05)] transition duration-300 hover:border-[var(--color-accent)] hover:shadow-[0_18px_36px_rgba(27,22,17,0.08)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-paper)]",
            open && "border-[var(--color-accent)] shadow-[0_18px_36px_rgba(27,22,17,0.08)]",
          )}
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={listboxId}
          onClick={() => setOpen((current) => !current)}
        >
          <div className="min-w-0">
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)]">
              {label}
            </p>
            <p className="mt-1 truncate text-sm font-medium text-[var(--color-ink)]">
              {selectedOption?.label ?? placeholder}
            </p>
          </div>
          <ChevronDown
            className={cn(
              "h-4 w-4 flex-none text-[var(--color-accent)] transition duration-300",
              open && "rotate-180",
            )}
          />
        </button>

        <div
          className={cn(
            "grid transition-all duration-300 ease-out",
            open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
          )}
        >
          <div className="overflow-hidden">
            <div
              id={listboxId}
              role="listbox"
              aria-label={label}
              className="rounded-[1.75rem] border border-[rgba(111,89,64,0.12)] bg-[rgba(255,251,245,0.95)] p-2 shadow-[0_18px_40px_rgba(27,22,17,0.06)]"
            >
              <SelectOption
                active={value === null}
                label={clearLabel}
                onClick={() => {
                  onChange(null);
                  setOpen(false);
                }}
              />
              {options.map((option) => (
                <SelectOption
                  key={option.value}
                  active={option.value === value}
                  label={option.label}
                  onClick={() => {
                    onChange(option.value);
                    setOpen(false);
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SelectOption({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      role="option"
      aria-selected={active}
      className={cn(
        "flex w-full items-center justify-between gap-3 rounded-[1.15rem] px-4 py-3 text-left text-sm transition duration-300",
        active
          ? "bg-[rgba(176,136,74,0.12)] text-[var(--color-ink)]"
          : "text-[var(--color-muted)] hover:bg-[rgba(176,136,74,0.06)] hover:text-[var(--color-ink)]",
      )}
      onClick={onClick}
    >
      <span className="truncate">{label}</span>
      <Check
        className={cn(
          "h-4 w-4 flex-none text-[var(--color-accent)] transition duration-300",
          active ? "opacity-100" : "opacity-0",
        )}
      />
    </button>
  );
}
