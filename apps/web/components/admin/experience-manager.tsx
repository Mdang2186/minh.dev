"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2, Edit2, Eye, EyeOff } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { useAdminLanguage } from "./admin-language-provider";

type Experience = Record<string, any>;

const emptyExperience: Experience = {
  sortOrder: 0,
  visible: true,
};

export function ExperienceManager() {
  const [items, setItems] = useState<Experience[]>([]);
  const [draft, setDraft] = useState<Experience>(emptyExperience);
  const [status, setStatus] = useState("");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editItem, setEditItem] = useState<Experience | null>(null);

  async function loadItems() {
    const response = await fetch("/api/admin/experience", { cache: "no-store" });
    const data = await response.json();
    setItems(
      (data.experiences ?? []).map((item: any) => {
        const mapped: Record<string, any> = {
          id: item.id,
          sortOrder: item.sortOrder,
          visible: item.visible,
        };
        const langs = ["en", "vi", "ja", "fr", "es", "zh", "ko"];
        const strFields = ["title", "org", "time"];
        
        strFields.forEach(f => {
          langs.forEach(l => {
            const key = l === "en" ? f : `${f}_${l}`;
            mapped[key] = item[key] ?? "";
          });
        });

        langs.forEach(l => {
          const dbKey = l === "en" ? "details" : `details_${l}`;
          mapped[dbKey + "Text"] = (item[dbKey] ?? []).join("\n");
        });

        return mapped;
      })
    );
  }

  useEffect(() => {
    loadItems();
  }, []);

  async function saveItem(item: Experience) {
    const body: Record<string, any> = {
      sortOrder: Number(item.sortOrder) || 0,
      visible: item.visible,
    };
    
    const langs = ["en", "vi", "ja", "fr", "es", "zh", "ko"];
    const strFields = ["title", "org", "time"];
    
    strFields.forEach(f => {
      langs.forEach(l => {
        const key = l === "en" ? f : `${f}_${l}`;
        body[key] = item[key];
      });
    });

    langs.forEach(l => {
      const dbKey = l === "en" ? "details" : `details_${l}`;
      body[dbKey] = (item[dbKey + "Text"] || "")
        .split(/\r?\n/)
        .map((line: string) => line.trim())
        .filter(Boolean);
    });

    const response = await fetch(item.id ? `/api/admin/experience/${item.id}` : "/api/admin/experience", {
      method: item.id ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await response.json().catch(() => null);
    if (!response.ok) return setStatus(data?.message || "Không thể lưu kinh nghiệm.");
    setStatus("Đã lưu kinh nghiệm.");
    setDraft(emptyExperience);
    setIsAddOpen(false);
    setEditItem(null);
    loadItems();
  }

  async function deleteItem(item: Experience) {
    if (!item.id || !confirm(`Xóa "${item.title}"?`)) return;
    await fetch(`/api/admin/experience/${item.id}`, { method: "DELETE" });
    setStatus("Đã xóa kinh nghiệm.");
    loadItems();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-black text-slate-900">Danh sách Kinh nghiệm</h2>
        <button type="button" onClick={() => setIsAddOpen(true)} className="rounded-xl bg-cyan-500 px-4 py-2.5 text-sm font-black text-white hover:bg-cyan-600 transition-colors flex items-center gap-2">
          <Plus className="h-4 w-4" /> Thêm mới
        </button>
      </div>

      {status && <p className="text-sm font-semibold text-cyan-600">{status}</p>}

      <div className="grid gap-4">
        {items.map((item) => (
          <div key={item.id} className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:shadow-md">
            <div>
              <h3 className={`font-bold ${item.visible ? "text-slate-900" : "text-slate-400"}`}>{item.title || item.title_vi || "Untitled"}</h3>
              <p className="text-sm text-slate-500 mt-1">{item.org || item.org_vi} &bull; {item.time || item.time_vi}</p>
            </div>
            <div className="flex items-center gap-1 sm:gap-2">
              <button onClick={() => saveItem({ ...item, visible: !item.visible })} className={`p-2 rounded-lg transition-colors ${item.visible ? "text-slate-400 hover:text-slate-600 hover:bg-slate-50" : "text-amber-500 hover:bg-amber-50"}`} title={item.visible ? "Đang hiện" : "Đang ẩn"}>
                {item.visible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
              </button>
              <button onClick={() => setEditItem(item)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Sửa">
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
            Chưa có kinh nghiệm nào. Nhấn "Thêm mới" để tạo.
          </div>
        )}
      </div>

      <Modal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} title="Thêm kinh nghiệm">
        <div className="space-y-6">
          <ExperienceFields item={draft} onChange={(field, value) => setDraft((current) => ({ ...current, [field]: value }))} />
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button onClick={() => setIsAddOpen(false)} className="rounded-xl px-4 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-100 transition-colors">Hủy</button>
            <button onClick={() => saveItem(draft)} className="rounded-xl bg-cyan-500 px-6 py-2.5 text-sm font-black text-white hover:bg-cyan-600 transition-colors">Lưu kinh nghiệm</button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={!!editItem} onClose={() => setEditItem(null)} title="Sửa kinh nghiệm">
        {editItem && (
          <div className="space-y-6">
            <ExperienceFields item={editItem} onChange={(field, value) => setEditItem({ ...editItem, [field]: value } as Experience)} />
            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
              <button onClick={() => setEditItem(null)} className="rounded-xl px-4 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-100 transition-colors">Hủy</button>
              <button onClick={() => saveItem(editItem)} className="rounded-xl bg-cyan-500 px-6 py-2.5 text-sm font-black text-white hover:bg-cyan-600 transition-colors">Lưu thay đổi</button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

function ExperienceFields({
  item,
  onChange,
}: {
  item: Experience;
  onChange: (field: string, value: string | number | boolean) => void;
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
      <AdminInput label={`Org ${labelSuffix}`} value={getVal("org")} onChange={(value) => onChange(getFieldKey("org"), value)} />
      <AdminInput label={`Time ${labelSuffix}`} value={getVal("time")} onChange={(value) => onChange(getFieldKey("time"), value)} />
      <AdminNumber label="Sort" value={item.sortOrder || 0} onChange={(value) => onChange("sortOrder", value)} />
      <label className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 md:col-span-1">
        Visible
        <input type="checkbox" checked={item.visible ?? true} onChange={(event) => onChange("visible", event.target.checked)} className="h-5 w-5 accent-cyan-500" />
      </label>
      <label className="block space-y-2 md:col-span-2">
        <span className="text-xs font-bold text-slate-600">Details {labelSuffix} (mỗi dòng một ý)</span>
        <textarea
          rows={5}
          value={item[getFieldKey("details") + "Text"] || ""}
          onChange={(event) => onChange(getFieldKey("details") + "Text", event.target.value)}
          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-medium text-slate-900 outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
        />
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
