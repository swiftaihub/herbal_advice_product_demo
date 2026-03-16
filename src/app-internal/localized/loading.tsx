export default function LocaleLoading() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4">
      <div className="flex items-center gap-3 rounded-full border border-[rgba(111,89,64,0.12)] bg-white/80 px-5 py-3 text-sm font-medium text-[var(--color-muted)] shadow-[0_10px_30px_rgba(24,21,17,0.05)]">
        <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-[var(--color-accent)]" />
        <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-[rgba(176,136,74,0.7)] [animation-delay:120ms]" />
        <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-[rgba(176,136,74,0.45)] [animation-delay:240ms]" />
      </div>
    </div>
  );
}
