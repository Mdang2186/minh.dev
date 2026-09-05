"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

export function PhotoAlbum({ images, isInstagram }: { images: string[]; isInstagram?: boolean }) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (selectedIndex === null) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedIndex(null);
      } else if (e.key === "ArrowLeft" && images.length > 1) {
        setSelectedIndex((prev) => (prev === null || prev === 0 ? images.length - 1 : prev - 1));
      } else if (e.key === "ArrowRight" && images.length > 1) {
        setSelectedIndex((prev) => (prev === null || prev === images.length - 1 ? 0 : prev + 1));
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedIndex, images?.length]);

  if (!images || images.length === 0) return null;

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedIndex !== null) {
      setSelectedIndex((selectedIndex + 1) % images.length);
    }
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedIndex !== null) {
      setSelectedIndex((selectedIndex - 1 + images.length) % images.length);
    }
  };

  const renderGrid = () => {
    const len = images.length;
    
    if (len === 1) {
      return (
        <div 
          className={`relative w-full overflow-hidden cursor-pointer group ${isInstagram ? 'aspect-square' : 'aspect-video rounded-2xl'}`}
          onClick={() => setSelectedIndex(0)}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={images[0]} alt="Album image" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        </div>
      );
    }
    
    if (len === 2) {
      return (
        <div className={`grid grid-cols-2 gap-1 overflow-hidden ${isInstagram ? 'aspect-square' : 'gap-2 h-48 sm:h-64 rounded-2xl'}`}>
          {images.map((src, i) => (
            <div key={i} className="relative w-full h-full cursor-pointer group" onClick={() => setSelectedIndex(i)}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="Album image" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            </div>
          ))}
        </div>
      );
    }
    
    if (len === 3) {
      return (
        <div className={`grid grid-cols-2 gap-1 overflow-hidden ${isInstagram ? 'aspect-square' : 'gap-2 h-48 sm:h-64 rounded-2xl'}`}>
          <div className="relative w-full h-full cursor-pointer group" onClick={() => setSelectedIndex(0)}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={images[0]} alt="Album image" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          </div>
          <div className="grid grid-rows-2 gap-2">
            {[1, 2].map((i) => (
              <div key={i} className="relative w-full h-full cursor-pointer group" onClick={() => setSelectedIndex(i)}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={images[i]} alt="Album image" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
            ))}
          </div>
        </div>
      );
    }
    
    // 4 or more
    return (
      <div className={`grid grid-cols-2 gap-1 overflow-hidden ${isInstagram ? 'aspect-square' : 'gap-2 h-48 sm:h-64 rounded-2xl'}`}>
        <div className="grid grid-rows-2 gap-2">
           <div className="relative w-full h-full cursor-pointer group" onClick={() => setSelectedIndex(0)}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={images[0]} alt="Album image" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          </div>
          <div className="relative w-full h-full cursor-pointer group" onClick={() => setSelectedIndex(1)}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={images[1]} alt="Album image" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          </div>
        </div>
        <div className="grid grid-rows-2 gap-2">
           <div className="relative w-full h-full cursor-pointer group" onClick={() => setSelectedIndex(2)}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={images[2]} alt="Album image" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          </div>
          <div className="relative w-full h-full cursor-pointer group" onClick={() => setSelectedIndex(3)}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={images[3]} alt="Album image" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            {len > 4 && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white font-bold text-2xl group-hover:bg-black/40 transition-colors">
                +{len - 4}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className={isInstagram ? "" : "mt-6"}>
        {renderGrid()}
      </div>

      {mounted && typeof document !== "undefined" && createPortal(
        <AnimatePresence>
          {selectedIndex !== null && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[99999] flex flex-col justify-between bg-white/98 backdrop-blur-md p-3 sm:p-5 select-none cursor-default overflow-hidden"
              onClick={() => setSelectedIndex(null)}
            >
              {/* Header */}
              <div 
                className="w-full flex items-center justify-between shrink-0 z-30 pb-2 border-b border-slate-100"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center gap-2">
                  <span className="bg-slate-900 text-white px-3.5 py-1 rounded-full text-xs font-bold shadow-xs">
                    {selectedIndex + 1} / {images.length}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button 
                    type="button"
                    onClick={() => setSelectedIndex(null)}
                    className="p-2 rounded-full bg-slate-900 hover:bg-slate-800 text-white transition-all cursor-pointer shadow-md hover:scale-105 active:scale-95 ring-2 ring-slate-900/10"
                    aria-label="Đóng (Esc)"
                    title="Đóng (Esc)"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Viewport */}
              <div className="flex-1 w-full min-h-0 flex items-center justify-center relative p-2 overflow-hidden">
                {images.length > 1 && (
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
                    src={images[selectedIndex]} 
                    alt="Full screen" 
                    className="max-w-full max-h-full w-auto h-auto object-contain rounded-xl shadow-2xl border border-slate-200/60" 
                  />
                </div>

                {images.length > 1 && (
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

              {/* Bottom Caption */}
              <div className="shrink-0 pt-2 text-center" onClick={(e) => e.stopPropagation()}>
                <span className="inline-block text-xs sm:text-sm font-semibold text-slate-800 bg-white/95 px-5 py-1.5 rounded-full border border-slate-200/80 shadow-xs max-w-2xl">
                  {selectedIndex + 1} / {images.length}
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
}
