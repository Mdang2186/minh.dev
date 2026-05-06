"use client";

import { useEffect, useState } from "react";
import { Save } from "lucide-react";

type ProfileFormState = {
  name: string;
  role: string;
  headline: string;
  intro: string;
  location: string;
  email: string;
  phone: string;
  avatarUrl: string;
  resumeUrl: string;
};

const emptyProfile: ProfileFormState = {
  name: "",
  role: "",
  headline: "",
  intro: "",
  location: "",
  email: "",
  phone: "",
  avatarUrl: "",
  resumeUrl: "",
};

export function ProfileForm() {
  const [form, setForm] = useState<ProfileFormState>(emptyProfile);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  async function loadProfile() {
    setLoading(true);
    const response = await fetch("/api/admin/profile", { cache: "no-store" });
    const data = await response.json();
    if (data.profile) {
      setForm({
        ...emptyProfile,
        ...Object.fromEntries(
          Object.entries(data.profile).map(([key, value]) => [key, value ?? ""])
        ),
      } as ProfileFormState);
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

  function updateField(name: keyof ProfileFormState, value: string) {
    setForm((current) => ({ ...current, [name]: value }));
  }

  if (loading) return <p className="text-sm text-slate-500">Đang tải hồ sơ...</p>;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {status ? (
        <div className="rounded-xl border border-cyan-200 bg-cyan-50 px-4 py-3 text-sm font-semibold text-cyan-700">
          {status}
        </div>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2">
        <AdminInput label="Tên" value={form.name} onChange={(value) => updateField("name", value)} required />
        <AdminInput label="Vai trò" value={form.role} onChange={(value) => updateField("role", value)} required />
      </div>
      <AdminInput label="Headline" value={form.headline} onChange={(value) => updateField("headline", value)} required />
      <AdminTextarea label="Intro" value={form.intro} onChange={(value) => updateField("intro", value)} required />
      <div className="grid gap-4 md:grid-cols-2">
        <AdminInput label="Địa điểm" value={form.location} onChange={(value) => updateField("location", value)} />
        <AdminInput label="Email" value={form.email} onChange={(value) => updateField("email", value)} />
        <AdminInput label="Số điện thoại" value={form.phone} onChange={(value) => updateField("phone", value)} />
        <AdminInput label="Avatar URL" value={form.avatarUrl} onChange={(value) => updateField("avatarUrl", value)} />
        <AdminInput label="Resume URL" value={form.resumeUrl} onChange={(value) => updateField("resumeUrl", value)} />
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
