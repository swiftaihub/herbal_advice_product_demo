export function LegalShell({
  eyebrow,
  title,
  intro,
  sections,
}: {
  eyebrow: string;
  title: string;
  intro: string;
  sections: Array<{ title: string; body: string[] }>;
}) {
  return (
    <div className="page-section py-16 md:py-24">
      <div className="mx-auto max-w-4xl">
        <div className="rounded-[2.75rem] border border-[rgba(111,89,64,0.12)] bg-white/82 p-8 shadow-[0_18px_46px_rgba(24,21,17,0.06)] md:p-12">
          <span className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-accent)]">
            {eyebrow}
          </span>
          <h1 className="mt-4 font-display text-5xl text-[var(--color-ink)] md:text-6xl">
            {title}
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-8 text-[var(--color-copy)]">
            {intro}
          </p>
          <div className="mt-10 space-y-10">
            {sections.map((section) => (
              <section key={section.title}>
                <h2 className="font-display text-3xl text-[var(--color-ink)]">
                  {section.title}
                </h2>
                <div className="mt-4 space-y-4 text-base leading-8 text-[var(--color-copy)]">
                  {section.body.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
