"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Project } from "@/data/site";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { X, ExternalLink, Github, FolderGit2, Calendar, Users, Wrench, Code2, Rocket, FileCode2, ImageIcon } from "lucide-react";
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
                <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 py-6 sm:px-6">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="relative w-full max-w-[1100px] bg-white rounded-3xl sm:rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[92vh] ring-1 ring-slate-200/50"
                    >
                        {/* Header Area (White Background) */}
                        <div className="relative px-8 py-8 sm:px-10 sm:py-10 bg-gradient-to-br from-white via-white to-cyan-50/30 border-b border-slate-100 flex flex-col gap-4 z-20 shrink-0">
                            <div className="flex justify-between items-start flex-row-reverse gap-4">
                                {/* Close Button */}
                                <button
                                    onClick={onClose}
                                    className="p-2 sm:p-2.5 text-slate-400 hover:text-slate-900 bg-white hover:bg-slate-100 rounded-full transition-all focus:outline-none shrink-0 border border-slate-200 shadow-sm shadow-slate-200/50 hover:shadow-md mt-1 mr-1"
                                    aria-label="Đóng cửa sổ"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                                <div className="space-y-4">
                                    {/* Role Badge */}
                                    {selectedProject.role && (
                                        <div className="inline-flex w-fit items-center gap-2 bg-cyan-50 text-cyan-600 px-4 py-1.5 rounded-full border border-cyan-100/50 shadow-sm text-[12px] sm:text-[13px] font-bold tracking-wider uppercase">
                                            <Rocket className="w-3.5 h-3.5" />
                                            <span>{selectedProject.role}</span>
                                        </div>
                                    )}

                                    {/* Title */}
                                    <h3 className="text-3xl sm:text-[2.75rem] leading-[1.15] font-black tracking-tight text-slate-900 pr-12">
                                        {selectedProject.name}
                                    </h3>

                                    {/* Sub-badges (Duration, Team) */}
                                    <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-[13px] font-bold text-slate-500">
                                        {selectedProject.duration && (
                                            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200/80 px-3.5 py-1.5 rounded-lg text-slate-600">
                                                <Calendar className="w-4 h-4 text-cyan-500" />
                                                <span>{selectedProject.duration}</span>
                                            </div>
                                        )}
                                        {selectedProject.teamSize && (
                                            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200/80 px-3.5 py-1.5 rounded-lg text-slate-600">
                                                <Users className="w-4 h-4 text-cyan-500" />
                                                <span>{selectedProject.teamSize}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Decorative background circle */}
                            <div className="absolute top-4 right-20 w-32 h-32 rounded-full border border-cyan-500/5 bg-transparent pointer-events-none" />
                            <div className="absolute top-10 right-28 w-16 h-16 rounded-full border border-cyan-500/10 bg-cyan-50/20 pointer-events-none" />
                        </div>

                        {/* Scrolling Body Area (Light Gray) */}
                        <div className="bg-[#f8f9fa] px-8 py-8 sm:px-10 sm:py-10 overflow-y-auto w-full custom-scrollbar relative z-10 flex flex-col gap-12 sm:gap-14">

                            {/* Content Grid */}
                            <div className="grid lg:grid-cols-[1fr_320px] xl:grid-cols-[1fr_360px] gap-10 sm:gap-16">
                                {/* Left Column: Description & Highlights */}
                                <div className="space-y-12">
                                    {/* Summary & Overview */}
                                    <div>
                                        <h4 className="text-[13.5px] font-black text-slate-800 uppercase tracking-widest mb-4 flex items-center gap-2.5">
                                            <div className="w-2 h-2 rounded-full bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.6)]" />
                                            TỔNG QUAN DỰ ÁN
                                        </h4>
                                        <div className="prose prose-slate max-w-none">
                                            <p className="text-slate-700 leading-[1.8] font-medium text-[15.5px]">
                                                {selectedProject.description || selectedProject.summary}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Highlights */}
                                    {selectedProject.highlights && selectedProject.highlights.length > 0 && (
                                        <div>
                                            <h4 className="text-[13.5px] font-black text-slate-800 uppercase tracking-widest mb-4 flex items-center gap-2.5">
                                                <div className="w-2 h-2 rounded-full bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.6)]" />
                                                TÍNH NĂNG NỔI BẬT
                                            </h4>
                                            <div className="bg-white border border-slate-200/60 rounded-3xl p-6 sm:p-8 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)]">
                                                <ul className="space-y-5">
                                                    {selectedProject.highlights.map((highlight, index) => {
                                                        const parts = highlight.split(':');
                                                        const hasColon = parts.length > 1;

                                                        return (
                                                            <li key={index} className="flex items-start gap-4">
                                                                <div className="mt-2.5 w-1.5 h-1.5 rounded-full bg-cyan-500 shrink-0" />
                                                                <div className="leading-[1.75] text-[15px] flex-1">
                                                                    {hasColon ? (
                                                                        <>
                                                                            <span className="font-bold text-slate-800 tracking-tight">{parts[0]}:</span>
                                                                            <span className="text-slate-600 font-medium ml-1.5">{parts.slice(1).join(':')}</span>
                                                                        </>
                                                                    ) : (
                                                                        <span className="text-slate-700 font-medium">{highlight}</span>
                                                                    )}
                                                                </div>
                                                            </li>
                                                        )
                                                    })}
                                                </ul>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Right Column: Tech & Tools */}
                                <div className="space-y-10 lg:pl-4">
                                    {/* Framework & Tech Stack */}
                                    <div>
                                        <h4 className="text-[12.5px] font-bold text-cyan-600 uppercase tracking-wider mb-5 flex items-center gap-2">
                                            <Code2 className="w-4 h-4" /> FRAMEWORK & TECH STACK
                                        </h4>
                                        <div className="flex flex-wrap gap-2.5">
                                            {selectedProject.stack.map((tech) => (
                                                <Badge key={tech} className="bg-white text-slate-700 border border-slate-200/60 px-4 py-1.5 text-[12.5px] font-bold rounded-full hover:bg-slate-50 transition-colors shadow-sm">
                                                    {tech}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Programming Languages */}
                                    {selectedProject.languages && selectedProject.languages.length > 0 && (
                                        <div>
                                            <h4 className="text-[12.5px] font-bold text-cyan-600 uppercase tracking-wider mb-5 flex items-center gap-2">
                                                <FolderGit2 className="w-4 h-4" /> NGÔN NGỮ LẬP TRÌNH
                                            </h4>
                                            <div className="flex flex-wrap gap-2.5">
                                                {selectedProject.languages.map((lang) => (
                                                    <Badge key={lang} className="bg-white text-slate-700 border border-slate-200/60 px-4 py-1.5 text-[12.5px] font-bold rounded-full hover:bg-slate-50 transition-colors shadow-sm">
                                                        {lang}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Tools & Environment */}
                                    {selectedProject.tools && selectedProject.tools.length > 0 && (
                                        <div>
                                            <h4 className="text-[12.5px] font-bold text-cyan-600 uppercase tracking-wider mb-5 flex items-center gap-2">
                                                <Wrench className="w-4 h-4" /> CÔNG CỤ & MÔI TRƯỜNG
                                            </h4>
                                            <div className="flex flex-wrap gap-2.5">
                                                {selectedProject.tools.map((tool) => (
                                                    <Badge key={tool} className="bg-white text-slate-700 border border-slate-200/60 px-4 py-1.5 text-[12.5px] font-bold rounded-full hover:bg-slate-50 transition-colors shadow-sm">
                                                        {tool}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Directory Tree Showcase */}
                            {selectedProject.directoryTree && (
                                <div className="mt-4">
                                    <h4 className="text-[13px] font-bold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                                        <FileCode2 className="w-4 h-4" />
                                        Cấu Trúc Thư Mục
                                    </h4>
                                    <div className="bg-[#1e1e1e] border border-slate-800 rounded-3xl p-6 sm:p-8 overflow-x-auto shadow-xl relative group">
                                        {/* Mock Editor Header */}
                                        <div className="flex items-center gap-2 mb-6 pointer-events-none absolute top-5 left-5">
                                            <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
                                            <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                                            <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
                                        </div>
                                        <pre className="font-mono text-[13px] sm:text-[14px] leading-[1.7] text-slate-300 min-w-max mt-6">
                                            <code>{selectedProject.directoryTree}</code>
                                        </pre>
                                    </div>
                                </div>
                            )}

                            {/* Screenshots Showcase */}
                            {selectedProject.screenshots && selectedProject.screenshots.length > 0 && (
                                <div>
                                    <h4 className="text-[13px] font-bold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                                        <ImageIcon className="w-4 h-4" />
                                        Hình Ảnh Minh Họa
                                    </h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {selectedProject.screenshots.map((src, i) => (
                                            <div key={i} className="relative w-full aspect-video rounded-3xl overflow-hidden border border-slate-200 shadow-sm bg-white group ring-1 ring-slate-900/5">
                                                <Image
                                                    src={src}
                                                    alt={`Screenshot ${i + 1}`}
                                                    fill
                                                    className="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                        </div>

                        {/* Footer links */}
                        <div className="px-8 py-6 sm:px-10 border-t border-slate-200 bg-white flex flex-col sm:flex-row gap-4 mt-auto relative z-20 shrink-0">
                            {selectedProject.links?.demo && (
                                <Link
                                    href={selectedProject.links.demo}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white px-8 py-3.5 text-[15px] font-bold tracking-wide text-slate-900 transition-all hover:bg-slate-50 hover:border-slate-300 active:scale-[0.98] shadow-sm flex-1 sm:flex-none w-full sm:w-auto"
                                >
                                    <ExternalLink className="w-5 h-5" />
                                    Live Demo
                                </Link>
                            )}
                            {selectedProject.links?.github && (
                                <Link
                                    href={selectedProject.links.github}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center justify-center gap-3 rounded-xl bg-slate-900 px-8 py-3.5 text-[15px] font-bold tracking-wide text-white transition-all hover:bg-slate-800 active:scale-[0.98] shadow-md shadow-slate-900/10 flex-1 sm:flex-none border border-transparent w-full sm:w-auto ml-auto"
                                >
                                    <Github className="w-5 h-5" />
                                    Source Code
                                </Link>
                            )}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );

    return createPortal(modalContent, document.body);
}
