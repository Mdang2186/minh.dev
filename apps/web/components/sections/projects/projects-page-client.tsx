"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { FolderGit2, ArrowUpRight, Github } from "lucide-react";
import { TechBadge } from "@/components/ui/tech-badge";
// import { Container } from "@/components/ui/container"; // Removed in favor of wider layout
import { ProjectModal } from "@/components/ui/project-modal";
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
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-8 xl:px-12">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="flex flex-col items-center sm:items-start w-full"
        >
          <motion.div variants={itemVariants} className="mb-6 sm:mb-8 w-full text-left">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight mb-2">
              Projects
            </h1>
            <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 font-medium">
              A showcase of both private and open-source projects I've built or contributed to.
            </p>
            <div className="w-full h-px border-b border-dashed border-slate-300 dark:border-slate-800 mt-4 sm:mt-5"></div>
          </motion.div>

          {projects.length ? (
            <motion.div variants={containerVariants} className="flex flex-col gap-4 sm:gap-6 md:gap-7 w-full">
              {projects.map((project, index) => {
                const numVal = index + 1;
                const numStr = numVal.toString().padStart(2, "0") + ".";
                // Even (02, 04): Number on Left, Title on Right
                // Odd (01, 03): Title on Left, Number on Right
                const isEven = numVal % 2 === 0;
                const { line1, line2 } = parseProjectTitle(project.name);

                return (
                  <motion.div
                    variants={itemVariants}
                    key={project.slug}
                    className="flex flex-col gap-2 sm:gap-2.5 w-full pb-5 sm:pb-6 border-b border-slate-200/50 dark:border-slate-800/50 last:border-0"
                  >
                    {/* TOP ROW: Header (Number + 2-Line Title: Line 1 Big, Line 2 Smaller, Height matches Number) */}
                    <div className={`flex items-center gap-2.5 sm:gap-3.5 w-full ${isEven ? 'justify-start' : 'justify-end'}`}>
                      {isEven ? (
                        <>
                          <span className="text-[2.75rem] sm:text-[3.5rem] md:text-[4.25rem] font-black text-transparent bg-clip-text bg-gradient-to-br from-cyan-400 to-blue-600 dark:from-cyan-300 dark:to-blue-500 leading-none shrink-0 tracking-tighter drop-shadow-xs select-none">
                            {numStr}
                          </span>
                          <Link href={`/projects/${project.slug}`} className="flex flex-col justify-center min-w-0 group">
                            <h2 className="text-xl sm:text-[26px] md:text-[32px] font-black text-slate-800 dark:text-white uppercase leading-[1.15] tracking-tight group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                              {line1}
                            </h2>
                            {line2 && (
                              <span className="text-xs sm:text-[13px] md:text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest leading-none mt-1">
                                {line2}
                              </span>
                            )}
                          </Link>
                        </>
                      ) : (
                        <>
                          <Link href={`/projects/${project.slug}`} className="flex flex-col justify-center text-right min-w-0 group">
                            <h2 className="text-xl sm:text-[26px] md:text-[32px] font-black text-slate-800 dark:text-white uppercase leading-[1.15] tracking-tight group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                              {line1}
                            </h2>
                            {line2 && (
                              <span className="text-xs sm:text-[13px] md:text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest leading-none mt-1">
                                {line2}
                              </span>
                            )}
                          </Link>
                          <span className="text-[2.75rem] sm:text-[3.5rem] md:text-[4.25rem] font-black text-transparent bg-clip-text bg-gradient-to-br from-cyan-400 to-blue-600 dark:from-cyan-300 dark:to-blue-500 leading-none shrink-0 tracking-tighter drop-shadow-xs select-none">
                            {numStr}
                          </span>
                        </>
                      )}
                    </div>

                    {/* SUB-HEADER: Metadata (Duration, Role, etc) */}
                    <div className={`flex flex-wrap items-center gap-1.5 sm:gap-2 text-xs sm:text-[13.5px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider ${isEven ? 'justify-start' : 'justify-end'}`}>
                      {project.duration && <span>{project.duration}</span>}
                      {project.duration && project.role && <span className="w-1 h-1 rounded-full bg-cyan-500" />}
                      {project.role && <span className="text-cyan-600 dark:text-cyan-400 font-bold">{project.role}</span>}
                      {project.role && project.teamSize && <span className="w-1 h-1 rounded-full bg-cyan-500" />}
                      {project.teamSize && <span>{project.teamSize}</span>}
                    </div>

                    {/* TEXT CONTENT: Cỡ chữ tăng nhẹ dễ đọc, khoảng cách vừa vặn */}
                    <div className="w-full flex flex-col gap-2 mt-0.5">
                      <div className={`text-[15px] sm:text-[16px] text-slate-600 dark:text-slate-300 leading-relaxed font-normal text-justify prose prose-slate max-w-none prose-headings:text-[17px] sm:prose-headings:text-[19px] prose-headings:font-bold prose-headings:text-slate-800 dark:prose-headings:text-white prose-p:text-[15px] sm:prose-p:text-[16px] prose-p:leading-relaxed prose-p:mb-2 prose-a:text-cyan-600 hover:prose-a:text-cyan-700 prose-li:text-[15px] sm:prose-li:text-[16px] prose-li:my-0.5 prose-blockquote:text-[14px] sm:prose-blockquote:text-[15px] prose-blockquote:py-1.5 prose-blockquote:px-4 ${!isEven ? 'prose-p:text-justify text-justify' : ''}`}>
                        {project.description ? (
                          <div dangerouslySetInnerHTML={{ __html: project.description }} />
                        ) : (
                          <p className="text-[15px] sm:text-[16px] leading-relaxed">{project.summary}</p>
                        )}
                      </div>

                      {/* HÀNG KẾT HỢP: Tech Stack + Details/Source nằm trên cùng 1 hàng */}
                      {/* Số thứ tự lẻ (!isEven): Details ở lề phải, Tech Stack ở lề trái */}
                      {/* Số thứ tự chẵn (isEven): Details ở lề trái, Tech Stack ở lề phải */}
                      <div className={`flex flex-col sm:flex-row items-center justify-between gap-2.5 sm:gap-3.5 w-full mt-1.5 pt-0.5 ${
                        isEven ? "sm:flex-row-reverse" : ""
                      }`}>
                        {/* Tech Stack */}
                        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 justify-center sm:justify-start">
                          {project.stack.slice(0, 4).map((s) => (
                            <TechBadge key={s} name={s} className="px-2.5 py-0.5 text-xs sm:text-[12.5px]" />
                          ))}
                          {project.stack.length > 4 && (
                            <span className="text-xs sm:text-[12.5px] text-slate-600 dark:text-slate-300 font-medium px-2.5 py-0.5 flex items-center bg-slate-100 dark:bg-slate-800 rounded-full border border-slate-200 dark:border-slate-700">
                              +{project.stack.length - 4}
                            </span>
                          )}
                        </div>

                        {/* Action Buttons: Source, View Details, Live Demo */}
                        <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 shrink-0 justify-center sm:justify-end">
                          {project.links?.demo && (
                            <a
                              href={project.links.demo}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-full text-xs sm:text-[13.5px] font-bold hover:scale-105 transition-all shadow-xs hover:shadow-md active:scale-95"
                            >
                              Live Demo <ArrowUpRight className="w-3.5 h-3.5" />
                            </a>
                          )}
                          {project.links?.github && (
                            <a
                              href={project.links.github}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-full text-xs sm:text-[13.5px] font-bold text-slate-700 dark:text-slate-200 hover:border-cyan-500 hover:text-cyan-600 dark:hover:text-cyan-400 transition-all shadow-2xs hover:scale-105 active:scale-95"
                            >
                              <Github className="w-3.5 h-3.5" /> Source
                            </a>
                          )}
                          <Link
                            href={`/projects/${project.slug}`}
                            className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-full text-xs sm:text-[13.5px] font-bold hover:scale-105 transition-all shadow-xs hover:shadow-md active:scale-95"
                          >
                            {t("viewDetails")} <ArrowUpRight className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      </div>
                    </div>

                    {/* IMAGE ROW (Khung ảnh chính + 4 ảnh nhỏ bên dưới) */}
                    <ProjectCardGallery
                      project={project}
                      onOpenZoom={(img) => setSelectedImage(img)}
                    />
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

      {/* Quick Image Viewer Modal (Nền trắng) */}
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
 * Component hiển thị khu vực hình ảnh (1 ảnh lớn + 4 ảnh nhỏ) cho từng thẻ dự án
 * Ưu tiên hiển thị cấu hình từ MANUAL_PROJECT_SHOWCASE (setup thủ công)
 * Hỗ trợ nhấp vào thumbnail để chuyển ảnh xem trước, nhấp ảnh lớn để mở zoom toàn màn hình
 */
function ProjectCardGallery({
  project,
  onOpenZoom,
}: {
  project: PublicProject;
  onOpenZoom: (imgUrl: string) => void;
}) {
  const manual = MANUAL_PROJECT_SHOWCASE[project.slug];

  // 1. Xác định ảnh bìa lớn chính (Hero Banner): Ưu tiên Admin DB (coverImage) -> manual config -> project.image
  const coverImage =
    project.coverImage ||
    manual?.cover ||
    project.image ||
    (project.screenshots && project.screenshots[0]) ||
    "";

  // 2. Xác định 4 ảnh nhỏ bên dưới: Ưu tiên Admin DB (showcaseImages) -> manual config -> project.screenshots
  const thumbnails =
    project.showcaseImages && project.showcaseImages.length > 0
      ? project.showcaseImages
      : manual?.thumbnails !== undefined && manual.thumbnails.length > 0
      ? manual.thumbnails
      : project.screenshots && project.screenshots.length > 1
      ? project.screenshots.slice(1, 5)
      : [];

  return (
    <div className="w-full mt-2 sm:mt-2.5 flex flex-col gap-2 sm:gap-2.5">
      {/* Khung ảnh bìa lớn (Tỉ lệ 21/9) - Cố định, không bị thay đổi khi bấm ảnh phụ */}
      <div
        className="relative aspect-[21/9] w-full rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 shadow-lg group cursor-zoom-in border border-slate-200/50 dark:border-slate-800/50"
        onClick={() => coverImage && onOpenZoom(coverImage)}
        title="Nhấp để xem ảnh bìa phóng to"
      >
        <div className="absolute inset-0 bg-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10 mix-blend-overlay pointer-events-none" />

        {/* Badge gợi ý phóng to khi rê chuột */}
        <div className="absolute top-3 right-3 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900/80 backdrop-blur-md text-white text-[11px] font-medium shadow-md">
            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>
            Phóng to ảnh bìa
          </span>
        </div>

        {coverImage ? (
          <img
            key={coverImage}
            src={coverImage}
            alt={`${project.name} cover`}
            className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-700 ease-out"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-400">
            <FolderGit2 className="w-8 h-8 opacity-20" />
          </div>
        )}
      </div>

      {/* Hàng 4 ảnh nhỏ bên dưới (Showcase Thumbnails) - Nhấp để xem phóng to ảnh đó, KHÔNG đổi ảnh bìa */}
      {thumbnails.length > 0 && (
        <div className="grid grid-cols-4 gap-2 sm:gap-2.5">
          {thumbnails.map((img, i) => (
            <div
              key={i}
              className="relative aspect-[16/10] rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800 cursor-zoom-in border border-slate-200/60 dark:border-slate-800/60 hover:border-cyan-400 hover:shadow-md transition-all duration-300 group"
              onClick={() => onOpenZoom(img)}
              title="Nhấp để xem ảnh phóng to"
            >
              <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 flex items-center justify-center">
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-slate-900/80 text-white text-[10px] font-bold shadow">
                  <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>
                  Xem ảnh #{i + 1}
                </span>
              </div>

              <img
                src={img}
                alt={`${project.name} thumbnail ${i + 1}`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

