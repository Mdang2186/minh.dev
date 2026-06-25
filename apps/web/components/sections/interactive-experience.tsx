"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Briefcase, Calendar, ChevronRight, X, Github, Code2, Layers, Wrench, Users, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import type { PublicProject } from "@/features/portfolio/portfolio.types";

type ExperienceHighlight = string;

export interface ExperienceData {
    id: string;
    title: string;
    org: string;
    period: string;
    highlights: ExperienceHighlight[];
}

interface InteractiveExperienceProps {
    experiences: ExperienceData[];
    projects?: PublicProject[];
}

export function InteractiveExperience({ experiences, projects = [] }: InteractiveExperienceProps) {
    const [activeIndex, setActiveIndex] = useState<number>(-1);
    const [isMobile, setIsMobile] = useState(false);
    const [selectedProject, setSelectedProject] = useState<PublicProject | null>(null);

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
                                    className={cn(
                                        "relative flex items-center group cursor-pointer transition-all duration-300 w-full pl-0",
                                        isActive ? "opacity-100" : "opacity-60 hover:opacity-100"
                                    )}
                                    onMouseEnter={() => !isMobile && setActiveIndex(index)}
                                    onClick={() => setActiveIndex(isActive && isMobile ? -1 : index)}
                                >
                                    {/* Timeline Dot */}
                                    <div className="relative flex items-center justify-center shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-background border-2 transition-colors z-20"
                                        style={{
                                            borderColor: isActive ? 'hsl(var(--primary))' : 'hsl(var(--border))',
                                        }}>
                                        <div className={cn(
                                            "w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300",
                                            isActive ? "bg-primary scale-100" : "bg-transparent scale-0 group-hover:bg-primary/50 group-hover:scale-100"
                                        )} />
                                    </div>

                                    {/* Timeline Tab */}
                                    <div className={cn(
                                        "ml-4 p-4 rounded-2xl flex-1 transition-all duration-300 border flex justify-between items-center group/tab",
                                        isActive
                                            ? "bg-primary/5 border-primary/20 shadow-sm"
                                            : "bg-transparent border-transparent hover:bg-muted/30"
                                    )}>
                                        <div className="flex flex-col">
                                            <span className="font-semibold text-foreground md:text-sm lg:text-base line-clamp-1">{exp.org.split('–')[0]?.trim() || exp.org}</span>
                                            <span className="text-xs text-muted-foreground mt-1 flex items-center gap-1.5"><Calendar size={12} /> {exp.period}</span>
                                        </div>
                                        <ChevronRight size={16} className={cn(
                                            "text-muted-foreground transition-transform duration-300",
                                            isActive ? "translate-x-1 text-primary opacity-100 rotate-90 md:rotate-0" : "opacity-0 -translate-x-2 group-hover/tab:opacity-50 group-hover/tab:-translate-x-1"
                                        )} />
                                    </div>
                                </div>

                                {/* Mobile Inline Content (Accordion style) */}
                                <AnimatePresence>
                                    {isMobile && isActive && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            className="overflow-hidden w-full pl-12 sm:pl-14 pr-0"
                                        >
                                            <div className="pt-4 pb-6">
                                                <ExperienceDetailCard 
                                                    exp={activeExp} 
                                                    project={activeProject}
                                                    onViewDetails={() => setSelectedProject(activeProject ?? null)} 
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
                                    onViewDetails={() => setSelectedProject(activeProject ?? null)}
                                />
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            )}
            
            <AnimatePresence>
                {selectedProject && (
                    <ProjectDetailModal 
                        project={selectedProject} 
                        role={activeExp.title}
                        onClose={() => setSelectedProject(null)} 
                    />
                )}
            </AnimatePresence>
        </div>
    );
}

function ExperienceDetailCard({ exp, className, project, onViewDetails }: { exp: ExperienceData, className?: string, project?: PublicProject, onViewDetails: () => void }) {
    return (
        <div className={cn(
            "p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col relative overflow-hidden group cursor-pointer",
            className
        )} onClick={project ? onViewDetails : undefined}>

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
                <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-5 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-cyan-500" /> Key Responsibilities & Features
                </h4>
                <ul className="space-y-5 text-[15px] sm:text-base leading-relaxed text-slate-700 dark:text-slate-300">
                    {exp.highlights.slice(0, 3).map((highlight, index) => {
                        const parts = highlight.split(':');
                        const hasColon = parts.length > 1;

                        return (
                            <motion.li
                                key={index}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: index * 0.1 }}
                                className="flex items-start gap-4 bg-white/50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-700/50 shadow-sm transition-all"
                            >
                                <span className="mt-1.5 w-2 h-2 shrink-0 rounded-full bg-slate-400 dark:bg-slate-600" />
                                <span className="flex-1 line-clamp-2">
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
                
                {project && (
                    <div className="mt-6 text-center">
                        <span className="inline-flex items-center gap-2 text-cyan-600 dark:text-cyan-400 font-bold text-sm bg-cyan-50 dark:bg-cyan-900/30 px-4 py-2 rounded-xl group-hover:bg-cyan-100 dark:group-hover:bg-cyan-900/50 transition-colors">
                            Nhấn để xem chi tiết dự án <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                        </span>
                    </div>
                )}
            </div>

        </div>
    );
}

function ProjectDetailModal({ project, role, onClose }: { project: PublicProject, role: string, onClose: () => void }) {
    // Prevent scrolling on body when modal is open
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm" onClick={onClose}>
            <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="relative w-full max-w-4xl max-h-[90vh] bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden"
            >
                {/* Header */}
                <div className="p-6 sm:p-8 border-b border-slate-100 shrink-0">
                    <button 
                        onClick={onClose}
                        className="absolute top-6 right-6 p-2 bg-slate-50 hover:bg-slate-100 text-slate-500 hover:text-slate-700 rounded-full transition-colors"
                    >
                        <X size={20} />
                    </button>

                    <div className="inline-flex items-center gap-2 mb-4">
                        <span className="px-3 py-1 rounded-full bg-cyan-50 text-cyan-600 text-[11px] font-black tracking-wider uppercase border border-cyan-100 flex items-center gap-1.5">
                            <Briefcase size={12} /> {role}
                        </span>
                    </div>

                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight leading-tight pr-12">
                        {project.name}
                    </h2>

                    <div className="flex flex-wrap gap-3 mt-5">
                        {project.duration && (
                            <div className="flex items-center gap-2 text-sm font-bold text-slate-600 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                                <Clock size={16} className="text-cyan-500" /> {project.duration}
                            </div>
                        )}
                        {project.teamSize && (
                            <div className="flex items-center gap-2 text-sm font-bold text-slate-600 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                                <Users size={16} className="text-cyan-500" /> {project.teamSize}
                            </div>
                        )}
                    </div>
                </div>

                {/* Body */}
                <div className="p-6 sm:p-8 overflow-y-auto flex-1">
                    <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
                        
                        {/* Left Content (2/3) */}
                        <div className="lg:col-span-2 space-y-8">
                            {/* Summary */}
                            <section>
                                <h3 className="text-[13px] font-black text-cyan-600 uppercase tracking-widest mb-3 flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-cyan-500" /> Tổng quan dự án
                                </h3>
                                <p className="text-slate-700 leading-relaxed font-medium">
                                    {project.summary}
                                </p>
                            </section>

                            {/* Highlights */}
                            {project.highlights && project.highlights.length > 0 && (
                                <section>
                                    <h3 className="text-[13px] font-black text-cyan-600 uppercase tracking-widest mb-4 flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-cyan-500" /> Tính năng nổi bật
                                    </h3>
                                    <ul className="space-y-4">
                                        {project.highlights.map((highlight, idx) => {
                                            const parts = highlight.split(':');
                                            const hasColon = parts.length > 1;
                                            return (
                                                <li key={idx} className="flex gap-3 text-slate-700 bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
                                                    <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0" />
                                                    <span className="leading-relaxed text-[15px]">
                                                        {hasColon ? (
                                                            <>
                                                                <span className="font-bold text-slate-900">{parts[0]}:</span>
                                                                <span>{parts.slice(1).join(':')}</span>
                                                            </>
                                                        ) : highlight}
                                                    </span>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </section>
                            )}
                        </div>

                        {/* Right Content (1/3) */}
                        <div className="space-y-8 lg:border-l border-slate-100 lg:pl-8">
                            {project.stack && project.stack.length > 0 && (
                                <section>
                                    <h3 className="text-[13px] font-black text-cyan-600 uppercase tracking-widest mb-3 flex items-center gap-2">
                                        <Layers size={14} className="text-cyan-500" /> Framework & Tech Stack
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {project.stack.map(tag => (
                                            <span key={tag} className="px-3 py-1.5 bg-white border border-slate-200 text-slate-700 text-xs font-bold rounded-xl shadow-sm">{tag}</span>
                                        ))}
                                    </div>
                                </section>
                            )}

                            {project.languages && project.languages.length > 0 && (
                                <section>
                                    <h3 className="text-[13px] font-black text-cyan-600 uppercase tracking-widest mb-3 flex items-center gap-2">
                                        <Code2 size={14} className="text-cyan-500" /> Ngôn ngữ lập trình
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {project.languages.map(tag => (
                                            <span key={tag} className="px-3 py-1.5 bg-white border border-slate-200 text-slate-700 text-xs font-bold rounded-xl shadow-sm">{tag}</span>
                                        ))}
                                    </div>
                                </section>
                            )}

                            {project.tools && project.tools.length > 0 && (
                                <section>
                                    <h3 className="text-[13px] font-black text-cyan-600 uppercase tracking-widest mb-3 flex items-center gap-2">
                                        <Wrench size={14} className="text-cyan-500" /> Công cụ & Môi trường
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {project.tools.map(tag => (
                                            <span key={tag} className="px-3 py-1.5 bg-white border border-slate-200 text-slate-700 text-xs font-bold rounded-xl shadow-sm">{tag}</span>
                                        ))}
                                    </div>
                                </section>
                            )}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                {project.links && (project.links.repo || project.links.demo) && (
                    <div className="p-4 sm:p-6 border-t border-slate-100 bg-slate-50 shrink-0 flex justify-end gap-3">
                        {project.links.repo && (
                            <a 
                                href={project.links.repo} 
                                target="_blank" 
                                rel="noreferrer"
                                className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-6 py-2.5 rounded-xl text-sm font-bold transition-all active:scale-95"
                            >
                                <Github size={18} /> Source Code
                            </a>
                        )}
                        {project.links.demo && (
                            <a 
                                href={project.links.demo} 
                                target="_blank" 
                                rel="noreferrer"
                                className="inline-flex items-center gap-2 bg-cyan-600 hover:bg-cyan-500 text-white px-6 py-2.5 rounded-xl text-sm font-bold transition-all active:scale-95"
                            >
                                Demo
                            </a>
                        )}
                    </div>
                )}
            </motion.div>
        </div>
    );
}
