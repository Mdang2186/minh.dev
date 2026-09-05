"use client";

import { useState, useRef } from "react";
import { Upload, X, Image as ImageIcon } from "lucide-react";

interface SingleImageUploaderProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  uploadType: "education" | "certification";
}

export function SingleImageUploader({ label, value, onChange, uploadType }: SingleImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = async (file: File) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", uploadType);
      
      const response = await fetch("/api/admin/files", { method: "POST", body: formData });
      if (!response.ok) throw new Error("Upload failed");
      
      const data = await response.json();
      onChange(data.url);
    } catch (error) {
      alert("Không thể tải ảnh lên. Vui lòng thử lại.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleUploadClick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  return (
    <div className="space-y-3 w-full">
      <div className="flex items-center justify-between">
        <span className="text-sm font-bold text-slate-700">{label}</span>
      </div>

      <div className="flex flex-col border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm p-4">
        {value ? (
          <div className="relative group rounded-lg overflow-hidden border border-slate-200 flex items-center justify-center bg-slate-50 h-32 w-full">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={value} alt="Uploaded logo" className="max-h-full max-w-full object-contain" />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                type="button"
                onClick={() => onChange("")}
                className="bg-white text-red-500 rounded-full p-2 hover:bg-red-50 transition-colors shadow-sm"
                title="Xoá ảnh"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
        ) : (
          <div className="h-32 flex flex-col items-center justify-center gap-3 border-2 border-dashed border-slate-200 rounded-lg bg-slate-50">
             <div className="h-10 w-10 rounded-full bg-white border border-slate-100 flex items-center justify-center shadow-sm">
                <ImageIcon className="h-5 w-5 text-slate-400" />
             </div>
             <div className="flex items-center gap-2">
              <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleUploadClick} disabled={uploading} />
              <button 
                type="button" 
                onClick={() => fileInputRef.current?.click()} 
                disabled={uploading} 
                className="inline-flex items-center gap-1.5 rounded-lg bg-cyan-500 px-4 py-2 text-xs font-bold text-white transition hover:bg-cyan-600 disabled:opacity-50 shadow-sm"
              >
                <Upload className="h-3.5 w-3.5" /> {uploading ? "Đang tải..." : "Tải Logo lên"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
