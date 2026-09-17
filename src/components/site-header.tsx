import Link from "next/link";
import { NavLinks } from "@/components/nav-links";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-paper/85 backdrop-blur supports-[backdrop-filter]:bg-paper/70">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link
          href="/"
          className="group flex items-center gap-2.5 font-serif text-base font-semibold tracking-wide"
        >
          <span
            aria-hidden
            className="grid size-7 place-items-center rounded-sm bg-primary font-serif text-sm leading-none text-primary-foreground shadow-sm transition-transform group-hover:-rotate-3"
          >
            道
          </span>
          <span>双商训练手册</span>
        </Link>
        <NavLinks />
      </div>
    </header>
  );
}
