import { LEVELS, type Level } from "@/lib/taxonomy";
import { cn } from "@/lib/utils";

const LEVEL_CLASSES: Record<Level, string> = {
  qi: "bg-level-qi/12 text-level-qi ring-level-qi/30",
  shu: "bg-level-shu/12 text-level-shu ring-level-shu/30",
  fa: "bg-level-fa/12 text-level-fa ring-level-fa/30",
  dao: "bg-level-dao/12 text-level-dao ring-level-dao/30",
};

export const LEVEL_DOT: Record<Level, string> = {
  qi: "bg-level-qi",
  shu: "bg-level-shu",
  fa: "bg-level-fa",
  dao: "bg-level-dao",
};

export const LEVEL_TEXT: Record<Level, string> = {
  qi: "text-level-qi",
  shu: "text-level-shu",
  fa: "text-level-fa",
  dao: "text-level-dao",
};

export function LevelBadge({
  level,
  className,
  withShort = false,
}: {
  level: Level;
  className?: string;
  withShort?: boolean;
}) {
  const meta = LEVELS[level];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-sm px-2 py-0.5 font-serif text-xs font-semibold tracking-wider ring-1",
        LEVEL_CLASSES[level],
        className,
      )}
    >
      <span className="text-sm leading-none">{meta.name}</span>
      {withShort && <span className="font-sans font-normal">{meta.short}</span>}
    </span>
  );
}
