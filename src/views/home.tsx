"use client";

import { useI18n } from "@/components/i18n-provider";
import type { HomeData } from "@/lib/page-data";
import { LocaleLink as Link } from "@/components/locale-link";
import {
  ArrowRightIcon,
  BookOpenIcon,
  CompassIcon,
  ListChecksIcon,
} from "lucide-react";
import {
  LEVELS,
  LEVEL_ORDER,
  type Level,
} from "@/lib/taxonomy";
import { Button } from "@/components/ui/button";
import { LevelBadge, LEVEL_DOT, LEVEL_TEXT } from "@/components/level-badge";
import { TocList } from "@/components/toc";
import { cn } from "@/lib/utils";

const STAGES = [
  { name: "见器", tip: "停止收集，选三件用满三个月" },
  { name: "习术", tip: "每月一式，练到不用想" },
  { name: "立法", tip: "让好判断不依赖好状态" },
  { name: "悟道", tip: "教、负责、退一步；回到器重新做学生" },
];

const STEPS = [
  {
    icon: CompassIcon,
    title: "先自知",
    body: "二十四题自测，看你在两条路上各站在哪一层。药要对症。",
    href: "/assessment",
    cta: "去自测",
  },
  {
    icon: BookOpenIcon,
    title: "挑一条路",
    body: "读完地图三章，从你薄弱的那一层读起。智商与情商可以并行读同一层。",
    href: "/manual",
    cta: "看目录",
  },
  {
    icon: ListChecksIcon,
    title: "日课不断",
    body: "晨间三问、一次命名、一条决策日志、读一段、晚间复盘。三十分钟，每天。",
    href: "/practice",
    cta: "今日日课",
  },
];

export default function HomePage({matrix,groups}: HomeData) {
  const { t, tx, locale } = useI18n();
  const isCjk = locale.startsWith("zh") || locale === "ja";
  const rows = [...LEVEL_ORDER].reverse();

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6">
      {/* Hero */}
      <section className="grid items-center gap-10 py-14 sm:py-20 lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-16">
        <div className="max-w-2xl">
          <p className="mb-4 font-serif text-sm tracking-[0.3em] text-primary">{t("双商训练手册")}</p>
          <h1 className={cn("font-serif font-semibold leading-[1.25] text-balance", isCjk ? "text-4xl tracking-wide sm:text-5xl lg:text-6xl" : "text-3xl sm:text-4xl lg:text-5xl")}>
            {t("从聪明到智慧，")}
            <span className={cn("block", !isCjk && "mt-4 text-xl font-normal leading-relaxed sm:text-2xl")}>{t("从术器到道法。")}</span>
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-muted-foreground">{t("聪明是解题的速度，智慧是选题与承受的能力。本手册把智商与情商放进「道、法、术、器」的同一张地图，让技巧被消化成判断力。")}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button
              size="lg"
              className="h-10 px-5 text-base"
              nativeButton={false} render={<Link href="/manual/preface" />}
            >{t("从序言开始")}<ArrowRightIcon data-icon="inline-end" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-10 px-5 text-base"
              nativeButton={false} render={<Link href="/assessment" />}
            >{t("先做自测")}</Button>
            <Button
              size="lg"
              variant="ghost"
              className="h-10 px-5 text-base"
              nativeButton={false} render={<Link href="/practice" />}
            >{t("今日日课")}</Button>
          </div>
        </div>

        <div
          aria-hidden
          className={cn("hidden items-stretch gap-3", isCjk ? "lg:flex" : "lg:grid lg:grid-cols-2")}
        >
          {rows.map((level) => (
            <div
              key={level}
              className={cn(
                "flex flex-col items-center justify-between rounded-md bg-card py-5 ring-1 ring-border",
                isCjk ? "w-16" : "w-32 px-2",
              )}
            >
              <span
                className={cn(
                  "font-serif text-4xl font-semibold",
                  LEVEL_TEXT[level],
                )}
              >
                {tx(LEVELS[level].name)}
              </span>
              <span className={cn("mt-4 font-serif text-xs text-muted-foreground", isCjk ? "writing-vertical tracking-[0.35em]" : "w-full break-words hyphens-auto text-center leading-relaxed")}>
                {tx(LEVELS[level].short)}{isCjk ? "·" : <br />}{tx(LEVELS[level].verb)}
              </span>
              <span className={cn("mt-4 size-1.5 rounded-full", LEVEL_DOT[level])} />
            </div>
          ))}
        </div>
      </section>

      {/* Two definitions */}
      <section className="grid gap-4 sm:grid-cols-2">
        <DefinitionCard
          term={t("聪明")}
          gloss={t("解题的能力")}
          body={t("处理信息的速度、广度与技巧。题目在那里，你解得快、解得巧、解得漂亮。它是术与器的极致。")}
          tone="muted"
        />
        <DefinitionCard
          term={t("智慧")}
          gloss={t("选题与承受的能力")}
          body={t("知道什么值得做、知道自己不知道什么，并且能与结果和平共处。它是道与法的开始。")}
          tone="primary"
        />
      </section>

      {/* Matrix */}
      <section className="mt-20">
        <SectionHeading
          kicker={t("一张地图")}
          title={t("双商 × 四层：八个格子")}
          description={t("器可传，术可练，法可立，道可养。学从器入，用从道出。每个格子是一章，点开即读。")}
        />
        <div className="overflow-hidden rounded-xl bg-card ring-1 ring-border">
          <div className="grid grid-cols-[4.5rem_1fr_1fr] sm:grid-cols-[9rem_1fr_1fr]">
            <div className="border-b border-border bg-paper-deep p-3" />
            <div className="border-b border-l border-border bg-paper-deep p-3 sm:p-4">
              <p className="font-serif text-sm font-semibold sm:text-base">{t("智商之路")}</p>
              <p className="hidden text-xs text-muted-foreground sm:block">{t("从聪明到智慧")}</p>
            </div>
            <div className="border-b border-l border-border bg-paper-deep p-3 sm:p-4">
              <p className="font-serif text-sm font-semibold sm:text-base">{t("情商之路")}</p>
              <p className="hidden text-xs text-muted-foreground sm:block">{t("从技巧到心性")}</p>
            </div>

            {rows.map((level, rowIndex) => (
              <MatrixRow
                key={level}
                level={level}
                iq={matrix.iq[level]}
                eq={matrix.eq[level]}
                last={rowIndex === rows.length - 1}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Stages */}
      <section className="mt-20">
        <SectionHeading
          kicker={t("四个阶段")}
          title={t("你现在站在哪一层")}
          description={t("每个阶段的药都不同。聪明人最常犯的错，是在所有阶段都吃同一种药——再学一点新东西。")}
        />
        <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {STAGES.map((stage, index) => (
            <li
              key={stage.name}
              className="relative rounded-lg bg-card p-5 ring-1 ring-border"
            >
              <span className="font-serif text-xs tracking-widest text-muted-foreground">
                {t("第 {number} 阶", {number: index + 1})}
              </span>
              <p
                className={cn(
                  "mt-1 font-serif text-2xl font-semibold",
                  LEVEL_TEXT[LEVEL_ORDER[index]],
                )}
              >
                {tx(stage.name)}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {tx(stage.tip)}
              </p>
            </li>
          ))}
        </ol>
        <p className="mt-4 text-sm text-muted-foreground">{t("不确定自己在哪一阶？")}<Link href="/assessment" className="ml-1 font-medium text-primary underline underline-offset-4">{t("五分钟自测")}</Link>{t("会给你两条路各自的定位，以及你的「错位」形状。")}</p>
      </section>

      {/* How to use */}
      <section className="mt-20">
        <SectionHeading kicker={t("如何使用")} title={t("三步开始")} />
        <div className="grid gap-4 md:grid-cols-3">
          {STEPS.map((step, index) => (
            <div
              key={step.title}
              className="flex flex-col rounded-lg bg-card p-5 ring-1 ring-border"
            >
              <div className="flex items-center gap-3">
                <span className="grid size-9 place-items-center rounded-md bg-primary/10 text-primary">
                  <step.icon className="size-4.5" />
                </span>
                <div>
                  <p className="text-xs text-muted-foreground">{t("第 {number} 步", {number: index + 1})}</p>
                  <h3 className="font-serif text-lg font-semibold">{tx(step.title)}</h3>
                </div>
              </div>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                {tx(step.body)}
              </p>
              <Link
                href={step.href}
                className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline underline-offset-4"
              >
                {tx(step.cta)}
                <ArrowRightIcon className="size-3.5" />
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* TOC */}
      <section className="mt-20 mb-8 grid gap-8 lg:grid-cols-[1fr_2fr]">
        <div>
          <SectionHeading
            kicker={t("目录")}
            title={t("十八篇")}
            description={t("序、地图三章、两条路各四章、合一四章、附录两篇。通读约两小时，修炼以年计。")}
          />
          <Button variant="outline" nativeButton={false} render={<Link href="/manual" />}>{t("完整目录")}<ArrowRightIcon data-icon="inline-end" />
          </Button>
        </div>
        <div className="rounded-xl bg-card p-5 ring-1 ring-border sm:p-6">
          <div className="grid gap-6 sm:grid-cols-2">
            <TocList groups={groups.slice(0, 3)} />
            <TocList groups={groups.slice(3)} />
          </div>
        </div>
      </section>
    </div>
  );
}

function SectionHeading({
  kicker,
  title,
  description,
}: {
  kicker: string;
  title: string;
  description?: string;
}) {
  const { tx } = useI18n();
  return (
    <div className="mb-6">
      <p className="mb-1 font-serif text-xs tracking-[0.3em] text-primary">{tx(kicker)}</p>
      <h2 className="font-serif text-2xl font-semibold tracking-wide sm:text-3xl">
        {tx(title)}
      </h2>
      {description && (
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
          {tx(description)}
        </p>
      )}
    </div>
  );
}

function DefinitionCard({
  term,
  gloss,
  body,
  tone,
}: {
  term: string;
  gloss: string;
  body: string;
  tone: "muted" | "primary";
}) {
  const { tx } = useI18n();
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl p-6 ring-1 ring-border",
        tone === "primary" ? "bg-primary text-primary-foreground" : "bg-card",
      )}
    >
      <span
        aria-hidden
        className={cn(
          "pointer-events-none absolute -right-3 -top-6 select-none font-serif text-[7rem] font-bold leading-none opacity-[0.07]",
        )}
      >
        {tx(term)}
      </span>
      <p className="font-serif text-xs tracking-[0.3em] opacity-80">{tx(gloss)}</p>
      <h3 className="mt-1 font-serif text-3xl font-semibold">{tx(term)}</h3>
      <p
        className={cn(
          "mt-3 max-w-md text-sm leading-relaxed sm:text-base",
          tone === "primary" ? "text-primary-foreground/90" : "text-muted-foreground",
        )}
      >
        {tx(body)}
      </p>
    </div>
  );
}

function MatrixRow({
  level,
  iq,
  eq,
  last,
}: {
  level: Level;
  iq?: { slug: string; title: string; label: string; summary: string };
  eq?: { slug: string; title: string; label: string; summary: string };
  last: boolean;
}) {
  const { tx } = useI18n();
  const meta = LEVELS[level];
  return (
    <>
      <div
        className={cn(
          "flex flex-col justify-center gap-1 bg-paper-deep/60 p-3 sm:p-4",
          !last && "border-b border-border",
        )}
      >
        <LevelBadge level={level} className="w-fit" />
        <p className="hidden text-xs leading-snug text-muted-foreground sm:block">
          {tx(meta.gloss)}
        </p>
      </div>
      <MatrixCell chapter={iq} last={last} />
      <MatrixCell chapter={eq} last={last} />
    </>
  );
}

function MatrixCell({
  chapter,
  last,
}: {
  chapter?: { slug: string; title: string; label: string; summary: string };
  last: boolean;
}) {
  const { tx } = useI18n();
  if (!chapter) {
    return <div className={cn("border-l border-border", !last && "border-b")} />;
  }
  const title = chapter.title.replace(/^[器术法道]·/, "");
  return (
    <Link
      href={`/manual/${chapter.slug}`}
      className={cn(
        "group flex flex-col gap-1 border-l border-border p-3 transition-colors hover:bg-accent/60 sm:p-4",
        !last && "border-b",
      )}
    >
      <span className="font-serif text-xs text-muted-foreground">{tx(chapter.label)}</span>
      <span className="font-serif text-sm font-semibold leading-snug group-hover:text-primary sm:text-base">
        {tx(title)}
      </span>
      <span className="hidden text-xs leading-relaxed text-muted-foreground md:line-clamp-2">
        {tx(chapter.summary)}
      </span>
    </Link>
  );
}
