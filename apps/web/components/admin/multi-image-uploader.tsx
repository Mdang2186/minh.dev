"use client";

import { useState, useRef, useMemo } from "react";
import { Upload, X, GripVertical, Image as ImageIcon } from "lucide-react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface MultiImageUploaderProps {
  label: string;
  images: string[];
  onChangeImages: (images: string[]) => void;
  uploadType: "education" | "certification";
}

function SortableImageItem({ 
  url, 
  id,
  removeImage 
}: { 
  url: string,
  id: string,
  removeImage: (url: string) => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
  const style = { transform: CSS.Transform.toString(transform), transition };

  return (
    <div ref={setNodeRef} style={style} className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-2 shadow-sm relative z-10 w-full group">
      <div 
        {...attributes} 
        {...listeners}
        className="cursor-grab p-1 text-slate-400 hover:text-cyan-600 active:cursor-grabbing touch-none shrink-0"
      >
        <GripVertical className="h-5 w-5" />
      </div>
      
      <div className="relative h-20 w-32 shrink-0 overflow-hidden rounded-lg border border-slate-100 bg-slate-100 flex items-center justify-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={url} alt="Uploaded image" className="max-h-full max-w-full object-cover pointer-events-none" />
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="text-xs text-slate-500 truncate mt-1 px-1" title={url}>
          {url.split('/').pop()}
        </div>
      </div>

      <button
        type="button"
        onClick={() => removeImage(url)}
        className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-500 transition-colors shrink-0 opacity-0 group-hover:opacity-100"
        title="Xoá ảnh"
      >
        <X className="h-5 w-5" />
      </button>
    </div>
  );
}

export function MultiImageUploader({ label, images, onChangeImages, uploadType }: MultiImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const safeImages = Array.isArray(images) ? images : [];
  const itemsWithIds = useMemo(() => safeImages.map((url, i) => ({ id: `${url}-${i}`, url })), [safeImages]);

  const sensors = useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }));

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = itemsWithIds.findIndex((i) => i.id === active.id);
      const newIndex = itemsWithIds.findIndex((i) => i.id === over.id);
      const newArray = arrayMove(safeImages, oldIndex, newIndex);
      onChangeImages(newArray);
    }
  };

  const processFiles = async (files: File[]) => {
    if (files.length === 0) return;
    setUploading(true);
    const newUploaded: string[] = [];

    try {
      await Promise.all(files.map(async (file) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("type", uploadType);
        const response = await fetch("/api/admin/files", { method: "POST", body: formData });
        if (!response.ok) throw new Error("Upload failed");
        const data = await response.json();
        newUploaded.push(data.url);
      }));

      onChangeImages([...safeImages, ...newUploaded]);
    } catch (error) {
      alert("Không thể tải ảnh lên. Vui lòng thử lại.");
    } finally {
      setUploading(false);
      setIsDraggingOver(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleUploadClick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    processFiles(files);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(false);
    if (uploading) return;
    const files = Array.from(e.dataTransfer.files).filter(file => file.type.startsWith('image/'));
    processFiles(files);
  };

  const removeImage = (urlToRemove: string) => {
    onChangeImages(safeImages.filter(url => url !== urlToRemove));
  };

  return (
    <div className="space-y-3 w-full">
      <div className="flex items-center justify-between">
        <span className="text-sm font-bold text-slate-700">{label}</span>
      </div>

      <div className="flex flex-col border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm">
        <div className="flex items-center justify-between gap-3 bg-slate-50 p-3 border-b border-slate-200">
           <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
             {safeImages.length} Ảnh
           </div>
           <div className="flex items-center gap-2">
            <input type="file" accept="image/*" multiple className="hidden" ref={fileInputRef} onChange={handleUploadClick} disabled={uploading} />
            <button type="button" onClick={() => fileInputRef.current?.click()} disabled={uploading} className="inline-flex items-center gap-1.5 rounded-lg bg-cyan-500 px-3 py-1.5 text-xs font-bold text-white transition hover:bg-cyan-600 disabled:opacity-50 shadow-sm">
              <Upload className="h-3.5 w-3.5" /> {uploading ? "Đang tải..." : "Thêm ảnh"}
            </button>
          </div>
        </div>

        <div 
          className={`transition-colors min-h-[150px] ${isDraggingOver ? 'bg-cyan-50/50 border-cyan-500 border-2 border-dashed m-1 rounded-lg' : 'bg-white'} p-4`}
          onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); setIsDraggingOver(true); }}
          onDragLeave={(e) => { e.preventDefault(); e.stopPropagation(); setIsDraggingOver(false); }}
          onDrop={handleDrop}
        >
          {safeImages.length === 0 ? (
            <div className="h-full min-h-[120px] flex flex-col items-center justify-center gap-2 text-slate-400 pointer-events-none">
              <div className="h-10 w-10 rounded-full bg-slate-50 flex items-center justify-center mb-1">
                <ImageIcon className="h-5 w-5 opacity-50" />
              </div>
              <p className="text-sm font-medium">Chưa có ảnh nào</p>
              <p className="text-xs">Kéo thả ảnh vào đây để tải lên</p>
            </div>
          ) : (
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={itemsWithIds.map(i => i.id)} strategy={verticalListSortingStrategy}>
                <div className="space-y-2">
                  {itemsWithIds.map((item) => (
                    <SortableImageItem key={item.id} id={item.id} url={item.url} removeImage={removeImage} />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          )}
        </div>
      </div>
    </div>
  );
}
