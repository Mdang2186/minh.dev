"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, X, Heart, GraduationCap, Award, Maximize2, User } from "lucide-react";

interface InstagramMediaCarouselProps {
  images: string[];
  title: string;
  subtitle?: string;
  logo?: string;
  color?: string;
  type: "education" | "certification";
  onLike?: () => void;
}

export function InstagramMediaCarousel({
  images,
  title,
  subtitle,
  logo,
  color = "#06b6d4",
  type,
  onLike,
}: InstagramMediaCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [showHeartBurst, setShowHeartBurst] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const hasImages = images && images.length > 0;
  const count = images ? images.length : 0;
  const isSingleImage = count === 1;

  useEffect(() => {
    if (!lightboxOpen) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setLightboxOpen(false);
      } else if (e.key === "ArrowLeft" && count > 1) {
        setCurrentIndex((prev) => (prev === 0 ? count - 1 : prev - 1));
      } else if (e.key === "ArrowRight" && count > 1) {
        setCurrentIndex((prev) => (prev === count - 1 ? 0 : prev + 1));
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [lightboxOpen, count]);

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? count - 1 : prev - 1));
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === count - 1 ? 0 : prev + 1));
  };

  const handleDoubleClick = () => {
    setShowHeartBurst(true);
    if (onLike) onLike();
    setTimeout(() => setShowHeartBurst(false), 800);
  };

  return (
    <div
      className={`relative w-full bg-white dark:bg-slate-950 flex items-center justify-center select-none overflow-hidden group transition-all ${
        isSingleImage
          ? "h-auto"
          : hasImages
          ? "min-h-[360px] sm:min-h-[460px] lg:min-h-[540px]"
          : "min-h-[320px] sm:min-h-[380px]"
      }`}
    >
      {/* Floating like animation on double tap */}
      <AnimatePresence>
        {showHeartBurst && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: [0, 1.3, 1], opacity: [0, 1, 0] }}
            transition={{ duration: 0.75, ease: "easeOut" }}
            className="absolute z-30 pointer-events-none drop-shadow-2xl"
          >
            <Heart className="w-24 h-24 text-rose-500 fill-rose-500" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── CASE 1: ĐÚNG 1 TẤM ẢNH -> KHUNG VỪA KHÍT VỚI ẢNH, KHÔNG BỊ THỪA KHOẢNG TRỐNG ── */}
      {isSingleImage ? (
        <div
          className="relative w-full h-auto flex items-center justify-center cursor-pointer overflow-hidden"
          onDoubleClick={handleDoubleClick}
          onClick={() => setLightboxOpen(true)}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={images[0]}
            alt={title}
            className="w-full h-auto max-h-[82vh] object-contain block mx-auto transition-transform duration-300 group-hover:scale-[1.005]"
          />

          {/* Expand Lightbox Button on Hover */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setLightboxOpen(true);
            }}
            className="absolute bottom-2.5 right-2.5 p-2 rounded-full bg-black/60 text-white/90 opacity-0 group-hover:opacity-100 hover:bg-black/85 hover:text-white transition-all backdrop-blur-sm z-20 shadow-md"
            title="Xem toàn màn hình"
          >
            <Maximize2 className="w-4 h-4" />
          </button>

          {/* Instagram Tagged Badge: @minhdev */}
          <div className="absolute bottom-2.5 left-2.5 z-20 flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/65 backdrop-blur-md text-white text-[11px] font-medium border border-white/10 shadow pointer-events-none">
            <User className="w-3 h-3 text-white" strokeWidth={1.5} />
            <span>@minhdev</span>
          </div>
        </div>
      ) : count > 1 ? (
        /* ── CASE 2: NHIỀU ẢNH (ALBUM CAROUSEL) ── */
        <div
          className="relative w-full h-full min-h-[360px] sm:min-h-[460px] lg:min-h-[540px] flex items-center justify-center cursor-pointer"
          onDoubleClick={handleDoubleClick}
          onClick={() => setLightboxOpen(true)}
        >
          {/* Main Displayed Image */}
          <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={images[currentIndex]}
              alt={`${title} - Photo ${currentIndex + 1}`}
              className="w-full h-full max-h-[600px] object-contain transition-all duration-300"
            />
          </div>

          {/* Expand Lightbox Button on Hover (Top Left) */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setLightboxOpen(true);
            }}
            className="absolute top-3 left-3 p-2 rounded-full bg-black/60 text-white/90 opacity-0 group-hover:opacity-100 hover:bg-black/80 hover:text-white transition-all backdrop-blur-sm z-20 shadow-md"
            title="Xem toàn màn hình"
          >
            <Maximize2 className="w-4 h-4" />
          </button>

          {/* Instagram Tagged Badge: @minhdev */}
          <div className="absolute bottom-3 left-3 z-20 flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/65 backdrop-blur-md text-white text-[11px] font-medium border border-white/10 shadow pointer-events-none">
            <User className="w-3 h-3 text-white" strokeWidth={1.5} />
            <span>@minhdev</span>
          </div>

          {/* Carousel Next / Prev Controls */}
          <button
            type="button"
            onClick={handlePrev}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/60 hover:bg-black/85 text-white flex items-center justify-center shadow-lg transition-transform hover:scale-105 active:scale-95 z-20 backdrop-blur-sm"
            aria-label="Previous photo"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <button
            type="button"
            onClick={handleNext}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/60 hover:bg-black/85 text-white flex items-center justify-center shadow-lg transition-transform hover:scale-105 active:scale-95 z-20 backdrop-blur-sm"
            aria-label="Next photo"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Photo Counter Badge (e.g. 1/4) */}
          <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-black/65 text-white text-xs font-semibold backdrop-blur-md z-20 tracking-wider shadow">
            {currentIndex + 1}/{count}
          </div>

          {/* Dot Indicators */}
          <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5 z-20 pointer-events-none">
            {images.map((_, idx) => (
              <div
                key={idx}
                className={`h-1.5 rounded-full transition-all duration-300 shadow-md ${
                  idx === currentIndex
                    ? "w-6 bg-cyan-500"
                    : "w-2 bg-slate-400/80 dark:bg-white/50"
                }`}
              />
            ))}
          </div>
        </div>
      ) : (
        /* ── CASE 3: CHƯA CÓ ẢNH (FALLBACK GRAPHIC CARD) ── */
        <div
          className="w-full h-full min-h-[320px] sm:min-h-[380px] flex flex-col justify-between p-8 md:p-10 relative overflow-hidden"
          style={{
            background: `radial-gradient(circle at 80% 20%, ${color}35 0%, #030712 70%)`,
          }}
        >
          {logo && (
            <div className="absolute -right-10 -bottom-10 opacity-10 pointer-events-none w-72 h-72">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={logo} alt="" className="w-full h-full object-contain filter grayscale contrast-200" />
            </div>
          )}

          {/* Top of Card */}
          <div className="flex items-center justify-between z-10">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-xs font-bold text-cyan-300">
              {type === "education" ? (
                <>
                  <GraduationCap className="w-3.5 h-3.5" /> Academic Credential
                </>
              ) : (
                <>
                  <Award className="w-3.5 h-3.5" /> Certified Achievement
                </>
              )}
            </div>

            {logo && (
              <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-md p-1.5 border border-white/15 flex items-center justify-center overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={logo} alt="Logo" className="w-full h-full object-contain" />
              </div>
            )}
          </div>

          {/* Center Title */}
          <div className="my-auto py-6 z-10">
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white leading-tight drop-shadow-md">
              {title}
            </h3>
            {subtitle && (
              <p className="mt-3 text-base sm:text-lg font-medium text-slate-300/90 leading-relaxed">
                {subtitle}
              </p>
            )}
          </div>

          {/* Bottom Accent */}
          <div className="flex items-center justify-between pt-4 border-t border-white/10 z-10 text-xs text-slate-400 font-medium">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
              Verified by Institution
            </span>
            <span className="text-slate-400">minhdev</span>
          </div>
        </div>
      )}

      {/* Full-Screen Lightbox (Nền trắng, portal body, hỗ trợ phím điều hướng) */}
      {mounted && typeof document !== "undefined" && createPortal(
        <AnimatePresence>
          {lightboxOpen && hasImages && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[99999] flex flex-col justify-between bg-white/98 backdrop-blur-md p-3 sm:p-5 select-none cursor-default overflow-hidden"
              onClick={() => setLightboxOpen(false)}
            >
              {/* Header controls */}
              <div 
                className="w-full flex items-center justify-between shrink-0 z-30 pb-2 border-b border-slate-100"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center gap-2">
                  <span className="bg-slate-900 text-white px-3.5 py-1 rounded-full text-xs font-bold shadow-xs">
                    {currentIndex + 1} / {count}
                  </span>
                  <span className="hidden sm:inline-block text-xs font-semibold text-slate-700 truncate max-w-md">
                    {title}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setLightboxOpen(false)}
                    className="p-2 rounded-full bg-slate-900 hover:bg-slate-800 text-white transition-all cursor-pointer shadow-md hover:scale-105 active:scale-95 ring-2 ring-slate-900/10"
                    aria-label="Đóng (Esc)"
                    title="Đóng (Esc)"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Center Main Image Viewport */}
              <div className="flex-1 w-full min-h-0 flex items-center justify-center relative p-2 overflow-hidden">
                {count > 1 && (
                  <button
                    type="button"
                    onClick={handlePrev}
                    className="absolute left-2 sm:left-4 z-20 p-3 rounded-full bg-white/90 hover:bg-white text-slate-800 shadow-xl border border-slate-200/80 transition-all cursor-pointer hover:scale-110 active:scale-95"
                    aria-label="Ảnh trước"
                    title="Ảnh trước"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                )}

                <div 
                  className="w-full h-full flex items-center justify-center"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={images[currentIndex]}
                    alt={`${title} - Photo ${currentIndex + 1}`}
                    className="max-w-full max-h-full w-auto h-auto object-contain rounded-xl shadow-2xl border border-slate-200/60"
                  />
                </div>

                {count > 1 && (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="absolute right-2 sm:right-4 z-20 p-3 rounded-full bg-white/90 hover:bg-white text-slate-800 shadow-xl border border-slate-200/80 transition-all cursor-pointer hover:scale-110 active:scale-95"
                    aria-label="Ảnh tiếp theo"
                    title="Ảnh tiếp theo"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                )}
              </div>

              {/* Bottom Caption Bar */}
              <div className="shrink-0 pt-2 text-center" onClick={(e) => e.stopPropagation()}>
                <span className="inline-block text-xs sm:text-sm font-semibold text-slate-800 bg-white/95 px-5 py-1.5 rounded-full border border-slate-200/80 shadow-xs max-w-2xl truncate">
                  {title} {count > 1 && `• ${currentIndex + 1} / ${count}`}
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
}
