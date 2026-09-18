import type { Viewport } from "next";
import "../globals.css";
import { I18nProvider } from "@/components/i18n-provider";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { getMessages, parseRoute } from "@/lib/i18n/server";

export const viewport: Viewport = { themeColor: "#f7f3ea", width: "device-width", initialScale: 1 };

export default async function RootLayout({children, params}: {
  children: React.ReactNode; params: Promise<{route?: string[]}>;
}) {
  const {locale} = parseRoute((await params).route);
  return (
    <html lang={locale} className="h-full antialiased">
      <head>
        {process.env.DQ_PORTABLE !== "1" && <>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          {/* Runtime fonts keep builds independent of Google availability. */}
          {/* eslint-disable-next-line @next/next/no-page-custom-font */}
          <link href="https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@400;600;700&family=Noto+Sans+SC:wght@400;500;700&display=swap" rel="stylesheet" />
        </>}
      </head>
      <body className="flex min-h-full flex-col">
        <I18nProvider locale={locale} messages={getMessages(locale)}>
          <SiteHeader />
          <div className="flex-1">{children}</div>
          <SiteFooter />
        </I18nProvider>
      </body>
    </html>
  );
}
