export const WORKSHOP_KEY = "dq.workshop.v1";
export interface WorkbookEntry {
  id: string; template: string; createdAt: string; values: Record<string, string>;
}
export interface WorkbookStore {
  version: 1;
  drafts: Record<string, Record<string, string>>;
  entries: WorkbookEntry[];
}
export const EMPTY_WORKBOOK: WorkbookStore = { version: 1, drafts: {}, entries: [] };
const identifier = /^[a-zA-Z0-9_-]{1,100}$/;
const object = (value: unknown): value is Record<string, unknown> => !!value && typeof value === "object" && !Array.isArray(value);
function values(value: unknown): Record<string, string> {
  if (!object(value)) throw new Error("Invalid fields");
  for (const [key, text] of Object.entries(value)) {
    if (!identifier.test(key) || ["__proto__", "constructor", "prototype"].includes(key) || typeof text !== "string" || text.length > 10000) throw new Error("Invalid field");
  }
  return Object.fromEntries(Object.entries(value)) as Record<string, string>;
}

/** Reject malformed data before replacing any existing draft or record. */
export function parseWorkbook(raw: string): WorkbookStore {
  const source: unknown = JSON.parse(raw);
  if (!object(source) || source.version !== 1 || !object(source.drafts) || !Array.isArray(source.entries)) throw new Error("Unsupported workbook");
  const drafts: WorkbookStore["drafts"] = {};
  for (const [id, draft] of Object.entries(source.drafts)) {
    if (!identifier.test(id) || ["__proto__", "constructor", "prototype"].includes(id)) throw new Error("Invalid template");
    drafts[id] = values(draft);
  }
  const ids = new Set<string>();
  const entries = source.entries.map((entry): WorkbookEntry => {
    if (!object(entry) || typeof entry.id !== "string" || !identifier.test(entry.id) || ids.has(entry.id) || typeof entry.template !== "string" || !identifier.test(entry.template) || typeof entry.createdAt !== "string" || !Number.isFinite(Date.parse(entry.createdAt))) throw new Error("Invalid record");
    ids.add(entry.id);
    return { id: entry.id, template: entry.template, createdAt: entry.createdAt, values: values(entry.values) };
  });
  return { version: 1, drafts, entries };
}

export function updateDraft(store: WorkbookStore, template: string, field: string, text: string): WorkbookStore {
  return { ...store, drafts: { ...store.drafts, [template]: { ...store.drafts[template], [field]: text } } };
}

/** Imports merge records without replacing drafts or changing colliding records. */
export function mergeWorkbook(current: WorkbookStore, incoming: WorkbookStore): WorkbookStore {
  const entries = [...current.entries];
  for (const entry of incoming.entries) {
    const existing = entries.find(item => item.id === entry.id);
    if (existing && (existing.template !== entry.template || existing.createdAt !== entry.createdAt || Object.keys(existing.values).length !== Object.keys(entry.values).length || Object.entries(existing.values).some(([key, value]) => entry.values[key] !== value))) throw new Error("Conflicting record");
    if (!existing) entries.push(entry);
  }
  return { version: 1, drafts: { ...incoming.drafts, ...current.drafts }, entries };
}
