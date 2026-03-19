import type { ButtonHTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-[var(--color-ink)] text-[#ffffff] shadow-[0_12px_30px_rgba(34,30,22,0.16)] hover:bg-[var(--color-ink-soft)] hover:text-[#ffffff]",
  secondary:
    "border border-[var(--color-line)] bg-[rgba(255,255,255,0.78)] text-[var(--color-ink)] hover:border-[var(--color-accent)] hover:bg-[rgba(255,250,241,0.96)]",
  ghost:
    "border border-transparent bg-transparent text-[var(--color-ink)] hover:border-[var(--color-line)] hover:bg-[rgba(255,255,255,0.55)]",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "h-10 px-3.5 text-sm sm:px-4",
  md: "h-11 px-4 text-sm sm:px-5",
  lg: "h-11 px-5 text-sm sm:h-12 sm:px-6",
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: ReactNode;
}

export function buttonStyles({
  variant = "primary",
  size = "md",
  className,
}: {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
}) {
  return cn(
    "relative isolate inline-flex items-center justify-center gap-2 rounded-full font-medium transition duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-paper)] disabled:cursor-not-allowed disabled:opacity-55",
    variantClasses[variant],
    sizeClasses[size],
    className,
  );
}

export function Button({
  className,
  variant = "primary",
  size = "md",
  icon,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={buttonStyles({ variant, size, className })}
      {...props}
    >
      {icon}
      {children}
    </button>
  );
}
