import Link from "next/link";

import { buttonStyles } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <div className="max-w-xl rounded-[2.5rem] border border-[rgba(111,89,64,0.12)] bg-white/75 p-10 text-center shadow-[0_18px_50px_rgba(24,21,17,0.06)]">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-accent)]">
          404
        </p>
        <h1 className="mt-4 font-display text-5xl text-[var(--color-ink)]">
          Page not found
        </h1>
        <p className="mt-4 text-base leading-8 text-[var(--color-muted)]">
          The page you’re looking for may have moved or doesn’t exist yet.
        </p>
        <Link href="/en" prefetch={false} className={buttonStyles({ className: "mt-8" })}>
          Return home
        </Link>
      </div>
    </main>
  );
}
