"use client";

import { useI18n } from "@/components/i18n-provider";
import type { ChapterInfo } from "@/lib/page-data";
import { Assessment } from "@/components/assessment/assessment";

export default function AssessmentPage({chapters}: {chapters: ChapterInfo}) {
  const { t } = useI18n();

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14">
      <header className="mx-auto mb-10 max-w-2xl text-center">
        <p className="mb-2 font-serif text-sm tracking-[0.3em] text-primary">{t("自知")}</p>
        <h1 className="font-serif text-3xl font-semibold tracking-wide sm:text-4xl">{t("先给自己定位")}</h1>
        <p className="mt-3 text-muted-foreground">{t("知人者智，自知者明。二十四题，看你在两条路上各站在哪一层。")}</p>
      </header>
      <Assessment chapters={chapters} />
    </div>
  );
}
