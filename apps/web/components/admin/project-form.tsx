"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Save } from "lucide-react";

type ProjectPayload = {
  title: string;
  slug: string;
  summary: string;
  description: string;
  content: string;
  coverImage: string;
  githubUrl: string;
  demoUrl: string;
  role: string;
  duration: string;
  teamSize: string;
  featured: boolean;
  published: boolean;
  sortOrder: number;
  directoryTree: string;
  highlightsText: string;
  languagesText: string;
  toolsText: string;
  techStacksText: string;
  projectImagesText: string;
};

const emptyProject: ProjectPayload = {
  title: "",
  slug: "",
  summary: "",
  description: "",
  content: "",
  coverImage: "",
  githubUrl: "",
  demoUrl: "",
  role: "",
  duration: "",
  teamSize: "",
  featured: false,
  published: true,
  sortOrder: 0,
  directoryTree: "",
  highlightsText: "",
  languagesText: "",
  toolsText: "",
  techStacksText: "",
  projectImagesText: "",
};

export function ProjectForm({ projectId }: { projectId?: string }) {
  const router = useRouter();
  const [form, setForm] = useState<ProjectPayload>(emptyProject);
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
          setForm({
            title: project.title ?? "",
            slug: project.slug ?? "",
            summary: project.summary ?? "",
            description: project.description ?? "",
            content: project.content ?? "",
            coverImage: project.coverImage ?? "",
            githubUrl: project.githubUrl ?? "",
            demoUrl: project.demoUrl ?? "",
            role: project.role ?? "",
            duration: project.duration ?? "",
            teamSize: project.teamSize ?? "",
            featured: Boolean(project.featured),
            published: Boolean(project.published),
            sortOrder: project.sortOrder ?? 0,
            directoryTree: project.directoryTree ?? "",
            highlightsText: (project.highlights ?? []).join("\n"),
            languagesText: (project.languages ?? []).join("\n"),
            toolsText: (project.tools ?? []).join("\n"),
            techStacksText: (project.techStacks ?? []).join("\n"),
            projectImagesText: (project.projectImages ?? [])
              .map((image: { imageUrl: string; altText?: string; sortOrder?: number }) =>
                [image.imageUrl, image.altText ?? "", image.sortOrder ?? 0].join("|")
              )
              .join("\n"),
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

  function updateField<T extends keyof ProjectPayload>(name: T, value: ProjectPayload[T]) {
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setStatus("");

    const body = {
      title: form.title,
      slug: form.slug,
      summary: form.summary,
      description: form.description,
      content: form.content,
      coverImage: form.coverImage,
      githubUrl: form.githubUrl,
      demoUrl: form.demoUrl,
      role: form.role,
      duration: form.duration,
      teamSize: form.teamSize,
      featured: form.featured,
      published: form.published,
      sortOrder: Number(form.sortOrder) || 0,
      directoryTree: form.directoryTree,
      highlights: parseList(form.highlightsText),
      languages: parseList(form.languagesText),
      tools: parseList(form.toolsText),
      techStacks: parseList(form.techStacksText),
      projectImages: parseProjectImages(form.projectImagesText),
    };

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

  if (loading) return <p className="text-sm text-slate-500">Đang tải dự án...</p>;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {status ? (
        <div className="rounded-xl border border-cyan-200 bg-cyan-50 px-4 py-3 text-sm font-semibold text-cyan-700">
          {status}
        </div>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2">
        <AdminInput label="Title" value={form.title} onChange={(value) => updateField("title", value)} required />
        <AdminInput label="Slug" value={form.slug} onChange={(value) => updateField("slug", value)} required />
      </div>
      <AdminTextarea label="Summary" value={form.summary} onChange={(value) => updateField("summary", value)} required rows={3} />
      <AdminTextarea label="Description" value={form.description} onChange={(value) => updateField("description", value)} rows={5} />
      <AdminTextarea label="Content" value={form.content} onChange={(value) => updateField("content", value)} rows={5} />

      <div className="grid gap-4 md:grid-cols-2">
        <AdminInput label="Cover image URL" value={form.coverImage} onChange={(value) => updateField("coverImage", value)} />
        <AdminInput label="GitHub URL" value={form.githubUrl} onChange={(value) => updateField("githubUrl", value)} />
        <AdminInput label="Demo URL" value={form.demoUrl} onChange={(value) => updateField("demoUrl", value)} />
        <AdminInput label="Role" value={form.role} onChange={(value) => updateField("role", value)} />
        <AdminInput label="Duration" value={form.duration} onChange={(value) => updateField("duration", value)} />
        <AdminInput label="Quy mô / Loại dự án (Team size / Type)" value={form.teamSize} onChange={(value) => updateField("teamSize", value)} />
        <AdminNumber label="Sort order" value={form.sortOrder} onChange={(value) => updateField("sortOrder", value)} />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <AdminCheckbox label="Featured" checked={form.featured} onChange={(value) => updateField("featured", value)} />
        <AdminCheckbox label="Published" checked={form.published} onChange={(value) => updateField("published", value)} />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <AdminTextarea label="Tech stacks (mỗi dòng một item)" value={form.techStacksText} onChange={(value) => updateField("techStacksText", value)} rows={6} />
        <AdminTextarea label="Project images (url|alt|sortOrder)" value={form.projectImagesText} onChange={(value) => updateField("projectImagesText", value)} rows={6} />
        <AdminTextarea label="Highlights (mỗi dòng một ý)" value={form.highlightsText} onChange={(value) => updateField("highlightsText", value)} rows={8} />
        <AdminTextarea label="Languages (mỗi dòng một item)" value={form.languagesText} onChange={(value) => updateField("languagesText", value)} rows={8} />
        <AdminTextarea label="Tools (mỗi dòng một item)" value={form.toolsText} onChange={(value) => updateField("toolsText", value)} rows={8} />
        <AdminTextarea label="Directory tree" value={form.directoryTree} onChange={(value) => updateField("directoryTree", value)} rows={8} />
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

function parseProjectImages(value: string) {
  return value
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line, index) => {
      const [imageUrl, altText = "", sortOrder = String(index + 1)] = line.split("|");
      return {
        imageUrl: imageUrl.trim(),
        altText: altText.trim(),
        sortOrder: Number(sortOrder) || index + 1,
      };
    });
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
        className="w-full resize-y rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium leading-6 text-slate-900 outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10"
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
