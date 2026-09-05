"use client";

import { useEffect, useState, useMemo } from "react";
import { createPortal } from "react-dom";
import { Project } from "@/data/site";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import {
    X,
    ExternalLink,
    Github,
    FolderGit2,
    Calendar,
    Briefcase,
    GraduationCap,
    Wrench,
    Code2,
    Rocket,
    FileCode2,
    ImageIcon,
    ZoomIn,
    ZoomOut,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    ListOrdered,
    Copy,
    Check,
    ArrowUp,
    Sparkles,
} from "lucide-react";
import { TechBadge } from "@/components/ui/tech-badge";

interface ProjectModalProps {
    selectedProject: Project | null;
    onClose: () => void;
}

export function ProjectModal({ selectedProject, onClose }: ProjectModalProps) {
    const [mounted, setMounted] = useState(false);
    const [activeImageIndex, setActiveImageIndex] = useState<number | null>(null);
    const [isZoomed, setIsZoomed] = useState(false);
    const [activeId, setActiveId] = useState<string>("");
    const [copiedTree, setCopiedTree] = useState(false);
    const [isMobileTocOpen, setIsMobileTocOpen] = useState(false);

    const allImages = useMemo(() => {
        if (!selectedProject) return [];
        if (selectedProject.detailedImages?.length) return selectedProject.detailedImages;
        if (selectedProject.screenshots?.length) return selectedProject.screenshots.map(src => ({ url: src, altText: "" }));
        return [];
    }, [selectedProject]);

    const { processedContent, tocItems } = useMemo(() => {
        if (!selectedProject) {
            return { processedContent: "", tocItems: [] };
        }

        const rawContent = selectedProject.content || selectedProject.description || selectedProject.summary || "";
        const items: { id: string; title: string; level: number }[] = [];
        let counter = 0;

        // Inject IDs into headings and extract for TOC
        let processed = rawContent.replace(
            /<(h[1-3])([^>]*)>(.*?)<\/\1>/gi,
            (match, tag, attrs, innerHtml) => {
                const plainText = innerHtml.replace(/<[^>]+>/g, "").trim();
                if (!plainText || plainText.toLowerCase().startsWith("tác giả:") || plainText.toLowerCase().startsWith("author:")) {
                    return match;
                }

                const existingIdMatch = attrs.match(/id=["']([^"']*)["']/i);
                const id = existingIdMatch ? existingIdMatch[1] : `heading-${++counter}`;
                const level = parseInt(tag[1], 10);
                items.push({ id, title: plainText, level });

                if (existingIdMatch) {
                    return `<${tag} class="scroll-mt-28 text-left break-words [overflow-wrap:anywhere]" ${attrs}>${innerHtml}</${tag}>`;
                }
                return `<${tag} id="${id}" class="scroll-mt-28 text-left break-words [overflow-wrap:anywhere]" ${attrs}>${innerHtml}</${tag}>`;
            }
        );

        // Ensure all <pre> blocks inside content are responsive and scrollable
        processed = processed.replace(
            /<pre([^>]*)>/gi,
            '<pre class="w-full max-w-full overflow-x-auto rounded-xl bg-slate-900 text-slate-100 p-3 sm:p-4 text-xs sm:text-sm font-mono border border-slate-800 my-4 custom-scrollbar" $1>'
        );

        if (selectedProject.highlights?.length) {
            items.push({ id: "section-highlights", title: "Tính năng nổi bật", level: 2 });
        }
        if (selectedProject.stack?.length || selectedProject.languages?.length || selectedProject.tools?.length) {
            items.push({ id: "section-tech-stack", title: "Framework & Công nghệ", level: 2 });
        }
        if ((selectedProject.detailedImages?.length || selectedProject.screenshots?.length || 0) > 0) {
            items.push({ id: "section-screenshots", title: "Album ảnh & Minh họa", level: 2 });
        }
        if (selectedProject.directoryTree) {
            items.push({ id: "section-directory-tree", title: "Cấu trúc thư mục", level: 2 });
        }

        return { processedContent: processed, tocItems: items };
    }, [selectedProject]);

    const scrollToSection = (id: string) => {
        const el = document.getElementById(id);
        if (!el) return;
        el.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    const scrollToTop = () => {
        const scrollContainer = document.getElementById("project-modal-scroll");
        if (scrollContainer) {
            scrollContainer.scrollTo({ top: 0, behavior: "smooth" });
        }
    };

    const handleCopyTree = () => {
        if (!selectedProject?.directoryTree) return;
        navigator.clipboard.writeText(selectedProject.directoryTree);
        setCopiedTree(true);
        setTimeout(() => setCopiedTree(false), 2000);
    };

    useEffect(() => {
        setMounted(true);
    }, []);

    // Prevent background scrolling when modal is open
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

    // Active heading tracking on scroll
    useEffect(() => {
        if (!selectedProject || tocItems.length === 0) return;

        const scrollContainer = document.getElementById("project-modal-scroll");
        if (!scrollContainer) return;

        const handleScroll = () => {
            const headings = tocItems
                .map(item => ({ id: item.id, el: document.getElementById(item.id) }))
                .filter((item): item is { id: string; el: HTMLElement } => item.el !== null);

            const containerRect = scrollContainer.getBoundingClientRect();
            const topOffset = containerRect.top + 140;

            let currentActive = headings[0]?.id || "";
            for (const { id, el } of headings) {
                const rect = el.getBoundingClientRect();
                if (rect.top <= topOffset) {
                    currentActive = id;
                } else {
                    break;
                }
            }
            setActiveId(currentActive);
        };

        scrollContainer.addEventListener("scroll", handleScroll, { passive: true });
        handleScroll();
        return () => scrollContainer.removeEventListener("scroll", handleScroll);
    }, [selectedProject, tocItems]);

    // Keyboard navigation for lightbox
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (activeImageIndex === null) return;
            if (e.key === "ArrowRight") {
                setActiveImageIndex(prev => (prev! + 1) % allImages.length);
                setIsZoomed(false);
            }
            if (e.key === "ArrowLeft") {
                setActiveImageIndex(prev => (prev! - 1 + allImages.length) % allImages.length);
                setIsZoomed(false);
            }
            if (e.key === "Escape") {
                setActiveImageIndex(null);
                setIsZoomed(false);
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [activeImageIndex, allImages.length]);

    if (!mounted) return null;

    const hasDemo = !!selectedProject?.links?.demo;
    const githubLink = selectedProject?.links?.github || (selectedProject?.links as any)?.repo;

    const modalContent = (
        <AnimatePresence>
            {selectedProject && (
                <div id="project-modal-scroll" className="fixed inset-0 z-[100] overflow-y-auto overflow-x-hidden bg-slate-50/70 backdrop-blur-xs custom-scrollbar w-full max-w-full">
                    {/* Fixed Close Button for entire modal */}
                    <button
                        onClick={onClose}
                        className="fixed top-3 right-3 sm:top-5 sm:right-6 z-[120] p-2.5 sm:p-3 text-slate-500 hover:text-slate-900 bg-white/90 backdrop-blur hover:bg-slate-100 rounded-full transition-all focus:outline-none shadow-md border border-slate-200 hover:scale-105 active:scale-95"
                        aria-label="Đóng cửa sổ"
                    >
                        <X className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={2.5} />
                    </button>

                    {/* Modal Container */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 30 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="relative w-full max-w-full mx-auto flex flex-col min-h-screen overflow-x-hidden"
                    >
                        {/* Header Area (Title + Actions on top) */}
                        <header className="relative w-full max-w-full overflow-hidden px-4 pt-8 pb-6 sm:px-10 sm:pt-12 sm:pb-8 bg-gradient-to-b from-white via-slate-50/80 to-slate-100/40 border-b border-slate-200/80 flex flex-col items-center text-center gap-3 z-20 shrink-0">
                            {/* Role Badge */}
                            {selectedProject.role && (
                                <div className="inline-flex w-fit items-center gap-1.5 bg-cyan-50 text-cyan-600 px-3.5 py-1 rounded-full border border-cyan-100 shadow-xs text-[11px] sm:text-xs font-bold tracking-wider uppercase">
                                    <Rocket className="w-3.5 h-3.5" />
                                    <span>{selectedProject.role}</span>
                                </div>
                            )}

                            {/* Title */}
                            <div className="flex flex-col items-center gap-1 sm:gap-1.5 mt-1 w-full max-w-4xl px-2">
                                {selectedProject.name.includes('|') ? (
                                    <>
                                        <h2 className="text-xl sm:text-3xl md:text-4xl leading-tight font-black tracking-tight text-slate-900 uppercase text-center break-words w-full">
                                            {selectedProject.name.split('|')[0].trim()}
                                        </h2>
                                        <h3 className="text-sm sm:text-lg md:text-xl font-bold tracking-tight text-slate-600 uppercase text-center break-words w-full">
                                            {selectedProject.name.split('|')[1].trim()}
                                        </h3>
                                    </>
                                ) : (
                                    <h2 className="text-xl sm:text-3xl md:text-4xl leading-tight font-black tracking-tight text-slate-900 uppercase text-center text-balance break-words w-full">
                                        {selectedProject.name}
                                    </h2>
                                )}
                            </div>

                            {/* Sub-badges (Duration, Team) */}
                            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5 text-xs sm:text-[13px] font-bold text-slate-500 mt-0.5">
                                {selectedProject.duration && (
                                    <div className="flex items-center gap-1.5 bg-white border border-slate-200/80 px-3 py-1 rounded-lg text-slate-600 shadow-xs">
                                        <Calendar className="w-3.5 h-3.5 text-cyan-500" />
                                        <span>{selectedProject.duration}</span>
                                    </div>
                                )}
                                {selectedProject.teamSize && (
                                    <div className="flex items-center gap-1.5 bg-white border border-slate-200/80 px-3 py-1 rounded-lg text-slate-600 shadow-xs">
                                        {/graduation|đồ án/i.test(selectedProject.teamSize) ? (
                                            <GraduationCap className="w-3.5 h-3.5 text-indigo-500" />
                                        ) : (
                                            <Briefcase className="w-3.5 h-3.5 text-cyan-500" />
                                        )}
                                        <span>{selectedProject.teamSize}</span>
                                    </div>
                                )}
                            </div>

                            {/* Source Code and Deploy Links right below Title */}
                            {(hasDemo || githubLink) && (
                                <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3.5 mt-2">
                                    {hasDemo && (
                                        <a
                                            href={selectedProject.links?.demo}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-2.5 text-xs sm:text-sm font-bold tracking-wide text-white shadow-md shadow-cyan-500/20 hover:from-cyan-600 hover:to-blue-700 hover:shadow-lg transition-all active:scale-95"
                                        >
                                            <ExternalLink className="w-4 h-4" />
                                            <span>Live Demo</span>
                                        </a>
                                    )}
                                    {githubLink && (
                                        <a
                                            href={githubLink}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-xs sm:text-sm font-bold tracking-wide text-white shadow-md shadow-slate-900/20 hover:bg-slate-800 hover:shadow-lg transition-all active:scale-95 border border-slate-800"
                                        >
                                            <Github className="w-4 h-4" />
                                            <span>Source Code</span>
                                        </a>
                                    )}
                                </div>
                            )}

                            {/* Decorative blur elements */}
                            <div className="absolute top-6 left-10 w-48 h-48 rounded-full bg-cyan-100/30 blur-3xl pointer-events-none hidden sm:block" />
                            <div className="absolute top-10 right-20 w-40 h-40 rounded-full bg-blue-100/30 blur-3xl pointer-events-none hidden sm:block" />
                        </header>

                        {/* Body Area: 3-Column Structured Layout */}
                        <div className="px-3 sm:px-6 lg:px-8 py-6 sm:py-8 w-full max-w-[1640px] mx-auto min-w-0">
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 xl:gap-8 items-start w-full min-w-0">
                                
                                {/* LEFT COLUMN (Desktop): Mục Lục (Table of Contents) */}
                                <aside className="lg:col-span-3 xl:col-span-2 hidden lg:block sticky top-6 max-h-[calc(100vh-4.5rem)] overflow-y-auto custom-scrollbar">
                                    {tocItems.length > 0 && (
                                        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs">
                                            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
                                                <div className="flex items-center gap-2 text-xs font-black text-slate-800 uppercase tracking-wider">
                                                    <ListOrdered className="w-4 h-4 text-cyan-500" />
                                                    <span>Mục Lục</span>
                                                </div>
                                                <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                                                    {tocItems.length} mục
                                                </span>
                                            </div>

                                            <nav className="space-y-1 text-xs">
                                                {tocItems.map((item, idx) => {
                                                    const isActive = activeId === item.id;
                                                    return (
                                                        <button
                                                            key={idx}
                                                            type="button"
                                                            onClick={() => scrollToSection(item.id)}
                                                            className={`w-full text-left flex items-start gap-2 py-1.5 px-2.5 rounded-lg transition-all ${
                                                                isActive
                                                                    ? "bg-cyan-50 text-cyan-700 font-bold border-l-2 border-cyan-500"
                                                                    : "text-slate-600 hover:text-cyan-700 hover:bg-slate-50 font-medium"
                                                            } ${item.level === 3 ? "pl-5 text-[11.5px] text-slate-500" : ""}`}
                                                        >
                                                            <span className={`w-1.5 h-1.5 rounded-full shrink-0 mt-1.5 transition-colors ${
                                                                isActive ? "bg-cyan-500" : item.level === 3 ? "bg-slate-300" : "bg-slate-400"
                                                            }`} />
                                                            <span className="line-clamp-2 leading-snug">{item.title}</span>
                                                        </button>
                                                    );
                                                })}
                                            </nav>
                                        </div>
                                    )}
                                </aside>

                                {/* CENTER COLUMN: Blog / Article Content */}
                                <main className="lg:col-span-5 xl:col-span-6 2xl:col-span-6 w-full min-w-0">
                                    {/* Mobile Collapsible TOC Accordion */}
                                    {tocItems.length > 0 && (
                                        <div className="block lg:hidden mb-5 bg-white border border-slate-200/80 rounded-2xl shadow-xs overflow-hidden">
                                            <button
                                                type="button"
                                                onClick={() => setIsMobileTocOpen(!isMobileTocOpen)}
                                                className="w-full flex items-center justify-between p-3.5 text-left font-bold text-xs uppercase tracking-wider text-slate-800 hover:bg-slate-50 transition-colors"
                                            >
                                                <div className="flex items-center gap-2">
                                                    <ListOrdered className="w-4 h-4 text-cyan-500" />
                                                    <span>Mục Lục Nội Dung</span>
                                                    <span className="text-[10px] font-bold text-cyan-700 bg-cyan-50 px-2 py-0.5 rounded-full border border-cyan-100">
                                                        {tocItems.length} mục
                                                    </span>
                                                </div>
                                                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${isMobileTocOpen ? "rotate-180" : ""}`} />
                                            </button>
                                            <AnimatePresence>
                                                {isMobileTocOpen && (
                                                    <motion.div
                                                        initial={{ height: 0, opacity: 0 }}
                                                        animate={{ height: "auto", opacity: 1 }}
                                                        exit={{ height: 0, opacity: 0 }}
                                                        transition={{ duration: 0.2 }}
                                                        className="overflow-hidden border-t border-slate-100 bg-slate-50/50 p-3"
                                                    >
                                                        <nav className="space-y-1 text-xs max-h-60 overflow-y-auto custom-scrollbar">
                                                            {tocItems.map((item, idx) => {
                                                                const isActive = activeId === item.id;
                                                                return (
                                                                    <button
                                                                        key={idx}
                                                                        type="button"
                                                                        onClick={() => {
                                                                            scrollToSection(item.id);
                                                                            setIsMobileTocOpen(false);
                                                                        }}
                                                                        className={`w-full text-left flex items-start gap-2 py-1.5 px-2.5 rounded-lg transition-colors ${
                                                                            isActive
                                                                                ? "bg-cyan-50 text-cyan-700 font-bold border-l-2 border-cyan-500"
                                                                                : "text-slate-600 hover:text-cyan-700 hover:bg-white font-medium"
                                                                        } ${item.level === 3 ? "pl-5 text-[11px] text-slate-500" : ""}`}
                                                                    >
                                                                        <span className={`w-1.5 h-1.5 rounded-full shrink-0 mt-1.5 ${
                                                                            isActive ? "bg-cyan-500" : item.level === 3 ? "bg-slate-300" : "bg-slate-400"
                                                                        }`} />
                                                                        <span className="line-clamp-2 leading-snug">{item.title}</span>
                                                                    </button>
                                                                );
                                                            })}
                                                        </nav>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    )}

                                    {/* Elevated Content Card */}
                                    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 sm:p-8 lg:p-10 min-w-0 max-w-full overflow-hidden">
                                        <article className="prose prose-slate prose-sm sm:prose-base w-full min-w-0 max-w-full break-words [overflow-wrap:anywhere] overflow-hidden
                                            prose-headings:font-bold prose-headings:text-slate-900 prose-headings:tracking-tight prose-headings:text-left prose-headings:break-words
                                            prose-h1:text-lg sm:prose-h1:text-2xl prose-h1:font-black prose-h1:leading-tight prose-h1:mb-3 prose-h1:border-b prose-h1:border-slate-100 prose-h1:pb-2
                                            prose-h2:text-base sm:prose-h2:text-xl prose-h2:font-bold prose-h2:text-slate-900 prose-h2:mt-6 prose-h2:mb-2.5
                                            prose-h3:text-sm sm:prose-h3:text-lg prose-h3:font-bold prose-h3:text-slate-800 prose-h3:mt-4 prose-h3:mb-2
                                            prose-p:text-slate-700 prose-p:leading-[1.75] prose-p:text-[13.5px] sm:prose-p:text-[14.5px] prose-p:mb-3 prose-p:text-left sm:prose-p:text-justify
                                            prose-a:text-cyan-600 hover:prose-a:text-cyan-700
                                            prose-img:rounded-xl prose-img:shadow-sm prose-img:border prose-img:border-slate-200 prose-img:max-w-full
                                            prose-strong:text-slate-900 prose-strong:font-bold
                                            prose-pre:w-full prose-pre:max-w-full prose-pre:overflow-x-auto prose-pre:bg-slate-900 prose-pre:text-slate-100 prose-pre:rounded-xl prose-pre:border prose-pre:border-slate-800 prose-pre:shadow-sm prose-pre:p-3 sm:prose-pre:p-4
                                            prose-blockquote:border-l-4 prose-blockquote:border-cyan-500 prose-blockquote:bg-cyan-50/40 prose-blockquote:py-2.5 prose-blockquote:px-4 prose-blockquote:rounded-r-xl prose-blockquote:not-italic prose-blockquote:text-slate-800
                                            prose-li:text-[13.5px] sm:prose-li:text-[14.5px] prose-li:my-1">
                                            {selectedProject.content ? (
                                                <div dangerouslySetInnerHTML={{ __html: processedContent }} />
                                            ) : selectedProject.description ? (
                                                <div dangerouslySetInnerHTML={{ __html: selectedProject.description }} />
                                            ) : (
                                                <p className="font-medium text-[13.5px] sm:text-[14.5px] leading-[1.75]">
                                                    {selectedProject.summary}
                                                </p>
                                            )}
                                        </article>
                                    </div>
                                </main>

                                {/* RIGHT COLUMN: Frameworks, Albums, Directory Tree, Highlights */}
                                <aside className="lg:col-span-4 xl:col-span-4 2xl:col-span-4 w-full min-w-0 space-y-5">
                                    {/* Highlights (Tính Năng Nổi Bật) */}
                                    {selectedProject.highlights && selectedProject.highlights.length > 0 && (
                                        <div id="section-highlights" className="scroll-mt-24 space-y-3 bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs">
                                            <div className="flex items-center gap-2 text-xs font-black text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-3">
                                                <div className="w-2 h-2 rounded-full bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.6)]" />
                                                <span>Tính Năng Nổi Bật</span>
                                            </div>
                                            <ul className="space-y-3 pt-1">
                                                {selectedProject.highlights.map((highlight, index) => {
                                                    const parts = highlight.split(':');
                                                    const hasColon = parts.length > 1;

                                                    return (
                                                        <li key={index} className="flex items-start gap-2.5">
                                                            <div className="mt-2 w-1.5 h-1.5 rounded-full bg-cyan-500 shrink-0" />
                                                            <div className="leading-relaxed text-[13px] sm:text-[13.5px] flex-1">
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
                                                    );
                                                })}
                                            </ul>
                                        </div>
                                    )}

                                    {/* Frameworks & Tech Stack */}
                                    {Boolean(selectedProject.stack?.length || selectedProject.languages?.length || selectedProject.tools?.length) && (
                                        <div id="section-tech-stack" className="scroll-mt-24 space-y-4 bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs">
                                            <div className="flex items-center gap-2 text-xs font-black text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-3">
                                                <Code2 className="w-4 h-4 text-cyan-500" />
                                                <span>Framework & Công Nghệ</span>
                                            </div>

                                            {/* Framework & Stack */}
                                            {selectedProject.stack?.length > 0 && (
                                                <div className="space-y-2">
                                                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Framework & Stack</span>
                                                    <div className="flex flex-wrap gap-1.5">
                                                        {selectedProject.stack.map((tech) => (
                                                            <TechBadge key={tech} name={tech} className="px-2.5 py-1 text-xs shadow-xs bg-slate-50 border border-slate-200/80" />
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Languages */}
                                            {selectedProject.languages && selectedProject.languages.length > 0 && (
                                                <div className="space-y-2 pt-2 border-t border-slate-100">
                                                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Ngôn Ngữ</span>
                                                    <div className="flex flex-wrap gap-1.5">
                                                        {selectedProject.languages.map((lang) => (
                                                            <TechBadge key={lang} name={lang} className="px-2.5 py-1 text-xs shadow-xs bg-slate-50 border border-slate-200/80" />
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Tools */}
                                            {selectedProject.tools && selectedProject.tools.length > 0 && (
                                                <div className="space-y-2 pt-2 border-t border-slate-100">
                                                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Công Cụ</span>
                                                    <div className="flex flex-wrap gap-1.5">
                                                        {selectedProject.tools.map((tool) => (
                                                            <TechBadge key={tool} name={tool} className="px-2.5 py-1 text-xs shadow-xs bg-slate-50 border border-slate-200/80" />
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* Album Ảnh & Minh Họa */}
                                    {allImages.length > 0 && (
                                        <div id="section-screenshots" className="scroll-mt-24 space-y-4 bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs">
                                            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                                                <div className="flex items-center gap-2 text-xs font-black text-slate-800 uppercase tracking-wider">
                                                    <ImageIcon className="w-4 h-4 text-cyan-500" />
                                                    <span>Album Ảnh & Minh Họa</span>
                                                </div>
                                                <span className="text-[11px] font-bold text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-full">
                                                    {allImages.length} ảnh
                                                </span>
                                            </div>

                                            {/* Folder-grouped image previews */}
                                            <div className="space-y-4">
                                                {(() => {
                                                    const groups: Record<string, any[]> = {};
                                                    if (selectedProject.detailedImages?.length) {
                                                        selectedProject.detailedImages.forEach(img => {
                                                            const f = img.folder || "Chung";
                                                            if (!groups[f]) groups[f] = [];
                                                            groups[f].push(img);
                                                        });
                                                    } else {
                                                        groups["Chung"] = (selectedProject.screenshots || []).map(src => ({ url: src, altText: "" }));
                                                    }

                                                    return Object.entries(groups).map(([folder, imgs]) => (
                                                        <div key={folder} className="space-y-2">
                                                            {folder !== "Chung" && (
                                                                <h6 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                                                                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
                                                                    {folder} ({imgs.length})
                                                                </h6>
                                                            )}
                                                            
                                                            {/* Desktop 2-column grid / Mobile horizontal scroll */}
                                                            <div className="grid grid-cols-2 gap-2 sm:hidden">
                                                                {imgs.slice(0, 4).map((img, i) => {
                                                                    const globalIndex = allImages.findIndex(x => x.url === img.url);
                                                                    const isLast = i === 3 && imgs.length > 4;
                                                                    const remaining = imgs.length - 3;

                                                                    return (
                                                                        <div
                                                                            key={i}
                                                                            onClick={() => { setActiveImageIndex(globalIndex !== -1 ? globalIndex : 0); setIsZoomed(false); }}
                                                                            className="relative aspect-[16/10] rounded-xl overflow-hidden border border-slate-200 shadow-xs cursor-pointer group bg-slate-100"
                                                                        >
                                                                            <Image
                                                                                src={img.url}
                                                                                alt={img.altText || `Screenshot ${i + 1}`}
                                                                                fill
                                                                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                                                                            />
                                                                            {isLast ? (
                                                                                <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-xs flex flex-col items-center justify-center text-white p-2 text-center">
                                                                                    <span className="text-sm font-black">+{remaining}</span>
                                                                                    <span className="text-[10px] font-medium text-slate-200">Xem thêm</span>
                                                                                </div>
                                                                            ) : (
                                                                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                                                                                    <div className="bg-white/90 text-slate-900 p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-all scale-75 group-hover:scale-100 shadow-sm">
                                                                                        <ZoomIn className="w-3.5 h-3.5" />
                                                                                    </div>
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    );
                                                                })}
                                                            </div>

                                                            {/* On sm screens and larger: clean 2-col thumbnail grid */}
                                                            <div className="hidden sm:grid grid-cols-2 gap-2">
                                                                {imgs.slice(0, 4).map((img, i) => {
                                                                    const globalIndex = allImages.findIndex(x => x.url === img.url);
                                                                    const isLast = i === 3 && imgs.length > 4;
                                                                    const remaining = imgs.length - 3;

                                                                    return (
                                                                        <div
                                                                            key={i}
                                                                            onClick={() => { setActiveImageIndex(globalIndex !== -1 ? globalIndex : 0); setIsZoomed(false); }}
                                                                            className="relative aspect-[16/10] rounded-xl overflow-hidden border border-slate-200 shadow-xs cursor-pointer group bg-slate-100"
                                                                        >
                                                                            <Image
                                                                                src={img.url}
                                                                                alt={img.altText || `Screenshot ${i + 1}`}
                                                                                fill
                                                                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                                                                            />
                                                                            {isLast ? (
                                                                                <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-xs flex flex-col items-center justify-center text-white p-2 text-center">
                                                                                    <span className="text-sm font-black">+{remaining}</span>
                                                                                    <span className="text-[10px] font-medium text-slate-200">Xem thêm</span>
                                                                                </div>
                                                                            ) : (
                                                                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                                                                                    <div className="bg-white/90 text-slate-900 p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-all scale-75 group-hover:scale-100 shadow-sm">
                                                                                        <ZoomIn className="w-3.5 h-3.5" />
                                                                                    </div>
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    );
                                                                })}
                                                            </div>
                                                        </div>
                                                    ));
                                                })()}

                                                <button
                                                    type="button"
                                                    onClick={() => { setActiveImageIndex(0); setIsZoomed(false); }}
                                                    className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-slate-50 hover:bg-cyan-50 border border-slate-200/80 text-xs font-bold text-slate-700 hover:text-cyan-700 transition-all active:scale-98"
                                                >
                                                    <ZoomIn className="w-3.5 h-3.5 text-cyan-600" />
                                                    <span>Xem toàn bộ album ({allImages.length} ảnh)</span>
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    {/* Cấu Trúc Thư Mục */}
                                    {selectedProject.directoryTree && (
                                        <div id="section-directory-tree" className="scroll-mt-24 space-y-3 bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs">
                                            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                                                <div className="flex items-center gap-2 text-xs font-black text-slate-800 uppercase tracking-wider">
                                                    <FileCode2 className="w-4 h-4 text-cyan-500" />
                                                    <span>Cấu Trúc Thư Mục</span>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={handleCopyTree}
                                                    className="inline-flex items-center gap-1.5 text-[11px] font-bold text-slate-500 hover:text-cyan-600 bg-slate-50 hover:bg-cyan-50 px-2.5 py-1 rounded-lg border border-slate-200 transition-all"
                                                    title="Sao chép cấu trúc"
                                                >
                                                    {copiedTree ? (
                                                        <>
                                                            <Check className="w-3 h-3 text-emerald-500" />
                                                            <span className="text-emerald-600">Đã chép!</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Copy className="w-3 h-3" />
                                                            <span>Chép</span>
                                                        </>
                                                    )}
                                                </button>
                                            </div>

                                            <div className="bg-slate-900 rounded-xl p-3.5 border border-slate-800 shadow-inner">
                                                {/* Terminal Header */}
                                                <div className="flex items-center gap-1.5 mb-2.5 border-b border-slate-800/80 pb-2">
                                                    <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
                                                    <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
                                                    <div className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
                                                    <span className="text-[10px] font-mono text-slate-500 ml-2">tree-structure</span>
                                                </div>
                                                <pre className="font-mono text-[11px] sm:text-[12px] leading-[1.65] text-slate-200 overflow-x-auto">
                                                    <code>{selectedProject.directoryTree}</code>
                                                </pre>
                                            </div>
                                        </div>
                                    )}
                                </aside>

                            </div>
                        </div>

                        {/* Footer area with Back to Top & Actions */}
                        <footer className="w-full max-w-full px-4 py-6 sm:py-8 border-t border-slate-200/80 bg-white flex flex-col sm:flex-row justify-between items-center gap-4 mt-auto relative z-20 shrink-0">
                            <button
                                type="button"
                                onClick={scrollToTop}
                                className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-cyan-600 transition-colors"
                            >
                                <ArrowUp className="w-4 h-4" />
                                <span>Lên đầu trang</span>
                            </button>

                            {(hasDemo || githubLink) && (
                                <div className="flex flex-wrap items-center justify-center gap-3">
                                    {hasDemo && (
                                        <a
                                            href={selectedProject.links?.demo}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="inline-flex items-center justify-center gap-2 rounded-xl border border-cyan-500 bg-white px-5 py-2 text-xs font-bold text-cyan-600 hover:bg-cyan-50 transition-all shadow-xs"
                                        >
                                            <ExternalLink className="w-3.5 h-3.5" />
                                            <span>Live Demo</span>
                                        </a>
                                    )}
                                    {githubLink && (
                                        <a
                                            href={githubLink}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-2 text-xs font-bold text-white hover:bg-slate-800 transition-all shadow-xs"
                                        >
                                            <Github className="w-3.5 h-3.5" />
                                            <span>Source Code</span>
                                        </a>
                                    )}
                                </div>
                            )}

                            <button
                                type="button"
                                onClick={onClose}
                                className="text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors"
                            >
                                Đóng cửa sổ
                            </button>
                        </footer>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );

    return createPortal(
        <>
            {modalContent}
            
            {/* Lightbox for images */}
            {/* LIGHTBOX FOR IMAGES (NỀN TRẮNG, SỬA NÚT CLOSE, NHẤP VÀO RÌA BẤT KỲ ĐỂ TẮT) */}
            <AnimatePresence>
                {activeImageIndex !== null && allImages[activeImageIndex] && (
                    <div 
                        className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-white/95 backdrop-blur-md p-4 sm:p-8 select-none cursor-default"
                        onClick={() => { setActiveImageIndex(null); setIsZoomed(false); }}
                    >
                        {/* Header controls */}
                        <div className="absolute top-4 left-4 sm:top-8 sm:left-8 z-30 flex gap-2 pointer-events-none">
                            <div className="bg-slate-900 text-white px-3.5 py-1.5 rounded-full text-xs font-bold shadow-md">
                                {activeImageIndex + 1} / {allImages.length}
                            </div>
                        </div>

                        <div className="absolute top-4 right-4 sm:top-8 sm:right-8 z-30 flex gap-2.5">
                            <motion.button 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="text-slate-700 hover:text-slate-950 bg-slate-100 hover:bg-slate-200 border border-slate-300/80 shadow-sm transition-all rounded-full p-2.5 cursor-pointer hover:scale-105 active:scale-95" 
                                onClick={(e) => { e.stopPropagation(); setIsZoomed(!isZoomed); }}
                                title={isZoomed ? "Thu nhỏ" : "Phóng to"}
                            >
                                {isZoomed ? <ZoomOut className="w-5 h-5 sm:w-6 sm:h-6" /> : <ZoomIn className="w-5 h-5 sm:w-6 sm:h-6" />}
                            </motion.button>
                            <motion.button 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="text-white bg-slate-900 hover:bg-slate-800 transition-all rounded-full p-2.5 shadow-xl cursor-pointer ring-2 ring-slate-900/10 hover:scale-105 active:scale-95" 
                                onClick={(e) => { e.stopPropagation(); setActiveImageIndex(null); setIsZoomed(false); }}
                                title="Đóng (Esc)"
                                aria-label="Đóng"
                            >
                                <X className="w-5 h-5 sm:w-6 sm:h-6" />
                            </motion.button>
                        </div>

                        {/* Navigation Controls */}
                        {allImages.length > 1 && (
                            <>
                                <button 
                                    className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 z-20 text-slate-800 hover:text-black bg-white hover:bg-slate-50 border border-slate-200 shadow-xl p-3 sm:p-3.5 rounded-full transition-all cursor-pointer hover:scale-110 active:scale-95"
                                    onClick={(e) => { e.stopPropagation(); setActiveImageIndex((activeImageIndex - 1 + allImages.length) % allImages.length); setIsZoomed(false); }}
                                    title="Ảnh trước"
                                >
                                    <ChevronLeft className="w-6 h-6" />
                                </button>
                                <button 
                                    className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 z-20 text-slate-800 hover:text-black bg-white hover:bg-slate-50 border border-slate-200 shadow-xl p-3 sm:p-3.5 rounded-full transition-all cursor-pointer hover:scale-110 active:scale-95"
                                    onClick={(e) => { e.stopPropagation(); setActiveImageIndex((activeImageIndex + 1) % allImages.length); setIsZoomed(false); }}
                                    title="Ảnh tiếp theo"
                                >
                                    <ChevronRight className="w-6 h-6" />
                                </button>
                            </>
                        )}

                        <motion.div
                            key={activeImageIndex}
                            initial={{ opacity: 0, scale: 0.96 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.96 }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            className={`relative max-w-full max-h-full flex flex-col items-center justify-center pointer-events-none ${isZoomed ? 'overflow-auto custom-scrollbar' : ''}`}
                        >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img 
                                src={allImages[activeImageIndex].url} 
                                alt={allImages[activeImageIndex].altText || "Expanded view"} 
                                onClick={(e) => { e.stopPropagation(); setIsZoomed(!isZoomed); }}
                                className={`pointer-events-auto rounded-xl shadow-2xl border border-slate-200/80 transition-all duration-300 ${isZoomed ? 'max-w-none max-h-none w-auto cursor-zoom-out' : 'max-w-[90vw] max-h-[82vh] object-contain cursor-zoom-in'}`} 
                            />
                            {!isZoomed && allImages[activeImageIndex].altText && (
                                <div 
                                    onClick={(e) => e.stopPropagation()}
                                    className="mt-4 pointer-events-auto text-slate-800 text-xs sm:text-sm font-semibold bg-white/95 px-5 py-1.5 rounded-full border border-slate-200/80 text-center max-w-2xl mx-auto shadow-md"
                                >
                                    {allImages[activeImageIndex].altText}
                                </div>
                            )}
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>,
        document.body
    );
}
