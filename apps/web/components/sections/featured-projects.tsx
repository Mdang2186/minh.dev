"use client";

import { useState } from "react";
import { TechBadge } from "@/components/ui/tech-badge";
import { Card, CardDesc, CardTitle } from "@/components/ui/card";
import type { PublicProject } from "@/features/portfolio/portfolio.types";
import { ProjectModal } from "@/components/ui/project-modal";
import { useTranslations } from "next-intl";

export function FeaturedProjects({ projects }: { projects: PublicProject[] }) {
  const [selectedProject, setSelectedProject] = useState<PublicProject | null>(null);
  const top = projects.slice(0, 3);
  const t = useTranslations("FeaturedProjects");

  return (
    <>
      {top.length ? (
        <div className="grid gap-4 md:grid-cols-3">
          {top.map((p) => (
            <div
              key={p.slug}
              className="h-full cursor-pointer group"
              onClick={() => setSelectedProject(p)}
            >
              <Card className="flex flex-col h-full hover:shadow-lg transition-shadow">
                <CardTitle className="group-hover:text-cyan-600 transition-colors">{p.name}</CardTitle>
                <CardDesc className="flex-grow">{p.summary}</CardDesc>

                <div className="mt-4 flex flex-wrap gap-2">
                  {p.stack.slice(0, 3).map((s) => (
                    <TechBadge key={s} name={s} />
                  ))}
                  {p.stack.length > 3 && (
                    <span className="inline-flex items-center px-2 py-1 rounded-lg text-[11px] font-bold bg-slate-100 text-slate-500 border border-slate-200">
                      +{p.stack.length - 3}
                    </span>
                  )}
                </div>

                <div className="mt-5 flex flex-wrap gap-3 pointer-events-none">
                  <span className="text-sm font-semibold text-cyan-600 dark:text-cyan-400">
                    {t("learnMore")}
                  </span>
                </div>
              </Card>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-neutral-500 dark:text-neutral-400 text-center py-10">
          {t("empty")}
        </p>
      )}

      <ProjectModal
        selectedProject={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </>
  );
}
