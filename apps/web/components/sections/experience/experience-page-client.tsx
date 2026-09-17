"use client";

import { Briefcase } from "lucide-react";
import { motion } from "framer-motion";
import { Container } from "@/components/common/container";
import { InteractiveExperience } from "@/components/sections/interactive-experience";
import type { PublicExperience, PublicProject, PublicTimelineNode } from "@/features/portfolio/portfolio.types";
import { useTranslations } from "next-intl";

export function ExperiencePageClient({ 
  experiences, 
  projects, 
  timelineNodes = [] 
}: { 
  experiences: PublicExperience[], 
  projects: PublicProject[],
  timelineNodes?: PublicTimelineNode[]
}) {
  const t = useTranslations("ExperiencePage");

  // Map timelineNodes to ExperienceData structure (Option B)
  const mappedExperiences = timelineNodes.map(node => {
    const highlights: string[] = [];
    let description = undefined;
    
    if (node.description) {
      const parts = node.description.split(/\n{1,}|\r?\n/).map(p => p.trim()).filter(Boolean);
      if (parts.length > 0) {
        description = parts[0]; // First line is description
        // The rest are lessons learned / highlights
        for (let i = 1; i < parts.length; i++) {
          let line = parts[i];
          if (line.startsWith("- ")) line = line.substring(2);
          else if (line.startsWith("-")) line = line.substring(1);
          highlights.push(line);
        }
      }
    }

    // Default values to fallback on if timeline node fields are missing
    return {
      id: node.id,
      title: node.shortLabel || node.type || "Milestone", // Displayed as Role / Tag
      org: node.title || "Timeline Node", // Displayed as Organization / Title
      period: node.date || "Ongoing", // Displayed as Period
      description: description,
      highlights: highlights,
      sprints: node.sprints || [],
      projectId: node.projectId || node.project?.id, // Passing projectId for links
      projectSlug: node.project?.slug
    };
  });

  return (
    <Container className="py-16 md:py-24">
      <div className="mx-auto max-w-5xl space-y-12">
        <div className="flex flex-col items-center text-center space-y-8">
          <div className="space-y-4">
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl font-black tracking-tight md:text-5xl flex items-center justify-center gap-4 text-slate-900 dark:text-white"
            >
              <span className="p-3 bg-cyan-500/10 rounded-2xl text-cyan-600 dark:text-cyan-400">
                <Briefcase className="h-8 w-8" />
              </span>
              My Journey & Experience
            </motion.h1>

            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
              My designated roles, milestones, and specialized responsibilities in projects, focusing on frontend development, UI/UX design, and team efficiency.
            </p>
          </div>
        </div>

        <div className="pt-8 w-full min-h-[600px] relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            {mappedExperiences.length > 0 ? (
              <InteractiveExperience experiences={mappedExperiences} projects={projects} />
            ) : (
              <div className="rounded-3xl border border-slate-200 bg-white/70 p-10 text-center text-slate-500 shadow-sm">
                {t("empty")}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </Container>
  );
}
