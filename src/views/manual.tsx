"use client";

import { useI18n } from "@/components/i18n-provider";
import { LocaleLink as Link } from "@/components/locale-link";
import { ArrowRightIcon } from "lucide-react";
import { PARTS } from "@/lib/taxonomy";
import type { ChapterGroup } from "@/lib/page-data";
import { LevelBadge } from "@/components/level-badge";

export default function ManualIndexPage({groups}: {groups: ChapterGroup[]}) {
  const { t, tx } = useI18n();
  const total = groups.reduce((sum, group) => sum + group.chapters.length, 0);
  const minutes = groups.reduce(
    (sum, group) =>
      sum + group.chapters.reduce((acc, chapter) => acc + chapter.readingMinutes, 0),
    0,
  );

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-14">
      <header className="mb-10">
        <p className="mb-2 font-serif text-sm tracking-widest text-primary">{t("目录")}</p>
        <h1 className="font-serif text-3xl font-semibold tracking-wide sm:text-4xl">{t("全书十八篇")}</h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          {t("共 {total} 篇，通读约 {minutes} 分钟。不必按顺序：先做自测，再从你薄弱的那一层读起。", {total, minutes})}{t("智商与情商两条路各有器、术、法、道四篇，可以并行读同一层。")}</p>
      </header>

      <div className="space-y-12">
        {groups.map(({ part, chapters }) => (
          <section key={part}>
            <div className="mb-4 flex items-baseline justify-between gap-4 border-b border-border pb-2">
              <h2 className="font-serif text-xl font-semibold tracking-wide">
                {tx(PARTS[part].title)}
              </h2>
              <p className="hidden text-sm text-muted-foreground sm:block">
                {tx(PARTS[part].subtitle)}
              </p>
            </div>
            <ol className="grid gap-3 sm:grid-cols-2">
              {chapters.map((chapter) => (
                <li key={chapter.slug}>
                  <Link
                    href={`/manual/${chapter.slug}`}
                    className="group flex h-full flex-col gap-2 rounded-lg bg-card p-4 ring-1 ring-border transition-all hover:-translate-y-0.5 hover:bg-accent/50 hover:shadow-sm"
                  >
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="font-serif">{tx(chapter.label)}</span>
                      {chapter.level && <LevelBadge level={chapter.level} />}
                      <span className="ml-auto">{t("{minutes} 分钟", {minutes: chapter.readingMinutes})}</span>
                    </div>
                    <h3 className="font-serif text-lg font-semibold leading-snug">
                      {tx(chapter.title)}
                    </h3>
                    <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                      {tx(chapter.summary)}
                    </p>
                    <span className="mt-auto inline-flex items-center gap-1 pt-1 text-xs font-medium text-primary">{t("阅读")}<ArrowRightIcon className="size-3.5 transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </Link>
                </li>
              ))}
            </ol>
          </section>
        ))}
      </div>
    </div>
  );
}
