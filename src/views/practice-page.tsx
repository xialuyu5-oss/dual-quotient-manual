"use client";

import { useI18n } from "@/components/i18n-provider";
import type { ChapterInfo } from "@/lib/page-data";
import { Practice } from "@/components/practice/practice";

export default function PracticePage({chapters}: {chapters: ChapterInfo}) {
  const { t } = useI18n();

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <header className="mb-8">
        <p className="mb-2 font-serif text-sm tracking-[0.3em] text-primary">{t("日课")}</p>
        <h1 className="font-serif text-3xl font-semibold tracking-wide sm:text-4xl">{t("贵在不断，不贵在多")}</h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">{t("读书不二：一书未完，不看他书。日课五项，周课六项。做不到三十分钟，就删到十分钟，但每天做。")}</p>
      </header>
      <Practice chapters={chapters} />
    </div>
  );
}
