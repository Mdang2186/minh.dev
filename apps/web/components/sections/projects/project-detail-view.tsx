"use client";

import { useState, useMemo, useEffect } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations, useLocale } from "next-intl";
import {
    ArrowLeft,
    ExternalLink,
    Github,
    Calendar,
    Briefcase,
    GraduationCap,
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
    X,
    ArrowUp,
    Share2,
    Check,
    Copy,
    Eye,
    Clock,
    User,
} from "lucide-react";
import { TechBadge } from "@/components/ui/tech-badge";
import { cn } from "@/lib/cn";
import type { PublicProject } from "@/features/portfolio/portfolio.types";

interface TocSubItem {
    id: string;
    title: string;
    level: number;
}

interface TocMainItem {
    id: string;
    title: string;
    level: number;
    subItems: TocSubItem[];
}

interface ProjectDetailViewProps {
    project: PublicProject;
}

export function ProjectDetailView({ project }: ProjectDetailViewProps) {
    const t = useTranslations("ProjectDetail");
    const locale = useLocale();
    const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState(true);
    const [showScrollTrigger, setShowScrollTrigger] = useState(false);
    const [manualExpanded, setManualExpanded] = useState<Record<string, boolean>>({});
    const [activeId, setActiveId] = useState<string>("");
    const [activeImageIndex, setActiveImageIndex] = useState<number | null>(null);
    const [isZoomed, setIsZoomed] = useState(false);
    const [copied, setCopied] = useState(false);
    const [realViews, setRealViews] = useState<number | null>(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Khóa cuộn trang khi đang mở xem ảnh tràn màn hình
    useEffect(() => {
        if (activeImageIndex !== null) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [activeImageIndex]);

    // Ghi nhận và lấy số lượt xem thực tế dựa vào lượt truy cập bài viết
    useEffect(() => {
        if (!project.slug) return;
        fetch(`/api/views/${project.slug}`, { method: "POST" })
            .then((res) => res.json())
            .then((data) => {
                if (typeof data.views === "number") {
                    setRealViews(data.views);
                }
            })
            .catch((err) => {
                console.error("Failed to record view:", err);
            });
    }, [project.slug]);

    // Collapsible states: mở sẵn theo yêu cầu
    const [isOpenFrameworks, setIsOpenFrameworks] = useState(true);
    const [isOpenAlbum, setIsOpenAlbum] = useState(true);

    const handleShare = async () => {
        if (typeof window === "undefined") return;
        if (navigator.share) {
            try {
                await navigator.share({
                    title: project.name,
                    url: window.location.href,
                });
                return;
            } catch {
                // User cancelled or share failed, fallback to copy
            }
        }
        navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const author = useMemo(() => {
        const text = project.content || project.description || "";
        const match = text.match(/(?:tác giả|author):\s*([^<\n\r]+)/i);
        if (match) {
            return match[1].replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").trim();
        }
        return "Đỗ Công Minh";
    }, [project.content, project.description]);

    const readingTime = useMemo(() => {
        const text = (project.content || project.description || project.summary || "").replace(/<[^>]+>/g, " ");
        const words = text.trim().split(/\s+/).filter(Boolean).length;
        return Math.max(1, Math.ceil(words / 200));
    }, [project.content, project.description, project.summary]);

    const viewCount = useMemo(() => {
        let hash = 0;
        const str = project.slug || project.id || project.name;
        for (let i = 0; i < str.length; i++) {
            hash = (hash << 5) - hash + str.charCodeAt(i);
            hash |= 0;
        }
        const seed = Math.abs(hash);
        return 1200 + (seed % 14000);
    }, [project.slug, project.id, project.name]);

    const formattedDate = useMemo(() => {
        if (project.updatedAt) {
            try {
                return new Date(project.updatedAt).toLocaleDateString(locale, {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                });
            } catch {
                // fallback
            }
        }
        return null;
    }, [project.updatedAt, locale]);

    const allImages = useMemo(() => {
        if (!project) return [];
        const list: { url: string; altText: string; folder?: string }[] = [];
        const seenUrls = new Set<string>();

        // 1. Detailed images / Screenshots từ admin
        if (project.detailedImages?.length) {
            project.detailedImages.forEach(img => {
                if (img.url && !seenUrls.has(img.url)) {
                    seenUrls.add(img.url);
                    list.push({ url: img.url, altText: img.altText || "", folder: img.folder || "" });
                }
            });
        } else if (project.screenshots?.length) {
            project.screenshots.forEach(src => {
                if (src && !seenUrls.has(src)) {
                    seenUrls.add(src);
                    list.push({ url: src, altText: "", folder: "" });
                }
            });
        }

        // 2. Trích xuất cả các ảnh xuất hiện trực tiếp trong nội dung bài viết
        const rawContent = project.content || project.description || "";
        const imgRegex = /<img[^>]+src=["']([^"']+)["'][^>]*>/gi;
        let match;
        while ((match = imgRegex.exec(rawContent)) !== null) {
            const src = match[1];
            if (src && !seenUrls.has(src)) {
                seenUrls.add(src);
                const altMatch = match[0].match(/alt=["']([^"']*)["']/i);
                const altText = altMatch ? altMatch[1] : "Ảnh bài viết";
                list.push({ url: src, altText, folder: "Bài viết" });
            }
        }

        return list;
    }, [project]);

    // Xử lý nhấp vào bất kỳ ảnh nào trong bài viết để mở popup Lightbox xem trực quan
    const handleArticleClick = (e: React.MouseEvent<HTMLElement>) => {
        const target = e.target as HTMLElement;
        if (target && target.tagName.toLowerCase() === "img") {
            const img = target as HTMLImageElement;
            const src = img.getAttribute("src") || img.src;
            if (src) {
                const idx = allImages.findIndex(item => {
                    if (item.url === src) return true;
                    if (src.includes(item.url)) return true;
                    if (item.url.includes(src)) return true;
                    const srcPath = src.replace(/^https?:\/\/[^/]+/, "");
                    const itemPath = item.url.replace(/^https?:\/\/[^/]+/, "");
                    return srcPath === itemPath;
                });

                if (idx !== -1) {
                    setActiveImageIndex(idx);
                } else {
                    const alt = img.getAttribute("alt") || img.alt || "Ảnh bài viết";
                    allImages.push({ url: src, altText: alt, folder: "Bài viết" });
                    setActiveImageIndex(allImages.length - 1);
                }
                setIsZoomed(false);
            }
        }
    };

    // Nhóm album chuẩn theo đúng các folder người dùng đã tạo trong Admin, không tự ý phân chia
    const albumGroups = useMemo(() => {
        if (!project) return [];
        if (!project.detailedImages?.length) {
            if (project.screenshots?.length) {
                return [{
                    folder: "Screenshots",
                    coverUrl: project.screenshots[0],
                    count: project.screenshots.length,
                    startIndex: 0
                }];
            }
            return [];
        }

        const map: Record<string, { folder: string; coverUrl: string; count: number; startIndex: number }> = {};
        project.detailedImages.forEach((img, idx) => {
            const folderName = img.folder?.trim() || "Chung";
            if (!map[folderName]) {
                map[folderName] = {
                    folder: folderName,
                    coverUrl: img.url,
                    count: 1,
                    startIndex: idx
                };
            } else {
                map[folderName].count += 1;
            }
        });

        return Object.values(map);
    }, [project]);

    const { processedContent, tocItems, tocTree } = useMemo(() => {
        const rawContent = project.content || project.description || project.summary || "";
        const items: { id: string; title: string; level: number }[] = [];
        const tree: TocMainItem[] = [];
        let counter = 0;

        let processed = rawContent.replace(
            /<(h[1-4])([^>]*)>(.*?)<\/\1>/gi,
            (match, tag, attrs, innerHtml) => {
                const plainText = innerHtml.replace(/<[^>]+>/g, "").trim();
                if (!plainText || plainText.toLowerCase().startsWith("tác giả:") || plainText.toLowerCase().startsWith("author:")) {
                    return match;
                }

                const existingIdMatch = attrs.match(/id=["']([^"']*)["']/i);
                const id = existingIdMatch ? existingIdMatch[1] : `heading-${++counter}`;
                const level = parseInt(tag[1], 10);
                items.push({ id, title: plainText, level });

                if (level <= 2) {
                    tree.push({ id, title: plainText, level, subItems: [] });
                } else {
                    if (tree.length > 0) {
                        tree[tree.length - 1].subItems.push({ id, title: plainText, level });
                    } else {
                        tree.push({ id, title: plainText, level: 2, subItems: [] });
                    }
                }

                if (existingIdMatch) {
                    return `<${tag} class="scroll-mt-24 text-left break-words [overflow-wrap:anywhere]" ${attrs}>${innerHtml}</${tag}>`;
                }
                return `<${tag} id="${id}" class="scroll-mt-24 text-left break-words [overflow-wrap:anywhere]" ${attrs}>${innerHtml}</${tag}>`;
            }
        );

        processed = processed.replace(
            /<pre([^>]*)>/gi,
            '<pre class="w-full max-w-full overflow-x-auto rounded-xl bg-slate-900 text-slate-100 p-4 text-xs sm:text-sm font-mono border border-slate-800 my-4 custom-scrollbar" $1>'
        );

        // Fallback to sidebar sections only if article has no headings
        if (items.length === 0) {
            if (project.highlights?.length) {
                const item = { id: "section-highlights", title: t("highlights"), level: 2 };
                items.push(item);
                tree.push({ ...item, subItems: [] });
            }
            if (project.directoryTree) {
                const item = { id: "section-directory-tree", title: t("directoryTree"), level: 2 };
                items.push(item);
                tree.push({ ...item, subItems: [] });
            }
            if (project.stack?.length || project.languages?.length || project.tools?.length) {
                const item = { id: "section-tech-stack", title: t("techStack"), level: 2 };
                items.push(item);
                tree.push({ ...item, subItems: [] });
            }
            if ((project.detailedImages?.length || project.screenshots?.length || 0) > 0) {
                const item = { id: "section-screenshots", title: t("gallery"), level: 2 };
                items.push(item);
                tree.push({ ...item, subItems: [] });
            }
        }

        return { processedContent: processed, tocItems: items, tocTree: tree };
    }, [project, t]);

    // Xác định mục chính cha đang active (hoặc chứa mục phụ đang active)
    const activeMainId = useMemo(() => {
        if (!activeId) return tocTree[0]?.id || "";
        for (const main of tocTree) {
            if (main.id === activeId) return main.id;
            if (main.subItems.some(sub => sub.id === activeId)) return main.id;
        }
        return tocTree[0]?.id || "";
    }, [activeId, tocTree]);

    // Hàm render mục lục phân cấp: lướt đến mục chính sẽ hiện các mục phụ & cập nhật khi đọc
    const renderHierarchicalToc = (onItemClick?: () => void) => {
        if (tocTree.length === 0) return null;

        return (
            <nav className="space-y-1 pt-1">
                {tocTree.map((main) => {
                    const isMainDirectlyActive = activeId === main.id;
                    const isMainOrChildActive = activeMainId === main.id;
                    const hasSubItems = main.subItems.length > 0;
                    const isExpanded = manualExpanded[main.id] !== undefined
                        ? manualExpanded[main.id]
                        : isMainOrChildActive;

                    return (
                        <div key={main.id} className="space-y-0.5">
                            {/* Main Section Header (Image 1 Style) */}
                            <div className="flex items-center justify-between group">
                                <button
                                    type="button"
                                    onClick={() => {
                                        scrollToSection(main.id);
                                        onItemClick?.();
                                    }}
                                    className={`flex-1 text-left py-1.5 px-2 rounded-lg text-xs leading-snug transition-all cursor-pointer truncate ${
                                        isMainDirectlyActive
                                            ? "font-bold text-cyan-600 bg-cyan-50/80 border-l-[3px] border-cyan-600 pl-2.5 shadow-2xs"
                                            : isMainOrChildActive
                                            ? "font-bold text-slate-900 bg-slate-50 border-l-[3px] border-cyan-500 pl-2.5"
                                            : "text-slate-700 hover:text-slate-900 hover:bg-slate-50 font-medium"
                                    }`}
                                    title={main.title}
                                >
                                    {main.title}
                                </button>

                                {hasSubItems && (
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setManualExpanded(prev => ({
                                                ...prev,
                                                [main.id]: prev[main.id] !== undefined ? !prev[main.id] : !isMainOrChildActive
                                            }));
                                        }}
                                        className="p-1 text-slate-400 hover:text-cyan-600 transition-transform duration-200 cursor-pointer"
                                        title="Toggle sub-sections"
                                    >
                                        <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isExpanded ? "" : "-rotate-90"}`} />
                                    </button>
                                )}
                            </div>

                            {/* Sub-items (Image 1 Style: Indented & auto-reveals when reading) */}
                            <AnimatePresence initial={false}>
                                {hasSubItems && isExpanded && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                        className="overflow-hidden ml-3 pl-2.5 border-l border-slate-200/90 space-y-0.5 py-0.5"
                                    >
                                        {main.subItems.map((sub) => {
                                            const isSubActive = activeId === sub.id;
                                            return (
                                                <button
                                                    key={sub.id}
                                                    type="button"
                                                    onClick={() => {
                                                        scrollToSection(sub.id);
                                                        onItemClick?.();
                                                    }}
                                                    className={`w-full text-left py-1 px-2 rounded-md text-[11.5px] leading-snug transition-all cursor-pointer truncate flex items-center gap-1.5 ${
                                                        isSubActive
                                                            ? "font-bold text-cyan-700 bg-cyan-50/90 border-l-2 border-cyan-600 pl-2"
                                                            : "text-slate-500 hover:text-slate-900 hover:bg-slate-100/70 font-normal"
                                                    }`}
                                                    title={sub.title}
                                                >
                                                    <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${isSubActive ? "bg-cyan-600" : "bg-slate-300"}`} />
                                                    <span className="truncate">{sub.title}</span>
                                                </button>
                                            );
                                        })}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    );
                })}
            </nav>
        );
    };

    // Scroll listener: Hiển thị nút 3 gạch khi lăn chuột + bám theo tiến độ đọc bài viết
    useEffect(() => {
        const handleScroll = () => {
            const scrollY = window.scrollY;
            setShowScrollTrigger(scrollY > 200);

            if (tocItems.length === 0) return;

            const headings = tocItems
                .map(item => ({ id: item.id, el: document.getElementById(item.id) }))
                .filter((item): item is { id: string; el: HTMLElement } => item.el !== null);

            if (headings.length === 0) return;

            const topOffset = scrollY + 140;
            let currentActive = headings[0]?.id || "";
            for (const { id, el } of headings) {
                const elTop = el.getBoundingClientRect().top + scrollY;
                if (elTop <= topOffset) {
                    currentActive = id;
                } else {
                    break;
                }
            }
            setActiveId(currentActive);
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        handleScroll();
        return () => window.removeEventListener("scroll", handleScroll);
    }, [tocItems]);

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

    const scrollToSection = (id: string) => {
        const el = document.getElementById(id);
        if (!el) return;
        el.scrollIntoView({ behavior: "smooth", block: "start" });
        if (typeof window !== "undefined" && window.innerWidth < 1024) {
            setIsLeftSidebarOpen(false);
        }
    };

    const hasDemo = !!project.links?.demo;
    const githubLink = project.links?.github || project.links?.repo;
    const isGraduation = !!project.teamSize && /graduation|đồ án/i.test(project.teamSize);
    const titleMain = project.name.includes('|') ? project.name.split('|')[0].trim() : project.name;
    const subtitle = project.name.includes('|') ? project.name.split('|')[1].trim() : null;

    return (
        <div className="min-h-screen bg-white text-slate-900 antialiased">
            
            {/* 1. SEPARATE TITLE & HEADER SECTION: Tiêu đề rộng hơn hoặc bằng độ rộng Header (Navbar max-w-7xl) */}
            <div className="w-full border-b border-slate-100 bg-white">
                <header className="max-w-7xl xl:max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-6 space-y-4">
                    {/* Top Row: Breadcrumbs on Left + Date on Right */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-slate-100/80">
                        {/* Left: Arrow + Breadcrumb */}
                        <nav className="flex items-center gap-2 text-xs sm:text-sm text-slate-500 overflow-x-auto custom-scrollbar py-1">
                            <Link
                                href="/work/projects"
                                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 flex items-center justify-center transition-all hover:-translate-x-0.5 shrink-0 shadow-2xs"
                                title={t("back")}
                                aria-label={t("back")}
                            >
                                <ArrowLeft className="w-3.5 h-3.5" />
                            </Link>
                            <div className="flex items-center gap-1.5 font-medium whitespace-nowrap">
                                <Link href="/" className="hover:text-cyan-600 transition-colors">
                                    {t("home")}
                                </Link>
                                <ChevronRight className="w-3.5 h-3.5 text-slate-300 shrink-0" />
                                <Link href="/work/projects" className="hover:text-cyan-600 transition-colors">
                                    {t("projects")}
                                </Link>
                                <ChevronRight className="w-3.5 h-3.5 text-slate-300 shrink-0" />
                                <span className="text-slate-900 font-semibold truncate max-w-[180px] sm:max-w-xs md:max-w-md">
                                    {titleMain}
                                </span>
                            </div>
                        </nav>

                        {/* Right: Date aligned to right margin! */}
                        {project.duration && (
                            <div className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-600 bg-slate-50 border border-slate-200/70 px-3 py-1 rounded-full shrink-0 shadow-2xs ml-auto">
                                <Calendar className="w-3.5 h-3.5 text-cyan-600 shrink-0" />
                                <span>{project.duration}</span>
                            </div>
                        )}
                    </div>

                    {/* Project Title Block & Quick Actions (Tiêu đề bên trái, nút hành động bên phải gọn gàng, không thừa thãi) */}
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pt-1">
                        <div className="space-y-1 flex-1 min-w-0">
                            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight uppercase leading-tight break-words">
                                {titleMain}
                            </h1>
                            {subtitle && (
                                <p className="text-sm sm:text-base font-bold text-slate-500 uppercase tracking-wide">
                                    {subtitle}
                                </p>
                            )}
                        </div>

                        {/* Nút hành động nhanh gọn gàng, không bị thừa thãi */}
                        <div className="flex flex-wrap items-center gap-2 shrink-0">
                            {hasDemo && (
                                <a
                                    href={project.links?.demo}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white text-xs font-bold shadow-xs hover:shadow-md transition-all active:scale-95"
                                >
                                    <ExternalLink className="w-3.5 h-3.5" />
                                    <span>{t("liveDemo")}</span>
                                </a>
                            )}
                            {githubLink && (
                                <a
                                    href={githubLink}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-xs hover:shadow-md transition-all active:scale-95"
                                >
                                    <Github className="w-3.5 h-3.5" />
                                    <span>{t("sourceCode")}</span>
                                </a>
                            )}
                            <button
                                type="button"
                                onClick={handleShare}
                                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200/90 text-slate-700 hover:text-slate-900 border border-slate-200/80 transition-all text-xs font-semibold cursor-pointer active:scale-95 shadow-2xs"
                                title={t("shareProject")}
                            >
                                {copied ? (
                                    <>
                                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                                        <span className="text-emerald-700 font-bold">{t("copied")}</span>
                                    </>
                                ) : (
                                    <>
                                        <Share2 className="w-3.5 h-3.5 text-slate-600" />
                                        <span>{t("shareProject")}</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Article Meta Bar + Badges (Author, Reading Time, Views, Updated, Role, Scope) */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-slate-100/70">
                        {/* Left: Author, Reading Time, Views, Updated */}
                        <div className="flex flex-wrap items-center gap-2.5 sm:gap-4 text-xs font-medium text-slate-500">
                            {/* Author */}
                            <div className="flex items-center gap-1.5">
                                <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                <span className="font-semibold text-slate-800">{author}</span>
                            </div>

                            <span className="text-slate-300">•</span>

                            {/* Reading time */}
                            <div className="flex items-center gap-1.5">
                                <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                <span>{readingTime} {t("readingTime")}</span>
                            </div>

                            <span className="text-slate-300">•</span>

                            {/* Views (Số lượt xem thực tế dựa trên truy cập) */}
                            <div className="flex items-center gap-1.5">
                                <Eye className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                <span className="font-semibold text-slate-700">
                                    {realViews !== null ? realViews.toLocaleString() : (project.slug ? "..." : "1")} {t("views")}
                                </span>
                            </div>

                            {/* Updated At */}
                            {formattedDate && (
                                <>
                                    <span className="text-slate-300">•</span>
                                    <div className="flex items-center gap-1.5 text-slate-400">
                                        <span suppressHydrationWarning>{t("updated")}: {formattedDate}</span>
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Right: Badges */}
                        <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
                            {project.teamSize && (
                                <span
                                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border shadow-2xs transition-colors ${
                                        isGraduation
                                            ? "bg-indigo-50/90 text-indigo-700 border-indigo-200/70"
                                            : "bg-slate-100 text-slate-700 border-slate-200/80"
                                    }`}
                                >
                                    {isGraduation ? (
                                        <GraduationCap className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                                    ) : (
                                        <Briefcase className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                                    )}
                                    <span>{isGraduation ? t("graduationProject") : project.teamSize}</span>
                                </span>
                            )}

                            {project.role && (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-cyan-50 text-cyan-800 border border-cyan-200/70 shadow-2xs">
                                    <Rocket className="w-3.5 h-3.5 text-cyan-600 shrink-0" />
                                    <span>{project.role}</span>
                                </span>
                            )}
                        </div>
                    </div>
                </header>
            </div>

            {/* 2. MAIN CONTENT AREA: Khung nội dung vẫn giữ nguyên độ rộng chuẩn, khi hiện mục lục sẽ mở rộng và đẩy toàn bộ sang phải */}
            <div className={cn(
                "w-full mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-20 transition-all duration-300 ease-in-out",
                isLeftSidebarOpen ? "max-w-[1760px]" : "max-w-7xl xl:max-w-[1440px]"
            )}>
                {/* 3-Column Seamless Editorial Layout: Left TOC (docked) | Center Article | Right Specs */}
                <div className="flex flex-col lg:flex-row items-start gap-8 lg:gap-10 xl:gap-12">

                    {/* DOCKED LEFT TOC SIDEBAR (CỐ ĐỊNH KHI LĂN TRANG) */}
                    <AnimatePresence initial={false}>
                        {isLeftSidebarOpen && (
                            <div className="hidden lg:block shrink-0 sticky top-20 self-start z-20">
                                <motion.aside
                                    initial={{ width: 0, opacity: 0 }}
                                    animate={{ width: 260, opacity: 1 }}
                                    exit={{ width: 0, opacity: 0 }}
                                    transition={{ type: "spring", damping: 30, stiffness: 350 }}
                                    className="flex flex-col h-[calc(100vh-5.5rem)] bg-white border-r border-slate-200/90 pr-3 overflow-hidden"
                                >
                                    {/* Header (Chuẩn Hình 2: Mục lục nội dung + nút X đóng) */}
                                    <div className="flex items-center justify-between pb-3 mb-2 border-b border-slate-100 shrink-0">
                                        <div className="flex items-center gap-2">
                                            <ListOrdered className="w-4 h-4 text-cyan-600" />
                                            <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">
                                                {t("onThisPage")}
                                            </h3>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setIsLeftSidebarOpen(false)}
                                            className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                                            title="Thu gọn mục lục"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>

                                    {/* Body: Hierarchical Accordion TOC */}
                                    <div className="flex-1 overflow-y-auto custom-scrollbar pr-1">
                                        {renderHierarchicalToc()}
                                    </div>
                                </motion.aside>
                            </div>
                        )}
                    </AnimatePresence>

                    {/* Center Column: Article Content (Khung ở giữa luôn hiển thị to hơn là nội dung chính) */}
                    <main className="flex-1 min-w-0 w-full">
                        <article 
                            onClick={handleArticleClick}
                            className="prose prose-slate prose-sm sm:prose-base w-full min-w-0 max-w-none break-words [overflow-wrap:anywhere] overflow-hidden
                            prose-headings:font-bold prose-headings:text-slate-900 prose-headings:tracking-tight prose-headings:text-left prose-headings:break-words
                            prose-h1:text-xl sm:prose-h1:text-2xl lg:prose-h1:text-[26px] prose-h1:font-black prose-h1:leading-snug prose-h1:mb-5 prose-h1:border-b prose-h1:border-slate-100 prose-h1:pb-3
                            prose-h2:text-base sm:prose-h2:text-lg lg:prose-h2:text-xl prose-h2:font-bold prose-h2:text-slate-900 prose-h2:mt-7 prose-h2:mb-3
                            prose-h3:text-sm sm:prose-h3:text-base lg:prose-h3:text-[17px] prose-h3:font-bold prose-h3:text-slate-800 prose-h3:mt-5 prose-h3:mb-2
                            prose-p:text-slate-700 prose-p:leading-[1.75] sm:prose-p:leading-[1.8] prose-p:text-[14px] sm:prose-p:text-[14.5px] prose-p:mb-4 prose-p:text-left sm:prose-p:text-justify
                            prose-a:text-cyan-600 hover:text-cyan-700 font-semibold
                            prose-img:rounded-2xl prose-img:shadow-sm prose-img:border prose-img:border-slate-100 prose-img:max-w-full prose-img:my-6 prose-img:cursor-zoom-in hover:prose-img:opacity-95 hover:prose-img:shadow-md transition-all
                            prose-strong:text-slate-900 prose-strong:font-bold
                            prose-pre:w-full prose-pre:max-w-full prose-pre:overflow-x-auto prose-pre:bg-slate-900 prose-pre:text-slate-100 prose-pre:rounded-2xl prose-pre:border prose-pre:border-slate-800 prose-pre:p-3.5 sm:prose-pre:p-4 prose-pre:my-3.5
                            prose-blockquote:border-l-4 prose-blockquote:border-cyan-500 prose-blockquote:bg-cyan-50/40 prose-blockquote:text-[13.5px] sm:prose-blockquote:text-[14px] prose-blockquote:py-2.5 prose-blockquote:px-4 prose-blockquote:my-3.5 prose-blockquote:rounded-r-xl prose-blockquote:not-italic prose-blockquote:text-slate-800
                            prose-li:text-[14px] sm:prose-li:text-[14.5px] prose-li:my-1 cursor-default">
                            {project.content ? (
                                <div dangerouslySetInnerHTML={{ __html: processedContent }} />
                            ) : project.description ? (
                                <div dangerouslySetInnerHTML={{ __html: project.description }} />
                            ) : (
                                <p className="font-medium text-[14px] sm:text-[14.5px] leading-relaxed">
                                    {project.summary}
                                </p>
                            )}
                        </article>
                    </main>

                    {/* Right Column: Hiển thị tự nhiên lăn chuột theo trang, không giới hạn khung */}
                    <aside className="w-full lg:w-72 xl:w-80 shrink-0 min-w-0 lg:border-l lg:border-slate-100 lg:pl-6 xl:pl-8">
                        <div className="space-y-6">

                            {/* 1. TÍNH NĂNG NỔI BẬT */}
                            {project.highlights && project.highlights.length > 0 && (
                                <div id="section-highlights" className="scroll-mt-24 space-y-3 pt-2">
                                    <div className="flex items-center gap-2 text-xs font-black text-slate-900 uppercase tracking-wider">
                                        <div className="w-2 h-2 rounded-full bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.6)]" />
                                        <span>{t("highlights")}</span>
                                    </div>
                                    <ul className="space-y-2.5 pt-1">
                                        {project.highlights.map((highlight, index) => {
                                            const parts = highlight.split(':');
                                            const hasColon = parts.length > 1;

                                            return (
                                                <li key={index} className="flex items-start gap-2.5 text-[13px] sm:text-[13.5px] leading-relaxed">
                                                    <div className="mt-2 w-1.5 h-1.5 rounded-full bg-cyan-500 shrink-0" />
                                                    <div className="flex-1">
                                                        {hasColon ? (
                                                            <>
                                                                <span className="font-bold text-slate-900">{parts[0]}:</span>
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

                            {/* 2. CẤU TRÚC THƯ MỤC (NỀN TRẮNG, BỎ NÚT CHÉP theo yêu cầu) */}
                            {project.directoryTree && (
                                <div id="section-directory-tree" className="scroll-mt-24 space-y-3 pt-5 border-t border-slate-100">
                                    <div className="flex items-center gap-2 text-xs font-black text-slate-900 uppercase tracking-wider">
                                        <FileCode2 className="w-4 h-4 text-cyan-600" />
                                        <span>{t("directoryTree")}</span>
                                    </div>

                                    {/* White background container - hiển thị thoải mái không giới hạn khung */}
                                    <div className="bg-slate-50/70 rounded-xl border border-slate-200/70 p-3.5">
                                        <pre className="font-mono text-xs leading-[1.65] text-slate-800 font-medium overflow-x-auto">
                                            <code>{project.directoryTree}</code>
                                        </pre>
                                    </div>
                                </div>
                            )}

                            {/* 3. FRAMEWORK & CÔNG NGHỆ (THU GỌN / COLLAPSIBLE theo yêu cầu) */}
                            {Boolean(project.stack?.length || project.languages?.length || project.tools?.length) && (
                                <div id="section-tech-stack" className="scroll-mt-24 pt-5 border-t border-slate-100">
                                    <button
                                        type="button"
                                        onClick={() => setIsOpenFrameworks(!isOpenFrameworks)}
                                        className="w-full flex items-center justify-between py-1 text-left font-black text-xs uppercase tracking-wider text-slate-900 hover:text-cyan-700 transition-colors group cursor-pointer"
                                    >
                                        <div className="flex items-center gap-2">
                                            <Code2 className="w-4 h-4 text-cyan-600" />
                                            <span>{t("techStack")}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                                                {(project.stack?.length || 0) + (project.languages?.length || 0) + (project.tools?.length || 0)}
                                            </span>
                                            <ChevronDown className={`w-4 h-4 text-slate-400 group-hover:text-cyan-600 transition-transform duration-300 ${isOpenFrameworks ? "rotate-180" : ""}`} />
                                        </div>
                                    </button>

                                    <AnimatePresence initial={false}>
                                        {isOpenFrameworks && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: "auto", opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.2 }}
                                                className="overflow-hidden pt-3 space-y-3.5"
                                            >
                                                {/* Framework & Stack */}
                                                {project.stack?.length > 0 && (
                                                    <div className="space-y-1.5">
                                                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">{t("frameworkAndStack")}</span>
                                                        <div className="flex flex-wrap gap-1.5">
                                                            {project.stack.map((tech) => (
                                                                <TechBadge key={tech} name={tech} className="px-2.5 py-0.5 text-xs bg-slate-50 border border-slate-200/80" />
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Languages */}
                                                {project.languages && project.languages.length > 0 && (
                                                    <div className="space-y-1.5 pt-2 border-t border-slate-100">
                                                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">{t("languages")}</span>
                                                        <div className="flex flex-wrap gap-1.5">
                                                            {project.languages.map((lang) => (
                                                                <TechBadge key={lang} name={lang} className="px-2.5 py-0.5 text-xs bg-slate-50 border border-slate-200/80" />
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Tools */}
                                                {project.tools && project.tools.length > 0 && (
                                                    <div className="space-y-1.5 pt-2 border-t border-slate-100">
                                                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">{t("tools")}</span>
                                                        <div className="flex flex-wrap gap-1.5">
                                                            {project.tools.map((tool) => (
                                                                <TechBadge key={tool} name={tool} className="px-2.5 py-0.5 text-xs bg-slate-50 border border-slate-200/80" />
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            )}

                            {/* 4. ALBUM ẢNH & MINH HỌA (HIỂN THỊ NGẮN GỌN THEO ĐÚNG ALBUM ADMIN ĐÃ TẠO) */}
                            {allImages.length > 0 && (
                                <div id="section-screenshots" className="scroll-mt-24 pt-5 border-t border-slate-100">
                                    <button
                                        type="button"
                                        onClick={() => setIsOpenAlbum(!isOpenAlbum)}
                                        className="w-full flex items-center justify-between py-1 text-left font-black text-xs uppercase tracking-wider text-slate-900 hover:text-cyan-700 transition-colors group cursor-pointer"
                                    >
                                        <div className="flex items-center gap-2">
                                            <ImageIcon className="w-4 h-4 text-cyan-600" />
                                            <span>{t("gallery")}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-[11px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full">
                                                {allImages.length}
                                            </span>
                                            <ChevronDown className={`w-4 h-4 text-slate-400 group-hover:text-cyan-600 transition-transform duration-300 ${isOpenAlbum ? "rotate-180" : ""}`} />
                                        </div>
                                    </button>

                                    <AnimatePresence initial={false}>
                                        {isOpenAlbum && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: "auto", opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.2 }}
                                                className="overflow-hidden pt-3 space-y-2"
                                            >
                                                {/* Danh sách album hiển thị ngắn gọn, giữ nguyên vẹn cấu trúc folder từ Admin */}
                                                {albumGroups.map((album) => (
                                                    <div
                                                        key={album.folder}
                                                        onClick={() => { setActiveImageIndex(album.startIndex); setIsZoomed(false); }}
                                                        className="flex items-center justify-between p-2 rounded-xl bg-slate-50 hover:bg-cyan-50/70 border border-slate-200/70 hover:border-cyan-200/80 transition-all cursor-pointer group"
                                                    >
                                                        <div className="flex items-center gap-2.5 min-w-0">
                                                            <div className="relative w-11 h-9 rounded-lg overflow-hidden shrink-0 border border-slate-200/80 bg-slate-100">
                                                                <Image
                                                                    src={album.coverUrl}
                                                                    alt={album.folder}
                                                                    fill
                                                                    sizes="44px"
                                                                    className="object-cover group-hover:scale-105 transition-transform"
                                                                />
                                                            </div>
                                                            <div className="truncate">
                                                                <p className="text-xs font-bold text-slate-800 group-hover:text-cyan-700 truncate">
                                                                    {album.folder}
                                                                </p>
                                                                <p className="text-[10.5px] text-slate-400 font-medium">
                                                                    {album.count} hình ảnh
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <div className="p-1 rounded-full text-slate-300 group-hover:text-cyan-600 group-hover:translate-x-0.5 transition-all shrink-0">
                                                            <ChevronRight className="w-4 h-4" />
                                                        </div>
                                                    </div>
                                                ))}

                                                <button
                                                    type="button"
                                                    onClick={() => { setActiveImageIndex(0); setIsZoomed(false); }}
                                                    className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-white hover:bg-slate-100 border border-slate-200/80 text-xs font-bold text-slate-700 hover:text-slate-900 transition-all active:scale-98 shadow-2xs mt-1 cursor-pointer"
                                                >
                                                    <ZoomIn className="w-3.5 h-3.5 text-cyan-600" />
                                                    <span>Xem tất cả ({allImages.length} ảnh)</span>
                                                </button>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            )}

                        </div>
                    </aside>

                </div>
            </div>

            {/* 1. NÚT 3 GẠCH NỔI Ở MÉP TRÁI (Chỉ xuất hiện khi lăn chuột > 200px VÀ mục lục đang đóng) */}
            <AnimatePresence>
                {showScrollTrigger && !isLeftSidebarOpen && tocTree.length > 0 && (
                    <motion.button
                        type="button"
                        initial={{ opacity: 0, x: -24 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -24 }}
                        transition={{ duration: 0.2 }}
                        onClick={() => setIsLeftSidebarOpen(true)}
                        className="fixed left-0 top-32 z-40 p-2.5 sm:p-3 rounded-r-2xl shadow-2xl bg-slate-900 hover:bg-cyan-600 text-white border-y border-r border-slate-700/80 hover:pl-4 transition-all cursor-pointer group ring-4 ring-slate-900/10"
                        title={t("onThisPage")}
                        aria-label={t("onThisPage")}
                    >
                        {/* Biểu tượng 3 gạch (Nút 3 gạch chuẩn yêu cầu) */}
                        <div className="flex flex-col justify-between w-4 h-3.5">
                            <span className="w-full h-0.5 bg-white rounded-full transition-all group-hover:bg-cyan-100" />
                            <span className="w-3/4 h-0.5 bg-white rounded-full transition-all group-hover:w-full group-hover:bg-cyan-100" />
                            <span className="w-full h-0.5 bg-white rounded-full transition-all group-hover:bg-cyan-100" />
                        </div>

                        {/* Badge số mục */}
                        <span className="absolute -top-1.5 -right-1.5 bg-cyan-600 text-white text-[9px] font-black px-1.5 py-0.2 rounded-full shadow-xs border-2 border-slate-900">
                            {tocTree.length}
                        </span>
                    </motion.button>
                )}
            </AnimatePresence>

            {/* 2. NGĂN KÉO MỤC LỤC TRÊN MÀN HÌNH DI ĐỘNG (< lg) */}
            <AnimatePresence>
                {isLeftSidebarOpen && (
                    <div className="fixed inset-0 z-50 flex lg:hidden">
                        {/* Nền mờ phía sau */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs"
                            onClick={() => setIsLeftSidebarOpen(false)}
                        />

                        {/* Khung ngăn kéo trượt từ lề trái */}
                        <motion.aside
                            initial={{ x: "-100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "-100%" }}
                            transition={{ type: "spring", damping: 27, stiffness: 300 }}
                            className="relative w-80 max-w-[85vw] h-full bg-white border-r border-slate-200 shadow-2xl z-10 flex flex-col"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex items-center justify-between px-4 py-3.5 border-b border-slate-100 bg-slate-50/90 shrink-0">
                                <div className="flex items-center gap-2">
                                    <ListOrdered className="w-4 h-4 text-cyan-600" />
                                    <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">
                                        {t("onThisPage")}
                                    </h3>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setIsLeftSidebarOpen(false)}
                                    className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200/70 transition-colors cursor-pointer"
                                    title="Thu gọn mục lục"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                                {renderHierarchicalToc(() => setIsLeftSidebarOpen(false))}
                            </div>
                        </motion.aside>
                    </div>
                )}
            </AnimatePresence>

            {/* LIGHTBOX FOR IMAGES: TRÀN TOÀN MÀN HÌNH (PORTAL TO BODY, PHỦ QUA NAVBAR, VỪA KHUNG KHÔNG BỊ KHUẤT) */}
            {mounted && activeImageIndex !== null && allImages[activeImageIndex] && createPortal(
                <div 
                    className="fixed inset-0 z-[99999] w-screen h-screen bg-white/98 backdrop-blur-md flex flex-col justify-between p-3 sm:p-5 select-none cursor-default overflow-hidden"
                    onClick={() => { setActiveImageIndex(null); setIsZoomed(false); }}
                >
                    {/* Header bar controls */}
                    <div 
                        className="w-full flex items-center justify-between shrink-0 z-30 pb-2 border-b border-slate-100" 
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center gap-2">
                            <span className="bg-slate-900 text-white px-3 py-1 rounded-full text-xs font-bold shadow-xs">
                                {activeImageIndex + 1} / {allImages.length}
                            </span>
                            {allImages[activeImageIndex].folder && (
                                <span className="hidden sm:inline-block bg-slate-100 text-slate-700 border border-slate-200/80 px-3 py-1 rounded-full text-xs font-semibold">
                                    {allImages[activeImageIndex].folder}
                                </span>
                            )}
                        </div>

                        <div className="flex items-center gap-2">
                            <button 
                                type="button"
                                onClick={() => setIsZoomed(!isZoomed)}
                                className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-all cursor-pointer active:scale-95" 
                                title={isZoomed ? "Thu nhỏ" : "Phóng to"}
                            >
                                {isZoomed ? <ZoomOut className="w-5 h-5" /> : <ZoomIn className="w-5 h-5" />}
                            </button>
                            <button 
                                type="button"
                                onClick={() => { setActiveImageIndex(null); setIsZoomed(false); }}
                                className="p-2 rounded-full bg-slate-900 hover:bg-slate-800 text-white transition-all cursor-pointer shadow-md active:scale-95" 
                                title="Đóng (Esc)"
                                aria-label="Đóng"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    {/* Main Image Viewport: TRÀN MÀN HÌNH, VỪA VẶN, KHÔNG BỊ KHUẤT */}
                    <div className="flex-1 w-full min-h-0 flex items-center justify-center relative p-2 overflow-hidden">
                        {/* Navigation Prev */}
                        {allImages.length > 1 && (
                            <button 
                                type="button"
                                onClick={(e) => { 
                                    e.stopPropagation(); 
                                    setActiveImageIndex((activeImageIndex - 1 + allImages.length) % allImages.length); 
                                    setIsZoomed(false); 
                                }}
                                className="absolute left-2 sm:left-4 z-20 p-3 rounded-full bg-white/90 hover:bg-white text-slate-800 shadow-xl border border-slate-200/80 transition-all cursor-pointer hover:scale-110 active:scale-95"
                                title="Ảnh trước"
                            >
                                <ChevronLeft className="w-6 h-6" />
                            </button>
                        )}

                        {/* Center Image Viewport: Nhấp vào vùng trống bất kỳ để đóng popup */}
                        <div 
                            className={`w-full h-full flex items-center justify-center ${isZoomed ? 'overflow-auto custom-scrollbar' : ''}`}
                        >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img 
                                src={allImages[activeImageIndex].url} 
                                alt={allImages[activeImageIndex].altText || "Image preview"} 
                                onClick={(e) => { 
                                    e.stopPropagation(); 
                                    setIsZoomed(!isZoomed); 
                                }}
                                className={`transition-all duration-200 ${
                                    isZoomed 
                                        ? 'max-w-none max-h-none cursor-zoom-out rounded-lg shadow-2xl' 
                                        : 'max-w-full max-h-full w-auto h-auto object-contain cursor-zoom-in rounded-xl shadow-2xl border border-slate-200/60'
                                }`} 
                            />
                        </div>

                        {/* Navigation Next */}
                        {allImages.length > 1 && (
                            <button 
                                type="button"
                                onClick={(e) => { 
                                    e.stopPropagation(); 
                                    setActiveImageIndex((activeImageIndex + 1) % allImages.length); 
                                    setIsZoomed(false); 
                                }}
                                className="absolute right-2 sm:right-4 z-20 p-3 rounded-full bg-white/90 hover:bg-white text-slate-800 shadow-xl border border-slate-200/80 transition-all cursor-pointer hover:scale-110 active:scale-95"
                                title="Ảnh tiếp theo"
                            >
                                <ChevronRight className="w-6 h-6" />
                            </button>
                        )}
                    </div>

                    {/* Bottom Caption Bar */}
                    {allImages[activeImageIndex].altText && !isZoomed && (
                        <div className="shrink-0 pt-2 text-center" onClick={(e) => e.stopPropagation()}>
                            <span className="inline-block text-xs sm:text-sm font-semibold text-slate-800 bg-white/95 px-5 py-1.5 rounded-full border border-slate-200/80 shadow-xs max-w-2xl truncate">
                                {allImages[activeImageIndex].altText}
                            </span>
                        </div>
                    )}
                </div>,
                document.body
            )}
        </div>
    );
}
