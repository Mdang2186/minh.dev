"use client";

import { useEffect, useState } from "react";
import { Save } from "lucide-react";
import { useAdminLanguage } from "./admin-language-provider";
import { FileSelector } from "./file-selector";

type ProfileFormState = Record<string, string>;

export function ProfileForm() {
  const { language } = useAdminLanguage();

  const [form, setForm] = useState<ProfileFormState>({});
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  async function loadProfile() {
    setLoading(true);
    const response = await fetch("/api/admin/profile", { cache: "no-store" });
    const data = await response.json();
    if (data.profile) {
      setForm(
        Object.fromEntries(
          Object.entries(data.profile).map(([key, value]) => [key, (value as string) ?? ""])
        )
      );
    }
    setLoading(false);
  }

  useEffect(() => {
    loadProfile();
  }, []);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setStatus("");

    const response = await fetch("/api/admin/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await response.json().catch(() => null);

    if (!response.ok) {
      setStatus(data?.message || "Không thể lưu hồ sơ.");
      setSaving(false);
      return;
    }

    setStatus("Đã lưu hồ sơ.");
    setSaving(false);
  }

  const getFieldKey = (base: string) => language === "en" ? base : `${base}_${language}`;
  
  function updateField(base: string, value: string) {
    setForm((current) => ({ ...current, [getFieldKey(base)]: value }));
  }

  function getVal(base: string) {
    return form[getFieldKey(base)] || "";
  }

  const isEn = language === "en";
  const labelSuffix = `(${language.toUpperCase()})`;

  if (loading) return <p className="text-sm text-slate-500">Đang tải hồ sơ...</p>;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {status ? (
        <div className="rounded-xl border border-cyan-200 bg-cyan-50 px-4 py-3 text-sm font-semibold text-cyan-700">
          {status}
        </div>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2">
        <AdminInput label={`Tên ${labelSuffix}`} value={getVal("name")} onChange={(value) => updateField("name", value)} required={isEn} />
        <AdminInput label={`Vai trò ${labelSuffix}`} value={getVal("role")} onChange={(value) => updateField("role", value)} required={isEn} />
      </div>
      
      <AdminInput label={`Headline ${labelSuffix}`} value={getVal("headline")} onChange={(value) => updateField("headline", value)} required={isEn} />
      <AdminTextarea label={`Intro ${labelSuffix}`} value={getVal("intro")} onChange={(value) => updateField("intro", value)} required={isEn} />
      
      <div className="grid gap-4 md:grid-cols-2">
        <AdminInput label={`Địa điểm ${labelSuffix}`} value={getVal("location")} onChange={(value) => updateField("location", value)} />
        <AdminInput label="Email" value={form.email || ""} onChange={(value) => setForm((c) => ({ ...c, email: value }))} />
        <AdminInput label="Số điện thoại" value={form.phone || ""} onChange={(value) => setForm((c) => ({ ...c, phone: value }))} />
        <FileSelector label="Avatar URL" type="avatar" value={form.avatarUrl || ""} onChange={(value) => setForm((c) => ({ ...c, avatarUrl: value }))} />
        <FileSelector label="Resume URL" type="resume" value={form.resumeUrl || ""} onChange={(value) => setForm((c) => ({ ...c, resumeUrl: value }))} />
      </div>

      <button
        type="submit"
        disabled={saving}
        className="inline-flex items-center gap-2 rounded-xl bg-cyan-500 px-5 py-3 text-sm font-black text-white transition-colors hover:bg-cyan-600 disabled:opacity-60"
      >
        <Save className="h-4 w-4" />
        {saving ? "Đang lưu..." : "Lưu hồ sơ"}
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
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
}) {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-bold text-slate-700">{label}</span>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        required={required}
        rows={5}
        className="w-full resize-y rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium leading-6 text-slate-900 outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10"
      />
    </label>
  );
}
