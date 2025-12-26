import Link from "next/link";
import { experiences } from "@/features/work/work.data";

export function ExperiencePreview() {
  const top = experiences.slice(0, 3);

  return (
    <div className="flex flex-col">
      {top.map((e, i) => (
        <div
          key={e.id}
          className="group flex flex-col gap-2 py-4 md:flex-row md:gap-8 border-b border-border/40 last:border-0"
        >
          <span className="text-sm text-muted-foreground w-32 shrink-0 pt-0.5">
            {e.period}
          </span>
          <div className="flex flex-col gap-1">
            <h3 className="font-medium text-foreground">
              {e.title}
            </h3>
            <p className="text-sm text-muted-foreground">
              {e.org}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
