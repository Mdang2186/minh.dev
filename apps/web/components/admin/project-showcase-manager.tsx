"use client";

import { useState, useRef } from "react";
import {
  Sparkles,
  UploadCloud,
  X,
  Plus,
  ArrowLeft,
  ArrowRight,
  Check,
  Image as ImageIcon,
  Star,
  Layers,
} from "lucide-react";
import type { ProjectImage } from "./project-image-uploader";

interface ProjectShowcaseManagerProps {
  coverImage: string;
  showcaseImages: string[];
  projectImages: ProjectImage[];
  onChangeCover: (url: string) => void;
  onChangeShowcaseImages: (urls: string[]) => void;
}

export function ProjectShowcaseManager({
  coverImage,
  showcaseImages,
  projectImages,
  onChangeCover,
  onChangeShowcaseImages,
}: ProjectShowcaseManagerProps) {
  const [uploading, setUploading] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Chuẩn hoá mảng 4 ô thumbnails (luôn có tối đa 4 slot)
  const currentSlots = [0, 1, 2, 3].map((i) => showcaseImages[i] || "");

  // Cập nhật 1 ô cụ thể
  const updateSlot = (index: number, url: string) => {
    const newSlots = [...currentSlots];
    newSlots[index] = url;
    onChangeShowcaseImages(newSlots.filter(Boolean).slice(0, 4));
  };

  // Xoá 1 ô
  const removeSlot = (index: number) => {
    const newSlots = [...currentSlots];
    newSlots.splice(index, 1);
    onChangeShowcaseImages(newSlots.filter(Boolean));
  };

  // Đổi chỗ 2 ô (Reorder)
  const moveSlot = (index: number, direction: "left" | "right") => {
    const targetIndex = direction === "left" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= 4) return;
    const newSlots = [...currentSlots];
    const temp = newSlots[index];
    newSlots[index] = newSlots[targetIndex];
    newSlots[targetIndex] = temp;
    onChangeShowcaseImages(newSlots.filter(Boolean));
  };

  // Thêm 1 ảnh vào ô trống đầu tiên hoặc ô đang chọn
  const assignImageToSlot = (url: string) => {
    if (selectedSlot !== null) {
      updateSlot(selectedSlot, url);
      setSelectedSlot(null);
      return;
    }
    const emptyIndex = currentSlots.findIndex((s) => !s);
    if (emptyIndex !== -1) {
      updateSlot(emptyIndex, url);
    } else {
      // Nếu đã đầy cả 4 ô thì thay ô thứ 4
      updateSlot(3, url);
    }
  };

  // Upload ảnh mới trực tiếp
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", "project");

    try {
      const res = await fetch("/api/admin/files", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (res.ok && data.url) {
        if (selectedSlot !== null) {
          updateSlot(selectedSlot, data.url);
          setSelectedSlot(null);
        } else {
          assignImageToSlot(data.url);
        }
      } else {
        alert(data.error || "Tải ảnh thất bại");
      }
    } catch {
      alert("Lỗi khi tải ảnh lên.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div className="rounded-2xl border-2 border-cyan-500/30 bg-gradient-to-br from-cyan-50/40 via-white to-blue-50/30 dark:from-slate-900/60 dark:to-slate-800/40 p-5 sm:p-6 shadow-sm space-y-6">
      {/* Tiêu đề mục Showcase */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-cyan-100 dark:border-slate-800 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-cyan-500 text-white shadow-md shadow-cyan-500/20">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
              Cấu hình Showcase Gallery (Trang /projects)
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
              Tuỳ chỉnh 1 ảnh bìa lớn và 4 ảnh nhỏ hiển thị nổi bật trên thẻ dự án. Bấm vào bất kỳ ảnh nào ngoài web sẽ mở phóng to xem ảnh đó, hoàn toàn không làm đổi ảnh bìa.
            </p>
          </div>
        </div>

        {/* Nút upload file nhanh */}
        <div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept="image/*"
            className="hidden"
          />
          <button
            type="button"
            disabled={uploading}
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-200 hover:border-cyan-500 hover:text-cyan-600 transition shadow-xs disabled:opacity-60"
          >
            <UploadCloud className="h-4 w-4" />
            {uploading ? "Đang tải lên..." : "Tải ảnh từ máy"}
          </button>
        </div>
      </div>

      {/* 1. KHUNG ẢNH BÌA CHÍNH (COVER - TỈ LỆ 21/9) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
            <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
            Ảnh bìa chính (Hero Banner - Tỉ lệ 21:9)
          </label>
          {coverImage && (
            <button
              type="button"
              onClick={() => onChangeCover("")}
              className="text-xs text-rose-500 hover:text-rose-700 font-semibold"
            >
              Gỡ ảnh bìa
            </button>
          )}
        </div>

        <div className="relative aspect-[21/9] w-full rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 border-2 border-dashed border-slate-300 dark:border-slate-700 flex items-center justify-center group shadow-inner">
          {coverImage ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={coverImage}
                alt="Showcase Cover"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    const url = prompt("Nhập đường dẫn ảnh bìa:", coverImage);
                    if (url !== null) onChangeCover(url.trim());
                  }}
                  className="px-3 py-1.5 rounded-lg bg-white text-slate-900 text-xs font-bold hover:bg-slate-100 shadow"
                >
                  Sửa link
                </button>
                <button
                  type="button"
                  onClick={() => onChangeCover("")}
                  className="px-3 py-1.5 rounded-lg bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 shadow"
                >
                  Xoá
                </button>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center gap-2 text-slate-400 p-4 text-center">
              <ImageIcon className="w-8 h-8 opacity-40" />
              <p className="text-xs sm:text-sm font-medium">
                Chưa có ảnh bìa lớn. Nhấp chọn 1 ảnh ở kho ảnh bên dưới để đặt làm bìa.
              </p>
            </div>
          )}
        </div>

        {/* Input nhập link trực tiếp */}
        <input
          type="text"
          value={coverImage}
          onChange={(e) => onChangeCover(e.target.value)}
          placeholder="Hoặc nhập đường dẫn ảnh bìa (VD: /projects/MotorShop/Ảnh.png)..."
          className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3.5 py-2 text-xs text-slate-700 dark:text-slate-200 outline-none focus:border-cyan-500 font-mono"
        />
      </div>

      {/* 2. HÀNG 4 ẢNH NHỎ (SHOWCASE THUMBNAILS - TỈ LỆ 16/10) */}
      <div className="space-y-2 pt-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
          <div>
            <label className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-cyan-500" />
              4 ảnh nhỏ bên dưới (Showcase Thumbnails - Tỉ lệ 16:10)
            </label>
            <p className="text-[11px] text-slate-400 font-normal">
              Bấm vào ảnh trên web sẽ mở phóng to xem ảnh đó, không thay thế ảnh bìa chính.
            </p>
          </div>
          <span className="text-xs font-semibold text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md self-start sm:self-auto">
            {showcaseImages.filter(Boolean).length}/4 ô đã chọn
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
          {[0, 1, 2, 3].map((slotIndex) => {
            const url = currentSlots[slotIndex];
            const isSelected = selectedSlot === slotIndex;

            return (
              <div
                key={slotIndex}
                className={`relative aspect-[16/10] rounded-xl overflow-hidden border-2 transition-all flex flex-col items-center justify-center group ${
                  url
                    ? "border-cyan-500/70 bg-slate-100 dark:bg-slate-800 shadow-sm"
                    : isSelected
                    ? "border-cyan-500 ring-2 ring-cyan-500/30 bg-cyan-50/50 dark:bg-slate-800/80"
                    : "border-dashed border-slate-300 dark:border-slate-700 bg-white/70 dark:bg-slate-800/50 hover:border-cyan-400"
                }`}
              >
                {/* Số thứ tự ô */}
                <span className="absolute top-1.5 left-1.5 z-20 px-1.5 py-0.5 rounded-md bg-slate-900/80 text-white text-[10px] font-black">
                  #{slotIndex + 1}
                </span>

                {url ? (
                  <>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={url}
                      alt={`Slot ${slotIndex + 1}`}
                      className="w-full h-full object-cover"
                    />

                    {/* Overlay điều khiển */}
                    <div className="absolute inset-0 bg-slate-900/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 z-20">
                      {slotIndex > 0 && (
                        <button
                          type="button"
                          onClick={() => moveSlot(slotIndex, "left")}
                          title="Đổi sang trái"
                          className="p-1.5 rounded-lg bg-white/90 text-slate-800 hover:bg-white text-xs"
                        >
                          <ArrowLeft className="w-3.5 h-3.5" />
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => removeSlot(slotIndex)}
                        title="Xoá ảnh khỏi ô này"
                        className="p-1.5 rounded-lg bg-rose-600 text-white hover:bg-rose-700 text-xs"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>

                      {slotIndex < 3 && (
                        <button
                          type="button"
                          onClick={() => moveSlot(slotIndex, "right")}
                          title="Đổi sang phải"
                          className="p-1.5 rounded-lg bg-white/90 text-slate-800 hover:bg-white text-xs"
                        >
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={() =>
                      setSelectedSlot(isSelected ? null : slotIndex)
                    }
                    className="w-full h-full flex flex-col items-center justify-center p-2 text-center text-slate-400 hover:text-cyan-600 transition"
                  >
                    <Plus className="w-5 h-5 mb-1" />
                    <span className="text-[11px] font-bold">
                      {isSelected ? "Chọn ảnh bên dưới..." : `Thêm ô #${slotIndex + 1}`}
                    </span>
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. KHO ẢNH PHỤ CỦA DỰ ÁN (CHỌN NHANH BẰNG 1-CLICK) */}
      {projectImages && projectImages.length > 0 && (
        <div className="space-y-2 pt-2 border-t border-slate-200/60 dark:border-slate-800">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200">
                Kho ảnh phụ của dự án ({projectImages.length} ảnh trong CSDL):
              </span>
              <p className="text-[11px] text-slate-400">
                Toàn bộ ảnh phụ được lưu trữ an toàn trong CSDL. Nhấp nút dưới ảnh để chọn làm Bìa hoặc gán vào 4 ô showcase.
              </p>
            </div>
            <span className="text-[11px] text-cyan-600 dark:text-cyan-400 font-semibold self-start sm:self-auto">
              Nhấp nút dưới ảnh để gán nhanh
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-2.5 max-h-64 overflow-y-auto p-1 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50">
            {projectImages.map((img, i) => {
              const isCover = coverImage === img.imageUrl;
              const isShowcase = showcaseImages.includes(img.imageUrl);

              return (
                <div
                  key={i}
                  className="relative group rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 flex flex-col shadow-2xs"
                >
                  <div className="relative aspect-[16/10] w-full bg-slate-100 dark:bg-slate-900 overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={img.imageUrl}
                      alt={img.altText || `Image ${i + 1}`}
                      className="w-full h-full object-cover"
                    />

                    {/* Tag trạng thái */}
                    <div className="absolute top-1 left-1 flex flex-col gap-0.5">
                      {isCover && (
                        <span className="px-1.5 py-0.5 rounded bg-amber-500 text-white text-[9px] font-black shadow">
                          BÌA
                        </span>
                      )}
                      {isShowcase && (
                        <span className="px-1.5 py-0.5 rounded bg-cyan-600 text-white text-[9px] font-black shadow">
                          Ô #{showcaseImages.indexOf(img.imageUrl) + 1}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* 2 nút thao tác nhanh */}
                  <div className="p-1.5 grid grid-cols-2 gap-1 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-100 dark:border-slate-700">
                    <button
                      type="button"
                      onClick={() => onChangeCover(img.imageUrl)}
                      title="Đặt ảnh này làm ảnh bìa chính"
                      className={`px-1 py-1 rounded text-[10px] font-bold text-center transition ${
                        isCover
                          ? "bg-amber-100 text-amber-800 font-black"
                          : "bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-amber-500 hover:text-white"
                      }`}
                    >
                      {isCover ? "✓ Bìa" : "★ Làm Bìa"}
                    </button>

                    <button
                      type="button"
                      onClick={() => assignImageToSlot(img.imageUrl)}
                      title="Thêm ảnh này vào 4 ô nhỏ showcase"
                      className={`px-1 py-1 rounded text-[10px] font-bold text-center transition ${
                        isShowcase
                          ? "bg-cyan-100 text-cyan-800 font-black"
                          : "bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-cyan-500 hover:text-white"
                      }`}
                    >
                      {isShowcase ? "✓ Có trong ô" : "+ Vào 4 ô"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
