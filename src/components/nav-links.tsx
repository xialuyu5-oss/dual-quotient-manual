"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/manual", label: "手册", match: (p: string) => p.startsWith("/manual") },
  { href: "/assessment", label: "自测", match: (p: string) => p.startsWith("/assessment") },
  { href: "/practice", label: "日课", match: (p: string) => p.startsWith("/practice") },
] as const;

export function NavLinks() {
  const pathname = usePathname();
  return (
    <nav aria-label="主导航" className="flex items-center gap-1 sm:gap-2">
      {LINKS.map((link) => {
        const active = link.match(pathname);
        return (
          <Link
            key={link.href}
            href={link.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "rounded-md px-3 py-1.5 text-sm transition-colors hover:bg-accent hover:text-foreground",
              active
                ? "bg-accent font-medium text-foreground"
                : "text-muted-foreground",
            )}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
