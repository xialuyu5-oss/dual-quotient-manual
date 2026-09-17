import type { Metadata } from "next";
import { getAllChapters } from "@/lib/content";
import { Practice } from "@/components/practice/practice";

export const metadata: Metadata = {
  title: "日课",
  description: "每日三十分钟的修炼日课与每周一小时的周课，逐项打勾，记录保存在本机。",
};

export default function PracticePage() {
  const chapters = Object.fromEntries(
    getAllChapters().map((chapter) => [
      chapter.slug,
      { label: chapter.label, title: chapter.title },
    ]),
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <header className="mb-8">
        <p className="mb-2 font-serif text-sm tracking-[0.3em] text-primary">日课</p>
        <h1 className="font-serif text-3xl font-semibold tracking-wide sm:text-4xl">
          贵在不断，不贵在多
        </h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          读书不二：一书未完，不看他书。日课五项，周课六项。做不到三十分钟，就删到十分钟，但每天做。
        </p>
      </header>
      <Practice chapters={chapters} />
    </div>
  );
}
