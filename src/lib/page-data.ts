import type { Chapter, ChapterMeta } from "./content";
import type { Level, Part } from "./taxonomy";
export type ChapterGroup = { part: Part; chapters: ChapterMeta[] };
export type ChapterInfo = Record<string, {label: string; title: string}>;
export type HomeData = {
  groups: ChapterGroup[];
  matrix: Record<"iq" | "eq", Partial<Record<Level, ChapterMeta>>>;
};
export type ChapterData = {
  slug: string; chapter: Chapter; prev: ChapterMeta | null;
  next: ChapterMeta | null; groups: ChapterGroup[];
};
