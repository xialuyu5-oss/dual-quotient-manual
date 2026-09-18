import type { Metadata, Viewport } from "next";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export const metadata: Metadata = {
  title: {
    default: "双商训练手册 · 从聪明到智慧，从术器到道法",
    template: "%s · 双商训练手册",
  },
  description:
    "一本关于智商与情商如何沿同一张地图向上修炼的手册：器可传、术可练、法可立、道可养。附自测与日课。",
};

export const viewport: Viewport = {
  themeColor: "#f7f3ea",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="zh-CN" className="h-full antialiased">
      <head>
        {process.env.DQ_PORTABLE !== "1" && <>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        {/* Loaded at runtime rather than via next/font so builds never depend on
            fetching the very large CJK font set; system fonts are the fallback. */}
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@400;600;700&family=Noto+Sans+SC:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
        </>}
      </head>
      <body className="flex min-h-full flex-col">
        <SiteHeader />
        <div className="flex-1">{children}</div>
        <SiteFooter />
      </body>
    </html>
  );
}
