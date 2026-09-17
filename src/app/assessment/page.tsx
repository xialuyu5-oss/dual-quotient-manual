import type { Metadata } from "next";
import { getAllChapters } from "@/lib/content";
import { Assessment } from "@/components/assessment/assessment";

export const metadata: Metadata = {
  title: "自测",
  description:
    "二十四题，定位你在智商与情商两条路上各处于器、术、法、道的哪一层，并诊断错位形状。",
};

export default function AssessmentPage() {
  const chapters = Object.fromEntries(
    getAllChapters().map((chapter) => [
      chapter.slug,
      { label: chapter.label, title: chapter.title },
    ]),
  );

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14">
      <header className="mx-auto mb-10 max-w-2xl text-center">
        <p className="mb-2 font-serif text-sm tracking-[0.3em] text-primary">自知</p>
        <h1 className="font-serif text-3xl font-semibold tracking-wide sm:text-4xl">
          先给自己定位
        </h1>
        <p className="mt-3 text-muted-foreground">
          知人者智，自知者明。二十四题，看你在两条路上各站在哪一层。
        </p>
      </header>
      <Assessment chapters={chapters} />
    </div>
  );
}
