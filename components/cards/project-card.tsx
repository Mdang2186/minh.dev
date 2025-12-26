import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/features/projects/projects.types";
import { cn } from "@/lib/utils";

export function ProjectCard({ project }: { project: Project }) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group flex flex-col gap-2 rounded-lg py-3 transition-colors sm:flex-row sm:items-start sm:gap-6"
    >
      <div className="shrink-0 sm:w-32">
        <span className="text-sm text-muted-foreground tabular-nums">
          {project.updatedAt ? new Date(project.updatedAt).getFullYear() : "2024"}
        </span>
      </div>

      <div className="flex flex-col gap-1">
        <h3 className="font-medium text-foreground group-hover:underline decoration-muted-foreground/50 underline-offset-4">
          {project.name}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {project.summary}
        </p>

        {/* Optional: Show stack if needed, or keep it minimal like luoi.dev which often just lists name/desc */}
      </div>
    </Link>
  );
}
