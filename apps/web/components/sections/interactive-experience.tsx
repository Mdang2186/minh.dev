"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Briefcase, Calendar, ChevronRight, X, Github, Code2, Layers, Wrench, Users, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import type { PublicProject } from "@/features/portfolio/portfolio.types";
import { Link } from "@/i18n/routing";

type ExperienceHighlight = string;

export interface SprintData {
    id?: string;
    title: string;
    startDate?: string;
    endDate?: string;
    description?: string;
}

export interface ExperienceData {
    id: string;
    title: string;
    org: string;
    period: string;
    description?: string;
    highlights: ExperienceHighlight[];
    sprints?: SprintData[];
    projectId?: string;
    projectSlug?: string;
}

interface InteractiveExperienceProps {
    experiences: ExperienceData[];
    projects?: PublicProject[];
}

export function InteractiveExperience({ experiences, projects = [] }: InteractiveExperienceProps) {
    const [activeIndex, setActiveIndex] = useState<number>(-1);
    const [isMobile, setIsMobile] = useState(false);

    // Check if we are on mobile to change behavior
    useEffect(() => {
        const checkMobile = () => {
            const mobile = window.innerWidth < 768;
            setIsMobile(mobile);
            if (!mobile && activeIndex === -1) {
                setActiveIndex(0);
            }
        };
        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, [activeIndex]);

    if (!experiences || experiences.length === 0) return null;

    const activeExp = experiences[activeIndex] || experiences[0];
    
    // Find matching project
    const activeProject = projects.find(p => p.name.includes(activeExp.org) || activeExp.org.includes(p.name));

    return (
        <div className="flex flex-col md:flex-row gap-8 lg:gap-12 w-full max-w-5xl mx-auto">
            {/* Left Column: Vertical Timeline */}
            <div className="md:w-1/3 flex flex-col relative">
                <div className="absolute left-4 sm:left-5 top-8 bottom-8 w-[2px] bg-border/40 rounded-full" />

                <div className="flex flex-col gap-6 relative z-10 w-full">
                    {experiences.map((exp, index) => {
                        const isActive = index === activeIndex;

                        return (
                            <div key={exp.id} className="relative flex flex-col w-full">
                                <div
                                    className="relative flex items-center group w-full"
                                >
                                    {/* Timeline Dot */}
                                    <div className="absolute left-0 flex items-center justify-center shrink-0 w-8 h-8 rounded-full bg-background border-2 transition-colors z-20"
                                        style={{
                                            borderColor: isActive ? 'rgb(6 182 212)' : 'rgb(226 232 240)',
                                        }}>
                                        <div className={cn(
                                            "w-2.5 h-2.5 rounded-full transition-all duration-300",
                                            isActive ? "bg-cyan-500 scale-100" : "bg-transparent scale-0 group-hover:bg-cyan-500/50 group-hover:scale-100"
                                        )} />
                                    </div>

                                    {/* Timeline Tab (Card Style) */}
                                    <div 
                                        onClick={() => {
                                            if (isMobile) {
                                                setActiveIndex(isActive ? -1 : index);
                                            } else {
                                                setActiveIndex(index);
                                            }
                                        }}
                                        className={cn(
                                            "ml-12 p-4 sm:p-5 rounded-2xl flex-1 transition-all duration-300 border flex justify-between items-center group/tab cursor-pointer",
                                            isActive
                                                ? "bg-white dark:bg-slate-900 border-cyan-500 shadow-md ring-1 ring-cyan-500/20"
                                                : "bg-white/60 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 shadow-sm hover:border-cyan-300"
                                        )}
                                    >
                                        <div className="flex flex-col">
                                            <span className="font-bold text-slate-900 dark:text-white md:text-sm lg:text-base line-clamp-1">{exp.org.split('–')[0]?.trim() || exp.org}</span>
                                            <span className="text-[13px] font-medium text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1.5"><Calendar size={14} className="text-cyan-500" /> {exp.period}</span>
                                        </div>
                                        {!isMobile && (
                                            <ChevronRight size={18} className={cn(
                                                "text-slate-400 transition-transform duration-300",
                                                isActive ? "translate-x-1 text-cyan-500 opacity-100" : "opacity-0 -translate-x-2 group-hover/tab:opacity-50 group-hover/tab:-translate-x-1"
                                            )} />
                                        )}
                                        {isMobile && (
                                            <ChevronRight size={18} className={cn(
                                                "text-slate-400 transition-transform duration-300",
                                                isActive ? "rotate-90 text-cyan-500" : "rotate-0"
                                            )} />
                                        )}
                                    </div>
                                </div>

                                {/* Mobile Inline Content (Accordion style) */}
                                <AnimatePresence>
                                    {isMobile && isActive && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            className="overflow-hidden w-full relative z-30"
                                        >
                                            <div className="pt-4 pb-6">
                                                <ExperienceDetailCard 
                                                    exp={activeExp} 
                                                    project={activeProject}
                                                    className="shadow-xl ring-1 ring-slate-900/5"
                                                />
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Right Column: Detail View (Desktop Sticky) */}
            {!isMobile && (
                <div className="md:w-2/3 relative h-auto">
                    <div className="sticky top-24 min-h-[400px]">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeExp.id}
                                initial={{ opacity: 0, x: 20, filter: "blur(4px)" }}
                                animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                                exit={{ opacity: 0, x: -20, filter: "blur(4px)" }}
                                transition={{ duration: 0.3, ease: "easeOut" }}
                                className="h-full"
                            >
                                <ExperienceDetailCard 
                                    exp={activeExp} 
                                    className="h-full" 
                                    project={activeProject}
                                />
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            )}
        </div>
    );
}

function ExperienceDetailCard({ exp, className, project }: { exp: ExperienceData, className?: string, project?: PublicProject }) {
    return (
        <div className={cn(
            "p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col relative overflow-hidden",
            className
        )}>

            <div className="flex flex-col space-y-4 pb-6 border-b border-cyan-500/20 relative z-10">
                <div className="flex justify-between items-start gap-4">
                    <div className="inline-flex items-center gap-2 w-fit">
                        <span className="px-3.5 py-1.5 rounded-full bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 text-xs md:text-sm font-bold tracking-wide uppercase border border-slate-200 dark:border-slate-700">
                            {exp.title}
                        </span>
                    </div>
                </div>

                <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white leading-tight group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                    {exp.org}
                </h3>

                <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-sm font-medium pt-1 text-slate-600 dark:text-slate-400">
                    <span className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
                        <Calendar size={15} className="text-cyan-600 dark:text-cyan-400" /> {exp.period}
                    </span>
                    {project?.teamSize && (
                        <span className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
                            <Briefcase size={15} className="text-cyan-600 dark:text-cyan-400" /> {project.teamSize}
                        </span>
                    )}
                </div>
            </div>

            <div className="pt-7 flex-1 relative z-10">
                {exp.description && (
                    <div className="mb-6">
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-3 flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-cyan-500" /> Mô tả kinh nghiệm
                        </h4>
                        <p className="text-[14px] sm:text-[15px] leading-relaxed text-slate-700 dark:text-slate-300">
                            {exp.description}
                        </p>
                    </div>
                )}
            
                {exp.highlights.length > 0 && (
                    <>
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-5 flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-cyan-500" /> Bài học & Đóng góp
                        </h4>
                        <ul className="space-y-3 text-[14px] sm:text-[15px] leading-relaxed text-slate-700 dark:text-slate-300">
                            {exp.highlights.map((highlight, index) => {
                                const parts = highlight.split(':');
                                const hasColon = parts.length > 1;

                                return (
                                    <motion.li
                                        key={index}
                                        initial={{ opacity: 0, y: 5 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.3, delay: index * 0.1 }}
                                        className="flex items-start gap-3 py-1"
                                    >
                                        <span className="mt-2 w-1.5 h-1.5 shrink-0 rounded-full bg-slate-400 dark:bg-slate-500" />
                                        <span className="flex-1">
                                            {hasColon ? (
                                                <>
                                                    <span className="font-bold text-slate-900 dark:text-cyan-300">{parts[0]}:</span>
                                                    <span className="text-slate-600 dark:text-slate-300">{parts.slice(1).join(':')}</span>
                                                </>
                                            ) : (
                                                <span>{highlight}</span>
                                            )}
                                        </span>
                                    </motion.li>
                                );
                            })}
                        </ul>
                    </>
                )}

                {exp.sprints && exp.sprints.length > 0 && (
                    <div className="mt-8 space-y-8">
                        {exp.sprints.map((sprint, idx) => (
                            <motion.div 
                                key={idx}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: idx * 0.15 }}
                            >
                                <h4 className="text-base font-bold text-slate-900 dark:text-white flex flex-wrap items-center gap-2 mb-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0" /> 
                                    <span>{sprint.title}</span>
                                    {(sprint.startDate || sprint.endDate) && (
                                        <span className="text-[11px] font-bold bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md text-slate-500 whitespace-nowrap">
                                            {sprint.startDate} {sprint.endDate ? `- ${sprint.endDate}` : ''}
                                        </span>
                                    )}
                                </h4>
                                {sprint.description && (
                                    <ul className="space-y-3 text-[14px] sm:text-[15px] leading-relaxed text-slate-700 dark:text-slate-300 ml-2 border-l-2 border-slate-100 dark:border-slate-800 pl-4">
                                        {sprint.description.split(/\r?\n/).filter(Boolean).map((line, i) => {
                                            // Make bullet point styles
                                            let content = line.trim();
                                            if (content.startsWith("- ")) content = content.substring(2);
                                            else if (content.startsWith("-")) content = content.substring(1);
                                            
                                            const parts = content.split(':');
                                            const hasColon = parts.length > 1;

                                            return (
                                                <li key={i} className="flex items-start gap-3 py-1">
                                                    <span className="mt-2 w-1.5 h-1.5 shrink-0 rounded-full bg-slate-300 dark:bg-slate-600" />
                                                    <span className="flex-1">
                                                        {hasColon ? (
                                                            <>
                                                                <span className="font-bold text-slate-800 dark:text-slate-200">{parts[0]}:</span>
                                                                <span className="text-slate-600 dark:text-slate-400">{parts.slice(1).join(':')}</span>
                                                            </>
                                                        ) : (
                                                            <span>{content}</span>
                                                        )}
                                                    </span>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                )}
                            </motion.div>
                        ))}
                    </div>
                )}
                
                {exp.projectSlug && (
                    <div className="mt-8 text-center">
                        <Link 
                            href={`/projects/${exp.projectSlug}`}
                            className="inline-flex items-center gap-2 text-cyan-600 dark:text-cyan-400 font-bold text-sm bg-cyan-50 dark:bg-cyan-900/30 px-5 py-2.5 rounded-xl group-hover:bg-cyan-100 dark:group-hover:bg-cyan-900/50 transition-colors"
                            onClick={(e) => e.stopPropagation()} // Prevent triggering parent onClick if any
                        >
                            Nhấn để xem chi tiết dự án <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                )}
            </div>

        </div>
    );
}

