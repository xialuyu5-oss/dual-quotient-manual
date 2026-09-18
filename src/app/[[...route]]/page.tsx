import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Home from "@/views/home";
import Manual from "@/views/manual";
import Chapter from "@/views/chapter";
import Assessment from "@/views/assessment-page";
import Practice from "@/views/practice-page";
import { getAllChapters, getAdjacentChapters, getChapter, getChaptersByPart, getMatrix } from "@/lib/content";
import { buildLocales, getTranslator, parseRoute } from "@/lib/i18n/server";
import { LOCALES, localizedPath } from "@/lib/i18n/locales";

type Props = {params: Promise<{route?: string[]}>};
export const dynamicParams = false;

export function generateStaticParams() {
  const paths = [[], ["manual"], ["assessment"], ["practice"], ...getAllChapters().map(ch => ["manual", ch.slug])];
  return [
    ...paths.map(route => ({route})),
    ...buildLocales().flatMap(locale => paths.map(route => ({route: [locale, ...route]}))),
  ];
}

export async function generateMetadata({params}: Props): Promise<Metadata> {
  const {locale, path, parts} = parseRoute((await params).route);
  const t = getTranslator(locale);
  const chapter = parts[0] === "manual" && parts.length === 2 ? getChapter(parts[1], locale) : null;
  const name = chapter ? `${chapter.label} ${chapter.title}` : t(path === "/manual" ? "目录" : path === "/assessment" ? "自测" : path === "/practice" ? "日课" : "双商训练手册");
  const site = "https://xialuyu5-oss.github.io/dual-quotient-manual";
  return {
    title: path === "/" ? t("双商训练手册 · 从聪明到智慧，从术器到道法") : `${name} · ${t("双商训练手册")}`,
    description: chapter?.summary ?? t("一本关于智商与情商如何沿同一张地图向上修炼的手册：器可传、术可练、法可立、道可养。附自测与日课。"),
    alternates: {
      canonical: site + localizedPath(locale, path),
      languages: Object.fromEntries(LOCALES.map(lang => [lang, site + localizedPath(lang, path)])),
    },
  };
}

export default async function Page({params}: Props) {
  const {locale, path, parts} = parseRoute((await params).route);
  if (path === "/") return <Home groups={getChaptersByPart(locale)} matrix={getMatrix(locale)} />;
  if (path === "/manual") return <Manual groups={getChaptersByPart(locale)} />;
  if (path === "/assessment" || path === "/practice") {
    const chapters = Object.fromEntries(getAllChapters(locale).map(ch => [ch.slug, {label: ch.label, title: ch.title}]));
    return path === "/assessment" ? <Assessment chapters={chapters} /> : <Practice chapters={chapters} />;
  }
  if (parts.length === 2 && parts[0] === "manual") {
    const chapter = getChapter(parts[1], locale);
    if (chapter) return <Chapter slug={chapter.slug} chapter={chapter} {...getAdjacentChapters(chapter.slug, locale)} groups={getChaptersByPart(locale)} />;
  }
  notFound();
}
