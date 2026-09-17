import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeftIcon, ArrowRightIcon, ClockIcon } from "lucide-react";
import {
  PARTS,
  getAdjacentChapters,
  getAllChapters,
  getChapter,
  getChaptersByPart,
} from "@/lib/content";
import { Markdown } from "@/components/markdown";
import { TocList } from "@/components/toc";
import { MobileToc } from "@/components/mobile-toc";
import { LevelBadge } from "@/components/level-badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

export function generateStaticParams() {
  return getAllChapters().map((chapter) => ({ slug: chapter.slug }));
}

export async function generateMetadata(
  props: PageProps<"/manual/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const chapter = getChapter(slug);
  if (!chapter) return { title: "未找到" };
  return {
    title: `${chapter.label} ${chapter.title}`,
    description: chapter.summary,
  };
}

export default async function ChapterPage(props: PageProps<"/manual/[slug]">) {
  const { slug } = await props.params;
  const chapter = getChapter(slug);
  if (!chapter) notFound();

  const { prev, next } = getAdjacentChapters(slug);
  const groups = getChaptersByPart();

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6">
      <div className="lg:grid lg:grid-cols-[260px_minmax(0,1fr)] lg:gap-12">
        <aside className="hidden lg:block">
          <div className="sticky top-14 max-h-[calc(100vh-3.5rem)] overflow-y-auto py-10 pr-2 [scrollbar-width:thin]">
            <TocList groups={groups} currentSlug={slug} compact />
          </div>
        </aside>

        <div className="min-w-0 py-8 lg:py-10">
          <div className="mb-6 flex items-center justify-between gap-3 lg:hidden">
            <MobileToc>
              <TocList groups={groups} currentSlug={slug} compact />
            </MobileToc>
            <span className="text-xs text-muted-foreground">
              {PARTS[chapter.part].title}
            </span>
          </div>

          <article className="mx-auto max-w-3xl">
            <header className="mb-10">
              <div className="mb-4 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                <span className="hidden lg:inline">{PARTS[chapter.part].title}</span>
                <span className="hidden lg:inline">·</span>
                <span className="font-serif">{chapter.label}</span>
                {chapter.level && <LevelBadge level={chapter.level} withShort />}
                <span className="ml-auto inline-flex items-center gap-1">
                  <ClockIcon className="size-3.5" />
                  约 {chapter.readingMinutes} 分钟
                </span>
              </div>
              <h1 className="font-serif text-3xl font-semibold leading-snug tracking-wide text-balance sm:text-4xl">
                {chapter.title}
              </h1>
              {chapter.subtitle && (
                <p className="mt-3 font-serif text-lg text-muted-foreground">
                  {chapter.subtitle}
                </p>
              )}
            </header>

            <Markdown content={chapter.content} />

            <Separator className="my-12" />

            <nav
              aria-label="章节导航"
              className="grid gap-3 sm:grid-cols-2"
            >
              <AdjacentLink chapter={prev} direction="prev" />
              <AdjacentLink chapter={next} direction="next" />
            </nav>

            {(slug === "know-thyself" || slug === "practice-plan") && (
              <div className="mt-8 rounded-lg bg-paper-deep p-5 text-sm">
                {slug === "know-thyself" ? (
                  <p>
                    本章配套的自测在
                    <Link href="/assessment" className="mx-1 font-medium text-primary underline underline-offset-4">
                      「自测」页面
                    </Link>
                    ，二十四题，约五分钟。
                  </p>
                ) : (
                  <p>
                    本章的日课与周课可以在
                    <Link href="/practice" className="mx-1 font-medium text-primary underline underline-offset-4">
                      「日课」页面
                    </Link>
                    逐项打勾，记录会保存在本机浏览器里。
                  </p>
                )}
              </div>
            )}
          </article>
        </div>
      </div>
    </div>
  );
}

function AdjacentLink({
  chapter,
  direction,
}: {
  chapter: ReturnType<typeof getAdjacentChapters>["prev"];
  direction: "prev" | "next";
}) {
  if (!chapter) {
    return <div aria-hidden className="hidden sm:block" />;
  }
  const isNext = direction === "next";
  return (
    <Link
      href={`/manual/${chapter.slug}`}
      className={cn(
        "group flex flex-col gap-1 rounded-lg bg-card p-4 ring-1 ring-border transition-colors hover:bg-accent/60",
        isNext ? "items-end text-right" : "items-start",
      )}
    >
      <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
        {!isNext && <ArrowLeftIcon className="size-3.5 transition-transform group-hover:-translate-x-0.5" />}
        {isNext ? "下一篇" : "上一篇"}
        {isNext && <ArrowRightIcon className="size-3.5 transition-transform group-hover:translate-x-0.5" />}
      </span>
      <span className="font-serif text-sm font-medium">
        <span className="mr-1.5 text-muted-foreground">{chapter.label}</span>
        {chapter.title}
      </span>
    </Link>
  );
}
