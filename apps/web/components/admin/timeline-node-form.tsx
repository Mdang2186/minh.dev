"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Save, Plus, Trash2 } from "lucide-react";
import { useAdminLanguage } from "./admin-language-provider";
import { MapPin, Globe, Code2, BookOpen, Star, MessageCircle, Plane, Radar, Mail, LucideIcon } from "lucide-react";

const ICONS: Record<string, LucideIcon> = { MapPin, Globe, Code2, BookOpen, Star, MessageCircle, Plane, Radar, Mail };
const PRESET_COLORS = ["#A9714A", "#D6249F", "#14B8A6", "#2563EB", "#22C55E", "#F97316"];

export function TimelineNodeForm({ nodeId }: { nodeId?: string }) {
  const router = useRouter();
  const { language } = useAdminLanguage();

  const [form, setForm] = useState<Record<string, any>>({
    sortOrder: 0,
    visible: true,
    type: "MILESTONE",
    sprints: [],
  });
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(Boolean(nodeId));
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!nodeId) return;

    async function loadNode() {
      try {
        const response = await fetch(`/api/admin/timeline-nodes/${nodeId}`, { cache: "no-store" });
        const data = await response.json().catch(() => null);
        if (!response.ok) {
          setStatus(data?.message || "Không thể tải timeline node.");
          return;
        }

        if (data?.node) {
          setForm(data.node);
        }
      } catch {
        setStatus("Không thể tải timeline node.");
      } finally {
        setLoading(false);
      }
    }

    loadNode();
  }, [nodeId]);

  const getFieldKey = (base: string) => language === "en" ? base : `${base}_${language}`;

  function updateField(name: string, value: any) {
    setForm((current) => ({ ...current, [name]: value }));
  }

  function getVal(base: string) {
    return form[getFieldKey(base)] || "";
  }

  // Sprints Management
  function addSprint() {
    const newSprint = {
      title: "",
      startDate: "",
      endDate: "",
      description: "",
      sortOrder: (form.sprints || []).length,
    };
    updateField("sprints", [...(form.sprints || []), newSprint]);
  }

  function updateSprint(index: number, field: string, value: any) {
    const newSprints = [...(form.sprints || [])];
    newSprints[index] = { ...newSprints[index], [field]: value };
    updateField("sprints", newSprints);
  }

  function removeSprint(index: number) {
    const newSprints = [...(form.sprints || [])];
    newSprints.splice(index, 1);
    updateField("sprints", newSprints);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setStatus("");

    try {
      const response = await fetch(nodeId ? `/api/admin/timeline-nodes/${nodeId}` : "/api/admin/timeline-nodes", {
        method: nodeId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await response.json().catch(() => null);
      if (!response.ok) {
        setStatus(data?.message || "Không thể lưu timeline node.");
        return;
      }

      setStatus("Đã lưu timeline node.");
      router.push("/admin/timeline-nodes");
      router.refresh();
    } catch {
      setStatus("Không thể lưu timeline node.");
    } finally {
      setSaving(false);
    }
  }

  const isEn = language === "en";
  const labelSuffix = `(${language.toUpperCase()})`;

  if (loading) return <p className="text-sm text-slate-500">Đang tải timeline node...</p>;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {status ? (
        <div className="rounded-xl border border-cyan-200 bg-cyan-50 px-4 py-3 text-sm font-semibold text-cyan-700">
          {status}
        </div>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2">
        <AdminInput label={`Title ${labelSuffix}`} value={getVal("title")} onChange={(value) => updateField(getFieldKey("title"), value)} required={isEn} />
        <AdminInput label="Date (vd: Q3 2026, Oct 2026)" value={form.date || ""} onChange={(value) => updateField("date", value)} required />
        <AdminInput label="Type (MILESTONE, PROJECT)" value={form.type || ""} onChange={(value) => updateField("type", value)} />
        <AdminInput label="Link (URL chuyển hướng)" value={form.link || ""} onChange={(value) => updateField("link", value)} />
        <AdminInput label={`Short Label ${labelSuffix}`} value={getVal("shortLabel")} onChange={(value) => updateField(getFieldKey("shortLabel"), value)} />
        <AdminIconSelect label="Icon" value={form.icon || ""} onChange={(value) => updateField("icon", value)} />
        <AdminColorPicker label="Color" value={form.color || ""} onChange={(value) => updateField("color", value)} />
        <AdminNumber label="Sort order" value={form.sortOrder || 0} onChange={(value) => updateField("sortOrder", value)} />
      </div>

      <AdminTextarea label={`Description ${labelSuffix}`} value={getVal("description")} onChange={(value) => updateField(getFieldKey("description"), value)} rows={4} />

      <div className="space-y-4 rounded-2xl border border-slate-200 bg-slate-50 p-6">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900">Sprints (Tùy chọn)</h3>
          <button
            type="button"
            onClick={addSprint}
            className="inline-flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-xs font-bold text-slate-700 shadow-sm border border-slate-200 hover:bg-slate-50"
          >
            <Plus className="h-4 w-4" />
            Thêm Sprint
          </button>
        </div>
        
        {form.sprints && form.sprints.length > 0 ? (
          <div className="space-y-4">
            {form.sprints.map((sprint: any, index: number) => (
              <div key={index} className="grid gap-4 rounded-xl border border-slate-200 bg-white p-4 md:grid-cols-[1fr_auto] items-start">
                <div className="grid gap-4 md:grid-cols-2">
                  <AdminInput label={`Sprint Title ${labelSuffix}`} value={language === "en" ? sprint.title : sprint[`title_${language}`] || ""} onChange={(val) => updateSprint(index, language === "en" ? "title" : `title_${language}`, val)} required={isEn} />
                  <AdminInput label={`Description ${labelSuffix}`} value={language === "en" ? sprint.description : sprint[`description_${language}`] || ""} onChange={(val) => updateSprint(index, language === "en" ? "description" : `description_${language}`, val)} />
                  <AdminInput label="Start Date" value={sprint.startDate || ""} onChange={(val) => updateSprint(index, "startDate", val)} required />
                  <AdminInput label="End Date" value={sprint.endDate || ""} onChange={(val) => updateSprint(index, "endDate", val)} required />
                </div>
                <button
                  type="button"
                  onClick={() => removeSprint(index)}
                  className="inline-flex items-center justify-center rounded-lg border border-red-200 p-2 text-red-600 hover:bg-red-50"
                  title="Xóa Sprint"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-500">Chưa có sprint nào.</p>
        )}
      </div>

      <button
        type="submit"
        disabled={saving}
        className="inline-flex items-center gap-2 rounded-xl bg-cyan-500 px-5 py-3 text-sm font-black text-white transition-colors hover:bg-cyan-600 disabled:opacity-60"
      >
        <Save className="h-4 w-4" />
        {saving ? "Đang lưu..." : "Lưu Timeline Node"}
      </button>
    </form>
  );
}

function AdminInput({
  label,
  value,
  onChange,
  required,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
}) {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-bold text-slate-700">{label}</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        required={required}
        className="w-full min-w-0 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-900 outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10"
      />
    </label>
  );
}

function AdminNumber({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-bold text-slate-700">{label}</span>
      <input
        type="number"
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-900 outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10"
      />
    </label>
  );
}

function AdminTextarea({
  label,
  value,
  onChange,
  required,
  rows = 4,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  rows?: number;
}) {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-bold text-slate-700">{label}</span>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        required={required}
        rows={rows}
        className="w-full min-w-0 resize-y rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium leading-6 text-slate-900 outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10"
      />
    </label>
  );
}

export function AdminIconSelect({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  const SelectedIcon = ICONS[value];
  return (
    <label className="block space-y-2">
      <span className="text-sm font-bold text-slate-700">{label}</span>
      <div className="flex items-center gap-3">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-900 outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10"
        >
          <option value="">Không có icon</option>
          {Object.keys(ICONS).map((iconKey) => (
            <option key={iconKey} value={iconKey}>
              {iconKey}
            </option>
          ))}
        </select>
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
          {SelectedIcon ? <SelectedIcon className="h-5 w-5 text-slate-700" /> : <span className="text-xs text-slate-400">None</span>}
        </div>
      </div>
    </label>
  );
}

export function AdminColorPicker({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="block space-y-2">
      <span className="text-sm font-bold text-slate-700">{label}</span>
      <div className="flex items-center gap-2 mb-2">
        {PRESET_COLORS.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => onChange(c)}
            className={`w-6 h-6 rounded-full border-2 ${value === c ? 'border-slate-900 scale-110' : 'border-transparent hover:scale-110'} transition-transform shadow-sm`}
            style={{ backgroundColor: c }}
            title={c}
          />
        ))}
      </div>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="#hex, rgb..."
        className="w-full min-w-0 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-900 outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10"
      />
    </div>
  );
}
