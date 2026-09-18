"use client";

import { useI18n } from "@/components/i18n-provider";
import { LocaleLink as Link } from "@/components/locale-link";
import { NavLinks } from "@/components/nav-links";
import { LanguageSwitcher } from "@/components/language-switcher";

export function SiteHeader() {
  const { t } = useI18n();
  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-paper/85 backdrop-blur supports-[backdrop-filter]:bg-paper/70">
      <div className="mx-auto flex min-h-14 max-w-6xl flex-wrap items-center justify-between gap-x-4 gap-y-2 px-4 py-2 sm:px-6">
        <Link
          href="/"
          className="group flex min-w-0 items-center gap-2.5 font-serif text-base font-semibold tracking-wide"
        >
          <span
            aria-hidden
            className="grid size-7 place-items-center rounded-sm bg-primary font-serif text-sm leading-none text-primary-foreground shadow-sm transition-transform group-hover:-rotate-3"
          >{t("道")}</span>
          <span>{t("双商训练手册")}</span>
        </Link>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2"><NavLinks /><LanguageSwitcher /></div>
      </div>
    </header>
  );
}
