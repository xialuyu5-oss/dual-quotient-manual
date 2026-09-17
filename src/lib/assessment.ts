import type { Level } from "@/lib/taxonomy";

export type Path = "iq" | "eq";

export interface Question {
  id: string;
  path: Path;
  level: Level;
  text: string;
}

export const SCALE = [
  { value: 1, label: "从不" },
  { value: 2, label: "很少" },
  { value: 3, label: "有时" },
  { value: 4, label: "经常" },
  { value: 5, label: "总是" },
] as const;

export const PATH_NAMES: Record<Path, string> = {
  iq: "智商之路",
  eq: "情商之路",
};

export const STAGE_NAMES: Record<Level, string> = {
  qi: "见器",
  shu: "习术",
  fa: "立法",
  dao: "悟道",
};

export const QUESTIONS: Question[] = [
  // 智商 · 器
  { id: "iq-qi-1", path: "iq", level: "qi", text: "我有一个固定的地方记录想法与笔记，并且每周至少回看一次。" },
  { id: "iq-qi-2", path: "iq", level: "qi", text: "做重要决定时，我会把决定、理由和预期写下来，留待日后核对。" },
  { id: "iq-qi-3", path: "iq", level: "qi", text: "面对高风险的例行事务（重要邮件、汇报、签约），我有自己的核对清单。" },
  // 智商 · 术
  { id: "iq-shu-1", path: "iq", level: "shu", text: "在反驳一个观点之前，我会先把对方的立场说到让对方认可「就是这个意思」。" },
  { id: "iq-shu-2", path: "iq", level: "shu", text: "对预测性的判断，我习惯用具体的概率（比如「七成」）而不是「应该会」来表达。" },
  { id: "iq-shu-3", path: "iq", level: "shu", text: "动手解决问题之前，我会先花时间用几种不同的说法重新定义问题。" },
  // 智商 · 法
  { id: "iq-fa-1", path: "iq", level: "fa", text: "无论心情好坏，我每周都会在固定时间复盘本周的决定与所学。" },
  { id: "iq-fa-2", path: "iq", level: "fa", text: "我会按「可逆/不可逆、影响大/小」给决定分级，并用不同的速度处理它们。" },
  { id: "iq-fa-3", path: "iq", level: "fa", text: "我有一份写下来的个人原则（「当……时，我……」），并且会定期更新。" },
  // 智商 · 道
  { id: "iq-dao-1", path: "iq", level: "dao", text: "在讨论中我能坦然说「我不确定」或「我不知道」，不觉得有损自己。" },
  { id: "iq-dao-2", path: "iq", level: "dao", text: "我能一边全力推进一个方案，一边真诚地承认它可能失败。" },
  { id: "iq-dao-3", path: "iq", level: "dao", text: "做判断时我会考虑五年后的后果，并愿意为长期的好处接受眼前的笨拙。" },
  // 情商 · 器
  { id: "eq-qi-1", path: "eq", level: "qi", text: "我能用比「不爽」「还行」精确得多的词，说出自己此刻的情绪。" },
  { id: "eq-qi-2", path: "eq", level: "qi", text: "情绪升起时，我会先注意到身体的信号（胸口发紧、呼吸变浅），再决定怎么回应。" },
  { id: "eq-qi-3", path: "eq", level: "qi", text: "我有记录情绪触发与反应的习惯，并能从中看到自己的模式。" },
  // 情商 · 术
  { id: "eq-shu-1", path: "eq", level: "shu", text: "在重要对话中，我会先复述对方的意思并得到确认，然后再表达自己的看法。" },
  { id: "eq-shu-2", path: "eq", level: "shu", text: "表达不满时，我会说具体的行为和它对我的影响，而不是评价对方「是什么样的人」。" },
  { id: "eq-shu-3", path: "eq", level: "shu", text: "听到批评时，我能先谢谢对方并提问澄清，而不是当场辩护。" },
  // 情商 · 法
  { id: "eq-fa-1", path: "eq", level: "fa", text: "我知道自己一天或一周里情绪最脆弱的时段，并且避免在那时做关系上的决定。" },
  { id: "eq-fa-2", path: "eq", level: "fa", text: "每周我都会主动为生活中重要的人做一件具体的「存款」（感谢、兑现承诺、认真倾听）。" },
  { id: "eq-fa-3", path: "eq", level: "fa", text: "冲突之后，我会在二十四小时内主动发起修复，不论对方是否先动。" },
  // 情商 · 道
  { id: "eq-dao-1", path: "eq", level: "dao", text: "我清楚自己在压力下的核心模式（防御、讨好、控制、退缩），并能在它启动时察觉到。" },
  { id: "eq-dao-2", path: "eq", level: "dao", text: "在冲突中，我能持续把对方当作一个有恐惧和需要的完整的人，而不是「那个不讲理的人」。" },
  { id: "eq-dao-3", path: "eq", level: "dao", text: "被激怒时，我的声音和判断依然稳定——不是硬撑，而是愤怒没有占满我。" },
];

export type Answers = Record<string, number>;

export type CellScores = Record<Path, Record<Level, number>>;

export interface Misalignment {
  key: "shu-strong" | "dao-hollow" | "qi-hoarding" | "fa-rigid" | "iq-over-eq" | "eq-over-iq";
  title: string;
  body: string;
  chapters: string[];
}

export interface AssessmentResult {
  takenAt: string;
  scores: CellScores;
  pathAverages: Record<Path, number>;
  stages: Record<Path, Level>;
  misalignments: Misalignment[];
  weakest: { path: Path; level: Level; score: number }[];
}

const LEVELS: Level[] = ["qi", "shu", "fa", "dao"];
const STAGE_THRESHOLD = 3.5;
const GAP = 1;

export function isComplete(answers: Answers): boolean {
  return QUESTIONS.every((q) => typeof answers[q.id] === "number");
}

export function computeScores(answers: Answers): CellScores {
  const scores: CellScores = {
    iq: { qi: 0, shu: 0, fa: 0, dao: 0 },
    eq: { qi: 0, shu: 0, fa: 0, dao: 0 },
  };
  for (const path of ["iq", "eq"] as Path[]) {
    for (const level of LEVELS) {
      const items = QUESTIONS.filter((q) => q.path === path && q.level === level);
      const total = items.reduce((sum, q) => sum + (answers[q.id] ?? 0), 0);
      scores[path][level] = Math.round((total / items.length) * 100) / 100;
    }
  }
  return scores;
}

/** The current stage is the first level, from the bottom, that is not yet solid. */
export function stageFor(levels: Record<Level, number>): Level {
  for (const level of LEVELS) {
    if (levels[level] < STAGE_THRESHOLD) return level;
  }
  return "dao";
}

function avg(values: number[]): number {
  return values.reduce((sum, v) => sum + v, 0) / values.length;
}

export function detectMisalignments(scores: CellScores): Misalignment[] {
  const combined: Record<Level, number> = {
    qi: avg([scores.iq.qi, scores.eq.qi]),
    shu: avg([scores.iq.shu, scores.eq.shu]),
    fa: avg([scores.iq.fa, scores.eq.fa]),
    dao: avg([scores.iq.dao, scores.eq.dao]),
  };
  const lower = avg([combined.qi, combined.shu]);
  const upper = avg([combined.fa, combined.dao]);
  const iqAvg = avg(Object.values(scores.iq));
  const eqAvg = avg(Object.values(scores.eq));

  const found: Misalignment[] = [];
  const faRigid = combined.fa - combined.dao >= GAP;

  // 法僵道失 is the more specific diagnosis; do not also report the generic one.
  if (lower - upper >= GAP && !faRigid) {
    found.push({
      key: "shu-strong",
      title: "术强道弱",
      body: "招很多，心很空。短期极有效，长期很累也很孤独——会赢，但不会活。你知道如何让人同意你，却未必知道自己为什么要让他们同意。",
      chapters: ["iq-dao", "eq-dao", "transition"],
    });
  }
  if (combined.dao - lower >= GAP) {
    found.push({
      key: "dao-hollow",
      title: "道空术虚",
      body: "满口道理，一到具体事就露怯。这一类常常把「看破」当成境界，其实是没有能力入局。回到器与术，做一件具体的、笨的、可以被检验的事。",
      chapters: ["iq-qi", "eq-qi", "iq-shu", "eq-shu"],
    });
  }
  if (combined.qi - combined.shu >= GAP) {
    found.push({
      key: "qi-hoarding",
      title: "器多术少",
      body: "工具囤积症。收藏是学习的廉价替代品，让人有进步的幻觉。三个月内不学任何新东西，每月只练一式。",
      chapters: ["iq-shu", "eq-shu", "traps"],
    });
  }
  if (faRigid) {
    found.push({
      key: "fa-rigid",
      title: "法僵道失",
      body: "制度完善，灵魂缺席。复盘按时做，日课天天打卡，但你已经忘了这一切是为了什么。定期退一步，问「这一切为了什么」。",
      chapters: ["iq-dao", "eq-dao", "transition"],
    });
  }
  if (iqAvg - eqAvg >= 0.8) {
    found.push({
      key: "iq-over-eq",
      title: "左下满，右上空",
      body: "思考的工具和技法很多，而情绪、关系与心性那一侧稀疏。这是读这本手册的人最常见的形状。第三部对你比第二部更重要——从第八章读起。",
      chapters: ["eq-qi", "eq-shu", "eq-fa", "eq-dao"],
    });
  } else if (eqAvg - iqAvg >= 0.8) {
    found.push({
      key: "eq-over-iq",
      title: "右侧满，左侧空",
      body: "你对人的感知强于对事的分析——人人喜欢你，但你可能做不出足够清晰的决定，也容易被利用。第二部对你更重要——从第四章读起。",
      chapters: ["iq-qi", "iq-shu", "iq-fa", "iq-dao"],
    });
  }

  return found;
}

export function evaluate(answers: Answers, takenAt = new Date().toISOString()): AssessmentResult {
  const scores = computeScores(answers);
  const cells = (["iq", "eq"] as Path[]).flatMap((path) =>
    LEVELS.map((level) => ({ path, level, score: scores[path][level] })),
  );
  const weakest = [...cells].sort((a, b) => a.score - b.score).slice(0, 2);
  return {
    takenAt,
    scores,
    pathAverages: {
      iq: Math.round(avg(Object.values(scores.iq)) * 100) / 100,
      eq: Math.round(avg(Object.values(scores.eq)) * 100) / 100,
    },
    stages: {
      iq: stageFor(scores.iq),
      eq: stageFor(scores.eq),
    },
    misalignments: detectMisalignments(scores),
    weakest,
  };
}

export const STAGE_ADVICE: Record<Level, { iq: string; eq: string }> = {
  qi: {
    iq: "先选定一个笔记入口，开始写决策日志。三个月内不再学任何新框架。",
    eq: "用情绪词汇表，每天命名一次；开始写情绪日记。三个月不学新的沟通技巧。",
  },
  shu: {
    iq: "每月只练一式，从「停一下」开始。晚间复盘记下今天用了几次。",
    eq: "每月只练一式，从「命名」开始。接受前几十次都会失败——事后想起来就算进步。",
  },
  fa: {
    iq: "建立三级复盘、分级决策，开始写原则手册。守法一年，不看心情。",
    eq: "建立关系账户、二十四小时修复规则、冲突协议。把「日省」放进晚间复盘。",
  },
  dao: {
    iq: "教别人；去承担后果的位置；每季退一步问「这一切为了什么」。回到器，重新做学生。",
    eq: "去最难的人和最想逃避的对话那里「事上磨练」。为一个人的成长负责。",
  },
};

export const CELL_CHAPTER: Record<Path, Record<Level, string>> = {
  iq: { qi: "iq-qi", shu: "iq-shu", fa: "iq-fa", dao: "iq-dao" },
  eq: { qi: "eq-qi", shu: "eq-shu", fa: "eq-fa", dao: "eq-dao" },
};
