"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Briefcase, MapPin, Calendar, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

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
}

export function InteractiveExperience({ experiences }: InteractiveExperienceProps) {
    const [activeIndex, setActiveIndex] = useState(0);
    const [isMobile, setIsMobile] = useState(false);

    // Check if we are on mobile to change behavior
    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    if (!experiences || experiences.length === 0) return null;

    const activeExp = experiences[activeIndex];

    return (
        <div className="flex flex-col md:flex-row gap-8 lg:gap-12 w-full max-w-5xl mx-auto">
            {/* Left Column: Vertical Timeline */}
            <div className="md:w-1/3 flex flex-col relative">
                <div className="absolute left-4 sm:left-5 top-8 bottom-8 w-[2px] bg-border/40 rounded-full" />

                <div className="flex flex-col gap-6 relative z-10 w-full">
                    {experiences.map((exp, index) => {
                        const isActive = index === activeIndex;

                        return (
                            <div
                                key={exp.id}
                                className={cn(
                                    "relative flex items-center group cursor-pointer transition-all duration-300 w-full pl-0",
                                    isActive ? "opacity-100" : "opacity-60 hover:opacity-100"
                                )}
                                onMouseEnter={() => !isMobile && setActiveIndex(index)}
                                onClick={() => setActiveIndex(index)}
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
                                        isActive ? "translate-x-1 text-primary opacity-100" : "opacity-0 -translate-x-2 group-hover/tab:opacity-50 group-hover/tab:-translate-x-1"
                                    )} />
                                </div>

                                {/* Mobile Inline Content (Accordion style) */}
                                {isMobile && isActive && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="absolute top-full left-12 right-0 mt-3 z-10 overflow-hidden"
                                    >
                                        <ExperienceDetailCard exp={activeExp} />
                                    </motion.div>
                                )}
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
                                <ExperienceDetailCard exp={activeExp} className="h-full" />
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            )}
        </div>
    );
}

function ExperienceDetailCard({ exp, className }: { exp: ExperienceData, className?: string }) {
    return (
        <div className={cn(
            "p-6 sm:p-8 rounded-3xl border border-cyan-500/20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-2xl flex flex-col relative overflow-hidden group",
            className
        )}>
            {/* Subtle Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-slate-900/5 dark:to-cyan-900/10 pointer-events-none" />

            <div className="flex flex-col space-y-4 pb-6 border-b border-cyan-500/20 relative z-10">
                <div className="flex justify-between items-start gap-4">
                    <div className="inline-flex items-center gap-2 w-fit">
                        <span className="px-3.5 py-1.5 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 text-xs md:text-sm font-bold tracking-wide uppercase border border-cyan-500/20 shadow-sm">
                            {exp.title}
                        </span>
                    </div>
                </div>

                <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white leading-tight">
                    {exp.org}
                </h3>

                <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-sm font-medium pt-1 text-slate-600 dark:text-slate-400">
                    <span className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
                        <Calendar size={15} className="text-cyan-600 dark:text-cyan-400" /> {exp.period}
                    </span>
                    <span className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
                        <Briefcase size={15} className="text-cyan-600 dark:text-cyan-400" /> Academic Project
                    </span>
                </div>
            </div>

            <div className="pt-7 flex-1 relative z-10">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-5 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-cyan-500" /> Key Responsibilities & Features
                </h4>
                <ul className="space-y-5 text-[15px] sm:text-base leading-relaxed text-slate-700 dark:text-slate-300">
                    {exp.highlights.map((highlight, index) => {
                        // Bold the part before the colon if it exists
                        const parts = highlight.split(':');
                        const hasColon = parts.length > 1;

                        return (
                            <motion.li
                                key={index}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: index * 0.1 }}
                                className="flex items-start gap-4 bg-white/50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-700/50 shadow-sm hover:shadow-md hover:border-cyan-500/30 transition-all"
                            >
                                <span className="mt-1.5 w-2 h-2 shrink-0 rounded-full bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.6)]" />
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
            </div>

            {/* Decorative Glow & Abstract Shapes */}
            <div className="absolute top-0 right-0 -m-20 w-48 h-48 bg-cyan-500/20 rounded-full blur-3xl -z-10 opacity-60 transition-transform duration-700 group-hover:scale-150" />
            <div className="absolute bottom-0 left-0 -m-32 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -z-10 opacity-50 transition-transform duration-700 group-hover:scale-125" />
            <div className="absolute top-8 right-8 w-16 h-16 border border-cyan-500/10 rounded-full -z-10" />
            <div className="absolute top-12 right-12 w-8 h-8 border border-slate-500/10 rounded-full -z-10" />
        </div>
    );
}
