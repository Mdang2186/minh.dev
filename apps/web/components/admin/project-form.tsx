"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Save } from "lucide-react";
import { useAdminLanguage } from "./admin-language-provider";
import { ProjectImageUploader, ProjectImage } from "./project-image-uploader";

type ProjectPayload = Record<string, any>;

export function ProjectForm({ projectId }: { projectId?: string }) {
  const router = useRouter();
  const { language } = useAdminLanguage();

  const [form, setForm] = useState<ProjectPayload>({
    featured: false,
    published: true,
    sortOrder: 0,
  });
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(Boolean(projectId));
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!projectId) return;

    async function loadProject() {
      try {
        const response = await fetch(`/api/admin/projects/${projectId}`, { cache: "no-store" });
        const data = await response.json().catch(() => null);
        if (!response.ok) {
          setStatus(data?.message || "Không thể tải dự án.");
          return;
        }

        if (data?.project) {
          const project = data.project;
          
          // Helper to map DB lists to text fields
          const textLists: Record<string, string> = {
            languagesText: (project.languages ?? []).join("\n"),
            toolsText: (project.tools ?? []).join("\n"),
            techStacksText: (project.techStacks ?? []).join("\n"),
          };
          
          // Map localized highlights
          const langs = ["en", "vi", "ja", "fr", "es", "zh", "ko"];
          langs.forEach((l) => {
            const field = l === "en" ? "highlights" : `highlights_${l}`;
            textLists[field + "Text"] = (project[field] ?? []).join("\n");
          });

          setForm({
            ...project,
            projectImages: project.projectImages || [],
            imageFolders: project.imageFolders || [],
            ...textLists,
          });
        }
      } catch {
        setStatus("Không thể tải dự án.");
      } finally {
        setLoading(false);
      }
    }

    loadProject();
  }, [projectId]);

  const getFieldKey = (base: string) => language === "en" ? base : `${base}_${language}`;

  function updateField(name: string, value: any) {
    setForm((current) => ({ ...current, [name]: value }));
  }

  function getVal(base: string) {
    return form[getFieldKey(base)] || "";
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setStatus("");

    // Build the payload dynamically
    const body: Record<string, any> = {
      slug: form.slug,
      coverImage: form.coverImage,
      githubUrl: form.githubUrl,
      demoUrl: form.demoUrl,
      duration: form.duration,
      teamSize: form.teamSize,
      featured: Boolean(form.featured),
      published: Boolean(form.published),
      sortOrder: Number(form.sortOrder) || 0,
      directoryTree: form.directoryTree,
      languages: parseList(form.languagesText || ""),
      tools: parseList(form.toolsText || ""),
      techStacks: parseList(form.techStacksText || ""),
      projectImages: form.projectImages || [],
      imageFolders: form.imageFolders || [],
    };

    const langs = ["en", "vi", "ja", "fr", "es", "zh", "ko"];
    const localizedFields = ["title", "summary", "description", "content", "role"];
    
    // Process text fields
    localizedFields.forEach(field => {
      langs.forEach(l => {
        const key = l === "en" ? field : `${field}_${l}`;
        body[key] = form[key];
      });
    });

    // Process highlights list
    langs.forEach(l => {
      const dbKey = l === "en" ? "highlights" : `highlights_${l}`;
      const formKey = dbKey + "Text";
      body[dbKey] = parseList(form[formKey] || "");
    });

    try {
      const response = await fetch(projectId ? `/api/admin/projects/${projectId}` : "/api/admin/projects", {
        method: projectId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await response.json().catch(() => null);
      if (!response.ok) {
        setStatus(data?.message || "Không thể lưu dự án.");
        return;
      }

      setStatus("Đã lưu dự án.");
      router.push("/admin/projects");
      router.refresh();
    } catch {
      setStatus("Không thể lưu dự án.");
    } finally {
      setSaving(false);
    }
  }

  const isEn = language === "en";
  const labelSuffix = `(${language.toUpperCase()})`;

  if (loading) return <p className="text-sm text-slate-500">Đang tải dự án...</p>;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {status ? (
        <div className="rounded-xl border border-cyan-200 bg-cyan-50 px-4 py-3 text-sm font-semibold text-cyan-700">
          {status}
        </div>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2">
        <AdminInput label={`Title ${labelSuffix}`} value={getVal("title")} onChange={(value) => updateField(getFieldKey("title"), value)} required={isEn} />
        <AdminInput label="Slug" value={form.slug || ""} onChange={(value) => updateField("slug", value)} required />
      </div>

      <AdminTextarea label={`Summary ${labelSuffix}`} value={getVal("summary")} onChange={(value) => updateField(getFieldKey("summary"), value)} required={isEn} rows={3} />
      <AdminTextarea label={`Description ${labelSuffix}`} value={getVal("description")} onChange={(value) => updateField(getFieldKey("description"), value)} rows={5} />
      <AdminTextarea label={`Content ${labelSuffix}`} value={getVal("content")} onChange={(value) => updateField(getFieldKey("content"), value)} rows={5} />

      <div className="grid gap-4 md:grid-cols-2">
        <AdminInput label="Cover image URL" value={form.coverImage || ""} onChange={(value) => updateField("coverImage", value)} />
        <AdminInput label="GitHub URL" value={form.githubUrl || ""} onChange={(value) => updateField("githubUrl", value)} />
        <AdminInput label="Demo URL" value={form.demoUrl || ""} onChange={(value) => updateField("demoUrl", value)} />
        <AdminInput label={`Role ${labelSuffix}`} value={getVal("role")} onChange={(value) => updateField(getFieldKey("role"), value)} />
        <AdminInput label="Duration" value={form.duration || ""} onChange={(value) => updateField("duration", value)} />
        <AdminInput label="Quy mô / Loại dự án (Team size / Type)" value={form.teamSize || ""} onChange={(value) => updateField("teamSize", value)} />
        <AdminNumber label="Sort order" value={form.sortOrder || 0} onChange={(value) => updateField("sortOrder", value)} />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <AdminCheckbox label="Featured" checked={form.featured || false} onChange={(value) => updateField("featured", value)} />
        <AdminCheckbox label="Published" checked={form.published ?? true} onChange={(value) => updateField("published", value)} />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <AdminTextarea label="Tech stacks (mỗi dòng một item)" value={form.techStacksText || ""} onChange={(value) => updateField("techStacksText", value)} rows={6} />
        <ProjectImageUploader 
          label="Quản lý File & Hình ảnh" 
          images={form.projectImages || []} 
          imageFolders={form.imageFolders || []}
          onChangeImages={(images) => updateField("projectImages", images)} 
          onChangeFolders={(folders) => updateField("imageFolders", folders)} 
        />
        <AdminTextarea label={`Highlights ${labelSuffix} (mỗi dòng một ý)`} value={form[getFieldKey("highlights") + "Text"] || ""} onChange={(value) => updateField(getFieldKey("highlights") + "Text", value)} rows={8} />
        <AdminTextarea label="Languages (mỗi dòng một item)" value={form.languagesText || ""} onChange={(value) => updateField("languagesText", value)} rows={8} />
        <AdminTextarea label="Tools (mỗi dòng một item)" value={form.toolsText || ""} onChange={(value) => updateField("toolsText", value)} rows={8} />
        <AdminTextarea label="Directory tree" value={form.directoryTree || ""} onChange={(value) => updateField("directoryTree", value)} rows={8} />
      </div>

      <button
        type="submit"
        disabled={saving}
        className="inline-flex items-center gap-2 rounded-xl bg-cyan-500 px-5 py-3 text-sm font-black text-white transition-colors hover:bg-cyan-600 disabled:opacity-60"
      >
        <Save className="h-4 w-4" />
        {saving ? "Đang lưu..." : "Lưu dự án"}
      </button>
    </form>
  );
}

function parseList(value: string) {
  return value
    .split(/\r?\n/)
    .map((item) => item.trim())
    .filter(Boolean);
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

function AdminCheckbox({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <label className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700">
      {label}
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="h-5 w-5 rounded border-slate-300 bg-white accent-cyan-500"
      />
    </label>
  );
}
