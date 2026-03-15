import type { MDXComponents } from "mdx/types";

export const mdxComponents: MDXComponents = {
  h2: (props) => (
    <h2
      className="mt-14 font-display text-3xl leading-tight text-[var(--color-ink)] md:text-4xl"
      {...props}
    />
  ),
  h3: (props) => (
    <h3
      className="mt-10 text-xl font-semibold text-[var(--color-ink)] md:text-2xl"
      {...props}
    />
  ),
  p: (props) => (
    <p
      className="mt-6 text-base leading-8 text-[var(--color-copy)] md:text-lg"
      {...props}
    />
  ),
  ul: (props) => (
    <ul className="mt-6 list-disc space-y-3 pl-6 text-[var(--color-copy)]" {...props} />
  ),
  ol: (props) => (
    <ol
      className="mt-6 list-decimal space-y-3 pl-6 text-[var(--color-copy)]"
      {...props}
    />
  ),
  li: (props) => <li className="leading-8" {...props} />,
  blockquote: (props) => (
    <blockquote
      className="mt-8 rounded-[2rem] border border-[rgba(111,89,64,0.12)] bg-[rgba(255,250,241,0.9)] px-6 py-5 text-lg italic text-[var(--color-ink)]"
      {...props}
    />
  ),
  strong: (props) => (
    <strong className="font-semibold text-[var(--color-ink)]" {...props} />
  ),
  a: (props) => (
    <a
      className="font-medium text-[var(--color-accent)] underline decoration-[rgba(176,136,74,0.36)] underline-offset-4"
      {...props}
    />
  ),
};
