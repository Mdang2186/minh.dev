"use client";

import { Copy, Heart, MessageCircle, GraduationCap, Award } from "lucide-react";
import type { FeedItem } from "./instagram-post";

interface InstagramGridProps {
  items: FeedItem[];
  onSelectPost: (item: FeedItem, index: number) => void;
}

export function InstagramGrid({ items, onSelectPost }: InstagramGridProps) {
  if (!items || items.length === 0) {
    return (
      <div className="py-16 text-center border-y border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <div className="w-14 h-14 rounded-full border border-slate-300 dark:border-slate-700 flex items-center justify-center mx-auto text-slate-400 mb-3">
          <GraduationCap className="w-7 h-7" strokeWidth={1.5} />
        </div>
        <p className="font-semibold text-sm text-slate-800 dark:text-slate-200">
          Chưa có bài đăng nào trong mục này
        </p>
        <p className="text-xs text-slate-400 mt-1">
          Dữ liệu được cập nhật từ hệ thống hồ sơ cá nhân.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-0.5 sm:gap-1 md:gap-2">
      {items.map((item, idx) => {
        const hasImages = item.images && item.images.length > 0;
        const isMultiImage = item.images && item.images.length > 1;
        const thumbnail = hasImages ? item.images[0] : null;
        const simulatedLikes = 128 + idx * 37;
        const simulatedComments = 8 + (idx % 5);

        return (
          <div
            key={item.id}
            onClick={() => onSelectPost(item, idx)}
            className="group relative aspect-square w-full overflow-hidden bg-slate-100 dark:bg-slate-900 cursor-pointer select-none"
            role="button"
            tabIndex={0}
            aria-label={`Xem chi tiết bài đăng: ${item.title}`}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onSelectPost(item, idx);
              }
            }}
          >
            {/* Thumbnail Image */}
            {thumbnail ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={thumbnail}
                alt={item.title}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            ) : (
              /* Fallback card if post has no image */
              <div
                className="w-full h-full flex flex-col justify-between p-2.5 sm:p-4 text-left relative overflow-hidden bg-slate-900"
              >
                {/* Outline Icon badge */}
                <div className="flex items-center justify-between z-10">
                  <div className="w-7 h-7 rounded-md border border-slate-700 bg-slate-800/80 flex items-center justify-center text-slate-200">
                    {item.type === "education" ? (
                      <GraduationCap className="w-4 h-4" strokeWidth={1.5} />
                    ) : (
                      <Award className="w-4 h-4" strokeWidth={1.5} />
                    )}
                  </div>
                  {item.logo && (
                    <div className="w-5 h-5 rounded-full overflow-hidden border border-slate-700 bg-white p-0.5">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={item.logo}
                        alt=""
                        className="w-full h-full object-contain"
                      />
                    </div>
                  )}
                </div>

                <div className="z-10">
                  <p className="text-[10px] sm:text-xs font-bold text-white line-clamp-2 leading-tight">
                    {item.title}
                  </p>
                  <p className="text-[9px] sm:text-[10px] text-slate-400 line-clamp-1 mt-0.5">
                    {item.subtitle}
                  </p>
                </div>
              </div>
            )}

            {/* Instagram Multi-Photo / Carousel Badge in top right corner */}
            {isMultiImage && (
              <div
                className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 p-1 rounded bg-black/40 backdrop-blur-sm text-white drop-shadow z-10 pointer-events-none"
                title="Nhiều hình ảnh"
              >
                <Copy className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2]" />
              </div>
            )}

            {/* Desktop Hover Overlay (Likes & Comments Count) */}
            <div className="absolute inset-0 bg-black/35 backdrop-blur-[1px] hidden sm:flex items-center justify-center gap-4 text-white font-bold text-xs sm:text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-20 pointer-events-none">
              <div className="flex items-center gap-1.5 drop-shadow">
                <Heart className="w-4 h-4 fill-white stroke-white" />
                <span>{simulatedLikes}</span>
              </div>
              <div className="flex items-center gap-1.5 drop-shadow">
                <MessageCircle className="w-4 h-4 fill-white stroke-white" />
                <span>{simulatedComments}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
