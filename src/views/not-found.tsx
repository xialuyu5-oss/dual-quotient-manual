"use client";

import { useI18n } from "@/components/i18n-provider";
import { LocaleLink as Link } from "@/components/locale-link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  const { t } = useI18n();
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center px-4 py-24 text-center">
      <p className="font-serif text-sm tracking-[0.3em] text-primary">{t("未找到")}</p>
      <h1 className="mt-3 font-serif text-3xl font-semibold">{t("这一页不在手册里")}</h1>
      <p className="mt-3 text-muted-foreground">{t("知之为知之，不知为不知。这个地址我们不知道，但目录里的十八篇都在。")}</p>
      <div className="mt-6 flex gap-3">
        <Button nativeButton={false} render={<Link href="/manual" />}>{t("回到目录")}</Button>
        <Button variant="outline" nativeButton={false} render={<Link href="/" />}>{t("回到首页")}</Button>
      </div>
    </div>
  );
}
