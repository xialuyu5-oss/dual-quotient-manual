export type Part =
  | "preface"
  | "map"
  | "iq"
  | "eq"
  | "integration"
  | "appendix";

export type Level = "qi" | "shu" | "fa" | "dao";

export const PARTS: Record<Part, { title: string; subtitle: string }> = {
  preface: { title: "序", subtitle: "这本手册想解决的问题" },
  map: { title: "第一部 · 地图", subtitle: "建立共同语言：聪明与智慧，道法术器" },
  iq: { title: "第二部 · 智商之路", subtitle: "从聪明到智慧：器、术、法、道" },
  eq: { title: "第三部 · 情商之路", subtitle: "从技巧到心性：器、术、法、道" },
  integration: {
    title: "第四部 · 合一",
    subtitle: "判断力的诞生、跃迁、修炼计划与陷阱",
  },
  appendix: { title: "附录", subtitle: "书单与一页纸总纲" },
};

export const PART_ORDER: Part[] = [
  "preface",
  "map",
  "iq",
  "eq",
  "integration",
  "appendix",
];

export const LEVELS: Record<
  Level,
  { name: string; short: string; gloss: string; verb: string }
> = {
  qi: { name: "器", short: "工具", gloss: "可以交接的工具与框架", verb: "可传" },
  shu: { name: "术", short: "技法", gloss: "需要练习才能获得的技法", verb: "可练" },
  fa: { name: "法", short: "系统", gloss: "让好行为不依赖好状态的制度", verb: "可立" },
  dao: { name: "道", short: "心性", gloss: "只能被指向、由你自己去养的理解", verb: "可养" },
};

export const LEVEL_ORDER: Level[] = ["qi", "shu", "fa", "dao"];
