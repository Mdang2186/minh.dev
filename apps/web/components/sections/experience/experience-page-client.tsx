"use client";

import { useState } from "react";
import { Award, Briefcase, Calendar, GraduationCap, MapPin } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Container } from "@/components/common/container";
import { InteractiveExperience } from "@/components/sections/interactive-experience";
import { certifications, educations } from "@/features/work/work.data";
import { cn } from "@/lib/cn";
import type { PublicExperience, PublicProject } from "@/features/portfolio/portfolio.types";
import { useTranslations } from "next-intl";

type Tab = "experience" | "education";

export function ExperiencePageClient({ experiences, projects }: { experiences: PublicExperience[], projects: PublicProject[] }) {
  const [activeTab, setActiveTab] = useState<Tab>("experience");
  const t = useTranslations("ExperiencePage");

  return (
    <Container className="py-16 md:py-24">
      <div className="mx-auto max-w-5xl space-y-12">
        <div className="flex flex-col items-center text-center space-y-8">
          <div className="space-y-4">
            <motion.h1
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl font-black tracking-tight md:text-5xl flex items-center justify-center gap-4 text-slate-900 dark:text-white"
            >
              {activeTab === "experience" ? (
                <>
                  <span className="p-3 bg-cyan-500/10 rounded-2xl text-cyan-600 dark:text-cyan-400">
                    <Briefcase className="h-8 w-8" />
                  </span>
                  Academic Projects
                </>
              ) : (
                <>
                  <span className="p-3 bg-cyan-500/10 rounded-2xl text-cyan-600 dark:text-cyan-400">
                    <GraduationCap className="h-8 w-8" />
                  </span>
                  Education & Certs
                </>
              )}
            </motion.h1>

            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
              {activeTab === "experience"
                ? "My designated roles and specialized responsibilities in university projects, focusing on frontend development, UI/UX design, and team efficiency."
                : "Detailed insights into my academic background, technical engineering degree, and recognized professional qualifications."}
            </p>
          </div>

          <div className="relative inline-flex bg-slate-100 dark:bg-slate-800/50 p-1.5 rounded-full border border-slate-200 dark:border-slate-700/50 shadow-sm z-20">
            {(["experience", "education"] as Tab[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "relative px-6 sm:px-10 py-2.5 rounded-full text-sm font-bold tracking-wide transition-colors duration-300 z-10 uppercase",
                  activeTab === tab ? "text-white" : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
                )}
              >
                {activeTab === tab ? (
                  <motion.div
                    layoutId="active-tab-indicator"
                    className="absolute inset-0 bg-cyan-500 dark:bg-cyan-600 rounded-full shadow-md z-[-1]"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                ) : null}
                {tab === "experience" ? "Experience" : "Education"}
              </button>
            ))}
          </div>
        </div>

        <div className="pt-8 w-full min-h-[600px] relative">
          <AnimatePresence mode="wait">
            {activeTab === "experience" ? (
              <motion.div
                key="experience"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                {experiences.length ? (
                  <InteractiveExperience experiences={experiences} projects={projects} />
                ) : (
                  <div className="rounded-3xl border border-slate-200 bg-white/70 p-10 text-center text-slate-500 shadow-sm">
                    {t("empty")}
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="education"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                <EducationPanel />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </Container>
  );
}

function EducationPanel() {
  return (
    <div className="grid gap-10 lg:grid-cols-2 items-stretch max-w-5xl mx-auto">
      <div className="space-y-8 flex flex-col">
        <h3 className="text-2xl font-black flex items-center gap-3 pb-2 text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800">
          <GraduationCap className="h-6 w-6 text-cyan-500" /> Academic Degree
        </h3>
        <div className="space-y-6 flex-1 flex flex-col">
          {educations.map((edu) => (
            <div key={edu.id} className="p-7 rounded-3xl border border-cyan-500/20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-lg flex flex-col relative overflow-hidden group h-full">
              <div className="flex gap-4 items-start relative z-10">
                <div className="w-16 h-16 rounded-2xl bg-white p-2 shadow-sm border border-slate-200 shrink-0 flex items-center justify-center relative overflow-hidden">
                  <div className="font-black text-xl text-blue-800">UNETI</div>
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-lg md:text-xl text-slate-900 dark:text-white leading-snug">{edu.title}</h4>
                  <div className="flex flex-col gap-1.5 mt-2">
                    <p className="text-[14px] font-medium text-slate-600 dark:text-slate-400 flex items-center gap-2">
                      <MapPin size={15} className="text-cyan-500 shrink-0" /> {edu.org}
                    </p>
                    <p className="text-[14px] font-medium text-slate-600 dark:text-slate-400 flex items-center gap-2">
                      <Calendar size={15} className="text-cyan-500 shrink-0" /> {edu.period}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8 space-y-3.5 text-[15px] bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-100 dark:border-slate-700/50 relative z-10 flex-1">
                <InfoRow label="Major" value={edu.major} />
                <InfoRow label="Degree" value={edu.degree} />
                <InfoRow label="GPA" value={edu.gpa} />
              </div>
              {edu.description ? (
                <p className="text-[15px] leading-relaxed text-slate-600 dark:text-slate-400 mt-6 relative z-10">
                  {edu.description}
                </p>
              ) : null}
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-8 flex flex-col">
        <h3 className="text-2xl font-black flex items-center gap-3 pb-2 text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800">
          <Award className="h-6 w-6 text-cyan-500" /> Certifications
        </h3>
        <div className="grid gap-6 flex-1 items-start content-start">
          {certifications.map((cert) => (
            <div key={cert.id} className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm shadow-sm relative overflow-hidden group" style={{ borderLeftColor: cert.color, borderLeftWidth: "4px" }}>
              <h4 className="font-bold text-lg md:text-xl leading-snug text-slate-900 dark:text-white">{cert.title}</h4>
              <div className="text-[14px] font-medium flex flex-col gap-3 pt-4">
                <span className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                    <Award size={16} className="shrink-0" style={{ color: cert.color }} /> {cert.issuer}
                  </span>
                  {cert.score ? (
                    <span className="font-bold py-1 px-3 rounded-full text-xs tracking-wide shadow-sm" style={{ backgroundColor: `${cert.color}15`, color: cert.color, border: `1px solid ${cert.color}30` }}>
                      Score: {cert.score}
                    </span>
                  ) : null}
                </span>
                <span className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                  <Calendar size={16} className="shrink-0" /> Issued: {cert.date}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-700 pb-3 last:border-0 last:pb-0">
      <span className="text-slate-500 dark:text-slate-400 font-medium tracking-wide text-sm uppercase">{label}</span>
      <span className="font-bold text-slate-900 dark:text-white text-right">{value}</span>
    </div>
  );
}
