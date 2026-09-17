import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { PART_ORDER, type Level, type Part } from "@/lib/taxonomy";

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

let cache: Chapter[] | null = null;

function loadAll(): Chapter[] {
  if (cache) return cache;
  const files = fs
    .readdirSync(CONTENT_DIR)
    .filter((file) => file.endsWith(".md"))
    .sort();

  const chapters = files.map((file) => {
    const raw = fs.readFileSync(path.join(CONTENT_DIR, file), "utf8");
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
      readingMinutes: Math.max(1, Math.round(plainLength / CHARS_PER_MINUTE)),
      content,
    } satisfies Chapter;
  });

  chapters.sort((a, b) => a.order - b.order);
  cache = chapters;
  return chapters;
}

export function getAllChapters(): ChapterMeta[] {
  return loadAll().map((chapter) => {
    const meta: ChapterMeta & { content?: string } = { ...chapter };
    delete meta.content;
    return meta;
  });
}

export function getChapter(slug: string): Chapter | null {
  return loadAll().find((chapter) => chapter.slug === slug) ?? null;
}

export function getAdjacentChapters(slug: string): {
  prev: ChapterMeta | null;
  next: ChapterMeta | null;
} {
  const all = getAllChapters();
  const index = all.findIndex((chapter) => chapter.slug === slug);
  return {
    prev: index > 0 ? all[index - 1] : null,
    next: index >= 0 && index < all.length - 1 ? all[index + 1] : null,
  };
}

export function getChaptersByPart(): { part: Part; chapters: ChapterMeta[] }[] {
  const all = getAllChapters();
  return PART_ORDER.map((part) => ({
    part,
    chapters: all.filter((chapter) => chapter.part === part),
  })).filter((group) => group.chapters.length > 0);
}

export function getMatrix(): Record<
  "iq" | "eq",
  Partial<Record<Level, ChapterMeta>>
> {
  const all = getAllChapters();
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
