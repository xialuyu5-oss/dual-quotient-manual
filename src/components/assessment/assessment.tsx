"use client";

import { useI18n } from "@/components/i18n-provider";
import { formatDate, formatNumber } from "@/lib/i18n/locales";
import { useMemo, useState } from "react";
import { LocaleLink as Link } from "@/components/locale-link";
import { ArrowLeftIcon, ArrowRightIcon, RotateCcwIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Progress,
  ProgressIndicator,
  ProgressTrack,
} from "@/components/ui/progress";
import { useIsClient, useLocalStorage } from "@/hooks/use-local-storage";
import { LevelBadge, LEVEL_DOT, LEVEL_TEXT } from "@/components/level-badge";
import { LEVELS, LEVEL_ORDER } from "@/lib/taxonomy";
import {
  CELL_CHAPTER,
  PATH_NAMES,
  QUESTIONS,
  SCALE,
  STAGE_ADVICE,
  STAGE_NAMES,
  evaluate,
  isComplete,
  type Answers,
  type AssessmentResult,
  type Path,
} from "@/lib/assessment";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "dq.assessment.v1";
const PAGE_SIZE = 6;
const MAX_HISTORY = 8;

type Stored = { history: AssessmentResult[] };

type ChapterInfo = Record<string, { label: string; title: string }>;

type Mode = "intro" | "quiz" | "result";

const EMPTY_STORED: Stored = { history: [] };

function normalizeStored(parsed: unknown): Stored {
  const candidate = parsed as Partial<Stored> | null;
  return Array.isArray(candidate?.history) ? { history: candidate.history } : EMPTY_STORED;
}

export function Assessment({ chapters }: { chapters: ChapterInfo }) {
  const { t, tx, locale } = useI18n();
  const [mode, setMode] = useState<Mode>("intro");
  const [answers, setAnswers] = useState<Answers>({});
  const [page, setPage] = useState(0);
  const [stored, setStored] = useLocalStorage<Stored>(
    STORAGE_KEY,
    EMPTY_STORED,
    normalizeStored,
  );
  const [result, setResult] = useState<AssessmentResult | null>(null);
  const hydrated = useIsClient();
  const history = stored.history;

  const pages = useMemo(() => {
    const chunks: (typeof QUESTIONS)[] = [];
    for (let i = 0; i < QUESTIONS.length; i += PAGE_SIZE) {
      chunks.push(QUESTIONS.slice(i, i + PAGE_SIZE));
    }
    return chunks;
  }, []);

  const answered = Object.keys(answers).length;
  const pageQuestions = pages[page] ?? [];
  const pageComplete = pageQuestions.every((q) => typeof answers[q.id] === "number");
  const lastResult = history[0] ?? null;
  const previous = result ? history.find((h) => h.takenAt !== result.takenAt) ?? null : null;

  function start() {
    setAnswers({});
    setPage(0);
    setResult(null);
    setMode("quiz");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function finish() {
    if (!isComplete(answers)) return;
    const next = evaluate(answers);
    setStored((prev) => ({ history: [next, ...prev.history].slice(0, MAX_HISTORY) }));
    setResult(next);
    setMode("result");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function showLast() {
    if (!lastResult) return;
    setResult(lastResult);
    setMode("result");
  }

  if (mode === "quiz") {
    return (
      <div className="mx-auto max-w-2xl">
        <div className="mb-8">
          <div className="mb-2 flex items-center justify-between text-sm text-muted-foreground">
            <span>
              {t("第 {page} / {total} 组", {page: page + 1, total: pages.length})}
            </span>
            <span>
              {t("已答 {answered} / {total}", {answered, total: QUESTIONS.length})}
            </span>
          </div>
          <Progress value={(answered / QUESTIONS.length) * 100} aria-label={t("作答进度")}>
            <ProgressTrack className="h-1.5">
              <ProgressIndicator />
            </ProgressTrack>
          </Progress>
        </div>

        <ol className="space-y-6">
          {pageQuestions.map((question, index) => {
            const number = page * PAGE_SIZE + index + 1;
            const value = answers[question.id];
            return (
              <li
                key={question.id}
                className="rounded-xl bg-card p-5 ring-1 ring-border"
              >
                <div className="mb-4 flex items-start gap-3">
                  <span className="mt-0.5 font-serif text-sm tabular-nums text-muted-foreground">
                    {String(number).padStart(2, "0")}
                  </span>
                  <p className="font-serif text-base leading-relaxed sm:text-[17px]">
                    {tx(question.text)}
                  </p>
                </div>
                <div
                  role="radiogroup"
                  aria-label={t("第 {number} 题", {number})}
                  className="grid grid-cols-5 gap-1.5 sm:gap-2"
                >
                  {SCALE.map((option) => {
                    const selected = value === option.value;
                    return (
                      <button
                        key={option.value}
                        type="button"
                        role="radio"
                        aria-checked={selected}
                        onClick={() =>
                          setAnswers((prev) => ({ ...prev, [question.id]: option.value }))
                        }
                        className={cn(
                          "flex flex-col items-center gap-1 rounded-md border px-1 py-2 text-xs transition-all sm:py-2.5 sm:text-sm",
                          selected
                            ? "border-primary bg-primary text-primary-foreground shadow-sm"
                            : "border-border bg-background text-muted-foreground hover:border-primary/50 hover:text-foreground",
                        )}
                      >
                        <span className="font-serif text-base font-semibold leading-none sm:text-lg">
                          {tx(option.value)}
                        </span>
                        <span>{tx(option.label)}</span>
                      </button>
                    );
                  })}
                </div>
              </li>
            );
          })}
        </ol>

        <div className="mt-8 flex items-center justify-between gap-3">
          <Button
            variant="outline"
            disabled={page === 0}
            onClick={() => {
              setPage((p) => Math.max(0, p - 1));
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          >
            <ArrowLeftIcon data-icon="inline-start" />{t("上一组")}</Button>
          {page < pages.length - 1 ? (
            <Button
              disabled={!pageComplete}
              onClick={() => {
                setPage((p) => Math.min(pages.length - 1, p + 1));
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            >{t("下一组")}<ArrowRightIcon data-icon="inline-end" />
            </Button>
          ) : (
            <Button disabled={!isComplete(answers)} onClick={finish}>{t("查看结果")}<ArrowRightIcon data-icon="inline-end" />
            </Button>
          )}
        </div>
        {!pageComplete && (
          <p className="mt-3 text-right text-xs text-muted-foreground">{t("答完本组六题后可继续。按实际做法答，不按你知道的答。")}</p>
        )}
      </div>
    );
  }

  if (mode === "result" && result) {
    return (
      <ResultView
        result={result}
        previous={previous}
        chapters={chapters}
        onRetake={start}
      />
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="rounded-xl bg-card p-6 ring-1 ring-border sm:p-8">
        <h2 className="font-serif text-xl font-semibold">{t("开始之前")}</h2>
        <ul className="mt-4 space-y-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
          <li className="flex gap-3">
            <span className="font-serif text-primary">{t("一")}</span>
            <span>{t("共二十四题，分四组，约五分钟。每题描述一种做法，请按你实际做的频率作答，而不是你知道该怎么做。")}</span>
          </li>
          <li className="flex gap-3">
            <span className="font-serif text-primary">{t("二")}</span>
            <span>{t("结果不是分数，是镜子：你在智商与情商两条路上各处于哪一阶，以及你的「错位」形状。")}</span>
          </li>
          <li className="flex gap-3">
            <span className="font-serif text-primary">{t("三")}</span>
            <span>{t("结果只保存在你本机的浏览器里，不会上传。建议每季度重做一次，对照变化。")}</span>
          </li>
        </ul>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button size="lg" className="h-10 px-5" onClick={start}>{t("开始自测")}<ArrowRightIcon data-icon="inline-end" />
          </Button>
          {hydrated && lastResult && (
            <Button size="lg" variant="outline" className="h-10 px-5" onClick={showLast}>
              {t("查看上次结果（{date}）", {date: formatDate(locale, lastResult.takenAt)})}
            </Button>
          )}
        </div>
      </div>
      <p className="mt-6 text-center text-sm text-muted-foreground">{t("想先了解四个阶段的含义？读")}<Link href="/manual/know-thyself" className="mx-1 text-primary underline underline-offset-4">{t("第三章 · 自知")}</Link>
        。
      </p>
    </div>
  );
}

function ResultView({
  result,
  previous,
  chapters,
  onRetake,
}: {
  result: AssessmentResult;
  previous: AssessmentResult | null;
  chapters: ChapterInfo;
  onRetake: () => void;
}) {
  const { t, tx, locale } = useI18n();
  const recommended = Array.from(
    new Set([
      ...result.weakest.map((cell) => CELL_CHAPTER[cell.path][cell.level]),
      ...result.misalignments.flatMap((m) => m.chapters),
    ]),
  ).slice(0, 5);

  return (
    <div className="mx-auto max-w-3xl space-y-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          {t("测于 {date}", {date: formatDate(locale, result.takenAt)})}
          {previous && (
            <span className="ml-2">{t("与 {date} 的结果对照", {date: formatDate(locale, previous.takenAt)})}</span>
          )}
        </p>
        <Button variant="outline" size="sm" onClick={onRetake}>
          <RotateCcwIcon data-icon="inline-start" />{t("重新自测")}</Button>
      </div>

      {/* Stages */}
      <section className="grid gap-4 sm:grid-cols-2">
        {(["iq", "eq"] as Path[]).map((path) => {
          const stage = result.stages[path];
          return (
            <div key={path} className="rounded-xl bg-card p-6 ring-1 ring-border">
              <p className="text-xs tracking-widest text-muted-foreground">
                {tx(PATH_NAMES[path])}{t("· 当前阶段")}</p>
              <p className={cn("mt-1 font-serif text-4xl font-semibold", LEVEL_TEXT[stage])}>
                {tx(STAGE_NAMES[stage])}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                {t("平均 {score} / 5", {score: formatNumber(locale, result.pathAverages[path], 1)})} · 
                {Object.values(result.scores[path]).every((score) => score >= 3.5)
                  ? t("四层都已稍稍稳固；这一阶没有终点")
                  : t("「{level}」这一层尚未稳固", {level: t(LEVELS[stage].name)})}
              </p>
              <p className="mt-4 text-sm leading-relaxed">{tx(STAGE_ADVICE[stage][path])}</p>
            </div>
          );
        })}
      </section>

      {/* Eight cells */}
      <section className="rounded-xl bg-card p-6 ring-1 ring-border">
        <h2 className="font-serif text-lg font-semibold">{t("八格图")}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{t("每格为三题平均分（1–5）。3.5 以上视为稍稍稳固。")}</p>
        <div className="mt-6 grid gap-8 sm:grid-cols-2">
          {(["iq", "eq"] as Path[]).map((path) => (
            <div key={path}>
              <p className="mb-3 font-serif text-sm font-semibold">{tx(PATH_NAMES[path])}</p>
              <ul className="space-y-3">
                {[...LEVEL_ORDER].reverse().map((level) => {
                  const score = result.scores[path][level];
                  const prevScore = previous?.scores[path][level];
                  const delta = prevScore !== undefined ? score - prevScore : null;
                  return (
                    <li key={level}>
                      <div className="mb-1 flex items-center justify-between text-sm">
                        <Link
                          href={`/manual/${CELL_CHAPTER[path][level]}`}
                          className="inline-flex items-center gap-2 hover:underline underline-offset-4"
                        >
                          <LevelBadge level={level} />
                          <span className="text-muted-foreground">{tx(LEVELS[level].short)}</span>
                        </Link>
                        <span className="tabular-nums">
                          {formatNumber(locale, score, 1)}
                          {delta !== null && delta !== 0 && (
                            <span
                              className={cn(
                                "ml-1.5 text-xs",
                                delta > 0 ? "text-level-fa" : "text-destructive",
                              )}
                            >
                              {delta > 0 ? "+" : ""}
                              {formatNumber(locale, delta, 1)}
                            </span>
                          )}
                        </span>
                      </div>
                      <div className="relative h-2 overflow-hidden rounded-full bg-muted">
                        <div
                          className={cn("h-full rounded-full transition-all", LEVEL_DOT[level])}
                          style={{ width: `${(score / 5) * 100}%` }}
                        />
                        <span
                          aria-hidden
                          className="absolute top-0 h-full w-px bg-foreground/30"
                          style={{ left: "70%" }}
                        />
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Misalignments */}
      <section>
        <h2 className="font-serif text-lg font-semibold">{t("形状诊断")}</h2>
        {result.misalignments.length === 0 ? (
          <p className="mt-3 rounded-xl bg-card p-5 text-sm leading-relaxed ring-1 ring-border">{t("八格之间没有明显错位——你的图是平的。这意味着接下来的功课不是补短，而是整体往上走一层：从你两条路各自的「当前阶段」开始。")}</p>
        ) : (
          <ul className="mt-3 space-y-3">
            {result.misalignments.map((m) => (
              <li key={m.key} className="rounded-xl bg-card p-5 ring-1 ring-border">
                <p className="font-serif text-base font-semibold text-primary">{tx(m.title)}</p>
                <p className="mt-2 text-sm leading-relaxed">{tx(m.body)}</p>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Recommended */}
      <section>
        <h2 className="font-serif text-lg font-semibold">{t("建议的阅读顺序")}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{t("从你最薄弱的两格出发，加上针对错位的章节。读完一章，做一章，再读下一章。")}</p>
        <ol className="mt-4 grid gap-2 sm:grid-cols-2">
          {recommended.map((slug, index) => {
            const info = chapters[slug];
            if (!info) return null;
            return (
              <li key={slug}>
                <Link
                  href={`/manual/${slug}`}
                  className="flex items-center gap-3 rounded-lg bg-card p-3.5 ring-1 ring-border transition-colors hover:bg-accent/60"
                >
                  <span className="grid size-7 shrink-0 place-items-center rounded-full bg-primary/10 font-serif text-sm text-primary">
                    {index + 1}
                  </span>
                  <span className="min-w-0">
                    <span className="block text-xs text-muted-foreground">{tx(info.label)}</span>
                    <span className="block truncate font-serif text-sm font-medium">
                      {tx(info.title)}
                    </span>
                  </span>
                  <ArrowRightIcon className="ml-auto size-4 shrink-0 text-muted-foreground" />
                </Link>
              </li>
            );
          })}
        </ol>
      </section>

      <div className="flex flex-wrap gap-3 border-t border-border pt-8">
        <Button nativeButton={false} render={<Link href="/practice" />}>{t("从今天的日课开始")}<ArrowRightIcon data-icon="inline-end" />
        </Button>
        <Button variant="outline" nativeButton={false} render={<Link href="/manual/practice-plan" />}>{t("看修炼计划")}</Button>
      </div>
    </div>
  );
}
