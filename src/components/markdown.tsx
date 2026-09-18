import ReactMarkdown from "react-markdown";
import remarkBreaks from "remark-breaks";
import remarkGfm from "remark-gfm";
import { LocaleLink as Link } from "@/components/locale-link";
import { cn } from "@/lib/utils";

export function Markdown({
  content,
  className,
}: {
  content: string;
  className?: string;
}) {
  return (
    <div className={cn("prose prose-manual max-w-none", className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkBreaks]}
        components={{
          a: ({ href, children }) => {
            const url = href ?? "#";
            if (url.startsWith("/") && !url.startsWith("//")) {
              return <Link href={url}>{children}</Link>;
            }
            return (
              <a href={url} target="_blank" rel="noreferrer">
                {children}
              </a>
            );
          },
          table: ({ children }) => (
            <div className="not-prose my-6 overflow-x-auto rounded-lg ring-1 ring-border">
              <table className="w-full border-collapse text-left font-sans text-[0.9em] leading-relaxed [&_td]:border-t [&_td]:border-border [&_td]:px-3 [&_td]:py-2.5 [&_td]:align-top [&_th]:bg-paper-deep [&_th]:px-3 [&_th]:py-2.5 [&_th]:font-semibold">
                {children}
              </table>
            </div>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
