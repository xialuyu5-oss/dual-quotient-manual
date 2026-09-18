"use client";

import Link from "next/link";
import type { ComponentProps } from "react";
import { useI18n } from "@/components/i18n-provider";
import { localizedPath } from "@/lib/i18n/locales";

export function LocaleLink({ href, ...props }: ComponentProps<typeof Link>) {
  const { locale } = useI18n();
  const target = typeof href === "string"
    ? localizedPath(locale, href)
    : { ...href, pathname: href.pathname ? localizedPath(locale, href.pathname) : href.pathname };
  return <Link {...props} href={target} />;
}
