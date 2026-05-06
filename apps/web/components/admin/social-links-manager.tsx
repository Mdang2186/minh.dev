"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2, Edit2, Eye, EyeOff } from "lucide-react";
import { Modal } from "@/components/ui/modal";

type SocialLink = {
  id?: string;
  name: string;
  url: string;
  iconUrl: string;
  sortOrder: number;
  visible: boolean;
};

const emptySocialLink: SocialLink = {
  name: "",
  url: "",
  iconUrl: "",
  sortOrder: 0,
  visible: true,
};

export function SocialLinksManager() {
  const [links, setLinks] = useState<SocialLink[]>([]);
  const [draft, setDraft] = useState<SocialLink>(emptySocialLink);
  const [status, setStatus] = useState("");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editLink, setEditLink] = useState<SocialLink | null>(null);

  async function loadLinks() {
    const response = await fetch("/api/admin/social-links", { cache: "no-store" });
    const data = await response.json();
    setLinks((data.socialLinks ?? []).map((link: any) => ({ ...link, iconUrl: link.iconUrl ?? "" })));
  }

  useEffect(() => {
    loadLinks();
  }, []);

  async function saveLink(link: SocialLink) {
    const response = await fetch(link.id ? `/api/admin/social-links/${link.id}` : "/api/admin/social-links", {
      method: link.id ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(link),
    });
    const data = await response.json().catch(() => null);
    if (!response.ok) return setStatus(data?.message || "Không thể lưu social link.");
    setStatus("Đã lưu social link.");
    setDraft(emptySocialLink);
    setIsAddOpen(false);
    setEditLink(null);
    loadLinks();
  }

  async function deleteLink(link: SocialLink) {
    if (!link.id || !confirm(`Xóa "${link.name}"?`)) return;
    await fetch(`/api/admin/social-links/${link.id}`, { method: "DELETE" });
    setStatus("Đã xóa social link.");
    loadLinks();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-black text-slate-900">Mạng xã hội</h2>
        <button type="button" onClick={() => setIsAddOpen(true)} className="rounded-xl bg-cyan-500 px-4 py-2.5 text-sm font-black text-white hover:bg-cyan-600 transition-colors flex items-center gap-2">
          <Plus className="h-4 w-4" /> Thêm mới
        </button>
      </div>

      {status && <p className="text-sm font-semibold text-cyan-600">{status}</p>}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {links.map((link) => (
          <div key={link.id} className="flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:shadow-md">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center overflow-hidden shrink-0">
                {link.iconUrl ? <img src={link.iconUrl} alt={link.name} className="w-5 h-5 object-contain" /> : <div className="w-5 h-5 bg-slate-300 rounded-full"></div>}
              </div>
              <div className="overflow-hidden">
                <h3 className={`font-bold truncate ${link.visible ? "text-slate-900" : "text-slate-400"}`}>{link.name}</h3>
                <p className="text-xs text-slate-500 truncate mt-0.5">{link.url}</p>
              </div>
            </div>
            
            <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100">
              <div className="text-xs font-bold text-slate-400">Sort: {link.sortOrder}</div>
              <div className="flex items-center gap-1">
                <button onClick={() => saveLink({ ...link, visible: !link.visible })} className={`p-2 rounded-lg transition-colors ${link.visible ? "text-slate-400 hover:text-slate-600 hover:bg-slate-50" : "text-amber-500 hover:bg-amber-50"}`} title={link.visible ? "Đang hiện" : "Đang ẩn"}>
                  {link.visible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                </button>
                <button onClick={() => setEditLink(link)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Sửa">
                  <Edit2 className="h-4 w-4" />
                </button>
                <button onClick={() => deleteLink(link)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Xóa">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
        {links.length === 0 && (
          <div className="col-span-full text-center py-10 text-slate-500 bg-white rounded-2xl border border-slate-200 border-dashed">
            Chưa có mạng xã hội nào. Nhấn "Thêm mới" để tạo.
          </div>
        )}
      </div>

      <Modal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} title="Thêm mạng xã hội">
        <div className="space-y-6">
          <SocialFields link={draft} onChange={(field, value) => setDraft((current) => ({ ...current, [field]: value }))} />
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button onClick={() => setIsAddOpen(false)} className="rounded-xl px-4 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-100 transition-colors">Hủy</button>
            <button onClick={() => saveLink(draft)} className="rounded-xl bg-cyan-500 px-6 py-2.5 text-sm font-black text-white hover:bg-cyan-600 transition-colors">Lưu mạng xã hội</button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={!!editLink} onClose={() => setEditLink(null)} title="Sửa mạng xã hội">
        {editLink && (
          <div className="space-y-6">
            <SocialFields link={editLink} onChange={(field, value) => setEditLink({ ...editLink, [field]: value } as SocialLink)} />
            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
              <button onClick={() => setEditLink(null)} className="rounded-xl px-4 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-100 transition-colors">Hủy</button>
              <button onClick={() => saveLink(editLink)} className="rounded-xl bg-cyan-500 px-6 py-2.5 text-sm font-black text-white hover:bg-cyan-600 transition-colors">Lưu thay đổi</button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

function SocialFields({
  link,
  onChange,
}: {
  link: SocialLink;
  onChange: (field: keyof SocialLink, value: string | number | boolean) => void;
}) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <AdminInput label="Name" value={link.name} onChange={(value) => onChange("name", value)} />
      <AdminInput label="URL" value={link.url} onChange={(value) => onChange("url", value)} />
      <AdminInput label="Icon URL" value={link.iconUrl} onChange={(value) => onChange("iconUrl", value)} />
      <AdminNumber label="Sort" value={link.sortOrder} onChange={(value) => onChange("sortOrder", value)} />
      <label className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700">
        Visible
        <input type="checkbox" checked={link.visible} onChange={(event) => onChange("visible", event.target.checked)} className="h-5 w-5 accent-cyan-500" />
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
