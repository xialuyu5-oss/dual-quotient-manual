"use client";

import { usePathname, useRouter } from "next/navigation";
import { LanguagesIcon } from "lucide-react";
import { useI18n } from "@/components/i18n-provider";
import { isLocale, languageLabel, LOCALES, localizedPath } from "@/lib/i18n/locales";

export function LanguageSwitcher() {
  const { locale, t } = useI18n();
  const pathname = usePathname();
  const router = useRouter();
  return (
    <label className="inline-flex min-w-0 items-center gap-1.5 text-sm">
      <LanguagesIcon className="size-4 shrink-0" aria-hidden />
      <span className="sr-only">{t("语言")}</span>
      <select
        value={locale}
        className="max-w-56 rounded-md border border-border bg-card px-2 py-1.5 text-foreground focus-visible:outline-2 focus-visible:outline-primary"
        onChange={(event) => {
          const next = event.target.value;
          if (!isLocale(next)) return;
          // Keep the same chapter, query and anchor. Learning records are shared
          // through the existing origin-scoped storage keys, never copied/reset.
          router.push(localizedPath(next, pathname) + window.location.search + window.location.hash);
        }}
      >
        {LOCALES.map((code) => <option key={code} value={code}>{languageLabel(code, locale)}</option>)}
      </select>
    </label>
  );
}
