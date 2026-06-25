"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Code2, LayoutTemplate, PenTool, Server, Wrench, Star } from "lucide-react";
import { Container } from "@/components/ui/container";
import { useTranslations } from "next-intl";
import type { PublicSkillGroup } from "@/features/portfolio/portfolio.types";
import {
  SiJavascript, SiTypescript, SiReact, SiHtml5, SiCss3,
  SiTailwindcss, SiDotnet, SiSpring,
  SiMysql, SiPostgresql, SiMongodb,
  SiGit, SiGithub, SiDocker, SiPostman,
  SiFigma, SiAdobephotoshop, SiAdobeillustrator, SiCanva,
  SiNextdotjs, SiNodedotjs,
} from "react-icons/si";
import {
  TbBrandCSharp, TbBrandVscode, TbBrandVisualStudio, TbFileTypeSql,
} from "react-icons/tb";
import { FaJava } from "react-icons/fa";
import type { IconType } from "react-icons";

const techIconMap: Record<string, { icon: IconType; color: string }> = {
  "javascript": { icon: SiJavascript, color: "#F7DF1E" },
  "typescript": { icon: SiTypescript, color: "#3178C6" },
  "reactjs": { icon: SiReact, color: "#61DAFB" },
  "react": { icon: SiReact, color: "#61DAFB" },
  "html & css": { icon: SiHtml5, color: "#E34F26" },
  "html": { icon: SiHtml5, color: "#E34F26" },
  "css": { icon: SiCss3, color: "#1572B6" },
  "tailwindcss": { icon: SiTailwindcss, color: "#06B6D4" },
  "c#/.net": { icon: TbBrandCSharp, color: "#512BD4" },
  "c#": { icon: TbBrandCSharp, color: "#512BD4" },
  "asp.net mvc": { icon: SiDotnet, color: "#512BD4" },
  "asp.net core": { icon: SiDotnet, color: "#512BD4" },
  "entity framework": { icon: SiDotnet, color: "#512BD4" },
  "java": { icon: FaJava, color: "#ED8B00" },
  "spring": { icon: SiSpring, color: "#6DB33F" },
  "mysql": { icon: SiMysql, color: "#4479A1" },
  "sql server": { icon: TbFileTypeSql, color: "#CC2927" },
  "git & github": { icon: SiGithub, color: "#181717" },
  "git": { icon: SiGit, color: "#F05032" },
  "github": { icon: SiGithub, color: "#181717" },
  "vs code": { icon: TbBrandVscode, color: "#007ACC" },
  "visual studio": { icon: TbBrandVisualStudio, color: "#5C2D91" },
  "postman": { icon: SiPostman, color: "#FF6C37" },
  "figma": { icon: SiFigma, color: "#F24E1E" },
  "photoshop": { icon: SiAdobephotoshop, color: "#31A8FF" },
  "illustrator": { icon: SiAdobeillustrator, color: "#FF9A00" },
  "canva": { icon: SiCanva, color: "#00C4CC" },
  "next.js": { icon: SiNextdotjs, color: "#000000" },
  "node.js": { icon: SiNodedotjs, color: "#339933" },
  "mongodb": { icon: SiMongodb, color: "#47A248" },
  "postgresql": { icon: SiPostgresql, color: "#4169E1" },
  "docker": { icon: SiDocker, color: "#2496ED" },
};

function getTechIcon(name: string) {
  const key = name.toLowerCase();
  return techIconMap[key] ?? null;
}

const levelConfig: Record<string, { label: string; stars: number; color: string; bg: string }> = {
  "frequently used": { label: "Frequently Used", stars: 5, color: "text-emerald-600", bg: "bg-emerald-50 border-emerald-200" },
  "occasionally": { label: "Occasionally", stars: 3, color: "text-blue-600", bg: "bg-blue-50 border-blue-200" },
  "learning": { label: "Learning", stars: 2, color: "text-amber-600", bg: "bg-amber-50 border-amber-200" },
};

const categoryIcons = [LayoutTemplate, Server, Code2, PenTool];

type Skill = { id: string; name: string; level?: string | null };

function SkillDetailModal({ skill, groupTitle, onClose }: { skill: Skill; groupTitle: string; onClose: () => void }) {
  const tech = getTechIcon(skill.name);
  const levelKey = skill.level?.toLowerCase() ?? "";
  const lvl = levelConfig[levelKey] ?? { label: skill.level ?? "Unknown", stars: 0, color: "text-slate-600", bg: "bg-slate-50 border-slate-200" };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" />
        <motion.div
          className="relative bg-white rounded-3xl shadow-2xl w-full max-w-sm z-10 overflow-hidden border border-slate-200"
          initial={{ scale: 0.85, opacity: 0, y: 30 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.85, opacity: 0, y: 30 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header gradient */}
          <div className="h-28 bg-gradient-to-br from-slate-50 to-slate-100 relative flex items-center justify-center">
            {tech ? (
              <tech.icon
                style={{ color: tech.color }}
                className="w-16 h-16 drop-shadow-md"
              />
            ) : (
              <Code2 className="w-14 h-14 text-slate-400" />
            )}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/80 hover:bg-white text-slate-500 hover:text-slate-800 transition-all shadow-sm border border-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-6 space-y-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">{groupTitle}</p>
              <h2 className="text-2xl font-black text-slate-900">{skill.name}</h2>
            </div>

            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-bold ${lvl.bg} ${lvl.color}`}>
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3.5 h-3.5 ${i < lvl.stars ? "fill-current" : "opacity-20 fill-current"}`}
                  />
                ))}
              </div>
              {lvl.label}
            </div>

            <div className="pt-2 border-t border-slate-100 text-sm text-slate-500 leading-relaxed">
              {levelKey === "frequently used" && "Công nghệ tôi dùng thường xuyên trong các dự án thực tế."}
              {levelKey === "occasionally" && "Tôi đã làm việc với công nghệ này trong một số dự án cụ thể."}
              {levelKey === "learning" && "Tôi đang trong quá trình học và khám phá công nghệ này."}
              {!["frequently used", "occasionally", "learning"].includes(levelKey) && "Công nghệ trong bộ kỹ năng của tôi."}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export function SkillsPageClient({ groups }: { groups: PublicSkillGroup[] }) {
  const [selectedSkill, setSelectedSkill] = useState<{ skill: Skill; groupTitle: string } | null>(null);
  const t = useTranslations("SkillsPage");

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <>
      <section className="pt-10 sm:pt-14 pb-16 min-h-screen relative bg-white">
        <Container>
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="max-w-6xl mx-auto"
          >
            <motion.div variants={itemVariants} className="text-center mb-16 sm:mb-20">
              <div className="inline-flex items-center justify-center p-3 sm:p-4 bg-slate-100 rounded-3xl text-slate-800 mb-6 border border-slate-200 shadow-sm">
                <Wrench className="w-8 h-8 sm:w-10 sm:h-10" />
              </div>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-4 text-slate-900">
                Skills <span className="text-slate-300">&</span>{" "}
                <span className="text-cyan-600">Tools</span>
              </h1>
              <p className="text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed font-medium">
                Nhấn vào từng kỹ năng để xem chi tiết mức độ sử dụng. Hover để xem biểu tượng công nghệ.
              </p>
            </motion.div>

            <motion.div variants={itemVariants} className="space-y-8 lg:space-y-10">
              {groups.length ? (
                groups.map((group, index) => {
                  const Icon = categoryIcons[index % categoryIcons.length];
                  return (
                    <motion.div
                      key={group.id}
                      variants={itemVariants}
                      className="p-6 sm:p-8 lg:p-10 rounded-3xl bg-white border border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-300"
                    >
                      <div className="flex flex-col md:flex-row gap-6 lg:gap-12">
                        <div className="md:w-1/3 flex-shrink-0">
                          <div className="flex items-center gap-4 mb-3">
                            <div className="p-3 bg-slate-100 border border-slate-200 rounded-2xl text-slate-800">
                              <Icon className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900">{group.title}</h3>
                          </div>
                          <p className="text-sm text-slate-400">{group.skills.length} kỹ năng</p>
                        </div>

                        <div className="md:w-2/3 flex flex-wrap gap-3">
                          {group.skills.map((skill) => {
                            const tech = getTechIcon(skill.name);
                            const levelKey = skill.level?.toLowerCase() ?? "";
                            const lvl = levelConfig[levelKey];
                            return (
                              <button
                                key={skill.id}
                                onClick={() => setSelectedSkill({ skill, groupTitle: group.title })}
                                className="group/skill flex items-center gap-2.5 px-4 py-2.5 rounded-2xl border border-slate-200 bg-slate-50 hover:bg-white hover:border-cyan-300 hover:shadow-md transition-all duration-200 cursor-pointer select-none"
                              >
                                {tech ? (
                                  <tech.icon
                                    style={{ color: tech.color }}
                                    className="w-5 h-5 flex-shrink-0 transition-transform duration-200 group-hover/skill:scale-110"
                                  />
                                ) : (
                                  <Code2 className="w-5 h-5 text-slate-400 flex-shrink-0" />
                                )}
                                <span className="text-sm font-semibold text-slate-700 group-hover/skill:text-cyan-700 transition-colors whitespace-nowrap">
                                  {skill.name}
                                </span>
                                {lvl && (
                                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md border ${lvl.bg} ${lvl.color} hidden sm:inline-block`}>
                                    {lvl.stars}★
                                  </span>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </motion.div>
                  );
                })
              ) : (
                <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center text-slate-400">
                  {t("empty")}
                </div>
              )}
            </motion.div>
          </motion.div>
        </Container>
      </section>

      {selectedSkill && (
        <SkillDetailModal
          skill={selectedSkill.skill}
          groupTitle={selectedSkill.groupTitle}
          onClose={() => setSelectedSkill(null)}
        />
      )}
    </>
  );
}
