"use client";

import { useState, useEffect, useRef } from "react";
import { UploadCloud, Check, FileText, Loader2, Eye, X } from "lucide-react";

interface FileSelectorProps {
  label: string;
  type: "avatar" | "resume";
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
}

export function FileSelector({ label, type, value, onChange, required }: FileSelectorProps) {
  const [files, setFiles] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchFiles = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/admin/files?type=${type}`, { cache: "no-store" });
      const data = await response.json();
      if (data.files) {
        setFiles(data.files);
      }
    } catch (err) {
      console.error("Failed to load files", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, [type]);

  const displayFiles = [...files];
  if (value && !displayFiles.includes(value)) {
    displayFiles.unshift(value);
  }

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", type);

    try {
      const response = await fetch("/api/admin/files", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      
      if (response.ok && data.url) {
        onChange(data.url);
        await fetchFiles();
      } else {
        alert(data.error || "Upload failed");
      }
    } catch (err) {
      alert("Upload failed");
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <div className="block space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-bold text-slate-700">{label}</span>
      </div>
      
      {/* Optimized responsive grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
        {displayFiles.map((fileUrl) => {
          const isSelected = value === fileUrl;
          return (
            <div key={fileUrl} className="relative group">
              <button
                type="button"
                onClick={() => onChange(fileUrl)}
                className={`w-full relative flex aspect-square flex-col items-center justify-center overflow-hidden rounded-xl border-2 transition-all ${
                  isSelected ? "border-cyan-500 bg-cyan-50" : "border-slate-200 bg-white hover:border-cyan-300"
                }`}
              >
                {type === "avatar" ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={fileUrl} alt={fileUrl} className="h-full w-full object-cover object-top" />
                ) : (
                  <div className="flex flex-col items-center gap-2 p-2">
                    <FileText className={`h-8 w-8 ${isSelected ? "text-cyan-600" : "text-slate-400"}`} />
                    <span className="text-[10px] break-all w-full px-2 text-center text-slate-600 line-clamp-2">
                      {fileUrl.split('/').pop()}
                    </span>
                  </div>
                )}
              </button>

              {/* Action Overlay */}
              <div className="absolute inset-0 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 rounded-xl pointer-events-none">
                <button 
                  type="button"
                  className="pointer-events-auto flex items-center justify-center p-2 bg-white/90 rounded-full hover:bg-white text-slate-700 shadow-sm transition-transform hover:scale-110" 
                  onClick={(e) => { 
                    e.stopPropagation(); 
                    if (type === "resume") {
                      window.open(fileUrl, '_blank');
                    } else {
                      setPreviewUrl(fileUrl);
                    }
                  }}
                  title="Xem trước"
                >
                  <Eye className="w-4 h-4" />
                </button>
              </div>

              {isSelected && (
                <div className="absolute right-2 top-2 rounded-full bg-cyan-500 p-1 text-white shadow-sm pointer-events-none">
                  <Check className="h-3 w-3" strokeWidth={3} />
                </div>
              )}
            </div>
          );
        })}

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading || loading}
          className="relative flex aspect-square flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 text-slate-500 transition-all hover:border-cyan-400 hover:bg-cyan-50 hover:text-cyan-600 disabled:opacity-50"
        >
          {uploading ? (
             <Loader2 className="h-6 w-6 animate-spin" />
          ) : (
            <UploadCloud className="h-6 w-6" />
          )}
          <span className="text-xs font-medium text-center px-2">Tải lên</span>
        </button>
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleUpload}
        className="hidden"
        accept={type === "avatar" ? "image/*" : "application/pdf"}
      />

      {/* Preview Modal */}
      {previewUrl && (
        <div 
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-900/90 p-4 backdrop-blur-sm" 
          onClick={() => setPreviewUrl(null)}
        >
          <button 
            className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors bg-slate-800/50 rounded-full p-2" 
            onClick={() => setPreviewUrl(null)}
          >
            <X className="w-6 h-6" />
          </button>
          
          <div className="max-w-4xl max-h-[85vh] w-full flex flex-col items-center justify-center relative bg-transparent rounded-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
            {type === "avatar" ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={previewUrl} alt="Preview" className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl" />
            ) : null}
          </div>
          
          <div className="mt-4 text-white/90 text-sm font-medium bg-slate-800/60 px-4 py-2 rounded-full">
            Chế độ xem trước (Preview)
          </div>
        </div>
      )}
    </div>
  );
}
