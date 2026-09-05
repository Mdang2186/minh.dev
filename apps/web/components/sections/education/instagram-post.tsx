"use client";

import { useState } from "react";
import { 
  Heart, 
  MessageCircle, 
  Send, 
  Bookmark, 
  ExternalLink,
  GraduationCap,
  Award,
  Calendar,
  Smile,
  Check,
  User,
} from "lucide-react";
import { motion } from "framer-motion";
import { InstagramMediaCarousel } from "./instagram-media-carousel";

export interface FeedItem {
  id: string;
  type: "education" | "certification";
  title: string;
  subtitle: string; // school org or cert issuer
  date: string;     // period or date
  degree?: string;
  major?: string;
  gpa?: string;
  score?: string;
  url?: string;
  logo?: string;
  images: string[];
  tags?: string[];
  description?: string;
  color?: string;
  createdAt?: string | Date;
}

export function InstagramPost({ item, index }: { item: FeedItem; index: number; avatar?: string }) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(128 + index * 37);
  const [bookmarked, setBookmarked] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);

  const handleLikeToggle = () => {
    if (liked) {
      setLiked(false);
      setLikeCount((prev) => prev - 1);
    } else {
      setLiked(true);
      setLikeCount((prev) => prev + 1);
    }
  };

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    setComments((prev) => [...prev, commentText.trim()]);
    setCommentText("");
  };

  // Reusable Post Header Component
  const renderHeader = (isMobile: boolean) => (
    <div className={`p-3 sm:p-3.5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900 ${isMobile ? "lg:hidden" : "hidden lg:flex"}`}>
      <div className="flex items-center gap-2.5 min-w-0">
        {/* Organization / School Logo as Avatar */}
        {item.logo ? (
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-slate-200 dark:border-slate-700 bg-white p-0.5 shrink-0 flex items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={item.logo}
              alt=""
              className="w-full h-full object-contain"
            />
          </div>
        ) : (
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
            {item.type === "education" ? (
              <GraduationCap className="w-4 h-4 sm:w-5 sm:h-5 text-slate-700 dark:text-slate-300" strokeWidth={1.5} />
            ) : (
              <Award className="w-4 h-4 sm:w-5 sm:h-5 text-slate-700 dark:text-slate-300" strokeWidth={1.5} />
            )}
          </div>
        )}

        {/* Institution / School Name as Header */}
        <div className="flex flex-col min-w-0">
          <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white truncate">
            {item.subtitle}
          </h4>
          <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 flex-wrap">
            <span className="font-medium px-1.5 py-0.2 rounded border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300">
              {item.type === "education" ? "edu" : "cert"}
            </span>
            <span>•</span>
            <span>{item.date}</span>
            <span>•</span>
            <span className="inline-flex items-center gap-0.5 text-slate-700 dark:text-slate-300 font-medium">
              <User className="w-3 h-3" strokeWidth={1.5} />
              @minhdev
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="w-full bg-white dark:bg-slate-900 border-y sm:border border-slate-200/90 dark:border-slate-800 sm:rounded-2xl md:rounded-3xl overflow-hidden shadow-sm sm:shadow-md transition-all"
    >
      {/* ── MOBILE: Post Header (LUÔN Ở TRÊN CÙNG CỦA ẢNH TRÊN ĐIỆN THOẠI) ── */}
      {renderHeader(true)}

      <div className={`grid grid-cols-1 lg:grid-cols-12 ${item.images && item.images.length === 1 ? "min-h-0" : "lg:min-h-[440px]"}`}>
        {/* ── Media Carousel (Nền trắng, tối ưu góc nhìn) ── */}
        <div className="lg:col-span-7 xl:col-span-8 bg-white dark:bg-slate-950 flex items-center justify-center relative border-b lg:border-b-0 lg:border-r border-slate-200 dark:border-slate-800">
          <InstagramMediaCarousel
            images={item.images}
            title={item.title}
            subtitle={item.subtitle}
            logo={item.logo}
            color={item.color}
            type={item.type}
            onLike={() => {
              if (!liked) {
                setLiked(true);
                setLikeCount((prev) => prev + 1);
              }
            }}
          />
        </div>

        {/* ── DESKTOP: Right Column Sidebar ── */}
        <div className="hidden lg:flex lg:col-span-5 xl:col-span-4 flex-col justify-between bg-white dark:bg-slate-900">
          {/* Header on Desktop */}
          {renderHeader(false)}

          {/* Body: Scrollable Description & Content */}
          <div className="p-4 flex-1 overflow-y-auto max-h-[380px] space-y-3.5 no-scrollbar text-xs sm:text-sm">
            {/* Title from Admin */}
            <div>
              <h4 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white leading-snug">
                {item.title}
              </h4>
              <p className="text-[11px] font-medium text-slate-400 mt-0.5 flex items-center gap-1.5">
                <Calendar className="w-3 h-3 text-cyan-500" />
                {item.date}
              </p>
            </div>

            {/* Badges for Admin Fields (Outline Style) */}
            <div className="flex flex-wrap gap-1.5">
              {item.degree && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded border border-slate-200 dark:border-slate-700 text-[11px] font-medium text-slate-700 dark:text-slate-300">
                  <GraduationCap className="w-3 h-3" strokeWidth={1.5} />
                  {item.degree}
                </span>
              )}

              {item.major && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded border border-slate-200 dark:border-slate-700 text-[11px] font-medium text-slate-700 dark:text-slate-300">
                  {item.major}
                </span>
              )}

              {/* Gắn thẻ tôi: @minhdev */}
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded border border-slate-300 dark:border-slate-700 text-[11px] font-medium text-slate-700 dark:text-slate-300">
                <User className="w-3 h-3" strokeWidth={1.5} />
                @minhdev
              </span>

              {item.gpa && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded border border-slate-200 dark:border-slate-700 text-[11px] font-bold text-slate-800 dark:text-slate-200">
                  GPA: {item.gpa}
                </span>
              )}

              {item.score && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded border border-slate-200 dark:border-slate-700 text-[11px] font-bold text-slate-800 dark:text-slate-200">
                  <Award className="w-3 h-3" strokeWidth={1.5} />
                  Score: {item.score}
                </span>
              )}

              {item.url && (
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded border border-slate-300 dark:border-slate-600 text-[11px] font-bold text-slate-900 dark:text-white hover:underline transition-all"
                >
                  <ExternalLink className="w-3 h-3" strokeWidth={1.5} />
                  Verify
                </a>
              )}
            </div>

            {/* Description */}
            {item.description ? (
              <div className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line bg-slate-50 dark:bg-slate-800/40 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                {item.description}
              </div>
            ) : null}

            {/* Hashtags setup từ Admin */}
            {item.tags && item.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-0.5">
                {item.tags.map((tag, i) => {
                  const clean = tag.startsWith("#") ? tag : `#${tag}`;
                  return (
                    <span
                      key={i}
                      className="text-xs font-semibold text-blue-600 dark:text-cyan-400 hover:underline cursor-pointer"
                    >
                      {clean}
                    </span>
                  );
                })}
              </div>
            )}

            {/* Dynamic Comments List */}
            {comments.length > 0 && (
              <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800">
                {comments.map((comment, i) => (
                  <div key={i} className="text-xs text-slate-800 dark:text-slate-200 flex items-start gap-1.5">
                    <span className="font-bold text-slate-900 dark:text-white">guest:</span>
                    <span className="flex-1">{comment}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer: Instagram Action Bar & Interaction */}
          <div className="border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-3.5 space-y-2.5">
            {/* Actions: Heart, Message, Share, Bookmark */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3.5 text-slate-900 dark:text-white">
                <button
                  type="button"
                  onClick={handleLikeToggle}
                  className="transition-transform active:scale-125 focus:outline-none"
                  aria-label="Like"
                >
                  <Heart
                    className={`w-5 h-5 sm:w-6 sm:h-6 transition-colors ${
                      liked
                        ? "text-rose-500 fill-rose-500 stroke-rose-500"
                        : "hover:text-rose-500"
                    }`}
                  />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const input = document.getElementById(`comment-input-${item.id}`);
                    input?.focus();
                  }}
                  className="hover:text-cyan-500 transition-colors"
                  aria-label="Comment"
                >
                  <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>

                <button
                  type="button"
                  onClick={handleShare}
                  className="hover:text-cyan-500 transition-colors"
                  aria-label="Share"
                >
                  {copied ? (
                    <Check className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-500" />
                  ) : (
                    <Send className="w-5 h-5 sm:w-6 sm:h-6" />
                  )}
                </button>
              </div>

              <button
                type="button"
                onClick={() => setBookmarked(!bookmarked)}
                className="transition-transform active:scale-110"
                aria-label="Bookmark"
              >
                <Bookmark
                  className={`w-5 h-5 sm:w-6 sm:h-6 transition-colors ${
                    bookmarked
                      ? "text-amber-500 fill-amber-500"
                      : "text-slate-900 dark:text-white hover:text-amber-500"
                  }`}
                />
              </button>
            </div>

            {/* Like Counter */}
            <div className="flex items-center justify-between text-xs font-bold text-slate-900 dark:text-white">
              <span>{likeCount.toLocaleString()} lượt thích</span>
              {copied && (
                <span className="text-emerald-500 font-bold text-[11px] animate-pulse">
                  Đã sao chép liên kết!
                </span>
              )}
            </div>

            {/* Comment Input */}
            <form onSubmit={handleAddComment} className="flex items-center gap-2 pt-0.5">
              <Smile className="w-4 h-4 text-slate-400 shrink-0" />
              <input
                id={`comment-input-${item.id}`}
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Thêm bình luận..."
                className="w-full bg-transparent text-xs text-slate-900 dark:text-white placeholder-slate-400 outline-none"
              />
              {commentText.trim() && (
                <button
                  type="submit"
                  className="text-xs font-bold text-cyan-500 hover:text-cyan-600 shrink-0"
                >
                  Đăng
                </button>
              )}
            </form>
          </div>
        </div>
      </div>

      {/* ── MOBILE: Actions & Caption (LUÔN Ở DƯỚI ẢNH TRÊN ĐIỆN THOẠI) ── */}
      <div className="lg:hidden p-3 sm:p-4 space-y-2.5 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
        {/* Actions bar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-slate-900 dark:text-white">
            <button
              type="button"
              onClick={handleLikeToggle}
              className="transition-transform active:scale-125 focus:outline-none"
              aria-label="Like"
            >
              <Heart
                className={`w-6 h-6 transition-colors ${
                  liked
                    ? "text-rose-500 fill-rose-500 stroke-rose-500"
                    : "hover:text-rose-500"
                }`}
              />
            </button>

            <button
              type="button"
              onClick={() => {
                const input = document.getElementById(`mobile-comment-${item.id}`);
                input?.focus();
              }}
              className="hover:text-cyan-500 transition-colors"
              aria-label="Comment"
            >
              <MessageCircle className="w-6 h-6" />
            </button>

            <button
              type="button"
              onClick={handleShare}
              className="hover:text-cyan-500 transition-colors"
              aria-label="Share"
            >
              {copied ? (
                <Check className="w-6 h-6 text-emerald-500" />
              ) : (
                <Send className="w-6 h-6" />
              )}
            </button>
          </div>

          <button
            type="button"
            onClick={() => setBookmarked(!bookmarked)}
            className="transition-transform active:scale-110"
            aria-label="Bookmark"
          >
            <Bookmark
              className={`w-6 h-6 transition-colors ${
                bookmarked
                  ? "text-amber-500 fill-amber-500"
                  : "text-slate-900 dark:text-white hover:text-amber-500"
              }`}
            />
          </button>
        </div>

        {/* Like count */}
        <div className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
          {likeCount.toLocaleString()} lượt thích
          {copied && (
            <span className="text-emerald-500 font-bold text-[11px] ml-2 animate-pulse">
              Đã sao chép liên kết!
            </span>
          )}
        </div>

        {/* Caption without redundant minhdev prefix */}
        <div className="text-xs sm:text-[13px] leading-relaxed text-slate-800 dark:text-slate-200">
          <span className="font-bold text-slate-900 dark:text-white">
            {item.title}
          </span>
          {item.description && (
            <span className="block mt-1 text-slate-600 dark:text-slate-300 whitespace-pre-line">
              {item.description}
            </span>
          )}
        </div>

        {/* Outline Badges on mobile */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {item.degree && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700 text-[10px] sm:text-[11px] font-medium text-slate-700 dark:text-slate-300">
              <GraduationCap className="w-3 h-3" strokeWidth={1.5} />
              {item.degree}
            </span>
          )}

          {item.major && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700 text-[10px] sm:text-[11px] font-medium text-slate-700 dark:text-slate-300">
              {item.major}
            </span>
          )}

          {/* Gắn thẻ tôi: @minhdev */}
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded border border-slate-300 dark:border-slate-700 text-[10px] sm:text-[11px] font-medium text-slate-700 dark:text-slate-300">
            <User className="w-3 h-3" strokeWidth={1.5} />
            @minhdev
          </span>

          {item.gpa && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700 text-[10px] sm:text-[11px] font-bold text-slate-800 dark:text-slate-200">
              GPA: {item.gpa}
            </span>
          )}

          {item.score && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700 text-[10px] sm:text-[11px] font-bold text-slate-800 dark:text-slate-200">
              <Award className="w-3 h-3" strokeWidth={1.5} />
              Score: {item.score}
            </span>
          )}

          {item.url && (
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded border border-slate-300 dark:border-slate-600 text-[10px] sm:text-[11px] font-bold text-slate-900 dark:text-white"
            >
              <ExternalLink className="w-3 h-3" strokeWidth={1.5} /> Verify
            </a>
          )}
        </div>

        {/* Hashtags on mobile */}
        {item.tags && item.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-0.5">
            {item.tags.map((tag, i) => {
              const clean = tag.startsWith("#") ? tag : `#${tag}`;
              return (
                <span
                  key={i}
                  className="text-xs font-semibold text-blue-600 dark:text-cyan-400 hover:underline"
                >
                  {clean}
                </span>
              );
            })}
          </div>
        )}

        {/* Date on mobile */}
        <div className="text-[10px] text-slate-400 uppercase tracking-wide pt-0.5">
          {item.date}
        </div>

        {/* Mobile comment form */}
        <form onSubmit={handleAddComment} className="flex items-center gap-2 pt-1 border-t border-slate-100 dark:border-slate-800">
          <Smile className="w-4 h-4 text-slate-400 shrink-0" />
          <input
            id={`mobile-comment-${item.id}`}
            type="text"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Thêm bình luận..."
            className="w-full bg-transparent text-xs text-slate-900 dark:text-white placeholder-slate-400 outline-none"
          />
          {commentText.trim() && (
            <button
              type="submit"
              className="text-xs font-bold text-cyan-500 hover:text-cyan-600 shrink-0"
            >
              Đăng
            </button>
          )}
        </form>
      </div>
    </motion.article>
  );
}
