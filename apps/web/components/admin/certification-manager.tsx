"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2, Edit2, Eye, EyeOff, AlertCircle } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { useAdminLanguage } from "./admin-language-provider";
import { SingleImageUploader } from "./single-image-uploader";
import { MultiImageUploader } from "./multi-image-uploader";

type Certification = Record<string, any>;

const emptyCertification: Certification = {
  sortOrder: 0,
  visible: true,
};

export function CertificationManager() {
  const [items, setItems] = useState<Certification[]>([]);
  const [draft, setDraft] = useState<Certification>(emptyCertification);
  const [status, setStatus] = useState("");
  const [modalError, setModalError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editItem, setEditItem] = useState<Certification | null>(null);

  async function loadItems() {
    const response = await fetch("/api/admin/certifications", { cache: "no-store" });
    const data = await response.json();
    setItems(
      (data.certifications ?? []).map((item: any) => {
        const mapped: Record<string, any> = {
          id: item.id,
          sortOrder: item.sortOrder,
          visible: item.visible,
          score: item.score,
          url: item.url,
          logo: item.logo,
          images: item.images ?? [],
          tags: item.tags ?? [],
          color: item.color,
        };
        const langs = ["en", "vi", "ja", "fr", "es", "zh", "ko"];
        const strFields = ["title", "issuer", "date"];
        
        strFields.forEach(f => {
          langs.forEach(l => {
            const key = l === "en" ? f : `${f}_${l}`;
            mapped[key] = item[key] ?? "";
          });
        });

        return mapped;
      })
    );
  }

  useEffect(() => {
    loadItems();
  }, []);

  async function saveItem(item: Certification) {
    setIsSaving(true);
    setModalError(null);

    const body: Record<string, any> = {
      sortOrder: Number(item.sortOrder) || 0,
      visible: item.visible,
      score: item.score,
      url: item.url,
      logo: item.logo,
      color: item.color,
      images: item.images ?? [],
      tags: typeof item.tags === "string" 
        ? item.tags.split(/[\s,]+/).filter(Boolean).map(t => t.startsWith("#") ? t.substring(1) : t)
        : (Array.isArray(item.tags) ? item.tags.map(t => t.startsWith("#") ? t.substring(1) : t) : []),
    };
    
    const langs = ["en", "vi", "ja", "fr", "es", "zh", "ko"];
    const strFields = ["title", "issuer", "date"];
    
    strFields.forEach(f => {
      let fallbackValue = "";
      for (const l of langs) {
        const k = l === "en" ? f : `${f}_${l}`;
        if (item[k] && typeof item[k] === "string" && item[k].trim() !== "") {
          fallbackValue = item[k];
          break;
        }
      }
      langs.forEach(l => {
        const key = l === "en" ? f : `${f}_${l}`;
        if (l === "en" && (!item[key] || item[key].trim() === "")) {
          body[key] = fallbackValue;
        } else {
          body[key] = item[key] ?? "";
        }
      });
    });

    body.issuer = body.issuer || body.title || "-";
    body.date = body.date || "-";

    try {
      const response = await fetch(item.id ? `/api/admin/certifications/${item.id}` : "/api/admin/certifications", {
        method: item.id ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await response.json().catch(() => null);
      if (!response.ok) {
        if (response.status === 401) {
          setModalError("Phiên đăng nhập admin đã hết hạn (401 Unauthorized). Vui lòng mở tab mới để đăng nhập lại rồi quay lại bấm Lưu, dữ liệu bạn vừa nhập sẽ không bị mất!");
          setStatus("Phiên đăng nhập admin đã hết hạn.");
        } else {
          setModalError(data?.message || "Không thể lưu chứng chỉ.");
          setStatus(data?.message || "Không thể lưu chứng chỉ.");
        }
        return;
      }
      setStatus("Đã lưu chứng chỉ thành công.");
      setModalError(null);
      setDraft(emptyCertification);
      setIsAddOpen(false);
      setEditItem(null);
      loadItems();
    } catch (err: any) {
      setModalError(err?.message || "Lỗi mạng hoặc không thể kết nối máy chủ.");
    } finally {
      setIsSaving(false);
    }
  }

  async function deleteItem(item: Certification) {
    if (!item.id || !confirm(`Xóa "${item.title}"?`)) return;
    await fetch(`/api/admin/certifications/${item.id}`, { method: "DELETE" });
    setStatus("Đã xóa chứng chỉ.");
    loadItems();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-black text-slate-900">Danh sách Chứng chỉ</h2>
        <button type="button" onClick={() => { setModalError(null); setIsAddOpen(true); }} className="rounded-xl bg-cyan-500 px-4 py-2.5 text-sm font-black text-white hover:bg-cyan-600 transition-colors flex items-center gap-2">
          <Plus className="h-4 w-4" /> Thêm mới
        </button>
      </div>

      {status && <p className="text-sm font-semibold text-cyan-600">{status}</p>}

      <div className="grid gap-4">
        {items.map((item) => (
          <div key={item.id} className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:shadow-md">
            <div>
              <h3 className={`font-bold ${item.visible ? "text-slate-900" : "text-slate-400"}`}>{item.title || item.title_vi || "Untitled"}</h3>
              <p className="text-sm text-slate-500 mt-1">{item.issuer || item.issuer_vi} &bull; {item.date || item.date_vi}</p>
            </div>
            <div className="flex items-center gap-1 sm:gap-2">
              <button onClick={() => saveItem({ ...item, visible: !item.visible })} className={`p-2 rounded-lg transition-colors ${item.visible ? "text-slate-400 hover:text-slate-600 hover:bg-slate-50" : "text-amber-500 hover:bg-amber-50"}`} title={item.visible ? "Đang hiện" : "Đang ẩn"}>
                {item.visible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
              </button>
              <button onClick={() => { setModalError(null); setEditItem(item); }} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Sửa">
                <Edit2 className="h-4 w-4" />
              </button>
              <button onClick={() => deleteItem(item)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Xóa">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
        {items.length === 0 && (
          <div className="text-center py-10 text-slate-500 bg-white rounded-2xl border border-slate-200 border-dashed">
            Chưa có chứng chỉ nào. Nhấn "Thêm mới" để tạo.
          </div>
        )}
      </div>

      <Modal isOpen={isAddOpen} onClose={() => { setModalError(null); setIsAddOpen(false); }} title="Thêm chứng chỉ">
        <div className="space-y-6">
          <CertificationFields item={draft} onChange={(field, value) => { setModalError(null); setDraft((current) => ({ ...current, [field]: value })); }} />

          {modalError && (
            <div className="rounded-xl bg-rose-50 border border-rose-200 p-3.5 text-sm text-rose-700 space-y-2">
              <p className="font-bold flex items-start gap-2">
                <AlertCircle className="w-5 h-5 shrink-0 text-rose-600 mt-0.5" />
                <span>{modalError}</span>
              </p>
              {modalError.includes("401") && (
                <div className="pt-1 flex flex-wrap items-center gap-2">
                  <a
                    href="/admin/login"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-cyan-800 bg-white border border-cyan-300 rounded-lg px-3 py-1.5 hover:bg-cyan-50 shadow-sm transition-all"
                  >
                    Mở trang Đăng nhập lại (tab mới) ↗
                  </a>
                  <span className="text-xs text-rose-500 italic">Đăng nhập xong quay lại tab này bấm "Lưu chứng chỉ"</span>
                </div>
              )}
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button disabled={isSaving} onClick={() => { setModalError(null); setIsAddOpen(false); }} className="rounded-xl px-4 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-100 transition-colors disabled:opacity-50">Hủy</button>
            <button disabled={isSaving} onClick={() => saveItem(draft)} className="rounded-xl bg-cyan-500 px-6 py-2.5 text-sm font-black text-white hover:bg-cyan-600 transition-colors disabled:opacity-50 flex items-center gap-2">
              {isSaving && <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
              {isSaving ? "Đang lưu..." : "Lưu chứng chỉ"}
            </button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={!!editItem} onClose={() => { setModalError(null); setEditItem(null); }} title="Sửa chứng chỉ">
        {editItem && (
          <div className="space-y-6">
            <CertificationFields item={editItem} onChange={(field, value) => { setModalError(null); setEditItem({ ...editItem, [field]: value } as Certification); }} />

            {modalError && (
              <div className="rounded-xl bg-rose-50 border border-rose-200 p-3.5 text-sm text-rose-700 space-y-2">
                <p className="font-bold flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 shrink-0 text-rose-600 mt-0.5" />
                  <span>{modalError}</span>
                </p>
                {modalError.includes("401") && (
                  <div className="pt-1 flex flex-wrap items-center gap-2">
                    <a
                      href="/admin/login"
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-cyan-800 bg-white border border-cyan-300 rounded-lg px-3 py-1.5 hover:bg-cyan-50 shadow-sm transition-all"
                    >
                      Mở trang Đăng nhập lại (tab mới) ↗
                    </a>
                    <span className="text-xs text-rose-500 italic">Đăng nhập xong quay lại tab này bấm "Lưu thay đổi"</span>
                  </div>
                )}
              </div>
            )}

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
              <button disabled={isSaving} onClick={() => { setModalError(null); setEditItem(null); }} className="rounded-xl px-4 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-100 transition-colors disabled:opacity-50">Hủy</button>
              <button disabled={isSaving} onClick={() => saveItem(editItem)} className="rounded-xl bg-cyan-500 px-6 py-2.5 text-sm font-black text-white hover:bg-cyan-600 transition-colors disabled:opacity-50 flex items-center gap-2">
                {isSaving && <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                {isSaving ? "Đang lưu..." : "Lưu thay đổi"}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

function CertificationFields({
  item,
  onChange,
}: {
  item: Certification;
  onChange: (field: string, value: string | number | boolean | string[]) => void;
}) {
  const { language } = useAdminLanguage();
  
  const getFieldKey = (base: string) => language === "en" ? base : `${base}_${language}`;
  
  function getVal(base: string) {
    return item[getFieldKey(base)] || "";
  }
  
  const labelSuffix = `(${language.toUpperCase()})`;

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <AdminInput label={`Title ${labelSuffix}`} value={getVal("title")} onChange={(value) => onChange(getFieldKey("title"), value)} />
      <AdminInput label={`Issuer ${labelSuffix}`} value={getVal("issuer")} onChange={(value) => onChange(getFieldKey("issuer"), value)} />
      <AdminInput label={`Date ${labelSuffix}`} value={getVal("date")} onChange={(value) => onChange(getFieldKey("date"), value)} />
      
      <AdminInput label="Score (All langs)" value={item.score || ""} onChange={(value) => onChange("score", value)} />
      <AdminInput label="URL (All langs)" value={item.url || ""} onChange={(value) => onChange("url", value)} />
      <AdminInput label="Color (All langs)" value={item.color || ""} onChange={(value) => onChange("color", value)} />
      <AdminInput 
        label="Hashtags dấu thăng (vd: #certificate #achievement #toeic)" 
        value={Array.isArray(item.tags) ? item.tags.map(t => t.startsWith("#") ? t : `#${t}`).join(" ") : (item.tags || "")} 
        onChange={(value) => onChange("tags", value)} 
      />
      
      <div className="md:col-span-2 grid md:grid-cols-2 gap-4">
        <SingleImageUploader label="Logo (All langs)" value={item.logo || ""} onChange={(value) => onChange("logo", value)} uploadType="certification" />
        <MultiImageUploader label="Album Ảnh (All langs)" images={item.images || []} onChangeImages={(value) => onChange("images", value)} uploadType="certification" />
      </div>
      
      <AdminNumber label="Sort" value={item.sortOrder || 0} onChange={(value) => onChange("sortOrder", value)} />
      <label className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 md:col-span-1">
        Visible
        <input type="checkbox" checked={item.visible ?? true} onChange={(event) => onChange("visible", event.target.checked)} className="h-5 w-5 accent-cyan-500" />
      </label>
    </div>
  );
}

function AdminInput({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="block space-y-2">
      <span className="text-xs font-bold text-slate-600">{label}</span>
      <input value={value} onChange={(event) => onChange(event.target.value)} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-medium text-slate-900 outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500" />
    </label>
  );
}

function AdminNumber({ label, value, onChange }: { label: string; value: number; onChange: (value: number) => void }) {
  return (
    <label className="block space-y-2">
      <span className="text-xs font-bold text-slate-600">{label}</span>
      <input type="number" value={value} onChange={(event) => onChange(Number(event.target.value))} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-medium text-slate-900 outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500" />
    </label>
  );
}
