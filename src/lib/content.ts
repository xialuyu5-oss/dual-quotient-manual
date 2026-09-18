import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { PART_ORDER, type Level, type Part } from "@/lib/taxonomy";
import { DEFAULT_LOCALE, type Locale } from "@/lib/i18n/locales";

export * from "@/lib/taxonomy";

export interface ChapterMeta {
  slug: string;
  label: string;
  title: string;
  subtitle: string;
  part: Part;
  level?: Level;
  order: number;
  summary: string;
  readingMinutes: number;
}

export interface Chapter extends ChapterMeta {
  content: string;
}

const CONTENT_DIR = path.join(process.cwd(), "content");

// Chinese reads at roughly 400 characters per minute for reflective prose.
const CHARS_PER_MINUTE = 400;

const cache = new Map<Locale, Chapter[]>();

function loadAll(locale: Locale = DEFAULT_LOCALE): Chapter[] {
  const existing = cache.get(locale);
  if (existing) return existing;
  const directory = locale === DEFAULT_LOCALE ? CONTENT_DIR : path.join(CONTENT_DIR, locale);
  const files = fs
    .readdirSync(directory)
    .filter((file) => file.endsWith(".md"))
    .sort();

  const chapters = files.map((file) => {
    const raw = fs.readFileSync(path.join(directory, file), "utf8");
    const { data, content } = matter(raw);
    const plainLength = content.replace(/[#>*|`\-\s]/g, "").length;
    return {
      slug: String(data.slug),
      label: String(data.label),
      title: String(data.title),
      subtitle: String(data.subtitle ?? ""),
      part: data.part as Part,
      level: data.level as Level | undefined,
      order: Number(data.order),
      summary: String(data.summary ?? ""),
      readingMinutes: Math.max(1, Math.round(
        locale.startsWith("zh") || locale === "ja" || locale === "ko"
          ? plainLength / CHARS_PER_MINUTE
          : content.trim().split(/\s+/).length / 200,
      )),
      content,
    } satisfies Chapter;
  });

  chapters.sort((a, b) => a.order - b.order);
  cache.set(locale, chapters);
  return chapters;
}

export function getAllChapters(locale: Locale = DEFAULT_LOCALE): ChapterMeta[] {
  return loadAll(locale).map((chapter) => {
    const meta: ChapterMeta & { content?: string } = { ...chapter };
    delete meta.content;
    return meta;
  });
}

export function getChapter(slug: string, locale: Locale = DEFAULT_LOCALE): Chapter | null {
  return loadAll(locale).find((chapter) => chapter.slug === slug) ?? null;
}

export function getAdjacentChapters(slug: string, locale: Locale = DEFAULT_LOCALE): {
  prev: ChapterMeta | null;
  next: ChapterMeta | null;
} {
  const all = getAllChapters(locale);
  const index = all.findIndex((chapter) => chapter.slug === slug);
  return {
    prev: index > 0 ? all[index - 1] : null,
    next: index >= 0 && index < all.length - 1 ? all[index + 1] : null,
  };
}

export function getChaptersByPart(locale: Locale = DEFAULT_LOCALE): { part: Part; chapters: ChapterMeta[] }[] {
  const all = getAllChapters(locale);
  return PART_ORDER.map((part) => ({
    part,
    chapters: all.filter((chapter) => chapter.part === part),
  })).filter((group) => group.chapters.length > 0);
}

export function getMatrix(locale: Locale = DEFAULT_LOCALE): Record<
  "iq" | "eq",
  Partial<Record<Level, ChapterMeta>>
> {
  const all = getAllChapters(locale);
  const matrix: Record<"iq" | "eq", Partial<Record<Level, ChapterMeta>>> = {
    iq: {},
    eq: {},
  };
  for (const chapter of all) {
    if ((chapter.part === "iq" || chapter.part === "eq") && chapter.level) {
      matrix[chapter.part][chapter.level] = chapter;
    }
  }
  return matrix;
}
