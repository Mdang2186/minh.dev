"use client";

import { useEffect, useState, useCallback } from "react";
import {
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
  User,
} from "lucide-react";
import { InstagramMediaCarousel } from "./instagram-media-carousel";
import type { FeedItem } from "./instagram-post";

interface InstagramPostDetailViewProps {
  item: FeedItem;
  allItems?: FeedItem[];
  onBack: () => void;
  onPrev: () => void;
  onNext: () => void;
  hasPrev: boolean;
  hasNext: boolean;
  postIndex: number;
  totalPosts: number;
}

/**
 * Single post card rendered inside the mobile continuous feed
 */
function MobileFeedPostItem({
  item,
  index,
}: {
  item: FeedItem;
  index: number;
}) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(140 + index * 17);
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

  return (
    <div
      id={`mobile-post-${index}`}
      className="bg-white dark:bg-slate-900 w-full overflow-hidden pb-8 mb-4 border-b border-slate-100/80 dark:border-slate-800/60 last:border-b-0"
    >
      {/* Author row */}
      <div className="px-3.5 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5 min-w-0">
          {item.logo ? (
            <div className="w-9 h-9 rounded-full bg-white p-0.5 shrink-0 flex items-center justify-center shadow-sm">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.logo} alt="" className="w-full h-full object-contain" />
            </div>
          ) : (
            <div className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
              {item.type === "education" ? (
                <GraduationCap className="w-4 h-4 text-slate-700 dark:text-slate-300" strokeWidth={1.5} />
              ) : (
                <Award className="w-4 h-4 text-slate-700 dark:text-slate-300" strokeWidth={1.5} />
              )}
            </div>
          )}

          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white truncate">
                {item.subtitle}
              </span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                {item.type === "education" ? "edu" : "cert"}
              </span>
            </div>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 flex items-center gap-1">
              <span>{item.date}</span>
              <span>•</span>
              <span className="inline-flex items-center gap-0.5 font-medium text-slate-700 dark:text-slate-300">
                <User className="w-2.5 h-2.5" strokeWidth={1.5} />
                @minhdev
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Khung chứa ảnh: NỀN MÀU TRẮNG */}
      <div className="bg-white dark:bg-slate-950 relative">
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

      {/* Action bar & Content: Tối giản */}
      <div className="p-3.5 space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-slate-900 dark:text-white">
            <button
              type="button"
              onClick={handleLikeToggle}
              className="focus:outline-none transition-transform active:scale-125"
              aria-label="Thích"
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
              onClick={() => document.getElementById(`comment-input-${index}`)?.focus()}
              aria-label="Bình luận"
            >
              <MessageCircle className="w-6 h-6" strokeWidth={1.5} />
            </button>
            <button type="button" onClick={handleShare} aria-label="Chia sẻ">
              {copied ? <Check className="w-6 h-6 text-emerald-500" /> : <Send className="w-6 h-6" strokeWidth={1.5} />}
            </button>
          </div>

          <button type="button" onClick={() => setBookmarked(!bookmarked)} aria-label="Lưu">
            <Bookmark
              className={`w-6 h-6 ${bookmarked ? "text-amber-500 fill-amber-500" : ""}`}
              strokeWidth={1.5}
            />
          </button>
        </div>

        {/* Lượt thích */}
        <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
          {likeCount.toLocaleString()} lượt thích
          {copied && <span className="text-emerald-500 ml-2 font-normal">Đã sao chép liên kết!</span>}
        </p>

        {/* Tiêu đề & Mô tả */}
        <div className="space-y-1">
          <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
            {item.title}
          </h3>
          {item.description && (
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 whitespace-pre-line leading-relaxed">
              {item.description}
            </p>
          )}
        </div>

        {/* Badges tối giản: nền dịu nhẹ */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {item.degree && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-[11px] font-medium text-slate-700 dark:text-slate-300">
              <GraduationCap className="w-3 h-3" strokeWidth={1.5} />
              {item.degree}
            </span>
          )}
          {item.major && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-[11px] font-medium text-slate-700 dark:text-slate-300">
              {item.major}
            </span>
          )}
          {/* Gắn thẻ tôi: @minhdev */}
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-[11px] font-medium text-slate-700 dark:text-slate-300">
            <User className="w-3 h-3" strokeWidth={1.5} />
            @minhdev
          </span>
          {item.gpa && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-[11px] font-bold text-slate-800 dark:text-slate-200">
              GPA: {item.gpa}
            </span>
          )}
          {item.score && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-[11px] font-bold text-slate-800 dark:text-slate-200">
              <Award className="w-3 h-3" strokeWidth={1.5} />
              Score: {item.score}
            </span>
          )}
          {item.url && (
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-[11px] font-bold text-slate-900 dark:text-white transition-colors"
            >
              <ExternalLink className="w-3 h-3" strokeWidth={1.5} /> Verify
            </a>
          )}
        </div>

        {/* Hashtags: Màu xanh chuẩn mạng xã hội / portfolio brand */}
        {item.tags && item.tags.length > 0 && (
          <div className="flex flex-wrap gap-x-2 gap-y-1 pt-1">
            {item.tags.map((tag, tIdx) => (
              <span
                key={tIdx}
                className="text-xs font-semibold text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300 hover:underline cursor-pointer transition-colors"
              >
                #{tag.replace(/^#/, "")}
              </span>
            ))}
          </div>
        )}

        {/* Comments List */}
        {comments.length > 0 && (
          <div className="space-y-1 pt-2">
            {comments.map((c, cIdx) => (
              <p key={cIdx} className="text-xs text-slate-700 dark:text-slate-300">
                <span className="font-bold mr-1">guest:</span>
                {c}
              </p>
            ))}
          </div>
        )}

        {/* Comment input form */}
        <form onSubmit={handleAddComment} className="flex items-center gap-2 pt-2">
          <Smile className="w-4 h-4 text-slate-400 shrink-0" strokeWidth={1.5} />
          <input
            id={`comment-input-${index}`}
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
  );
}

export function InstagramPostDetailView({
  item,
  allItems,
  onBack,
  onPrev,
  onNext,
  hasPrev,
  hasNext,
  postIndex,
  totalPosts,
}: InstagramPostDetailViewProps) {
  // Desktop post state
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(162 + postIndex * 19);
  const [bookmarked, setBookmarked] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);

  // Scroll to the selected post on mobile on mount or when postIndex changes
  useEffect(() => {
    // Only on mobile screens
    if (typeof window !== "undefined" && window.innerWidth < 1024) {
      const timer = setTimeout(() => {
        const el = document.getElementById(`mobile-post-${postIndex}`);
        if (el) {
          el.scrollIntoView({ behavior: "instant", block: "start" });
        }
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [postIndex]);

  // Reset desktop states when item changes
  useEffect(() => {
    setLiked(false);
    setLikeCount(140 + Math.floor(Math.random() * 40));
    setBookmarked(false);
    setComments([]);
    setCommentText("");
    setCopied(false);
  }, [item.id]);

  // Keyboard navigation on desktop
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onBack();
      if (e.key === "ArrowLeft" && hasPrev) onPrev();
      if (e.key === "ArrowRight" && hasNext) onNext();
    },
    [onBack, onPrev, onNext, hasPrev, hasNext]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

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

  const feedList = allItems && allItems.length > 0 ? allItems : [item];

  return (
    <div className="w-full max-w-full font-sans transition-all pb-12 overflow-x-hidden">
      {/* ── MOBILE TOP NAVIGATION BAR: TỐI GIẢN, NÚT MŨI TÊN, KHÔNG ĐƯỜNG KẺ CHIA KHUNG ── */}
      <div className="lg:hidden sticky top-0 z-30 bg-white/95 dark:bg-slate-950/95 backdrop-blur px-3 py-3 flex items-center justify-between w-full">
        <button
          type="button"
          onClick={onBack}
          className="p-1 text-slate-800 dark:text-white hover:text-cyan-500 transition-colors flex items-center shrink-0"
          aria-label="Quay lại"
        >
          <ChevronLeft className="w-6 h-6 stroke-[2.2]" />
        </button>

        <div className="text-center flex-1">
          <span className="font-bold text-base text-slate-900 dark:text-white tracking-tight">
            Post
          </span>
        </div>

        <div className="w-7 shrink-0" />
      </div>

      {/* ── DESKTOP TOP BAR: NÚT MŨI TÊN, SỐ LƯỢNG, KHÔNG ĐƯỜNG KẺ KHUNG ── */}
      <div className="hidden lg:flex items-center justify-between mb-4 pb-1">
        <button
          type="button"
          onClick={onBack}
          className="p-2 rounded-xl bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shadow-sm flex items-center justify-center"
          title="Quay lại"
          aria-label="Quay lại"
        >
          <ChevronLeft className="w-4 h-4 stroke-[2.2]" />
        </button>

        <div className="flex items-center gap-2.5">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold tabular-nums">
            {postIndex + 1} / {totalPosts}
          </span>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={onPrev}
              disabled={!hasPrev}
              className="p-1.5 rounded-lg bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Bài trước"
              aria-label="Bài trước"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={onNext}
              disabled={!hasNext}
              className="p-1.5 rounded-lg bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Bài tiếp theo"
              aria-label="Bài tiếp theo"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* ── MOBILE POST VIEW: CUỘN DANH SÁCH LIÊN TỤC CHUẨN INSTAGRAM (HIỂN THỊ LUÔN CÁC BÀI TIẾP THEO) ── */}
      <div className="lg:hidden space-y-2">
        {feedList.map((postItem, idx) => (
          <MobileFeedPostItem key={postItem.id} item={postItem} index={idx} />
        ))}

        {/* Chân danh sách: Tinh gọn */}
        <div className="py-8 text-center text-slate-400 dark:text-slate-500 text-xs space-y-1">
          <p className="font-semibold">Bạn đã xem hết các bài viết</p>
          <button
            type="button"
            onClick={onBack}
            className="text-xs text-cyan-600 dark:text-cyan-400 font-medium hover:underline mt-1 inline-block"
          >
            Quay lại lưới ảnh
          </button>
        </div>
      </div>

      {/* ── DESKTOP POST VIEW: 2 CỘT RỘNG RÃI, NỀN TRẮNG, TỐI GIẢN LIỀN MẠCH ── */}
      <div className="hidden lg:grid lg:grid-cols-12 rounded-2xl bg-white dark:bg-slate-900 shadow-sm overflow-hidden min-h-[580px]">
        {/* Left 7 cols: Media Carousel (NỀN TRẮNG) */}
        <div className="col-span-7 bg-white dark:bg-slate-950 flex items-center justify-center overflow-hidden">
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

        {/* Right 5 cols: Post Details */}
        <div className="col-span-5 flex flex-col justify-between bg-white dark:bg-slate-900 p-6">
          {/* Header */}
          <div className="flex items-center justify-between pb-3">
            <div className="flex items-center gap-3 min-w-0">
              {item.logo ? (
                <div className="w-10 h-10 rounded-full bg-white p-0.5 shrink-0 flex items-center justify-center shadow-sm">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={item.logo} alt="" className="w-full h-full object-contain" />
                </div>
              ) : (
                <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                  {item.type === "education" ? (
                    <GraduationCap className="w-5 h-5 text-slate-700 dark:text-slate-300" strokeWidth={1.5} />
                  ) : (
                    <Award className="w-5 h-5 text-slate-700 dark:text-slate-300" strokeWidth={1.5} />
                  )}
                </div>
              )}
              <div className="min-w-0">
                <h4 className="font-bold text-sm text-slate-900 dark:text-white truncate">
                  {item.subtitle}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mt-0.5">
                  <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[10px] font-semibold text-slate-700 dark:text-slate-300">
                    {item.type === "education" ? "edu" : "cert"}
                  </span>
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
          </div>

          {/* Scrollable Body */}
          <div className="flex-1 overflow-y-auto space-y-3.5 text-xs sm:text-sm no-scrollbar py-2">
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white leading-snug">
                {item.title}
              </h3>
            </div>

            {/* Badges: Nền dịu nhẹ */}
            <div className="flex flex-wrap gap-1.5">
              {item.degree && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-[11px] font-medium text-slate-700 dark:text-slate-300">
                  <GraduationCap className="w-3 h-3" strokeWidth={1.5} />
                  {item.degree}
                </span>
              )}
              {item.major && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-[11px] font-medium text-slate-700 dark:text-slate-300">
                  {item.major}
                </span>
              )}
              {/* Gắn thẻ tôi: @minhdev */}
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-[11px] font-medium text-slate-700 dark:text-slate-300">
                <User className="w-3 h-3" strokeWidth={1.5} />
                @minhdev
              </span>
              {item.gpa && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-[11px] font-bold text-slate-800 dark:text-slate-200">
                  GPA: {item.gpa}
                </span>
              )}
              {item.score && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-[11px] font-bold text-slate-800 dark:text-slate-200">
                  <Award className="w-3 h-3" strokeWidth={1.5} />
                  Score: {item.score}
                </span>
              )}
              {item.url && (
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-[11px] font-bold text-slate-900 dark:text-white transition-colors"
                >
                  <ExternalLink className="w-3 h-3" strokeWidth={1.5} />
                  Verify
                </a>
              )}
            </div>

            {/* Description */}
            {item.description && (
              <div className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line bg-slate-50 dark:bg-slate-800/40 p-3 rounded-xl">
                {item.description}
              </div>
            )}

            {/* Tags: Màu xanh chuẩn mạng xã hội / portfolio brand */}
            {item.tags && item.tags.length > 0 && (
              <div className="flex flex-wrap gap-x-2 gap-y-1 pt-1">
                {item.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="text-xs font-semibold text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300 hover:underline cursor-pointer transition-colors"
                  >
                    #{tag.replace(/^#/, "")}
                  </span>
                ))}
              </div>
            )}

            {/* Comments List */}
            {comments.length > 0 && (
              <div className="space-y-1.5 pt-2">
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
          <div className="pt-3 space-y-2.5">
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
                  onClick={() => document.getElementById("post-detail-comment-input-desktop")?.focus()}
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

            <form onSubmit={handleAddComment} className="flex items-center gap-2 pt-1">
              <Smile className="w-4 h-4 text-slate-400 shrink-0" strokeWidth={1.5} />
              <input
                id="post-detail-comment-input-desktop"
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
    </div>
  );
}
