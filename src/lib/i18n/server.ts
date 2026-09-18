import fs from "node:fs";
import path from "node:path";
import { LOCALES, DEFAULT_LOCALE, isLocale, type Locale } from "./locales";
import { createTranslator, type Messages } from "./messages";

const cache = new Map<Locale, Messages>();
export function getMessages(locale: Locale): Messages {
  const found = cache.get(locale);
  if (found) return found;
  // Fail the build for a missing dictionary; never publish a partially translated
  // locale by silently replacing it with Chinese.
  const messages = JSON.parse(fs.readFileSync(path.join(process.cwd(), "src/lib/i18n/dictionaries", `${locale}.json`), "utf8")) as Messages;
  cache.set(locale, messages);
  return messages;
}
export function getTranslator(locale: Locale) { return createTranslator(getMessages(locale)); }

export function buildLocales(): readonly Locale[] {
  const requested = process.env.DQ_BUILD_LOCALES?.split(",");
  if (!requested) return LOCALES;
  if (!requested.length || !requested.every(isLocale)) throw new Error("Invalid DQ_BUILD_LOCALES");
  return requested;
}

export function parseRoute(route: string[] = []) {
  const hasPrefix = isLocale(route[0] ?? "");
  const locale: Locale = hasPrefix ? route[0] as Locale : DEFAULT_LOCALE;
  const parts = hasPrefix ? route.slice(1) : route;
  return { locale, parts, path: "/" + parts.join("/"), legacy: !hasPrefix };
}
