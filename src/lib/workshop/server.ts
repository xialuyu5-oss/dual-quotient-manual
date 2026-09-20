import fs from "node:fs";
import path from "node:path";
import type { Locale } from "../i18n/locales";
import type { WorkshopContent } from "./types";

const cache = new Map<Locale, WorkshopContent>();
export function getWorkshop(locale: Locale): WorkshopContent {
  const cached = cache.get(locale);
  if (cached) return cached;
  const content = JSON.parse(fs.readFileSync(path.join(process.cwd(), "content/workshop", `${locale}.json`), "utf8")) as WorkshopContent;
  cache.set(locale, content);
  return content;
}
