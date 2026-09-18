"use client";

import { useI18n } from "@/components/i18n-provider";
import { useState, type MouseEvent, type ReactNode } from "react";
import { ListIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export function MobileToc({ children }: { children: ReactNode }) {
  const { t, tx } = useI18n();
  const [open, setOpen] = useState(false);

  function closeOnLink(event: MouseEvent<HTMLDivElement>) {
    if ((event.target as HTMLElement).closest("a")) setOpen(false);
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={<Button variant="outline" size="sm" className="lg:hidden" />}
      >
        <ListIcon data-icon="inline-start" />{t("目录")}</SheetTrigger>
      <SheetContent side="left" className="w-[85vw] overflow-y-auto sm:max-w-sm">
        <SheetHeader className="pb-0">
          <SheetTitle className="font-serif">{t("目录")}</SheetTitle>
          <SheetDescription>{t("序、四部、附录，共十八篇")}</SheetDescription>
        </SheetHeader>
        <div className="px-3 pb-6" onClickCapture={closeOnLink}>
          {tx(children)}
        </div>
      </SheetContent>
    </Sheet>
  );
}
