"use client";

import { useState, useRef, useMemo } from "react";
import { Upload, X, GripVertical, Image as ImageIcon, Folder, ChevronRight, Plus, Trash2, Edit2 } from "lucide-react";
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

export type ProjectImage = {
  id?: string;
  imageUrl: string;
  altText: string;
  folder: string;
  sortOrder: number;
};

interface ProjectImageUploaderProps {
  label: string;
  images: ProjectImage[];
  imageFolders: string[];
  onChangeImages: (images: ProjectImage[]) => void;
  onChangeFolders: (folders: string[]) => void;
}

const getImagesWithIds = (images: ProjectImage[]) => 
  images.map((img, i) => ({ ...img, id: img.id || `${img.imageUrl}-${i}` }));

function SortableImageItem({ 
  img, 
  updateImage, 
  removeImage 
}: { 
  img: ProjectImage, 
  updateImage: (id: string, field: string, value: string) => void,
  removeImage: (id: string) => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: img.id! });
  const style = { transform: CSS.Transform.toString(transform), transition };

  return (
    <div ref={setNodeRef} style={style} className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white p-2 shadow-sm relative z-10 min-w-0 w-full">
      <div 
        {...attributes} 
        {...listeners}
        className="cursor-grab p-1 text-slate-400 hover:text-cyan-600 active:cursor-grabbing touch-none"
      >
        <GripVertical className="h-5 w-5" />
      </div>
      
      <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded-md border border-slate-100 bg-slate-100 flex items-center justify-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={img.imageUrl} alt={img.altText || ""} className="max-h-full max-w-full object-cover pointer-events-none" />
      </div>
      
      <div className="flex-1 min-w-0">
        <input
          type="text"
          placeholder="Mô tả ảnh (Alt text)..."
          value={img.altText || ""}
          onChange={(e) => updateImage(img.id!, 'altText', e.target.value)}
          className="w-full min-w-0 rounded-md border border-slate-200 px-3 py-2 text-xs outline-none transition focus:border-cyan-500"
        />
        <div className="text-[10px] text-slate-400 truncate mt-1 px-1" title={img.imageUrl}>
          {img.imageUrl.split('/').pop()}
        </div>
      </div>

      <button
        type="button"
        onClick={() => removeImage(img.id!)}
        className="rounded-md p-2 text-slate-400 hover:bg-red-50 hover:text-red-500 transition-colors shrink-0"
        title="Xoá ảnh"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

export function ProjectImageUploader({ label, images, imageFolders, onChangeImages, onChangeFolders }: ProjectImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [currentPath, setCurrentPath] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const imagesWithIds = useMemo(() => getImagesWithIds(images).sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0)), [images]);
  const currentImages = useMemo(() => imagesWithIds.filter(img => (img.folder || "") === currentPath), [imagesWithIds, currentPath]);
  
  // Calculate subfolders
  const currentSubFolders = useMemo(() => {
    const prefix = currentPath ? `${currentPath}/` : "";
    const subs = new Set<string>();
    
    // Check all imageFolders to see which ones are direct children
    imageFolders.forEach(folder => {
      if (folder.startsWith(prefix) && folder.length > prefix.length) {
        const rest = folder.substring(prefix.length);
        const nextSlashIndex = rest.indexOf('/');
        if (nextSlashIndex === -1) {
          subs.add(folder); // Direct child
        } else {
          subs.add(prefix + rest.substring(0, nextSlashIndex)); // Intermediate child
        }
      }
    });

    // Also check image folders in case an image is uploaded to a folder not explicitly in `imageFolders` array
    images.forEach(img => {
      const f = img.folder || "";
      if (f.startsWith(prefix) && f.length > prefix.length) {
        const rest = f.substring(prefix.length);
        const nextSlashIndex = rest.indexOf('/');
        if (nextSlashIndex === -1) {
          subs.add(f); // Direct child
        } else {
          subs.add(prefix + rest.substring(0, nextSlashIndex)); // Intermediate child
        }
      }
    });

    return Array.from(subs).sort();
  }, [currentPath, imageFolders, images]);

  const sensors = useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }));

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = currentImages.findIndex((i) => i.id === active.id);
      const newIndex = currentImages.findIndex((i) => i.id === over.id);
      
      const newCurrentImages = arrayMove(currentImages, oldIndex, newIndex);
      
      // Merge back
      const newImagesWithIds = [...imagesWithIds];
      const minSortOrder = currentImages.length > 0 ? Math.min(...currentImages.map(img => img.sortOrder || 0)) : 0;
      
      newCurrentImages.forEach((img, i) => {
        img.sortOrder = minSortOrder + i;
        const globalIndex = newImagesWithIds.findIndex(gi => gi.id === img.id);
        if (globalIndex !== -1) newImagesWithIds[globalIndex] = img;
      });

      // Cleanup ID field before passing up
      onChangeImages(newImagesWithIds.map(img => {
        const { id, ...rest } = img;
        return rest;
      }));
    }
  };

  const processFiles = async (files: File[]) => {
    if (files.length === 0) return;
    setUploading(true);
    const newUploaded: ProjectImage[] = [];

    try {
      await Promise.all(files.map(async (file) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("type", "project");
        const response = await fetch("/api/admin/files", { method: "POST", body: formData });
        if (!response.ok) throw new Error("Upload failed");
        const data = await response.json();
        const maxSortOrder = images.length > 0 ? Math.max(...images.map(img => img.sortOrder || 0)) : 0;
        newUploaded.push({ imageUrl: data.url, altText: "", folder: currentPath, sortOrder: maxSortOrder + 1 });
      }));

      const newImages = [...images, ...newUploaded];
      onChangeImages(newImages);
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

  const updateImage = (id: string, field: string, value: string) => {
    const newImages = [...imagesWithIds];
    const index = newImages.findIndex(img => img.id === id);
    if (index !== -1) {
      newImages[index] = { ...newImages[index], [field]: value };
      onChangeImages(newImages.map(img => { const { id, ...rest } = img; return rest; }));
    }
  };

  const removeImage = (id: string) => {
    const newImages = imagesWithIds.filter(img => img.id !== id);
    onChangeImages(newImages.map(img => { const { id, ...rest } = img; return rest; }));
  };

  const handleCreateFolder = () => {
    const name = prompt("Nhập tên thư mục mới:");
    if (!name?.trim()) return;
    const cleanName = name.trim().replace(/\//g, ""); // Prevent slashes in name
    if (!cleanName) return;
    const newPath = currentPath ? `${currentPath}/${cleanName}` : cleanName;
    if (!imageFolders.includes(newPath)) {
      onChangeFolders([...imageFolders, newPath]);
    }
  };

  const handleDeleteFolder = (folderPath: string) => {
    if (!confirm(`Bạn có chắc muốn xoá thư mục "${folderPath}" và toàn bộ dữ liệu bên trong?`)) return;
    
    // Remove all folders that start with this path
    const newFolders = imageFolders.filter(f => f !== folderPath && !f.startsWith(`${folderPath}/`));
    onChangeFolders(newFolders);

    // Remove all images inside this folder or subfolders
    const newImages = images.filter(img => (img.folder || "") !== folderPath && !(img.folder || "").startsWith(`${folderPath}/`));
    onChangeImages(newImages);
  };

  const handleRenameFolder = (folderPath: string) => {
    const folderName = folderPath.split('/').pop();
    const newName = prompt("Nhập tên mới:", folderName);
    if (!newName?.trim() || newName.trim() === folderName) return;
    const cleanName = newName.trim().replace(/\//g, ""); // Prevent slashes
    if (!cleanName) return;

    const basePath = folderPath.substring(0, folderPath.lastIndexOf('/'));
    const newPath = basePath ? `${basePath}/${cleanName}` : cleanName;

    // Update imageFolders
    const newFolders = imageFolders.map(f => {
      if (f === folderPath) return newPath;
      if (f.startsWith(`${folderPath}/`)) return f.replace(`${folderPath}/`, `${newPath}/`);
      return f;
    });
    if (!newFolders.includes(newPath)) newFolders.push(newPath);
    onChangeFolders(newFolders);

    // Update images
    const newImages = images.map(img => {
      const f = img.folder || "";
      if (f === folderPath) return { ...img, folder: newPath };
      if (f.startsWith(`${folderPath}/`)) return { ...img, folder: f.replace(`${folderPath}/`, `${newPath}/`) };
      return img;
    });
    onChangeImages(newImages);
  };

  const breadcrumbs = currentPath ? currentPath.split('/') : [];

  return (
    <div className="space-y-3 md:col-span-2 min-w-0 w-full">
      <div className="flex items-center justify-between">
        <span className="text-sm font-bold text-slate-700">{label}</span>
      </div>

      <div className="flex flex-col border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm">
        {/* Explorer Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-50 p-3 border-b border-slate-200">
          <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar pb-1 w-full sm:w-auto">
            <button 
              type="button" 
              onClick={() => setCurrentPath("")}
              className="text-sm font-bold text-slate-600 hover:text-cyan-600 shrink-0"
            >
              Root
            </button>
            {breadcrumbs.map((crumb, idx) => {
              const path = breadcrumbs.slice(0, idx + 1).join('/');
              return (
                <div key={path} className="flex items-center gap-2 shrink-0">
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                  <button 
                    type="button" 
                    onClick={() => setCurrentPath(path)}
                    className={`text-sm font-bold ${idx === breadcrumbs.length - 1 ? "text-cyan-600" : "text-slate-600 hover:text-cyan-600"}`}
                  >
                    {crumb}
                  </button>
                </div>
              );
            })}
          </div>
          <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-start sm:justify-end">
            <button type="button" onClick={handleCreateFolder} className="inline-flex items-center gap-1.5 rounded-lg bg-white border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition shadow-sm">
              <Plus className="h-3.5 w-3.5" /> Thư mục
            </button>
            <input type="file" accept="image/*" multiple className="hidden" ref={fileInputRef} onChange={handleUploadClick} disabled={uploading} />
            <button type="button" onClick={() => fileInputRef.current?.click()} disabled={uploading} className="inline-flex items-center gap-1.5 rounded-lg bg-cyan-500 px-3 py-1.5 text-xs font-bold text-white transition hover:bg-cyan-600 disabled:opacity-50 shadow-sm">
              <Upload className="h-3.5 w-3.5" /> {uploading ? "Đang tải..." : "Tải ảnh"}
            </button>
          </div>
        </div>

        {/* Explorer Body */}
        <div 
          className={`transition-colors min-h-[300px] ${isDraggingOver ? 'bg-cyan-50/50 border-cyan-500 border-2 border-dashed m-1 rounded-lg' : 'bg-white'} p-4`}
          onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); setIsDraggingOver(true); }}
          onDragLeave={(e) => { e.preventDefault(); e.stopPropagation(); setIsDraggingOver(false); }}
          onDrop={handleDrop}
        >
          {currentSubFolders.length === 0 && currentImages.length === 0 ? (
            <div className="h-full min-h-[250px] flex flex-col items-center justify-center gap-2 text-slate-400">
              <div className="h-12 w-12 rounded-full bg-slate-50 flex items-center justify-center mb-2">
                <Folder className="h-6 w-6 opacity-50" />
              </div>
              <p className="text-sm font-medium">Thư mục trống</p>
              <p className="text-xs">Tạo thư mục mới hoặc kéo thả ảnh vào đây để tải lên</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Render Folders */}
              {currentSubFolders.length > 0 && (
                <div>
                  <h5 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Thư mục</h5>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {currentSubFolders.map(folderPath => {
                      const name = folderPath.split('/').pop();
                      return (
                        <div 
                          key={folderPath} 
                          className="group flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:border-cyan-300 hover:bg-cyan-50/30 cursor-pointer transition-all bg-white shadow-sm hover:shadow-md"
                          onDoubleClick={() => setCurrentPath(folderPath)}
                        >
                          <div className="flex items-center gap-3 overflow-hidden flex-1" onClick={() => setCurrentPath(folderPath)}>
                            <Folder className="w-5 h-5 text-cyan-500 shrink-0 fill-cyan-100" />
                            <span className="text-sm font-medium text-slate-700 truncate select-none">{name}</span>
                          </div>
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                            <button type="button" onClick={(e) => { e.stopPropagation(); handleRenameFolder(folderPath); }} className="p-1 text-slate-400 hover:text-cyan-600 rounded hover:bg-cyan-100/50" title="Đổi tên">
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button type="button" onClick={(e) => { e.stopPropagation(); handleDeleteFolder(folderPath); }} className="p-1 text-slate-400 hover:text-red-500 rounded hover:bg-red-50" title="Xóa">
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Render Images */}
              {currentImages.length > 0 && (
                <div>
                  <h5 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Hình ảnh</h5>
                  <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                    <SortableContext items={currentImages.map(i => i.id!)} strategy={verticalListSortingStrategy}>
                      <div className="space-y-2">
                        {currentImages.map((img) => (
                          <SortableImageItem key={img.id} img={img} updateImage={updateImage} removeImage={removeImage} />
                        ))}
                      </div>
                    </SortableContext>
                  </DndContext>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
