import Link from "next/link";
import type { ChapterMeta } from "@/lib/content";
import { PARTS, type Part } from "@/lib/taxonomy";
import { LEVEL_DOT } from "@/components/level-badge";
import { cn } from "@/lib/utils";

export function TocList({
  groups,
  currentSlug,
  compact = false,
}: {
  groups: { part: Part; chapters: ChapterMeta[] }[];
  currentSlug?: string;
  compact?: boolean;
}) {
  return (
    <nav aria-label="目录" className={cn("space-y-6", compact && "space-y-5")}>
      {groups.map(({ part, chapters }) => (
        <section key={part}>
          <h3
            className={cn(
              "font-serif font-semibold tracking-wide text-foreground/80",
              compact ? "mb-2 text-xs" : "mb-3 text-sm",
            )}
          >
            {PARTS[part].title}
          </h3>
          <ul className={cn("space-y-1", !compact && "space-y-1.5")}>
            {chapters.map((chapter) => {
              const active = chapter.slug === currentSlug;
              return (
                <li key={chapter.slug}>
                  <Link
                    href={`/manual/${chapter.slug}`}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "group flex items-baseline gap-2 rounded-md px-2 py-1.5 transition-colors hover:bg-accent/70",
                      compact ? "text-[13px]" : "text-sm",
                      active && "bg-accent font-medium",
                    )}
                  >
                    <span
                      className={cn(
                        "shrink-0 font-serif tabular-nums text-muted-foreground",
                        compact ? "w-12 text-[11px]" : "w-14 text-xs",
                      )}
                    >
                      {chapter.label}
                    </span>
                    <span className="flex min-w-0 flex-1 items-baseline gap-1.5">
                      {chapter.level && (
                        <span
                          aria-hidden
                          className={cn(
                            "inline-block size-1.5 shrink-0 translate-y-[-1px] rounded-full",
                            LEVEL_DOT[chapter.level],
                          )}
                        />
                      )}
                      <span className="truncate">{chapter.title}</span>
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </nav>
  );
}
