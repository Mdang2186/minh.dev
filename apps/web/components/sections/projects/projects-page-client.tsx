"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Calendar, FolderGit2, LayoutTemplate, Briefcase } from "lucide-react";
import { TechBadge } from "@/components/ui/tech-badge";
import { Container } from "@/components/ui/container";
import { ProjectModal } from "@/components/ui/project-modal";
import type { PublicProject } from "@/features/portfolio/portfolio.types";


export function ProjectsPageClient({ projects }: { projects: PublicProject[] }) {
  const [selectedProject, setSelectedProject] = useState<PublicProject | null>(null);

  useEffect(() => {
    document.body.style.overflow = selectedProject ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [selectedProject]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <section className="pt-10 sm:pt-14 pb-20 relative min-h-screen">
      <Container>
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="max-w-7xl mx-auto flex flex-col items-center sm:items-start"
        >
          <motion.div variants={itemVariants} className="mb-14 max-w-3xl flex flex-col items-center text-center sm:items-start sm:text-left">
            <div className="flex items-center gap-4 mb-5">
              <div className="p-3.5 bg-cyan-500/10 rounded-2xl text-cyan-600 dark:text-cyan-400 border border-cyan-500/20 shadow-sm">
                <FolderGit2 className="w-8 h-8" />
              </div>
              <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-slate-900 dark:text-white">
                Featured Projects
              </h1>
            </div>
            <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl">
              Khám phá các dự án tôi đã tham gia và xây dựng. Nhấn vào từng dự án để xem thêm chi tiết về chức năng, giao diện và công nghệ.
            </p>
          </motion.div>

          {projects.length ? (
            <motion.div variants={containerVariants} className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 w-full">
              {projects.map((project) => (
                <motion.div
                  variants={itemVariants}
                  key={project.slug}
                  className="h-full cursor-pointer group"
                  onClick={() => setSelectedProject(project)}
                >
                  <div className="h-full flex flex-col bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-[2rem] overflow-hidden border border-slate-200/80 dark:border-slate-800/80 transition-all duration-500 hover:shadow-2xl hover:shadow-cyan-500/15 hover:-translate-y-1.5 hover:border-cyan-500/40 relative z-10 group">
                    {/* Edge-to-edge Image */}
                    {project.image ? (
                      <div className="relative w-full aspect-[16/10] overflow-hidden bg-slate-100 dark:bg-slate-800 border-b border-slate-100 dark:border-slate-800">
                        <Image
                          src={project.image}
                          alt={project.name}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      </div>
                    ) : (
                      <div className="relative w-full aspect-[16/10] overflow-hidden bg-slate-50 dark:bg-slate-800/50 flex flex-col items-center justify-center border-b border-slate-100 dark:border-slate-800">
                        <LayoutTemplate className="w-14 h-14 text-slate-300 dark:text-slate-600 mb-3" />
                        <span className="text-[13px] font-medium text-slate-400">No preview available</span>
                      </div>
                    )}

                    {/* Content */}
                    <div className="p-6 sm:p-7 flex flex-col flex-grow relative bg-white dark:bg-slate-900">
                      <h3 className="text-xl sm:text-[22px] font-black tracking-tight text-slate-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors leading-snug mb-3">
                        <span className="line-clamp-2">{project.name}</span>
                      </h3>

                      <div className="flex flex-wrap items-center gap-x-3 gap-y-2 mb-4 text-[12px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                        {project.duration ? (
                          <div className="flex items-center gap-1.5">
                            <Calendar className="w-4 h-4 text-cyan-500" />
                            <span>{project.duration}</span>
                          </div>
                        ) : null}
                        {project.duration && project.teamSize && (
                          <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700" />
                        )}
                        {project.teamSize ? (
                          <div className="flex items-center gap-1.5">
                            <Briefcase className="w-4 h-4 text-cyan-500" />
                            <span>{project.teamSize}</span>
                          </div>
                        ) : null}
                      </div>

                      <p className="flex-grow line-clamp-3 text-slate-600 dark:text-slate-400 font-medium leading-relaxed text-[15px] mb-6">
                        {project.summary}
                      </p>

                      <div className="flex flex-wrap gap-2 mt-auto pt-5 border-t border-slate-100 dark:border-slate-800/50">
                        {project.stack.slice(0, 4).map((stack) => (
                          <TechBadge key={stack} name={stack} className="bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700" />
                        ))}
                        {project.stack.length > 4 ? (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-[11px] font-bold bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                            +{project.stack.length - 4}
                          </span>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="w-full rounded-3xl border border-slate-200 bg-white/70 p-10 text-center text-slate-500 shadow-sm">
              Project content is being prepared.
            </div>
          )}
        </motion.div>
      </Container>

      <ProjectModal selectedProject={selectedProject} onClose={() => setSelectedProject(null)} />
    </section>
  );
}
