"use client";

import { useState, useEffect } from "react";
import { 
  GraduationCap, 
  Award, 
  Grid, 
  LayoutList,
  CheckCircle2
} from "lucide-react";
import type { PublicEducation, PublicCertification, PublicSiteProfile } from "@/features/portfolio/portfolio.types";
import { InstagramPost, type FeedItem } from "./instagram-post";
import { InstagramGrid } from "./instagram-grid";
import { InstagramPostDetailView } from "./instagram-post-detail-view";

function parseDateValue(dateStr?: string | null): number {
  if (!dateStr || typeof dateStr !== "string") return 0;
  const s = dateStr.trim();
  if (!s) return 0;

  // 1. If it contains a range like "2022 - 2026" or "09/2022 - 06/2026", take the end date
  if (s.includes("-") && !s.match(/^\d{1,2}-\d{1,2}-\d{4}$/) && !s.match(/^\d{4}-\d{2}-\d{2}$/)) {
    const parts = s.split("-");
    const endPart = parts[parts.length - 1].trim();
    const endVal = parseDateValue(endPart);
    if (endVal > 0) return endVal;
  }

  // 2. Try standard Date.parse (handles "November 11, 2026", "April 02, 2023", "2026-06-21", etc.)
  const parsed = Date.parse(s);
  if (!isNaN(parsed)) return parsed;

  // 3. Handle DD-MM-YYYY or DD/MM/YYYY
  const dmyMatch = s.match(/^(\d{1,2})[-/](\d{1,2})[-/](\d{4})$/);
  if (dmyMatch) {
    const day = parseInt(dmyMatch[1], 10);
    const month = parseInt(dmyMatch[2], 10) - 1;
    const year = parseInt(dmyMatch[3], 10);
    const d = new Date(year, month, day).getTime();
    if (!isNaN(d)) return d;
  }

  // 4. Handle MM/YYYY
  const myMatch = s.match(/^(\d{1,2})[-/](\d{4})$/);
  if (myMatch) {
    const month = parseInt(myMatch[1], 10) - 1;
    const year = parseInt(myMatch[2], 10);
    const d = new Date(year, month, 1).getTime();
    if (!isNaN(d)) return d;
  }

  // 5. Find any 4-digit year in the string
  const yearMatches = s.match(/\b(19\d\d|20\d\d)\b/g);
  if (yearMatches && yearMatches.length > 0) {
    const lastYear = parseInt(yearMatches[yearMatches.length - 1], 10);
    return new Date(lastYear, 0, 1).getTime();
  }

  return 0;
}

export function EducationPageClient({
  profile,
  educations,
  certifications,
}: {
  profile?: PublicSiteProfile;
  educations: PublicEducation[];
  certifications: PublicCertification[];
}) {
  const [activeTab, setActiveTab] = useState<"all" | "education" | "certification">("all");
  // Default to grid layout (like Instagram profile mobile presentation)
  const [viewMode, setViewMode] = useState<"grid" | "feed">("grid");
  const [selectedPostIndex, setSelectedPostIndex] = useState<number | null>(null);

  const avatarUrl = profile?.avatarUrl || "/avatar1.png";

  // Map real data from Admin into Feed items
  const eduItems: FeedItem[] = (educations ?? []).map((edu) => ({
    id: `edu-${edu.id}`,
    type: "education",
    title: edu.title,
    subtitle: edu.org,
    date: edu.period,
    degree: edu.degree,
    major: edu.major,
    gpa: edu.gpa,
    logo: edu.logo,
    images: edu.images || [],
    tags: edu.tags && edu.tags.length > 0 ? edu.tags : (edu.major ? [edu.major.replace(/\s+/g, "").toLowerCase(), "education", "engineering"] : ["education"]),
    description: edu.description,
    color: "#0ea5e9",
    createdAt: (edu as any).createdAt,
  }));

  const certItems: FeedItem[] = (certifications ?? []).map((cert) => ({
    id: `cert-${cert.id}`,
    type: "certification",
    title: cert.title,
    subtitle: cert.issuer,
    date: cert.date,
    score: cert.score,
    url: cert.url,
    logo: cert.logo,
    images: cert.images || [],
    tags: cert.tags && cert.tags.length > 0 ? cert.tags : [cert.title.replace(/\s+/g, "").toLowerCase(), "certificate", "achievement"],
    description: (cert as any).description,
    color: cert.color || "#10b981",
    createdAt: (cert as any).createdAt,
  }));

  // ── SẮP XẾP THEO THỜI GIAN CẢ HỌC VẤN VÀ CHỨNG CHỈ (CHRONOLOGICAL SORTING: MỚI NHẤT LÊN ĐẦU) ──
  const sortByTimeDesc = (a: FeedItem, b: FeedItem) => {
    const timeA = parseDateValue(a.date);
    const timeB = parseDateValue(b.date);
    if (timeB !== timeA) {
      return timeB - timeA;
    }
    const createdA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const createdB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    return createdB - createdA;
  };

  eduItems.sort(sortByTimeDesc);
  certItems.sort(sortByTimeDesc);
  const allItems: FeedItem[] = [...eduItems, ...certItems].sort(sortByTimeDesc);

  const displayedItems =
    activeTab === "all"
      ? allItems
      : activeTab === "education"
      ? eduItems
      : certItems;

  const totalPosts = allItems.length;
  const eduCount = eduItems.length;
  const certCount = certItems.length;

  // Browser back button support
  useEffect(() => {
    const handlePopState = () => {
      setSelectedPostIndex(null);
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const handleSelectPost = (idx: number) => {
    setSelectedPostIndex(idx);
    if (typeof window !== "undefined") {
      window.history.pushState({ postId: displayedItems[idx]?.id }, "");
    }
  };

  const handleBackToGrid = () => {
    setSelectedPostIndex(null);
  };

  // ── KHI XEM BÀI VIẾT: TRÊN WEB THÌ MỞ CẢ TRANG RA VÀ CÓ NÚT BACK, TRÊN ĐIỆN THOẠI CÓ NÚT '< Post' ──
  if (selectedPostIndex !== null && displayedItems[selectedPostIndex]) {
    return (
      <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 py-0 lg:py-6 md:py-8 font-sans">
        <div className="w-full max-w-7xl mx-auto px-0 sm:px-6 lg:px-8">
          <InstagramPostDetailView
            item={displayedItems[selectedPostIndex]}
            allItems={displayedItems}
            onBack={handleBackToGrid}
            onPrev={() =>
              setSelectedPostIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : prev))
            }
            onNext={() =>
              setSelectedPostIndex((prev) =>
                prev !== null && prev < displayedItems.length - 1 ? prev + 1 : prev
              )
            }
            hasPrev={selectedPostIndex > 0}
            hasNext={selectedPostIndex < displayedItems.length - 1}
            postIndex={selectedPostIndex}
            totalPosts={displayedItems.length}
          />
        </div>
      </div>
    );
  }

  // ── GIAO DIỆN HỒ SƠ & LƯỚI ẢNH: HIỂN THỊ FULL TRANG RỘNG RÃI TRÊN WEB ──
  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 py-3 sm:py-6 md:py-8 font-sans">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ── Seamless Profile Header: Rộng rãi, tinh gọn ── */}
        <div className="px-0 mb-3 sm:mb-6">
          <div className="flex items-center gap-3 sm:gap-5">
            {/* Avatar từ hồ sơ cá nhân với viền Story Ring tinh tế */}
            <div className="relative shrink-0">
              <div className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 rounded-full p-[2px] bg-gradient-to-tr from-amber-400 via-rose-500 to-cyan-500 shadow-sm">
                <div className="w-full h-full rounded-full bg-white dark:bg-slate-900 p-[1.5px] flex items-center justify-center">
                  <div className="w-full h-full rounded-full overflow-hidden bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={avatarUrl}
                      alt="minhdev avatar"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Thông tin cá nhân & thống kê */}
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <h1 className="font-extrabold text-sm sm:text-base tracking-tight flex items-center">
                  <span className="text-slate-900 dark:text-white">minh</span><span className="text-cyan-500 dark:text-cyan-400">dev</span>
                </h1>
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-500 fill-cyan-500/20 shrink-0" />
              </div>

              {/* Thống kê bài viết tinh gọn */}
              <div className="flex items-center gap-2 text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                <span><strong className="text-slate-900 dark:text-white font-bold">{totalPosts}</strong> bài đăng</span>
                <span>•</span>
                <span><strong className="text-slate-900 dark:text-white font-bold">{eduCount}</strong> học vấn</span>
                <span>•</span>
                <span><strong className="text-slate-900 dark:text-white font-bold">{certCount}</strong> chứng chỉ</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Instagram Profile Tab Navigation (Tối giản, hạn chế đường kẻ chia khung) ── */}
        <div className="flex items-center justify-between px-2 sm:px-0 mb-3 sm:mb-4">
          {/* Category Tabs: all, edu, cert with outline icons */}
          <div className="flex items-center flex-1 justify-center sm:justify-start gap-1 sm:gap-6">
            {/* Tab: all */}
            <button
              type="button"
              onClick={() => setActiveTab("all")}
              className={`flex items-center justify-center gap-1.5 py-2.5 sm:py-3 px-3 sm:px-4 text-xs tracking-wider transition-all border-b-2 -mb-[1px] ${
                activeTab === "all"
                  ? "border-slate-900 dark:border-white text-slate-900 dark:text-white font-bold"
                  : "border-transparent text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 font-medium"
              }`}
            >
              <Grid className="w-4 h-4" strokeWidth={1.5} />
              <span className="uppercase text-[11px] sm:text-xs">all</span>
            </button>

            {/* Tab: edu */}
            <button
              type="button"
              onClick={() => setActiveTab("education")}
              className={`flex items-center justify-center gap-1.5 py-2.5 sm:py-3 px-3 sm:px-4 text-xs tracking-wider transition-all border-b-2 -mb-[1px] ${
                activeTab === "education"
                  ? "border-slate-900 dark:border-white text-slate-900 dark:text-white font-bold"
                  : "border-transparent text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 font-medium"
              }`}
            >
              <GraduationCap className="w-4 h-4" strokeWidth={1.5} />
              <span className="uppercase text-[11px] sm:text-xs">edu</span>
            </button>

            {/* Tab: cert */}
            <button
              type="button"
              onClick={() => setActiveTab("certification")}
              className={`flex items-center justify-center gap-1.5 py-2.5 sm:py-3 px-3 sm:px-4 text-xs tracking-wider transition-all border-b-2 -mb-[1px] ${
                activeTab === "certification"
                  ? "border-slate-900 dark:border-white text-slate-900 dark:text-white font-bold"
                  : "border-transparent text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 font-medium"
              }`}
            >
              <Award className="w-4 h-4" strokeWidth={1.5} />
              <span className="uppercase text-[11px] sm:text-xs">cert</span>
            </button>
          </div>

          {/* View Mode Toggle: Grid [▦] vs Feed [☰] */}
          <div className="flex items-center gap-1 pl-2 sm:pl-3">
            <button
              type="button"
              onClick={() => setViewMode("grid")}
              title="Chế độ lưới ảnh (Grid)"
              className={`p-1.5 rounded transition-colors ${
                viewMode === "grid"
                  ? "text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800"
                  : "text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"
              }`}
              aria-label="Grid view"
            >
              <Grid className="w-4 h-4" strokeWidth={1.5} />
            </button>

            <button
              type="button"
              onClick={() => setViewMode("feed")}
              title="Chế độ cuộn chi tiết (Feed)"
              className={`p-1.5 rounded transition-colors ${
                viewMode === "feed"
                  ? "text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800"
                  : "text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"
              }`}
              aria-label="Feed view"
            >
              <LayoutList className="w-4 h-4" strokeWidth={1.5} />
            </button>
          </div>
        </div>

        {/* ── Main Display: Grid View or Feed View ── */}
        {viewMode === "grid" ? (
          /* ── 3-Column Square Grid (Instagram Profile Mobile View) ── */
          <InstagramGrid
            items={displayedItems}
            onSelectPost={(_item, idx) => handleSelectPost(idx)}
          />
        ) : (
          /* ── Feed View: Single-Column Cards (Header cleaned up) ── */
          <div className="space-y-4 sm:space-y-6 md:space-y-8 px-0 sm:px-0">
            {displayedItems.length > 0 ? (
              displayedItems.map((item, idx) => (
                <InstagramPost
                  key={item.id}
                  item={item}
                  index={idx}
                />
              ))
            ) : (
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-8 text-center text-slate-500">
                <p className="font-bold text-sm">Chưa có bài đăng nào trong mục này.</p>
                <p className="text-xs text-slate-400 mt-1">Dữ liệu được cập nhật từ Admin Dashboard.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
