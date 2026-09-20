export interface WorkbookField { id: string; label: string; hint: string }
export interface WorkbookTemplate { id: string; title: string; description: string; fields: WorkbookField[] }
export interface WorkshopCase {
  id: string;
  title: string;
  category: string;
  situation: string;
  question: string;
  options: { text: string; feedback: string }[];
  principle: string;
  action: string;
  review: string;
  template: string;
  chapter: string;
}
export interface WorkshopTopic {
  id: string; title: string; idea: string; questions: string[]; example: string; boundary: string;
}
export interface WorkshopContent {
  title: string;
  intro: string;
  ui: Record<string, string>;
  cases: WorkshopCase[];
  templates: WorkbookTemplate[];
  topics: WorkshopTopic[];
}
