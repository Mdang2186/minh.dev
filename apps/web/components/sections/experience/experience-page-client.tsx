"use client";

import { Briefcase } from "lucide-react";
import { motion } from "framer-motion";
import { Container } from "@/components/common/container";
import { InteractiveExperience } from "@/components/sections/interactive-experience";
import type { PublicExperience, PublicProject } from "@/features/portfolio/portfolio.types";
import { useTranslations } from "next-intl";

export function ExperiencePageClient({ experiences, projects }: { experiences: PublicExperience[], projects: PublicProject[] }) {
  const t = useTranslations("ExperiencePage");

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
              Professional Experience
            </motion.h1>

            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
              My designated roles and specialized responsibilities in projects, focusing on frontend development, UI/UX design, and team efficiency.
            </p>
          </div>
        </div>

        <div className="pt-8 w-full min-h-[600px] relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            {experiences.length ? (
              <InteractiveExperience experiences={experiences} projects={projects} />
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
