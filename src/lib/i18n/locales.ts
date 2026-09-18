/** Stable URL identifiers, independent of translated display names. */
export const LOCALES = ["zh-CN", "zh-TW", "en", "ja", "ko", "de", "ru", "es", "fr"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "zh-CN";

export const LANGUAGE_NAMES: Record<Locale, string> = {
  "zh-CN": "简体中文",
  "zh-TW": "繁體中文",
  en: "English",
  ja: "日本語",
  ko: "한국어",
  de: "Deutsch",
  ru: "Русский",
  es: "Español",
  fr: "Français",
};

/** Native names remain recognizable; Chinese readers also see familiar labels. */
export function languageLabel(target: Locale, interfaceLocale: Locale): string {
  const names = interfaceLocale === "zh-CN"
    ? { en: "英语", ja: "日语", ko: "韩国语", de: "德语", ru: "俄语", es: "西班牙语", fr: "法语" }
    : interfaceLocale === "zh-TW"
      ? { en: "英語", ja: "日語", ko: "韓國語", de: "德語", ru: "俄語", es: "西班牙語", fr: "法語" }
      : null;
  return names && target in names
    ? `${names[target as keyof typeof names]} · ${LANGUAGE_NAMES[target]}`
    : LANGUAGE_NAMES[target];
}

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}

/** Input is a Next pathname (basePath is handled by Next's Link/router). */
export function stripLocale(pathname: string): string {
  const suffixStart = pathname.search(/[?#]/);
  const path = suffixStart < 0 ? pathname : pathname.slice(0, suffixStart);
  const suffix = suffixStart < 0 ? "" : pathname.slice(suffixStart);
  const segments = path.split("/");
  if (isLocale(segments[1] ?? "")) segments.splice(1, 1);
  return (segments.join("/") || "/") + suffix;
}

export function localizedPath(locale: Locale, pathname: string): string {
  // Leave external, protocol-relative, fragment and query links untouched.
  if (!pathname.startsWith("/") || pathname.startsWith("//")) return pathname;
  const path = stripLocale(pathname);
  return `/${locale}${path === "/" ? "/" : path}`;
}

export function formatNumber(locale: Locale, value: number, decimals = 0): string {
  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

export function formatDate(locale: Locale, value: Date | string | number): string {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat(locale, {
    year: "numeric", month: "short", day: "numeric",
  }).format(date);
}
