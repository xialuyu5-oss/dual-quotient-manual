export interface PracticeItem {
  id: string;
  title: string;
  detail: string;
  minutes?: number;
  chapter?: string;
}

export const DAILY_ITEMS: PracticeItem[] = [
  {
    id: "morning-three",
    title: "晨间三问",
    detail:
      "看手机前写下：今天最重要的一个判断是什么？最可能激起我情绪的人或事是什么？我今天想成为什么样的人（一个词）？",
    minutes: 5,
    chapter: "practice-plan",
  },
  {
    id: "name-emotion",
    title: "一次情绪命名",
    detail:
      "停下来，用词汇表里最准确的那个词命名当下的情绪，再问它替哪个需要说话。记进情绪日记。",
    chapter: "eq-qi",
  },
  {
    id: "decision-log",
    title: "一条决策日志",
    detail: "记一个决定：是什么、为什么、预期什么、多大把握（百分数）、何时核对。小决定也可以。",
    chapter: "iq-qi",
  },
  {
    id: "read",
    title: "读一段",
    detail: "经典或一本真正的好书，十五分钟。一书未完，不看他书。写一句今天读到的最重要的一点。",
    minutes: 15,
    chapter: "reading-list",
  },
  {
    id: "evening-review",
    title: "晚间复盘",
    detail:
      "今天哪个判断我会改？哪次互动我后悔或欣慰？学到了什么？——为人谋而不忠乎？与朋友交而不信乎？传不习乎？",
    minutes: 5,
    chapter: "iq-fa",
  },
];

export const WEEKLY_ITEMS: PracticeItem[] = [
  {
    id: "review-logs",
    title: "回看本周日志",
    detail: "决策日志与情绪日记。找模式，不找错。",
    chapter: "iq-fa",
  },
  {
    id: "relationship-deposit",
    title: "关系账户存款",
    detail: "关系账本上最久没有存款的那个人，本周给他存一笔——具体的感谢、兑现的承诺、一次认真的倾听。",
    chapter: "eq-fa",
  },
  {
    id: "deep-talk",
    title: "一次深度对话",
    detail: "与一个人进行一次不少于三十分钟、不带议程、真正在听的谈话。",
    chapter: "eq-shu",
  },
  {
    id: "inversion",
    title: "一次逆向练习",
    detail: "为你本周最坚定的一个看法写一段反方陈述，写到你觉得「好像也有道理」为止。",
    chapter: "iq-shu",
  },
  {
    id: "monthly-move",
    title: "本月练的那一式",
    detail: "回顾这周用了几次，效果如何。已经开始自动出现了吗？",
    chapter: "practice-plan",
  },
  {
    id: "one-thing",
    title: "下周唯一最重要的一件事",
    detail: "写下来。一件。",
    chapter: "practice-plan",
  },
];

export interface PracticeStore {
  days: Record<string, string[]>;
  weeks: Record<string, string[]>;
}

export const EMPTY_STORE: PracticeStore = { days: {}, weeks: {} };

function pad(n: number) {
  return String(n).padStart(2, "0");
}

export function dayKey(date: Date): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

/** Week key is the local date of that week's Monday. */
export function weekKey(date: Date): string {
  const monday = new Date(date);
  const offset = (monday.getDay() + 6) % 7;
  monday.setDate(monday.getDate() - offset);
  monday.setHours(0, 0, 0, 0);
  return dayKey(monday);
}

export function shiftDay(date: Date, delta: number): Date {
  const next = new Date(date);
  next.setDate(next.getDate() + delta);
  return next;
}

export function isDayComplete(store: PracticeStore, key: string): boolean {
  const done = store.days[key] ?? [];
  return DAILY_ITEMS.every((item) => done.includes(item.id));
}

/**
 * Consecutive fully-completed days ending today, or ending yesterday if today
 * is still in progress (so a streak is not shown as broken before the day is over).
 */
export function computeStreak(store: PracticeStore, today: Date): number {
  let cursor = isDayComplete(store, dayKey(today)) ? today : shiftDay(today, -1);
  let streak = 0;
  while (isDayComplete(store, dayKey(cursor))) {
    streak += 1;
    cursor = shiftDay(cursor, -1);
    if (streak > 3650) break;
  }
  return streak;
}

export function countCompletedDays(store: PracticeStore): number {
  return Object.keys(store.days).filter((key) => isDayComplete(store, key)).length;
}

export function formatChineseDate(date: Date): string {
  const weekdays = ["日", "一", "二", "三", "四", "五", "六"];
  return `${date.getFullYear()} 年 ${date.getMonth() + 1} 月 ${date.getDate()} 日 · 星期${weekdays[date.getDay()]}`;
}
