import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-border/70 bg-paper-deep/60">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p className="font-serif">
          知之为知之，不知为不知，是知也。
          <span className="ml-2 text-xs">——《论语·为政》</span>
        </p>
        <nav className="flex flex-wrap gap-x-5 gap-y-2">
          <Link href="/manual" className="hover:text-foreground">
            目录
          </Link>
          <Link href="/manual/one-page" className="hover:text-foreground">
            一页纸总纲
          </Link>
          <Link href="/manual/reading-list" className="hover:text-foreground">
            书单
          </Link>
          <Link href="/assessment" className="hover:text-foreground">
            自测
          </Link>
          <Link href="/practice" className="hover:text-foreground">
            日课
          </Link>
        </nav>
      </div>
    </footer>
  );
}
