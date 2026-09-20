"use client";

import { useEffect, useRef, useState } from "react";
import { useIsClient } from "@/hooks/use-local-storage";
import { useWorkbook } from "@/hooks/use-workbook";
import { useI18n } from "@/components/i18n-provider";
import { formatDate } from "@/lib/i18n/locales";
import { mergeWorkbook, parseWorkbook, updateDraft, WORKSHOP_KEY, type WorkbookEntry } from "@/lib/workshop/records";
import type { WorkbookTemplate } from "@/lib/workshop/types";

function download(filename: string, text: string, mime: string) {
  const url = URL.createObjectURL(new Blob([text], { type: mime }));
  const link = document.createElement("a");
  link.href = url; link.download = filename;
  document.body.appendChild(link); link.click(); link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
const control = "rounded-md border bg-card px-3 py-2 text-sm hover:bg-accent disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary";

export function Workbook({ templates, active, onSelect, ui }: { templates: WorkbookTemplate[]; active: string; onSelect: (id: string) => void; ui: Record<string, string> }) {
  const { locale } = useI18n();
  const ready = useIsClient();
  const { store, write, issue } = useWorkbook();
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState<{ type: "clear" | "delete" | "load"; template?: string; entry?: WorkbookEntry } | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);
  const template = templates.find(item => item.id === active) ?? templates[0];
  const draft = store.drafts[template.id] ?? {};
  const hasText = Object.values(draft).some(value => value.trim());
  const entries = [...store.entries].sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  useEffect(() => {
    if (!issue) return;
    const warn = (event: BeforeUnloadEvent) => { event.preventDefault(); event.returnValue = ""; };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [issue]);

  function archive() {
    if (!hasText || !ready) return;
    const entry: WorkbookEntry = { id: crypto.randomUUID(), template: template.id, createdAt: new Date().toISOString(), values: { ...draft } };
    const saved = write(previous => ({ ...previous, entries: [...previous.entries, entry] }));
    setMessage(saved ? "savedRecord" : "saveFailed");
  }
  function confirm() {
    if (!pending) return;
    if (pending.type === "clear" && pending.template) write(previous => ({ ...previous, drafts: { ...previous.drafts, [pending.template!]: {} } }));
    if (pending.type === "delete" && pending.entry) write(previous => ({ ...previous, entries: previous.entries.filter(item => item.id !== pending.entry!.id) }));
    if (pending.type === "load" && pending.entry) {
      const entry = pending.entry;
      write(previous => ({ ...previous, drafts: { ...previous.drafts, [entry.template]: { ...entry.values } } }));
      onSelect(entry.template);
    }
    setPending(null); setMessage("");
  }
  async function importFile(file?: File) {
    if (!file) return;
    try {
      if (file.size > 10 * 1024 * 1024) throw new Error("Too large");
      const incoming = parseWorkbook(await file.text());
      const saved = write(previous => mergeWorkbook(previous, incoming));
      setMessage(saved ? "imported" : "saveFailed");
    } catch { setMessage("importFailed"); }
    finally { if (fileInput.current) fileInput.current.value = ""; }
  }
  function exportMarkdown() {
    const title = template.title;
    const body = `# ${title}\n\n${template.fields.map(field => `## ${field.label}\n\n${draft[field.id] ?? ""}`).join("\n\n")}\n`;
    download(`workbook-${template.id}.md`, body, "text/markdown;charset=utf-8");
  }

  return <div className="space-y-6">
    <p className="text-sm leading-relaxed text-muted-foreground">{ui.privacy}</p>
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4" aria-label={ui.chooseTemplate}>
      {templates.map(item => <button key={item.id} type="button" aria-pressed={template.id === item.id} onClick={() => { onSelect(item.id); setPending(null); setMessage(""); }} className="rounded-xl border bg-card p-4 text-left hover:bg-accent aria-pressed:border-primary aria-pressed:bg-primary/5 focus-visible:outline-2 focus-visible:outline-primary">
        <span className="block font-serif text-lg font-semibold">{item.title}</span><span className="mt-2 block text-sm leading-relaxed text-muted-foreground">{item.description}</span>
      </button>)}
    </div>
    <div className="rounded-xl border bg-card p-5 sm:p-7">
      <h3 className="font-serif text-2xl font-semibold">{template.title}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{ui.draftHelp}</p>
      <p role="status" className={`mt-3 text-sm ${issue ? "text-destructive" : "text-muted-foreground"}`}>
        {!ready ? ui.loading : issue === "invalid" ? ui.invalidStorage : issue ? ui.saveFailed : ui.draftSaved}
      </p>
      {issue === "invalid" && <button type="button" className={`${control} mt-2`} onClick={() => {
        try { download("workbook-original.txt", window.localStorage.getItem(WORKSHOP_KEY) ?? "", "text/plain;charset=utf-8"); }
        catch { setMessage("saveFailed"); }
      }}>{ui.exportOriginal}</button>}
      <div className="mt-6 grid gap-5 md:grid-cols-2">
        {template.fields.map(field => <div key={`${template.id}-${field.id}`}>
          <label className="mb-1 block text-sm font-medium" htmlFor={`workbook-${template.id}-${field.id}`}>{field.label}</label>
          <p id={`hint-${template.id}-${field.id}`} className="mb-2 text-xs leading-relaxed text-muted-foreground">{field.hint}</p>
          <textarea id={`workbook-${template.id}-${field.id}`} aria-describedby={`hint-${template.id}-${field.id}`} rows={4} maxLength={10000} disabled={!ready} value={draft[field.id] ?? ""} onChange={event => {
            write(previous => updateDraft(previous, template.id, field.id, event.target.value));
            setMessage("");
          }} className="block w-full resize-y rounded-lg border bg-paper/40 px-3 py-2 text-base leading-relaxed focus:border-primary focus:outline-2 focus:outline-primary/20 disabled:opacity-50" />
        </div>)}
      </div>
      <div className="mt-5 flex flex-wrap gap-3">
        <button type="button" disabled={!ready || !hasText} onClick={archive} className={`${control} border-primary bg-primary text-primary-foreground hover:bg-primary/90`}>{ui.saveRecord}</button>
        <button type="button" disabled={!ready || !hasText} onClick={exportMarkdown} className={control}>{ui.exportDraft}</button>
        <button type="button" disabled={!ready || !hasText} onClick={() => setPending({ type: "clear", template: template.id })} className={control}>{ui.clearDraft}</button>
      </div>
    </div>
    {pending && <div role="alert" className="rounded-lg border border-primary/40 bg-card p-4">
      <p className="text-sm">{ui[pending.type === "clear" ? "confirmClear" : pending.type === "delete" ? "confirmDelete" : "confirmLoad"]}</p>
      <div className="mt-3 flex gap-3"><button type="button" onClick={confirm} className={control}>{ui.confirm}</button><button type="button" onClick={() => setPending(null)} className={control}>{ui.cancel}</button></div>
    </div>}
    <section className="rounded-xl border bg-card p-5 sm:p-7" aria-label={ui.myRecords}>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h3 className="font-serif text-xl font-semibold">{ui.myRecords} <span className="text-sm text-muted-foreground">({entries.length})</span></h3>
        <div className="flex flex-wrap gap-2">
          <button type="button" disabled={!ready} className={control} onClick={() => download("workbook-backup.json", JSON.stringify(store, null, 2), "application/json")}>{ui.exportBackup}</button>
          <label className={control}>{ui.importBackup}<input ref={fileInput} type="file" accept=".json,application/json" disabled={!ready} onChange={event => void importFile(event.target.files?.[0])} className="mt-2 block max-w-full text-xs file:mr-2 file:rounded file:border-0 file:bg-muted file:px-2 file:py-1" /></label>
        </div>
      </div>
      <p className="mt-3 text-xs leading-relaxed text-muted-foreground">{ui.backupHelp}</p>
      {message && <p role="status" className="mt-3 text-sm text-primary">{ui[message]}</p>}
      {!entries.length && <p className="py-8 text-sm text-muted-foreground">{ui.emptyRecords}</p>}
      <div className="mt-5 space-y-3">{entries.map(entry => {
        const definition = templates.find(item => item.id === entry.template);
        return <details key={entry.id} className="rounded-lg border p-4">
          <summary className="cursor-pointer text-sm"><span className="font-semibold">{definition?.title ?? ui.record}</span><span className="mx-3 text-muted-foreground">{formatDate(locale, entry.createdAt)}</span><span className="break-words">{Object.values(entry.values).find(value => value.trim())?.slice(0, 70)}</span></summary>
          <dl className="mt-4 space-y-3">{Object.entries(entry.values).filter(([,value]) => value.trim()).map(([id, value]) => <div key={id}><dt className="text-xs font-semibold text-muted-foreground">{definition?.fields.find(field => field.id === id)?.label ?? ui.note}</dt><dd className="mt-1 whitespace-pre-wrap break-words text-sm leading-relaxed">{value}</dd></div>)}</dl>
          <div className="mt-4 flex flex-wrap gap-3">{definition && <button type="button" className={control} onClick={() => setPending({ type: "load", entry })}>{ui.loadDraft}</button>}<button type="button" className={control} onClick={() => setPending({ type: "delete", entry })}>{ui.deleteRecord}</button></div>
        </details>;
      })}</div>
    </section>
  </div>;
}
