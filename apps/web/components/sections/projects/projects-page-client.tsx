"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { FolderGit2, ArrowUpRight, Github, Calendar } from "lucide-react";
import { TechBadge } from "@/components/ui/tech-badge";
import type { PublicProject } from "@/features/portfolio/portfolio.types";
import { useTranslations } from "next-intl";
import { MANUAL_PROJECT_SHOWCASE } from "@/data/projects-showcase";

export { MANUAL_PROJECT_SHOWCASE };

export function ProjectsPageClient({ projects }: { projects: PublicProject[] }) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const t = useTranslations("ProjectsPage");

  useEffect(() => {
    if (!selectedImage) return;
    document.body.style.overflow = "hidden";
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedImage(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedImage]);

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

  const parseProjectTitle = (rawName: string) => {
    if (rawName.includes('|')) {
      const parts = rawName.split('|').map(s => s.trim()).filter(Boolean);
      return { line1: parts[0], line2: parts.slice(1).join(' | ') };
    }
    if (rawName.includes('—')) {
      const parts = rawName.split('—').map(s => s.trim()).filter(Boolean);
      return { line1: parts[0], line2: parts.length > 1 ? `— ${parts.slice(1).join(' — ')} —` : '' };
    }
    if (rawName.includes(' - ')) {
      const parts = rawName.split(' - ').map(s => s.trim()).filter(Boolean);
      return { line1: parts[0], line2: parts.slice(1).join(' - ') };
    }
    return { line1: rawName.trim(), line2: '' };
  };

  return (
    <section className="pt-8 sm:pt-12 pb-16 relative min-h-screen">
      <style dangerouslySetInnerHTML={{ __html: "@import url('https://fonts.googleapis.com/css2?family=Anton&display=swap');" }} />

      <div className="mx-auto w-full px-4 sm:px-8 xl:px-12 max-w-[1600px]">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="flex flex-col items-center sm:items-start w-full"
        >
          {projects.length ? (
            <motion.div variants={containerVariants} className="flex flex-col gap-16 sm:gap-20 lg:gap-28 w-full">
              {projects.map((project, index) => {
                const numVal = index + 1;
                const numStr = numVal.toString().padStart(2, "0");
                const isEven = numVal % 2 === 0;
                const { line1, line2 } = parseProjectTitle(project.name);

                const MAX_STACK = 5;
                const visibleStack = project.stack.slice(0, MAX_STACK);
                const hiddenStackCount = project.stack.length - MAX_STACK;

                return (
                  <motion.div
                    variants={itemVariants}
                    key={project.slug}
                    className="grid grid-cols-1 lg:grid-cols-12 lg:gap-x-12 relative group"
                  >
                    {/* Hàng 1: TITLE, NUMBER & META */}
                    <div className={`flex flex-col lg:justify-end mb-4 lg:mb-10
                      lg:col-span-8 lg:row-start-1 order-1 lg:order-none
                      ${isEven ? 'lg:col-start-5 lg:items-end lg:text-right' : 'lg:col-start-1 lg:items-start lg:text-left'}
                    `}>
                      <div className={`flex items-center justify-center lg:justify-start gap-3 mb-2 ${isEven ? 'lg:flex-row-reverse' : ''}`}>
                        <span className="text-[10px] sm:text-xs lg:text-sm font-bold tracking-[0.15em] text-slate-400 dark:text-slate-500 uppercase text-center lg:text-left w-full lg:w-auto">
                          {project.featured ? "FEATURED PROJECT" : "PROJECT SHOWCASE"}
                        </span>
                      </div>
                      
                      <div className={`flex flex-wrap items-baseline justify-center lg:justify-start gap-x-3 gap-y-1 lg:gap-4 ${isEven ? 'lg:flex-row-reverse' : ''} text-center lg:text-left`}>
                          <h2
                            className="text-3xl sm:text-5xl lg:text-6xl xl:text-[72px] uppercase leading-[1.1] tracking-wide mb-2 bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-sky-500 dark:from-white dark:to-sky-400 py-1"
                            style={{ fontFamily: '"Anton", sans-serif' }}
                          >
                            <Link href={`/projects/${project.slug}`} className="hover:opacity-80 transition-opacity drop-shadow-sm">
                              {line1}
                            </Link>
                          </h2>
                          {/* NUMBER shown on mobile inline with title, hidden on lg where it has its own column */}
                          <span
                            className="lg:hidden text-4xl sm:text-6xl leading-none tracking-wider select-none drop-shadow-md bg-clip-text text-transparent bg-gradient-to-br from-slate-900 to-sky-500 dark:from-white dark:to-sky-400 shrink-0"
                            style={{ fontFamily: '"Anton", sans-serif' }}
                          >
                            {numStr}.
                          </span>
                      </div>

                      {line2 && (
                        <span className="text-[10px] sm:text-xs lg:text-[15px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest block text-center lg:text-left mt-1 lg:mt-0 px-2 lg:px-0">
                          {line2}
                        </span>
                      )}
                      
                      <div className={`flex flex-wrap items-center justify-center lg:justify-start gap-1.5 mt-2.5 lg:mt-3 text-[9px] sm:text-[11px] lg:text-[12px] font-bold text-slate-400 uppercase tracking-wider ${isEven ? 'lg:flex-row-reverse lg:justify-end' : ''} px-2 lg:px-0`}>
                          {project.duration && <span>{project.duration}</span>}
                          {(project.duration && (project.role || project.teamSize)) && <span className="text-sky-500">•</span>}
                          {project.role && <span className="text-sky-600">{project.role}</span>}
                          {(project.role && project.teamSize) && <span className="text-sky-500">•</span>}
                          {project.teamSize && <span>{project.teamSize}</span>}
                      </div>
                    </div>

                    {/* Hàng 1.5: NUMBER for Desktop Only */}
                    <div className={`hidden lg:flex flex-col justify-end mb-6 lg:mb-10
                      lg:col-span-4 lg:row-start-1 order-none
                      ${isEven ? 'lg:col-start-1 lg:items-start lg:text-left' : 'lg:col-start-9 lg:items-end lg:text-right'}
                    `}>
                      <div className="overflow-visible flex items-baseline gap-4 block">
                        <span
                          className="text-[160px] xl:text-[200px] leading-[0.8] tracking-wider select-none drop-shadow-md bg-clip-text text-transparent bg-gradient-to-br from-slate-900 to-sky-500 dark:from-white dark:to-sky-400"
                          style={{ fontFamily: '"Anton", sans-serif' }}
                        >
                          {numStr}
                        </span>
                      </div>
                    </div>

                    {/* GALLERY (Order 2 on mobile) */}
                    <div className={`flex flex-col items-center justify-start mb-6 lg:mb-8
                      lg:col-span-6 lg:row-start-2 order-2 lg:order-none
                      ${isEven ? 'lg:col-start-1' : 'lg:col-start-7'}
                    `}>
                      <ProjectGalleryLayout project={project} onOpenZoom={setSelectedImage} />
                    </div>

                    {/* Hàng 2: DESCRIPTION (Order 3 on mobile) */}
                    <div className={`flex flex-col justify-start mb-6 lg:mb-8
                      lg:col-span-6 lg:row-start-2 order-3 lg:order-none
                      ${isEven ? 'lg:col-start-7' : 'lg:col-start-1'}
                    `}>
                      <div className={`prose prose-slate dark:prose-invert prose-sm sm:prose-base max-w-none break-words [overflow-wrap:anywhere] overflow-hidden
                        prose-headings:font-bold prose-headings:text-slate-900 dark:prose-headings:text-slate-100 prose-headings:tracking-tight prose-headings:text-left prose-headings:break-words
                        prose-h1:text-xl sm:prose-h1:text-2xl lg:prose-h1:text-[26px] prose-h1:font-black prose-h1:leading-snug prose-h1:mb-3
                        prose-h2:text-base sm:prose-h2:text-lg lg:prose-h2:text-xl prose-h2:font-bold prose-h2:mt-5 prose-h2:mb-3
                        prose-h3:text-sm sm:prose-h3:text-base lg:prose-h3:text-[17px] prose-h3:font-bold prose-h3:mt-4 prose-h3:mb-2
                        prose-p:text-slate-700 dark:prose-p:text-slate-300 prose-p:leading-[1.75] sm:prose-p:leading-[1.8] prose-p:text-[14px] sm:prose-p:text-[14.5px] prose-p:mb-4 prose-p:text-left sm:prose-p:text-justify
                        prose-a:text-cyan-600 hover:text-cyan-700 font-semibold
                        prose-strong:text-slate-900 dark:prose-strong:text-slate-100 prose-strong:font-bold
                        prose-blockquote:border-l-4 prose-blockquote:border-cyan-500 prose-blockquote:bg-cyan-50/40 dark:prose-blockquote:bg-slate-800/50 prose-blockquote:text-[13.5px] sm:prose-blockquote:text-[14px] prose-blockquote:py-2.5 prose-blockquote:px-4 prose-blockquote:my-3.5 prose-blockquote:rounded-r-xl prose-blockquote:not-italic prose-blockquote:text-slate-800 dark:prose-blockquote:text-slate-200
                        prose-li:text-[14px] sm:prose-li:text-[14.5px] prose-li:my-1
                        ${isEven ? 'lg:text-left' : 'lg:text-left'} text-left
                      `}>
                        {project.description ? (
                          <div dangerouslySetInnerHTML={{ __html: project.description }} />
                        ) : (
                          <p>{project.summary}</p>
                        )}
                      </div>
                    </div>

                    {/* Hàng 3: TECH STACK & BUTTONS */}
                    <div className={`flex items-start
                      lg:col-span-6 lg:row-start-3 order-4 lg:order-none
                      ${isEven ? 'lg:col-start-7 lg:justify-end' : 'lg:col-start-1 lg:justify-start'}
                    `}>
                      <div className={`flex flex-wrap items-center gap-2 ${isEven ? 'lg:justify-end' : 'lg:justify-start'}`}>
                        {visibleStack.map((s) => (
                          <>
                            <TechBadge key={`mobile-${s}`} name={s} iconOnly={true} className="lg:hidden" />
                            <TechBadge key={`desktop-${s}`} name={s} className="hidden lg:inline-flex px-3 py-1 text-[11px] lg:text-xs font-semibold bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700" />
                          </>
                        ))}
                        {hiddenStackCount > 0 && (
                          <span className="px-2.5 py-1 text-[11px] lg:text-xs font-bold bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-full border border-slate-300 dark:border-slate-600">
                            +{hiddenStackCount}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className={`flex flex-wrap items-start justify-center lg:justify-start gap-3 mt-4 lg:mt-0
                      lg:col-span-6 lg:row-start-3 order-5 lg:order-none
                      ${isEven ? 'lg:col-start-1 lg:justify-start' : 'lg:col-start-7 lg:justify-end'}
                    `}>
                      {project.links?.github && (
                        <a
                          href={project.links.github}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 px-4 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-full text-[13px] font-bold text-slate-700 dark:text-slate-200 hover:border-slate-800 hover:text-slate-900 dark:hover:border-sky-500 dark:hover:text-sky-400 transition-all shadow-sm"
                        >
                          <Github className="w-4 h-4" /> Source
                        </a>
                      )}
                      <Link
                        href={`/projects/${project.slug}`}
                        className="inline-flex items-center gap-1.5 px-5 py-2 bg-gradient-to-r from-slate-800 to-slate-900 dark:from-sky-600 dark:to-sky-500 text-white rounded-full text-[13px] font-bold hover:scale-105 transition-all shadow-md"
                      >
                        {t("viewDetails")} <ArrowUpRight className="w-4 h-4" />
                      </Link>
                    </div>

                  </motion.div>
                );
              })}
            </motion.div>
          ) : (
            <div className="w-full rounded-2xl border border-slate-200 bg-white/70 p-8 text-center text-sm text-slate-500 shadow-sm mt-8">
              {t("empty")}
            </div>
          )}
        </motion.div>
      </div>

      {/* Quick Image Viewer Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-white/98 backdrop-blur-md p-4 sm:p-8 select-none cursor-default transition-all duration-300"
          onClick={() => setSelectedImage(null)}
        >
          <button
            className="absolute top-4 right-4 sm:top-6 sm:right-6 text-white bg-slate-900 hover:bg-slate-800 rounded-full p-2.5 shadow-xl ring-2 ring-slate-900/10 transition-all cursor-pointer hover:scale-105 active:scale-95 z-50"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedImage(null);
            }}
            title="Đóng (Esc)"
            aria-label="Đóng"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={selectedImage}
            alt="Fullscreen preview"
            className="max-w-full max-h-[90vh] object-contain rounded-xl shadow-2xl border border-slate-200/60 cursor-zoom-out"
            onClick={() => setSelectedImage(null)}
          />
        </div>
      )}
    </section>
  );
}

/**
 * Component hiển thị khu vực hình ảnh: 1 ảnh lớn trên cùng, 4 ảnh nhỏ xếp ngang bên dưới
 */
function ProjectGalleryLayout({
  project,
  onOpenZoom,
}: {
  project: PublicProject;
  onOpenZoom: (imgUrl: string) => void;
}) {
  const manual = MANUAL_PROJECT_SHOWCASE[project.slug];

  const coverImage =
    project.coverImage ||
    manual?.cover ||
    project.image ||
    (project.screenshots && project.screenshots[0]) ||
    "";

  // Lấy ra tất cả các ảnh còn lại (hoặc setup tay)
  const allThumbnails =
    project.showcaseImages && project.showcaseImages.length > 0
      ? project.showcaseImages
      : manual?.thumbnails !== undefined && manual.thumbnails.length > 0
        ? manual.thumbnails
        : project.screenshots && project.screenshots.length > 1
          ? project.screenshots.slice(1)
          : [];

  const thumbnails = allThumbnails.slice(0, 4);
  const hasThumbnails = thumbnails.length > 0;

  return (
    <div className="flex flex-col gap-2 sm:gap-3 w-full">
      {/* Khung ảnh bìa lớn (Trên) - Tỉ lệ cố định 16:9 */}
      <div
        className="w-full aspect-video relative rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 shadow-inner group cursor-zoom-in border border-slate-200/50 dark:border-slate-700/50 flex-shrink-0"
        onClick={() => coverImage && onOpenZoom(coverImage)}
        title="Nhấp để xem ảnh bìa phóng to"
      >
        <div className="absolute inset-0 bg-[#0F4A7B]/10 dark:bg-sky-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10 mix-blend-overlay pointer-events-none" />

        {coverImage ? (
          <img
            key={coverImage}
            src={coverImage}
            alt={`${project.name} cover`}
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700 ease-out"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-slate-400">
            <FolderGit2 className="w-8 h-8 opacity-20" />
          </div>
        )}
      </div>

      {/* 4 ảnh nhỏ (Dưới - xếp thành lưới 4 cột) chỉ hiển thị khi có ảnh */}
      {hasThumbnails && (
        <div className="w-full grid grid-cols-4 gap-2 sm:gap-3">
          {Array.from({ length: 4 }).map((_, i) => {
            const img = thumbnails[i];
            if (!img) {
              return (
                <div
                  key={`empty-${i}`}
                  className="w-full aspect-video bg-slate-50 dark:bg-slate-800/30 rounded-lg border border-slate-200/50 dark:border-slate-700/50"
                />
              );
            }
            return (
              <div
                key={i}
                className="w-full aspect-video relative rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800 cursor-zoom-in group border border-slate-200/50 dark:border-slate-700/50 shadow-sm"
                onClick={() => onOpenZoom(img)}
                title="Nhấp để xem ảnh phóng to"
              >
                <img
                  src={img}
                  alt={`${project.name} thumbnail ${i + 1}`}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
                />
                {/* Hiển thị số lượng ảnh còn lại (nếu có) trên ảnh cuối cùng */}
                {i === 3 && allThumbnails.length > 4 && (
                  <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[2px] flex items-center justify-center group-hover:bg-slate-900/50 transition-colors">
                    <span className="text-white font-black text-lg sm:text-xl drop-shadow-md">
                      +{allThumbnails.length - 3}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
