"use client";

import { useEffect, useState, useMemo } from "react";
import { createPortal } from "react-dom";
import { Project } from "@/data/site";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { X, ExternalLink, Github, FolderGit2, Calendar, Briefcase, Wrench, Code2, Rocket, FileCode2, ImageIcon, ZoomIn, ZoomOut, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ProjectModalProps {
    selectedProject: Project | null;
    onClose: () => void;
}

function CollapsibleSection({ 
    title, 
    icon, 
    children, 
    defaultOpen = true,
    titleClassName = "text-[12px] font-bold text-cyan-600 uppercase tracking-wider flex items-center gap-2"
}: { 
    title: React.ReactNode; 
    icon?: React.ReactNode; 
    children: React.ReactNode; 
    defaultOpen?: boolean;
    titleClassName?: string;
}) {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <div className="flex flex-col">
            <button 
                onClick={() => setIsOpen(!isOpen)} 
                className="w-full flex items-center justify-between text-left group focus:outline-none mb-4"
                type="button"
            >
                <div className={`${titleClassName} transition-colors group-hover:text-cyan-500`}>
                    {icon}
                    {title}
                </div>
                <div className="p-1 rounded-full bg-slate-50 text-slate-400 group-hover:bg-cyan-50 group-hover:text-cyan-500 transition-colors shrink-0 ml-4">
                    <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                </div>
            </button>
            <AnimatePresence initial={false}>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden"
                    >
                        <div className="pb-2">
                            {children}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export function ProjectModal({ selectedProject, onClose }: ProjectModalProps) {
    const [mounted, setMounted] = useState(false);
    const [activeImageIndex, setActiveImageIndex] = useState<number | null>(null);
    const [isZoomed, setIsZoomed] = useState(false);

    const allImages = useMemo(() => {
        if (!selectedProject) return [];
        if (selectedProject.detailedImages?.length) return selectedProject.detailedImages;
        if (selectedProject.screenshots?.length) return selectedProject.screenshots.map(src => ({ url: src, altText: "" }));
        return [];
    }, [selectedProject]);

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

    const modalContent = (
        <AnimatePresence>
            {selectedProject && (
                <div className="fixed inset-0 z-[100] overflow-y-auto bg-slate-100/95 backdrop-blur-sm sm:px-6 py-0 sm:py-8 custom-scrollbar">
                    {/* Fixed Close Button for entire modal */}
                    <button
                        onClick={onClose}
                        className="fixed top-4 right-4 sm:top-6 sm:right-6 z-[110] p-3 sm:p-4 text-slate-500 hover:text-slate-900 bg-white hover:bg-slate-50 rounded-full transition-all focus:outline-none shadow-lg border border-slate-200 hover:scale-105"
                        aria-label="Đóng cửa sổ"
                    >
                        <X className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={2.5} />
                    </button>

                    {/* Modal Container */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 40 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="relative w-full max-w-4xl mx-auto bg-white sm:rounded-[2rem] shadow-2xl overflow-hidden flex flex-col min-h-screen sm:min-h-0 ring-1 ring-slate-200"
                    >
                        {/* Header Area */}
                        <div className="relative px-6 py-10 sm:px-12 sm:py-12 bg-gradient-to-br from-white via-white to-cyan-50/40 border-b border-slate-100 flex flex-col gap-5 z-20 shrink-0">
                            <div className="space-y-5 mt-4 sm:mt-0">
                                {/* Role Badge */}
                                {selectedProject.role && (
                                    <div className="inline-flex w-fit items-center gap-2 bg-cyan-50 text-cyan-600 px-4 py-1.5 rounded-full border border-cyan-100 shadow-sm text-[12px] sm:text-[13px] font-bold tracking-wider uppercase">
                                        <Rocket className="w-3.5 h-3.5" />
                                        <span>{selectedProject.role}</span>
                                    </div>
                                )}

                                {/* Title */}
                                <h3 className="text-3xl sm:text-5xl leading-[1.2] font-black tracking-tight text-slate-900 pr-8">
                                    {selectedProject.name}
                                </h3>

                                {/* Sub-badges (Duration, Team) */}
                                <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-[13px] font-bold text-slate-500">
                                    {selectedProject.duration && (
                                        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3.5 py-1.5 rounded-lg text-slate-600 shadow-sm">
                                            <Calendar className="w-4 h-4 text-cyan-500" />
                                            <span>{selectedProject.duration}</span>
                                        </div>
                                    )}
                                    {selectedProject.teamSize && (
                                        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3.5 py-1.5 rounded-lg text-slate-600 shadow-sm">
                                            <Briefcase className="w-4 h-4 text-cyan-500" />
                                            <span>{selectedProject.teamSize}</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Decorative background circle */}
                            <div className="absolute top-4 right-10 w-32 h-32 rounded-full border border-cyan-500/5 bg-transparent pointer-events-none hidden sm:block" />
                            <div className="absolute top-10 right-20 w-16 h-16 rounded-full border border-cyan-500/10 bg-cyan-50/20 pointer-events-none hidden sm:block" />
                        </div>

                        {/* Body Area */}
                        <div className="bg-white px-6 py-8 sm:px-12 sm:py-12 relative z-10 flex flex-col gap-10 sm:gap-14">
                            
                            {/* Top Content Grid */}
                            <div className="grid lg:grid-cols-[1fr_300px] gap-10 sm:gap-16">
                                {/* Left Column: Description & Highlights */}
                                <div className="space-y-12">
                                    {/* Summary & Overview */}
                                    <CollapsibleSection
                                        title="TỔNG QUAN DỰ ÁN"
                                        icon={<div className="w-2 h-2 rounded-full bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.6)]" />}
                                        titleClassName="text-[13px] font-black text-slate-800 uppercase tracking-widest flex items-center gap-2.5"
                                    >
                                        <div className="prose prose-slate max-w-none">
                                            <p className="text-slate-700 leading-[1.8] font-medium text-[15.5px]">
                                                {selectedProject.description || selectedProject.summary}
                                            </p>
                                        </div>
                                    </CollapsibleSection>

                                    {/* Highlights */}
                                    {selectedProject.highlights && selectedProject.highlights.length > 0 && (
                                        <CollapsibleSection
                                            title="TÍNH NĂNG NỔI BẬT"
                                            icon={<div className="w-2 h-2 rounded-full bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.6)]" />}
                                            titleClassName="text-[13px] font-black text-slate-800 uppercase tracking-widest flex items-center gap-2.5"
                                        >
                                            <div className="bg-slate-50 border border-slate-200/60 rounded-3xl p-6 sm:p-8">
                                                <ul className="space-y-5">
                                                    {selectedProject.highlights.map((highlight, index) => {
                                                        const parts = highlight.split(':');
                                                        const hasColon = parts.length > 1;

                                                        return (
                                                            <li key={index} className="flex items-start gap-3">
                                                                <div className="mt-2.5 w-1.5 h-1.5 rounded-full bg-cyan-500 shrink-0" />
                                                                <div className="leading-[1.7] text-[15px] flex-1">
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
                                        </CollapsibleSection>
                                    )}
                                </div>

                                {/* Right Column: Tech & Tools */}
                                <div className="space-y-8 lg:border-l border-slate-100 lg:pl-8">
                                    {/* Framework & Tech Stack */}
                                    <CollapsibleSection
                                        title="FRAMEWORK & TECH STACK"
                                        icon={<Code2 className="w-4 h-4" />}
                                        defaultOpen={false}
                                    >
                                        <div className="flex flex-wrap gap-2">
                                            {selectedProject.stack.map((tech) => (
                                                <Badge key={tech} className="bg-slate-100 text-slate-700 border border-slate-200/50 px-3 py-1 text-[11.5px] font-semibold rounded-lg hover:bg-slate-200 transition-colors shadow-none">
                                                    {tech}
                                                </Badge>
                                            ))}
                                        </div>
                                    </CollapsibleSection>

                                    {/* Programming Languages */}
                                    {selectedProject.languages && selectedProject.languages.length > 0 && (
                                        <CollapsibleSection
                                            title="NGÔN NGỮ LẬP TRÌNH"
                                            icon={<FolderGit2 className="w-4 h-4" />}
                                            defaultOpen={false}
                                        >
                                            <div className="flex flex-wrap gap-2">
                                                {selectedProject.languages.map((lang) => (
                                                    <Badge key={lang} className="bg-slate-100 text-slate-700 border border-slate-200/50 px-3 py-1 text-[11.5px] font-semibold rounded-lg hover:bg-slate-200 transition-colors shadow-none">
                                                        {lang}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </CollapsibleSection>
                                    )}

                                    {/* Tools & Environment */}
                                    {selectedProject.tools && selectedProject.tools.length > 0 && (
                                        <CollapsibleSection
                                            title="CÔNG CỤ & MÔI TRƯỜNG"
                                            icon={<Wrench className="w-4 h-4" />}
                                            defaultOpen={false}
                                        >
                                            <div className="flex flex-wrap gap-2">
                                                {selectedProject.tools.map((tool) => (
                                                    <Badge key={tool} className="bg-slate-100 text-slate-700 border border-slate-200/50 px-3 py-1 text-[11.5px] font-semibold rounded-lg hover:bg-slate-200 transition-colors shadow-none">
                                                        {tool}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </CollapsibleSection>
                                    )}
                                </div>
                            </div>

                            {/* Screenshots Showcase (Gallery) */}
                            {((selectedProject.detailedImages && selectedProject.detailedImages.length > 0) || (selectedProject.screenshots && selectedProject.screenshots.length > 0)) && (
                                <CollapsibleSection
                                    title="Hình Ảnh Minh Họa"
                                    icon={<ImageIcon className="w-4 h-4" />}
                                    titleClassName="text-[13px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2"
                                >
                                    <div className="space-y-6 pt-2">
                                    
                                    {(() => {
                                        const groups: Record<string, any[]> = {};
                                        if (selectedProject.detailedImages?.length) {
                                            selectedProject.detailedImages.forEach(img => {
                                                const f = img.folder || "Khác";
                                                if (!groups[f]) groups[f] = [];
                                                groups[f].push(img);
                                            });
                                        } else {
                                            groups["Hình ảnh"] = (selectedProject.screenshots || []).map(src => ({ url: src, altText: "" }));
                                        }

                                        return Object.entries(groups).map(([folder, imgs], groupIndex) => (
                                            <div key={folder} className="space-y-3">
                                                {folder !== "Khác" && folder !== "Hình ảnh" && (
                                                    <h5 className="font-bold text-slate-700 text-sm flex items-center gap-2">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
                                                        {folder.split('/').join(' / ')}
                                                    </h5>
                                                )}
                                                <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-6 custom-scrollbar -mx-6 px-6 sm:mx-0 sm:px-0">
                                                    {imgs.map((img, i) => {
                                                        const globalIndex = allImages.findIndex(x => x.url === img.url);
                                                        return (
                                                            <div 
                                                                key={i} 
                                                                className="relative min-w-[85%] sm:min-w-[70%] md:min-w-[60%] aspect-video rounded-2xl overflow-hidden border border-slate-200 shadow-sm snap-center cursor-pointer group shrink-0 ring-1 ring-slate-900/5"
                                                                onClick={() => { setActiveImageIndex(globalIndex !== -1 ? globalIndex : 0); setIsZoomed(false); }}
                                                            >
                                                                <Image
                                                                    src={img.url}
                                                                    alt={img.altText || `Screenshot ${i + 1}`}
                                                                    fill
                                                                    className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                                                                />
                                                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                                                                    <div className="bg-white/90 backdrop-blur text-slate-900 p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all scale-90 group-hover:scale-100 shadow-lg">
                                                                        <ZoomIn className="w-5 h-5" />
                                                                    </div>
                                                                </div>
                                                                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 pt-10 text-white transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all flex justify-between items-end">
                                                                    <div>
                                                                        {img.altText && <p className="font-bold text-white mb-1 shadow-black drop-shadow-md">{img.altText}</p>}
                                                                        <p className="text-sm font-medium text-white/90 drop-shadow-md">Bấm để xem chi tiết</p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        ));
                                    })()}
                                    
                                    {(selectedProject.detailedImages?.length || selectedProject.screenshots?.length || 0) > 1 && (
                                        <p className="text-center text-xs font-medium text-slate-400 -mt-2">Cuộn ngang để xem thêm ảnh</p>
                                    )}
                                    </div>
                                </CollapsibleSection>
                            )}

                            {/* Directory Tree Showcase */}
                            {selectedProject.directoryTree && (
                                <CollapsibleSection
                                    title="Cấu Trúc Thư Mục"
                                    icon={<FileCode2 className="w-4 h-4" />}
                                    titleClassName="text-[13px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2"
                                >
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
                                </CollapsibleSection>
                            )}

                        </div>

                        {/* Footer links */}
                        <div className="px-6 py-6 sm:px-12 border-t border-slate-200 bg-slate-50 flex flex-col sm:flex-row gap-4 mt-auto relative z-20 shrink-0">
                            {selectedProject.links?.demo && (
                                <Link
                                    href={selectedProject.links.demo}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center justify-center gap-3 rounded-xl border border-slate-300 bg-white px-8 py-3.5 text-[15px] font-bold tracking-wide text-slate-900 transition-all hover:bg-slate-100 hover:border-slate-400 shadow-sm flex-1 sm:flex-none w-full sm:w-auto"
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
                                    className="inline-flex items-center justify-center gap-3 rounded-xl bg-slate-900 px-8 py-3.5 text-[15px] font-bold tracking-wide text-white transition-all hover:bg-slate-800 hover:shadow-lg shadow-md shadow-slate-900/20 flex-1 sm:flex-none border border-transparent w-full sm:w-auto ml-auto"
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

    return createPortal(
        <>
            {modalContent}
            
            {/* Lightbox for images */}
            <AnimatePresence>
                {activeImageIndex !== null && allImages[activeImageIndex] && (
                    <div 
                        className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-black/95 backdrop-blur-md p-4 sm:p-8"
                        onClick={() => { setActiveImageIndex(null); setIsZoomed(false); }}
                    >
                        {/* Header controls */}
                        <div className="absolute top-4 left-4 sm:top-8 sm:left-8 z-10 flex gap-2">
                            <div className="bg-white/10 backdrop-blur-sm text-white/90 px-4 py-2 rounded-full text-sm font-medium border border-white/10">
                                {activeImageIndex + 1} / {allImages.length}
                            </div>
                        </div>

                        <div className="absolute top-4 right-4 sm:top-8 sm:right-8 z-10 flex gap-3">
                            <motion.button 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="text-white/70 hover:text-white bg-white/10 hover:bg-white/20 transition-colors rounded-full p-3" 
                                onClick={(e) => { e.stopPropagation(); setIsZoomed(!isZoomed); }}
                            >
                                {isZoomed ? <ZoomOut className="w-5 h-5 sm:w-6 sm:h-6" /> : <ZoomIn className="w-5 h-5 sm:w-6 sm:h-6" />}
                            </motion.button>
                            <motion.button 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="text-white/70 hover:text-white bg-white/10 hover:bg-white/20 transition-colors rounded-full p-3" 
                                onClick={(e) => { e.stopPropagation(); setActiveImageIndex(null); setIsZoomed(false); }}
                            >
                                <X className="w-5 h-5 sm:w-6 sm:h-6" />
                            </motion.button>
                        </div>

                        {/* Navigation Controls */}
                        {allImages.length > 1 && (
                            <>
                                <button 
                                    className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 z-10 text-white/50 hover:text-white bg-white/5 hover:bg-white/20 p-3 sm:p-4 rounded-full backdrop-blur-sm transition-all focus:outline-none"
                                    onClick={(e) => { e.stopPropagation(); setActiveImageIndex((activeImageIndex - 1 + allImages.length) % allImages.length); setIsZoomed(false); }}
                                >
                                    <ChevronLeft className="w-6 h-6 sm:w-8 sm:h-8" />
                                </button>
                                <button 
                                    className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 z-10 text-white/50 hover:text-white bg-white/5 hover:bg-white/20 p-3 sm:p-4 rounded-full backdrop-blur-sm transition-all focus:outline-none"
                                    onClick={(e) => { e.stopPropagation(); setActiveImageIndex((activeImageIndex + 1) % allImages.length); setIsZoomed(false); }}
                                >
                                    <ChevronRight className="w-6 h-6 sm:w-8 sm:h-8" />
                                </button>
                            </>
                        )}

                        <motion.div
                            key={activeImageIndex}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            className={`relative w-full h-full flex flex-col items-center justify-center ${isZoomed ? 'overflow-auto custom-scrollbar items-start justify-start' : ''}`}
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img 
                                src={allImages[activeImageIndex].url} 
                                alt={allImages[activeImageIndex].altText || "Expanded view"} 
                                onClick={(e) => { e.stopPropagation(); setIsZoomed(!isZoomed); }}
                                className={`rounded-lg shadow-2xl transition-all duration-300 ${isZoomed ? 'max-w-none max-h-none w-auto cursor-zoom-out' : 'max-w-full max-h-[80vh] object-contain cursor-zoom-in'}`} 
                            />
                            {!isZoomed && allImages[activeImageIndex].altText && (
                                <div className="mt-6 text-white/90 text-sm font-medium bg-white/10 backdrop-blur-sm px-6 py-2 rounded-full border border-white/10 text-center max-w-2xl mx-auto shadow-lg">
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
