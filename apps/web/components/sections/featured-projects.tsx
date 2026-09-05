"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { TechBadge } from "@/components/ui/tech-badge";
import type { PublicProject } from "@/features/portfolio/portfolio.types";
import { ProjectModal } from "@/components/ui/project-modal";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/cn";
import { motion } from "framer-motion";
import { ArrowUpRight, FolderGit2, Github } from "lucide-react";

export function FeaturedProjects({ projects }: { projects: PublicProject[] }) {
  const [selectedProject, setSelectedProject] = useState<PublicProject | null>(null);
  const top = projects.slice(0, 3);
  const t = useTranslations("FeaturedProjects");

  const mainProject = top[0];
  const secondaryProjects = top.slice(1);

  return (
    <>
      {top.length ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 w-full">
          {/* Main Project Poster */}
          {mainProject && (
            <Link href={`/projects/${mainProject.slug}`} className="lg:col-span-2 flex flex-col">
              <ProjectPosterCard
                project={mainProject}
                isMain={true}
                index={0}
                onClick={() => {}}
                t={t}
              />
            </Link>
          )}

          {/* Secondary Projects Stacked */}
          {secondaryProjects.length > 0 && (
            <div className="flex flex-col gap-4 md:gap-6 lg:col-span-1">
              {secondaryProjects.map((p, i) => (
                <Link key={p.slug} href={`/projects/${p.slug}`} className="flex-1 flex flex-col">
                  <ProjectPosterCard
                    project={p}
                    isMain={false}
                    index={i + 1}
                    onClick={() => {}}
                    t={t}
                  />
                </Link>
              ))}
            </div>
          )}
        </div>
      ) : (
        <p className="text-sm text-white/40 text-center py-10">
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

function ProjectPosterCard({
  project,
  isMain,
  index,
  onClick,
  t
}: {
  project: PublicProject;
  isMain: boolean;
  index: number;
  onClick: () => void;
  t: any;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: index * 0.1 }}
      className={cn(
        "group relative overflow-hidden rounded-3xl cursor-pointer border border-white/10 hover:border-white/20 transition-all duration-700 bg-zinc-900/50 backdrop-blur-sm",
        isMain ? "lg:col-span-2 min-h-[320px] md:min-h-[450px] lg:min-h-[600px]" : "flex-1 min-h-[220px] md:min-h-[300px]"
      )}
      onClick={onClick}
    >
      {/* Background Image / Poster */}
      <div className="absolute inset-0">
        {(project.image || project.screenshots?.[0]) ? (
          <Image
            src={project.image || project.screenshots?.[0] || ""}
            alt={project.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-white/5">
            <FolderGit2 className="w-16 h-16 text-white/10" />
          </div>
        )}
        
        {/* Gradients for text readability and poster effect */}
        <div className={cn(
          "absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent transition-opacity duration-700",
          isMain ? "opacity-90 group-hover:opacity-100" : "opacity-90 group-hover:opacity-100"
        )} />
        <div className="absolute inset-0 bg-blue-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700 mix-blend-overlay" />
      </div>

      {/* Content overlay */}
      <div className="absolute inset-0 flex flex-col justify-end p-4 md:p-8 lg:p-10 z-10">
        {/* Floating Number indicator */}
        <div className="absolute top-4 right-4 lg:top-8 lg:right-8 opacity-40 group-hover:opacity-100 transition-opacity duration-500">
          <span className="text-xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-br from-cyan-300 to-blue-500 leading-none tracking-tighter">
            {(index + 1).toString().padStart(2, "0")}
          </span>
        </div>

        <div className="transform translate-y-2 md:translate-y-3 group-hover:translate-y-0 transition-transform duration-500 ease-out flex flex-col gap-1.5 md:gap-3">
          
          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-1.5 md:gap-2 text-[8px] md:text-[11px] font-bold text-cyan-300 uppercase tracking-widest">
            {project.role && <span>{project.role}</span>}
            {project.role && project.duration && <span className="w-1 h-1 rounded-full bg-white/20" />}
            {project.duration && <span className="text-white/50">{project.duration}</span>}
          </div>

          {/* Title */}
          <h3 className={cn(
            "uppercase leading-[1.15] tracking-tight drop-shadow-md flex flex-col gap-0.5 md:gap-1.5",
            isMain ? "max-w-2xl" : "line-clamp-2"
          )}>
            {project.name.split("|").map((part, i) => (
              <span 
                key={i} 
                className={cn(
                  "block",
                  i === 0 
                    ? (isMain ? "text-xl md:text-4xl lg:text-5xl font-black text-white" : "text-base md:text-xl lg:text-2xl font-black text-white")
                    : (isMain ? "text-sm md:text-lg lg:text-xl font-bold text-white/80" : "text-[11px] md:text-base font-bold text-white/80")
                )}
              >
                {part.trim()}
              </span>
            ))}
          </h3>

          {/* Summary */}
          {isMain && (
            <p className="text-[11px] md:text-sm text-white/70 line-clamp-2 max-w-xl mt-0.5 md:mt-1 font-medium leading-relaxed">
              {project.summary}
            </p>
          )}

          {/* Tech Stack & Action */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 md:gap-3 mt-1 md:mt-3 opacity-90 lg:opacity-0 lg:group-hover:opacity-100 transition-all duration-500 delay-100 lg:translate-y-2 lg:group-hover:translate-y-0">
            <div className="flex flex-wrap gap-1 md:gap-1.5 flex-1">
              {project.stack.slice(0, isMain ? 4 : 3).map((s) => (
                <TechBadge key={s} name={s} className="px-1.5 py-0.5 md:px-2 md:py-0.5 text-[9px] md:text-[10px] bg-black/50 backdrop-blur-md border-white/10 text-white/80" />
              ))}
              {project.stack.length > (isMain ? 4 : 3) && (
                <span className="inline-flex items-center px-1.5 py-0.5 md:px-2 md:py-0.5 rounded-md text-[9px] md:text-[10px] font-semibold bg-white/5 text-white/60 backdrop-blur-md border border-white/10">
                  +{project.stack.length - (isMain ? 4 : 3)}
                </span>
              )}
            </div>
            
            <div className="shrink-0 flex items-center gap-2 hidden sm:flex">
               <div className="inline-flex items-center justify-center w-8 h-8 md:w-10 md:h-10 rounded-full bg-white text-black hover:bg-cyan-400 hover:text-white hover:scale-110 transition-all shadow-lg">
                 <ArrowUpRight className="w-4 h-4 md:w-5 md:h-5" />
               </div>
            </div>
          </div>
          
        </div>
      </div>
    </motion.div>
  );
}
