"use client";

import { useState } from "react";
import { LocaleLink } from "@/components/locale-link";
import type { WorkshopCase } from "@/lib/workshop/types";

export function CaseExplorer({ cases, ui, onWorkbook }: { cases: WorkshopCase[]; ui: Record<string, string>; onWorkbook: (id: string) => void }) {
  const [category, setCategory] = useState("");
  const [choices, setChoices] = useState<Record<string, number>>({});
  return <>
    <label className="mb-5 flex flex-wrap items-center gap-3 text-sm">
      {ui.filter}
      <select className="max-w-full rounded-md border bg-card px-3 py-2" value={category} onChange={event => setCategory(event.target.value)}>
        <option value="">{ui.allCases}</option>
        {[...new Set(cases.map(item => item.category))].map(value => <option key={value}>{value}</option>)}
      </select>
    </label>
    <div className="grid items-start gap-4 md:grid-cols-2">
      {cases.filter(item => !category || item.category === category).map(item => <details key={item.id} id={`case-${item.id}`} className="group scroll-mt-32 rounded-xl border bg-card open:shadow-sm">
        <summary className="cursor-pointer px-5 py-5 marker:text-primary">
          <span className="text-xs text-primary">{item.category}</span>
          <span className="mt-1 block font-serif text-xl font-semibold">{item.title}</span>
          <span className="mt-2 block text-sm leading-relaxed text-muted-foreground">{item.situation}</span>
        </summary>
        <div className="space-y-5 border-t px-5 py-5 text-sm leading-relaxed">
          <fieldset>
            <legend className="mb-3 font-medium">{item.question}</legend>
            <div className="space-y-2">
              {item.options.map((option, index) => <button key={index} type="button" aria-pressed={choices[item.id] === index} onClick={() => setChoices(previous => ({ ...previous, [item.id]: index }))} className="block w-full rounded-lg border px-4 py-3 text-left transition-colors hover:bg-accent aria-pressed:border-primary aria-pressed:bg-primary/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
                <span className="mr-2 font-serif text-primary">{String.fromCharCode(65 + index)}.</span>{option.text}
              </button>)}
            </div>
          </fieldset>
          {choices[item.id] !== undefined ? <div aria-live="polite" className="rounded-lg bg-paper-deep p-4">
            <p className="mb-1 font-semibold">{ui.tradeoff}</p><p>{item.options[choices[item.id]].feedback}</p>
          </div> : <p className="text-muted-foreground">{ui.chooseFirst}</p>}
          <dl className="space-y-4">
            <div><dt className="font-semibold">{ui.principle}</dt><dd className="mt-1 text-muted-foreground">{item.principle}</dd></div>
            <div><dt className="font-semibold">{ui.action}</dt><dd className="mt-1 text-muted-foreground">{item.action}</dd></div>
            <div><dt className="font-semibold">{ui.review}</dt><dd className="mt-1 text-muted-foreground">{item.review}</dd></div>
          </dl>
          <div className="flex flex-wrap items-center gap-4 border-t pt-4">
            <button type="button" onClick={() => onWorkbook(item.template)} className="rounded-md bg-primary px-4 py-2 text-primary-foreground">{ui.openWorkbook}</button>
            <LocaleLink href={`/manual/${item.chapter}`} className="text-primary underline underline-offset-4">{ui.relatedChapter}</LocaleLink>
          </div>
        </div>
      </details>)}
    </div>
  </>;
}
