"use client";

import { useState } from "react";
import { CaseExplorer } from "@/components/workshop/case-explorer";
import { Workbook } from "@/components/workshop/workbook";
import type { WorkshopContent } from "@/lib/workshop/types";

export default function WorkshopPage({ content }: { content: WorkshopContent }) {
  const [active, setActive] = useState(content.templates[0].id);
  const { ui } = content;
  const sections = [
    { id: "cases", title: ui.casesTitle, description: ui.casesIntro, count: content.cases.length },
    { id: "workbook", title: ui.workbookTitle, description: ui.workbookIntro, count: content.templates.length },
    { id: "boundaries", title: ui.topicsTitle, description: ui.topicsIntro, count: content.topics.length },
  ];
  function openWorkbook(id: string) {
    setActive(id);
    document.getElementById("workbook")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }
  return <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
    <header className="max-w-3xl">
      <p className="font-serif text-sm tracking-widest text-primary">{ui.eyebrow}</p>
      <h1 className="mt-3 font-serif text-4xl font-semibold leading-tight sm:text-5xl">{content.title}</h1>
      <p className="mt-5 text-base leading-relaxed text-muted-foreground sm:text-lg">{content.intro}</p>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{ui.growing}</p>
    </header>
    <nav aria-label={ui.sectionNav} className="my-9 grid gap-4 md:grid-cols-3">
      {sections.map((section, index) => <a key={section.id} href={`#${section.id}`} className="group rounded-xl border bg-card p-5 transition-colors hover:border-primary focus-visible:outline-2 focus-visible:outline-primary">
        <span className="font-serif text-3xl text-primary/70">0{index + 1}</span><span className="ml-3 text-sm text-muted-foreground">{section.count} {ui.items}</span>
        <h2 className="mt-3 font-serif text-xl font-semibold">{section.title} <span aria-hidden className="text-primary">↗</span></h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{section.description}</p>
      </a>)}
    </nav>
    <section id="cases" className="scroll-mt-36 border-t py-10">
      <h2 className="font-serif text-3xl font-semibold">{ui.casesTitle}</h2>
      <p className="mb-6 mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground">{ui.caseNote}</p>
      <CaseExplorer cases={content.cases} ui={ui} onWorkbook={openWorkbook} />
    </section>
    <section id="workbook" className="scroll-mt-36 border-t py-10">
      <h2 className="mb-3 font-serif text-3xl font-semibold">{ui.workbookTitle}</h2>
      <Workbook templates={content.templates} ui={ui} active={active} onSelect={setActive} />
    </section>
    <section id="boundaries" className="scroll-mt-36 border-t py-10">
      <h2 className="font-serif text-3xl font-semibold">{ui.topicsTitle}</h2>
      <p className="mb-6 mt-3 text-sm leading-relaxed text-muted-foreground">{ui.topicsIntro}</p>
      <div className="grid items-start gap-4 md:grid-cols-2">{content.topics.map((topic, index) => <details key={topic.id} id={`topic-${topic.id}`} className="scroll-mt-36 rounded-xl border bg-card">
        <summary className="cursor-pointer p-5 marker:text-primary"><span className="mr-2 font-serif text-primary">0{index + 1}</span><span className="font-serif text-xl font-semibold">{topic.title}</span></summary>
        <div className="space-y-4 border-t p-5 text-sm leading-relaxed">
          <p>{topic.idea}</p>
          <div><h3 className="font-semibold">{ui.ask}</h3><ul className="mt-2 list-disc space-y-2 pl-5 text-muted-foreground">{topic.questions.map(question => <li key={question}>{question}</li>)}</ul></div>
          <div className="rounded-lg bg-paper-deep p-4"><h3 className="mb-1 font-semibold">{ui.example}</h3><p>{topic.example}</p></div>
          <div><h3 className="font-semibold">{ui.limit}</h3><p className="mt-1 text-muted-foreground">{topic.boundary}</p></div>
        </div>
      </details>)}</div>
      <button type="button" onClick={() => openWorkbook("interests")} className="mt-6 rounded-lg border border-primary px-4 py-3 text-sm text-primary hover:bg-primary/5">{ui.mapInterests}</button>
    </section>
    <aside className="rounded-xl bg-paper-deep p-6 text-sm leading-relaxed text-muted-foreground"><p className="mb-1 font-serif text-lg font-semibold text-foreground">{ui.nextTitle}</p><p>{ui.nextBody}</p></aside>
  </main>;
}
