"use client";

import { createContext, useContext, useMemo } from "react";
import { createTranslator, type Messages, type Translator } from "@/lib/i18n/messages";
import type { Locale } from "@/lib/i18n/locales";

type I18nContextValue = { locale: Locale; t: Translator; tx: (value: React.ReactNode) => React.ReactNode };
const I18nContext = createContext<I18nContextValue | null>(null);

/** The server supplies only the active dictionary, not every language. */
export function I18nProvider({
  locale, messages, children,
}: { locale: Locale; messages: Messages; children: React.ReactNode }) {
  const value = useMemo(() => {
    const t = createTranslator(messages);
    return { locale, t, tx: (node: React.ReactNode) => typeof node === "string" ? t(node) : node };
  }, [locale, messages]);
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nContextValue {
  const value = useContext(I18nContext);
  if (!value) throw new Error("useI18n must be used within I18nProvider");
  return value;
}
