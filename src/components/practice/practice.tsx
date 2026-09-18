"use client";

import { useI18n } from "@/components/i18n-provider";
import { formatDate } from "@/lib/i18n/locales";
import { useMemo, useState } from "react";
import { LocaleLink as Link } from "@/components/locale-link";
import { ArrowUpRightIcon, FlameIcon } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { useNow } from "@/hooks/use-now";
import {
  DAILY_ITEMS,
  EMPTY_STORE,
  WEEKLY_ITEMS,
  computeStreak,
  countCompletedDays,
  dayKey,
  isDayComplete,
  shiftDay,
  weekKey,
  type PracticeItem,
  type PracticeStore,
} from "@/lib/practice";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "dq.practice.v1";

type ChapterInfo = Record<string, { label: string; title: string }>;

function normalizeStore(parsed: unknown): PracticeStore {
  const candidate = (parsed ?? {}) as Partial<PracticeStore>;
  return {
    days: candidate.days ?? {},
    weeks: candidate.weeks ?? {},
  };
}

function toggle(list: string[], id: string): string[] {
  return list.includes(id) ? list.filter((x) => x !== id) : [...list, id];
}

export function Practice({ chapters }: { chapters: ChapterInfo }) {
  const { t, tx, locale } = useI18n();
  const [store, setStore] = useLocalStorage<PracticeStore>(
    STORAGE_KEY,
    EMPTY_STORE,
    normalizeStore,
  );
  const today = useNow();
  const [confirmingReset, setConfirmingReset] = useState(false);

  const todayKey = today ? dayKey(today) : null;
  const thisWeekKey = today ? weekKey(today) : null;
  const doneToday = todayKey ? store.days[todayKey] ?? [] : [];
  const doneWeek = thisWeekKey ? store.weeks[thisWeekKey] ?? [] : [];

  const streak = today ? computeStreak(store, today) : 0;
  const totalDays = countCompletedDays(store);

  const recentDays = useMemo(() => {
    if (!today) return [];
    return Array.from({ length: 14 }, (_, i) => {
      const date = shiftDay(today, i - 13);
      const key = dayKey(date);
      const done = store.days[key]?.length ?? 0;
      return { key, date, done, complete: isDayComplete(store, key) };
    });
  }, [store, today]);

  function toggleDaily(id: string) {
    if (!todayKey) return;
    setStore((prev) => ({
      ...prev,
      days: { ...prev.days, [todayKey]: toggle(prev.days[todayKey] ?? [], id) },
    }));
  }

  function toggleWeekly(id: string) {
    if (!thisWeekKey) return;
    setStore((prev) => ({
      ...prev,
      weeks: { ...prev.weeks, [thisWeekKey]: toggle(prev.weeks[thisWeekKey] ?? [], id) },
    }));
  }

  function resetAll() {
    setStore(EMPTY_STORE);
    setConfirmingReset(false);
  }

  const allDailyDone = doneToday.length === DAILY_ITEMS.length;

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
      <div className="space-y-8">
        {/* Daily */}
        <section className="rounded-xl bg-card ring-1 ring-border">
          <header className="flex flex-wrap items-end justify-between gap-3 border-b border-border px-5 py-4 sm:px-6">
            <div>
              <p className="text-xs tracking-widest text-muted-foreground">{t("日课 · 约三十分钟")}</p>
              <h2 className="mt-0.5 font-serif text-xl font-semibold">
                {today ? formatDate(locale, today) : t("今日")}
              </h2>
            </div>
            <p className="font-serif text-sm tabular-nums text-muted-foreground">
              {tx(doneToday.length)} / {tx(DAILY_ITEMS.length)}
            </p>
          </header>
          <ChecklistBody
            items={DAILY_ITEMS}
            done={doneToday}
            onToggle={toggleDaily}
            chapters={chapters}
            idPrefix="daily"
            disabled={!today}
          />
          <footer className="border-t border-border px-5 py-3 text-sm text-muted-foreground sm:px-6">
            {allDailyDone
              ? t("今天的日课已完成。贵在不断，不贵在多——明天再来。")
              : t("中断不是失败，中断之后不回来才是。做不完就做一项，但每天做。")}
          </footer>
        </section>

        {/* Weekly */}
        <section className="rounded-xl bg-card ring-1 ring-border">
          <header className="flex flex-wrap items-end justify-between gap-3 border-b border-border px-5 py-4 sm:px-6">
            <div>
              <p className="text-xs tracking-widest text-muted-foreground">{t("周课 · 约一小时，建议周日")}</p>
              <h2 className="mt-0.5 font-serif text-xl font-semibold">{t("本周")}</h2>
            </div>
            <p className="font-serif text-sm tabular-nums text-muted-foreground">
              {tx(doneWeek.length)} / {tx(WEEKLY_ITEMS.length)}
            </p>
          </header>
          <ChecklistBody
            items={WEEKLY_ITEMS}
            done={doneWeek}
            onToggle={toggleWeekly}
            chapters={chapters}
            idPrefix="weekly"
            disabled={!today}
          />
        </section>
      </div>

      {/* Side */}
      <aside className="space-y-4 lg:sticky lg:top-20 lg:self-start">
        <div className="rounded-xl bg-card p-5 ring-1 ring-border">
          <div className="flex items-center gap-3">
            <span
              className={cn(
                "grid size-10 place-items-center rounded-lg",
                streak > 0 ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground",
              )}
            >
              <FlameIcon className="size-5" />
            </span>
            <div>
              <p className="text-xs text-muted-foreground">{t("连续完成")}</p>
              <p className="font-serif text-2xl font-semibold tabular-nums">
                {tx(streak)} <span className="text-sm font-normal text-muted-foreground">{t("天")}</span>
              </p>
            </div>
            <div className="ml-auto text-right">
              <p className="text-xs text-muted-foreground">{t("累计")}</p>
              <p className="font-serif text-2xl font-semibold tabular-nums">
                {tx(totalDays)} <span className="text-sm font-normal text-muted-foreground">{t("天")}</span>
              </p>
            </div>
          </div>
          <div className="mt-5">
            <p className="mb-2 text-xs text-muted-foreground">{t("近十四天")}</p>
            <div className="grid grid-cols-14 gap-1">
              {recentDays.map((day) => (
                <span
                  key={day.key}
                  title={`${formatDate(locale, day.date)}: ${day.done} / ${DAILY_ITEMS.length}`}
                  className={cn(
                    "aspect-square rounded-[3px]",
                    day.complete
                      ? "bg-primary"
                      : day.done > 0
                        ? "bg-primary/35"
                        : "bg-muted",
                  )}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-xl bg-paper-deep p-5 text-sm leading-relaxed">
          <p className="font-serif text-base font-semibold">{t("三条提醒")}</p>
          <ul className="mt-2 space-y-2 text-muted-foreground">
            <li>{t("你会中断。中断了，第二天照做，不补，不自责。")}</li>
            <li>{t("进步是看不见的。心性的变化以年为单位。")}</li>
            <li>{t("手册会过时，你不会。留下有用的，扔掉其余的。")}</li>
          </ul>
          <Link
            href="/manual/practice-plan"
            className="mt-3 inline-flex items-center gap-1 text-primary hover:underline underline-offset-4"
          >{t("第十四章 · 修炼计划")}<ArrowUpRightIcon className="size-3.5" />
          </Link>
        </div>

        <div className="px-1 text-xs text-muted-foreground">{t("记录只保存在本机浏览器。")}{confirmingReset ? (
            <span className="ml-1 inline-flex items-center gap-2">{t("确定清除全部记录？")}<Button size="xs" variant="destructive" onClick={resetAll}>{t("清除")}</Button>
              <Button size="xs" variant="ghost" onClick={() => setConfirmingReset(false)}>{t("取消")}</Button>
            </span>
          ) : (
            <button
              type="button"
              className="ml-1 underline underline-offset-4 hover:text-foreground"
              onClick={() => setConfirmingReset(true)}
            >{t("清除全部记录")}</button>
          )}
        </div>
      </aside>
    </div>
  );
}

function ChecklistBody({
  items,
  done,
  onToggle,
  chapters,
  idPrefix,
  disabled,
}: {
  items: PracticeItem[];
  done: string[];
  onToggle: (id: string) => void;
  chapters: ChapterInfo;
  idPrefix: string;
  disabled: boolean;
}) {
  const { t, tx } = useI18n();
  return (
    <ul className="divide-y divide-border">
      {items.map((item) => {
        const checked = done.includes(item.id);
        const inputId = `${idPrefix}-${item.id}`;
        const chapter = item.chapter ? chapters[item.chapter] : undefined;
        return (
          <li
            key={item.id}
            className={cn(
              "flex gap-4 px-5 py-4 transition-colors sm:px-6",
              checked && "bg-paper-deep/50",
            )}
          >
            <Checkbox
              id={inputId}
              checked={checked}
              disabled={disabled}
              onCheckedChange={() => onToggle(item.id)}
              className="mt-1.5 size-5 rounded-[5px]"
            />
            <div className="min-w-0 flex-1">
              <label
                htmlFor={inputId}
                className={cn(
                  "flex cursor-pointer flex-wrap items-baseline gap-x-2 font-serif text-base font-semibold",
                  checked && "text-muted-foreground line-through decoration-primary/60",
                )}
              >
                {tx(item.title)}
                {item.minutes && (
                  <span className="font-sans text-xs font-normal text-muted-foreground no-underline">
                    {t("{minutes} 分钟", {minutes: item.minutes})}
                  </span>
                )}
              </label>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{tx(item.detail)}</p>
              {chapter && item.chapter && (
                <Link
                  href={`/manual/${item.chapter}`}
                  className="mt-1.5 inline-flex items-center gap-1 text-xs text-primary hover:underline underline-offset-4"
                >
                  {tx(chapter.label)} · {tx(chapter.title)}
                  <ArrowUpRightIcon className="size-3" />
                </Link>
              )}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
