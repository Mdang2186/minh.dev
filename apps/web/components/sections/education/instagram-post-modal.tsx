"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  ChevronLeft,
  ChevronRight,
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
  ArrowLeft,
  User,
} from "lucide-react";
import { InstagramMediaCarousel } from "./instagram-media-carousel";
import type { FeedItem } from "./instagram-post";

interface InstagramPostModalProps {
  item: FeedItem | null;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  hasPrev: boolean;
  hasNext: boolean;
}

export function InstagramPostModal({
  item,
  onClose,
  onPrev,
  onNext,
  hasPrev,
  hasNext,
}: InstagramPostModalProps) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(142);
  const [bookmarked, setBookmarked] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);

  // Reset state when active item changes
  useEffect(() => {
    if (item) {
      setLiked(false);
      setLikeCount(128 + Math.floor(Math.random() * 50));
      setBookmarked(false);
      setComments([]);
      setCommentText("");
      setCopied(false);
    }
  }, [item]);

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft" && hasPrev) onPrev();
      if (e.key === "ArrowRight" && hasNext) onNext();
    },
    [onClose, onPrev, onNext, hasPrev, hasNext]
  );

  useEffect(() => {
    if (!item) return;
    window.addEventListener("keydown", handleKeyDown);
    // Lock body scroll
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [item, handleKeyDown]);

  if (!item) return null;

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

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-0 sm:p-4 md:p-6"
        onClick={onClose}
      >
        {/* Close Button Top Right */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3 right-3 sm:top-5 sm:right-5 p-2 rounded-full bg-black/50 text-white/80 hover:text-white hover:bg-black/80 transition-colors z-50"
          aria-label="Đóng"
        >
          <X className="w-6 h-6" strokeWidth={1.75} />
        </button>

        {/* Prev / Next Buttons (Desktop) */}
        {hasPrev && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onPrev();
            }}
            className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/60 text-white hover:bg-black/90 transition-transform active:scale-95 z-50"
            aria-label="Bài trước"
          >
            <ChevronLeft className="w-6 h-6" strokeWidth={2} />
          </button>
        )}

        {hasNext && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onNext();
            }}
            className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/60 text-white hover:bg-black/90 transition-transform active:scale-95 z-50"
            aria-label="Bài kế tiếp"
          >
            <ChevronRight className="w-6 h-6" strokeWidth={2} />
          </button>
        )}

        {/* Main Modal Dialog */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full h-full sm:h-auto sm:max-h-[90vh] sm:max-w-4xl lg:max-w-5xl bg-white dark:bg-slate-900 sm:rounded-2xl overflow-hidden shadow-2xl flex flex-col"
        >
          {/* ── MOBILE LAYOUT (Single scrollable container) ── */}
          <div className="flex sm:hidden flex-col h-full overflow-y-auto">
            {/* Mobile Header: Back Button + School / Issuer Name + Tagged @minhdev + Close */}
            <div className="p-3 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between sticky top-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur z-20">
              <div className="flex items-center gap-2 min-w-0">
                {/* Nút Quay lại */}
                <button
                  type="button"
                  onClick={onClose}
                  className="flex items-center gap-1 text-slate-800 dark:text-slate-200 hover:text-slate-950 dark:hover:text-white py-1 pr-2 rounded transition-colors shrink-0"
                  aria-label="Quay lại"
                >
                  <ArrowLeft className="w-5 h-5" strokeWidth={1.75} />
                  <span className="text-xs font-semibold">Quay lại</span>
                </button>

                <div className="h-4 w-px bg-slate-200 dark:bg-slate-700 mx-0.5 shrink-0" />

                {item.logo ? (
                  <div className="w-7 h-7 rounded-full border border-slate-200 dark:border-slate-700 bg-white p-0.5 shrink-0 flex items-center justify-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={item.logo} alt="" className="w-full h-full object-contain" />
                  </div>
                ) : (
                  <div className="w-7 h-7 rounded-full border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                    {item.type === "education" ? (
                      <GraduationCap className="w-3.5 h-3.5 text-slate-700 dark:text-slate-300" strokeWidth={1.5} />
                    ) : (
                      <Award className="w-3.5 h-3.5 text-slate-700 dark:text-slate-300" strokeWidth={1.5} />
                    )}
                  </div>
                )}
                <div className="min-w-0">
                  <p className="font-bold text-xs text-slate-900 dark:text-white truncate">
                    {item.subtitle}
                  </p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
                    <span>{item.type === "education" ? "edu" : "cert"}</span>
                    <span>•</span>
                    <span className="inline-flex items-center gap-0.5 font-medium text-slate-700 dark:text-slate-300">
                      <User className="w-2.5 h-2.5" strokeWidth={1.5} />
                      @minhdev
                    </span>
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="p-1.5 text-slate-500 hover:text-slate-900 dark:hover:text-white"
                aria-label="Đóng"
              >
                <X className="w-5 h-5" strokeWidth={1.5} />
              </button>
            </div>

            {/* Mobile Media Carousel */}
            <div className="bg-white dark:bg-slate-950 flex items-center justify-center">
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

            {/* Mobile Actions Bar */}
            <div className="p-3.5 space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-slate-900 dark:text-white">
                  <button
                    type="button"
                    onClick={handleLikeToggle}
                    className="focus:outline-none transition-transform active:scale-125"
                  >
                    <Heart
                      className={`w-6 h-6 transition-colors ${
                        liked ? "text-rose-500 fill-rose-500" : ""
                      }`}
                      strokeWidth={1.5}
                    />
                  </button>
                  <button
                    type="button"
                    onClick={() => document.getElementById("modal-comment-input-mobile")?.focus()}
                  >
                    <MessageCircle className="w-6 h-6" strokeWidth={1.5} />
                  </button>
                  <button type="button" onClick={handleShare}>
                    {copied ? <Check className="w-6 h-6 text-emerald-500" /> : <Send className="w-6 h-6" strokeWidth={1.5} />}
                  </button>
                </div>
                <button type="button" onClick={() => setBookmarked(!bookmarked)}>
                  <Bookmark
                    className={`w-6 h-6 ${bookmarked ? "text-amber-500 fill-amber-500" : ""}`}
                    strokeWidth={1.5}
                  />
                </button>
              </div>

              <p className="text-xs font-bold text-slate-900 dark:text-white">
                {likeCount.toLocaleString()} lượt thích
                {copied && <span className="text-emerald-500 ml-2 font-normal">Đã sao chép!</span>}
              </p>

              {/* Title & Description */}
              <div className="text-xs text-slate-800 dark:text-slate-200 space-y-1">
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  {item.title}
                </h3>
                {item.description && (
                  <p className="text-slate-600 dark:text-slate-300 whitespace-pre-line leading-relaxed">
                    {item.description}
                  </p>
                )}
              </div>

              {/* Badges */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {item.degree && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700 text-[11px] font-medium text-slate-700 dark:text-slate-300">
                    <GraduationCap className="w-3 h-3" strokeWidth={1.5} />
                    {item.degree}
                  </span>
                )}
                {item.major && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700 text-[11px] font-medium text-slate-700 dark:text-slate-300">
                    {item.major}
                  </span>
                )}
                {/* Gắn thẻ tôi: @minhdev */}
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded border border-slate-300 dark:border-slate-700 text-[11px] font-medium text-slate-700 dark:text-slate-300">
                  <User className="w-3 h-3" strokeWidth={1.5} />
                  @minhdev
                </span>
                {item.gpa && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700 text-[11px] font-semibold text-slate-800 dark:text-slate-200">
                    GPA: {item.gpa}
                  </span>
                )}
                {item.score && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700 text-[11px] font-semibold text-slate-800 dark:text-slate-200">
                    <Award className="w-3 h-3" strokeWidth={1.5} />
                    Score: {item.score}
                  </span>
                )}
                {item.url && (
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded border border-slate-300 dark:border-slate-600 text-[11px] font-bold text-slate-900 dark:text-white hover:underline"
                  >
                    <ExternalLink className="w-3 h-3" strokeWidth={1.5} />
                    Verify
                  </a>
                )}
              </div>

              {/* Tags */}
              {item.tags && item.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {item.tags.map((tag, idx) => (
                    <span key={idx} className="text-xs text-slate-500 dark:text-slate-400">
                      #{tag.replace(/^#/, "")}
                    </span>
                  ))}
                </div>
              )}

              {/* Comments */}
              {comments.length > 0 && (
                <div className="space-y-1 pt-2 border-t border-slate-100 dark:border-slate-800">
                  {comments.map((c, idx) => (
                    <p key={idx} className="text-xs text-slate-700 dark:text-slate-300">
                      <span className="font-bold mr-1">guest:</span>
                      {c}
                    </p>
                  ))}
                </div>
              )}

              {/* Comment Input */}
              <form onSubmit={handleAddComment} className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <Smile className="w-4 h-4 text-slate-400 shrink-0" strokeWidth={1.5} />
                <input
                  id="modal-comment-input-mobile"
                  type="text"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Thêm bình luận..."
                  className="w-full bg-transparent text-xs text-slate-900 dark:text-white placeholder-slate-400 outline-none"
                />
                {commentText.trim() && (
                  <button type="submit" className="text-xs font-bold text-slate-900 dark:text-white shrink-0">
                    Đăng
                  </button>
                )}
              </form>
            </div>
          </div>

          {/* ── DESKTOP LAYOUT (2-Column Grid) ── */}
          <div className="hidden sm:grid sm:grid-cols-12 h-full max-h-[90vh]">
            {/* Left Column: Media Carousel */}
            <div className="col-span-7 bg-white dark:bg-slate-950 flex items-center justify-center overflow-hidden border-r border-slate-200 dark:border-slate-800">
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

            {/* Right Column: Post Details */}
            <div className="col-span-5 flex flex-col justify-between bg-white dark:bg-slate-900">
              {/* Header: Institution / School Name */}
              <div className="p-3.5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2.5 min-w-0">
                  {/* Nút Quay lại trên desktop */}
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex items-center gap-1 text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white py-1 px-2.5 rounded border border-slate-200 dark:border-slate-700 text-xs font-semibold mr-1 transition-colors shrink-0"
                    aria-label="Quay lại"
                  >
                    <ArrowLeft className="w-4 h-4" strokeWidth={1.75} />
                    <span>Quay lại</span>
                  </button>

                  {item.logo ? (
                    <div className="w-9 h-9 rounded-full border border-slate-200 dark:border-slate-700 bg-white p-0.5 shrink-0 flex items-center justify-center">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={item.logo} alt="" className="w-full h-full object-contain" />
                    </div>
                  ) : (
                    <div className="w-9 h-9 rounded-full border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                      {item.type === "education" ? (
                        <GraduationCap className="w-4 h-4 text-slate-700 dark:text-slate-300" strokeWidth={1.5} />
                      ) : (
                        <Award className="w-4 h-4 text-slate-700 dark:text-slate-300" strokeWidth={1.5} />
                      )}
                    </div>
                  )}
                  <div className="min-w-0">
                    <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white truncate">
                      {item.subtitle}
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5 flex-wrap">
                      <span>{item.type === "education" ? "edu" : "cert"}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-400" strokeWidth={1.5} />
                        {item.date}
                      </span>
                      <span>•</span>
                      <span className="inline-flex items-center gap-0.5 text-slate-700 dark:text-slate-300 font-medium">
                        <User className="w-3 h-3" strokeWidth={1.5} />
                        @minhdev
                      </span>
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={onClose}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                  aria-label="Đóng"
                >
                  <X className="w-5 h-5" strokeWidth={1.5} />
                </button>
              </div>

              {/* Scrollable Body */}
              <div className="p-4 flex-1 overflow-y-auto space-y-3 text-xs sm:text-sm no-scrollbar">
                <div>
                  <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white leading-snug">
                    {item.title}
                  </h3>
                </div>

                {/* Outline Badges */}
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
                {item.description && (
                  <div className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line bg-slate-50 dark:bg-slate-800/40 p-3 rounded-lg border border-slate-100 dark:border-slate-800">
                    {item.description}
                  </div>
                )}

                {/* Tags */}
                {item.tags && item.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {item.tags.map((tag, idx) => (
                      <span key={idx} className="text-xs text-slate-500 dark:text-slate-400 hover:underline cursor-pointer">
                        #{tag.replace(/^#/, "")}
                      </span>
                    ))}
                  </div>
                )}

                {/* Comments List */}
                {comments.length > 0 && (
                  <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800">
                    {comments.map((c, idx) => (
                      <div key={idx} className="text-xs text-slate-800 dark:text-slate-200 flex items-start gap-1.5">
                        <span className="font-bold text-slate-900 dark:text-white">guest:</span>
                        <span className="flex-1">{c}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Action Bar & Comment Input */}
              <div className="border-t border-slate-100 dark:border-slate-800 p-3.5 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3.5 text-slate-900 dark:text-white">
                    <button
                      type="button"
                      onClick={handleLikeToggle}
                      className="focus:outline-none transition-transform active:scale-125"
                    >
                      <Heart
                        className={`w-5 h-5 transition-colors ${liked ? "text-rose-500 fill-rose-500" : ""}`}
                        strokeWidth={1.5}
                      />
                    </button>
                    <button
                      type="button"
                      onClick={() => document.getElementById("modal-comment-input-desktop")?.focus()}
                    >
                      <MessageCircle className="w-5 h-5" strokeWidth={1.5} />
                    </button>
                    <button type="button" onClick={handleShare}>
                      {copied ? <Check className="w-5 h-5 text-emerald-500" /> : <Send className="w-5 h-5" strokeWidth={1.5} />}
                    </button>
                  </div>
                  <button type="button" onClick={() => setBookmarked(!bookmarked)}>
                    <Bookmark
                      className={`w-5 h-5 ${bookmarked ? "text-amber-500 fill-amber-500" : ""}`}
                      strokeWidth={1.5}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between text-xs font-bold text-slate-900 dark:text-white">
                  <span>{likeCount.toLocaleString()} lượt thích</span>
                  {copied && <span className="text-emerald-500 text-[11px]">Đã sao chép liên kết!</span>}
                </div>

                <form onSubmit={handleAddComment} className="flex items-center gap-2 pt-1 border-t border-slate-100 dark:border-slate-800">
                  <Smile className="w-4 h-4 text-slate-400 shrink-0" strokeWidth={1.5} />
                  <input
                    id="modal-comment-input-desktop"
                    type="text"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Thêm bình luận..."
                    className="w-full bg-transparent text-xs text-slate-900 dark:text-white placeholder-slate-400 outline-none"
                  />
                  {commentText.trim() && (
                    <button type="submit" className="text-xs font-bold text-slate-900 dark:text-white shrink-0">
                      Đăng
                    </button>
                  )}
                </form>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
