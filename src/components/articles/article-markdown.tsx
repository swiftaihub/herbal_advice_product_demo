import type { CSSProperties } from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";

import { cn } from "@/lib/utils";

export function ArticleMarkdown({
  content,
  className,
  style,
}: {
  content: string;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <div className={cn("article-prose", className)} style={style}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw, rehypeSlug]}
        components={{
          a: ({ href = "", ...props }) => {
            const isExternal = /^https?:\/\//.test(href);

            return (
              <a
                href={href}
                target={isExternal ? "_blank" : undefined}
                rel={isExternal ? "noreferrer" : undefined}
                {...props}
              />
            );
          },
          // Article images come from content files, so they need native markdown rendering.
          img: ({ alt = "", ...props }) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img alt={alt} loading="lazy" {...props} />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
