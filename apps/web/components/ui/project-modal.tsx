"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Project } from "@/data/site";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { X, ExternalLink, Github, FolderGit2, Calendar, Users, Wrench, Code2, Rocket, LayoutTemplate } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ProjectModalProps {
    selectedProject: Project | null;
    onClose: () => void;
}

export function ProjectModal({ selectedProject, onClose }: ProjectModalProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Prevent scrolling when modal is open
    useEffect(() => {
        if (selectedProject) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [selectedProject]);

    if (!mounted) return null;

    const modalContent = (
        <AnimatePresence>
            {selectedProject && (
                <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6 sm:px-6">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-neutral-900/60 backdrop-blur-sm"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="relative w-full max-w-4xl bg-white dark:bg-neutral-900 rounded-[2rem] shadow-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden flex flex-col max-h-[90vh]"
                    >
                        {/* Header */}
                        <div className="flex items-start sm:items-center justify-between px-6 sm:px-8 py-5 sm:py-6 border-b border-neutral-100 dark:border-neutral-800 sticky top-0 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md z-10 flex-col sm:flex-row gap-4 sm:gap-0">
                            <div>
                                <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-100 mb-2">
                                    {selectedProject.name}
                                </h3>
                                <div className="flex flex-wrap items-center gap-3 sm:gap-6 text-sm font-semibold text-neutral-500 dark:text-neutral-400">
                                    {selectedProject.role && (
                                        <div className="flex items-center gap-1.5 bg-neutral-100 dark:bg-neutral-800 px-2.5 py-1 rounded-md">
                                            <Rocket className="w-4 h-4 text-cyan-500" />
                                            <span className="text-neutral-700 dark:text-neutral-300">{selectedProject.role}</span>
                                        </div>
                                    )}
                                    {selectedProject.duration && (
                                        <div className="flex items-center gap-1.5">
                                            <Calendar className="w-4 h-4" />
                                            <span>{selectedProject.duration}</span>
                                        </div>
                                    )}
                                    {selectedProject.teamSize && (
                                        <div className="flex items-center gap-1.5">
                                            <Users className="w-4 h-4" />
                                            <span>{selectedProject.teamSize}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="absolute top-5 right-5 sm:static p-2.5 text-neutral-400 hover:text-neutral-900 dark:text-neutral-500 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-cyan-500 shrink-0 self-start"
                                aria-label="Đóng cửa sổ"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Body */}
                        <div className="px-6 sm:px-8 py-6 sm:py-8 overflow-y-auto w-full custom-scrollbar">
                            <div className="grid lg:grid-cols-3 gap-8 sm:gap-12">
                                {/* Left Column: Description & Highlights */}
                                <div className="lg:col-span-2 space-y-8">
                                    {/* Summary & Overview */}
                                    <div>
                                        <h4 className="text-sm font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                                            <LayoutTemplate className="w-4 h-4" />
                                            Tổng quan Dự án
                                        </h4>
                                        <div className="prose prose-neutral dark:prose-invert max-w-none">
                                            <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed font-medium text-[15px]">
                                                {selectedProject.description || selectedProject.summary}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Highlights */}
                                    {selectedProject.highlights && selectedProject.highlights.length > 0 && (
                                        <div>
                                            <h4 className="text-sm font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                                                <Rocket className="w-4 h-4" />
                                                Tính năng Nổi bật
                                            </h4>
                                            <div className="bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-100 dark:border-neutral-800 rounded-2xl p-5 sm:p-6">
                                                <ul className="space-y-3">
                                                    {selectedProject.highlights.map((highlight, index) => (
                                                        <li key={index} className="flex items-start gap-3.5 text-neutral-700 dark:text-neutral-300">
                                                            <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-cyan-500 shrink-0 shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
                                                            <span className="leading-relaxed text-[15px]">{highlight}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Right Column: Tech & Tools */}
                                <div className="space-y-8">
                                    {/* Framework & Tech Stack */}
                                    <div>
                                        <h4 className="text-sm font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                                            <Code2 className="w-4 h-4" />
                                            Framework & Tech Stack
                                        </h4>
                                        <div className="flex flex-wrap gap-2">
                                            {selectedProject.stack.map((tech) => (
                                                <Badge key={tech} className="bg-cyan-50 dark:bg-cyan-500/10 text-cyan-700 dark:text-cyan-400 border border-cyan-200 dark:border-cyan-500/20 px-3 py-1.5 text-sm font-semibold rounded-lg hover:bg-cyan-100 dark:hover:bg-cyan-500/20 transition-colors">
                                                    {tech}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Programming Languages */}
                                    {selectedProject.languages && selectedProject.languages.length > 0 && (
                                        <div>
                                            <h4 className="text-sm font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                                                <FolderGit2 className="w-4 h-4" />
                                                Ngôn ngữ
                                            </h4>
                                            <div className="flex flex-wrap gap-2">
                                                {selectedProject.languages.map((lang) => (
                                                    <Badge key={lang} className="bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20 px-3 py-1.5 text-sm font-semibold rounded-lg hover:bg-emerald-100 dark:hover:bg-emerald-500/20 transition-colors">
                                                        {lang}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Tools & Environment */}
                                    {selectedProject.tools && selectedProject.tools.length > 0 && (
                                        <div>
                                            <h4 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                                                <Wrench className="w-4 h-4" />
                                                Công cụ & Môi trường
                                            </h4>
                                            <div className="flex flex-wrap gap-2">
                                                {selectedProject.tools.map((tool) => (
                                                    <Badge key={tool} className="bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/20 px-3 py-1.5 text-sm font-semibold rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-500/20 transition-colors">
                                                        {tool}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Footer links */}
                        {(selectedProject.links?.github || selectedProject.links?.demo) && (
                            <div className="px-6 sm:px-8 py-5 border-t border-neutral-100 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50 flex flex-wrap gap-4 mt-auto">
                                {selectedProject.links.github && (
                                    <Link
                                        href={selectedProject.links.github}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-neutral-900 dark:bg-white px-6 py-3 text-sm font-bold text-white dark:text-neutral-900 transition-all hover:bg-neutral-800 dark:hover:bg-neutral-200 active:scale-95 shadow-md flex-1 sm:flex-none"
                                    >
                                        <Github className="w-4 h-4" />
                                        Source Code
                                    </Link>
                                )}
                                {selectedProject.links.demo && (
                                    <Link
                                        href={selectedProject.links.demo}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-6 py-3 text-sm font-bold text-neutral-900 dark:text-white transition-all hover:bg-neutral-50 dark:hover:bg-neutral-700 active:scale-95 shadow-sm flex-1 sm:flex-none"
                                    >
                                        <ExternalLink className="w-4 h-4" />
                                        Live Demo
                                    </Link>
                                )}
                            </div>
                        )}
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );

    return createPortal(modalContent, document.body);
}
