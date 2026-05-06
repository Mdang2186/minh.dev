"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Edit3, Eye, EyeOff, Plus, Trash2 } from "lucide-react";

type AdminProject = {
  id: string;
  title: string;
  slug: string;
  summary: string;
  description?: string | null;
  content?: string | null;
  coverImage?: string | null;
  githubUrl?: string | null;
  demoUrl?: string | null;
  role?: string | null;
  duration?: string | null;
  teamSize?: string | null;
  featured: boolean;
  published: boolean;
  sortOrder: number;
  directoryTree?: string | null;
  highlights: string[];
  languages: string[];
  tools: string[];
  techStacks: string[];
  projectImages: Array<{ imageUrl: string; altText?: string; sortOrder?: number }>;
};

export function ProjectsList() {
  const [projects, setProjects] = useState<AdminProject[]>([]);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);

  async function loadProjects() {
    setLoading(true);
    const response = await fetch("/api/admin/projects", { cache: "no-store" });
    const data = await response.json();
    setProjects(data.projects ?? []);
    setLoading(false);
  }

  useEffect(() => {
    loadProjects();
  }, []);

  async function deleteProject(project: AdminProject) {
    if (!confirm(`Xóa dự án "${project.title}"?`)) return;
    const response = await fetch(`/api/admin/projects/${project.id}`, { method: "DELETE" });
    if (!response.ok) {
      const data = await response.json().catch(() => null);
      setStatus(data?.message || "Không thể xóa dự án.");
      return;
    }
    setStatus("Đã xóa dự án.");
    loadProjects();
  }

  async function togglePublished(project: AdminProject) {
    const response = await fetch(`/api/admin/projects/${project.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...project,
        published: !project.published,
        projectImages: project.projectImages,
      }),
    });
    if (!response.ok) {
      const data = await response.json().catch(() => null);
      setStatus(data?.message || "Không thể cập nhật trạng thái.");
      return;
    }
    loadProjects();
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-black text-slate-900">Danh sách dự án</h2>
          {status ? <p className="mt-1 text-sm text-cyan-600">{status}</p> : null}
        </div>
        <Link
          href="/admin/projects/create"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-500 px-4 py-2.5 text-sm font-black text-white transition hover:bg-cyan-600"
        >
          <Plus className="h-4 w-4" />
          Thêm dự án
        </Link>
      </div>

      {loading ? (
        <p className="text-sm text-slate-500">Đang tải dự án...</p>
      ) : projects.length ? (
        <div className="overflow-hidden rounded-2xl border border-slate-200 shadow-sm">
          <div className="divide-y divide-slate-100">
            {projects.map((project) => (
              <div key={project.id} className="grid gap-4 bg-white p-4 md:grid-cols-[1fr_auto] md:items-center">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-black text-slate-900">{project.title}</h3>
                    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-600">
                      /{project.slug}
                    </span>
                    <span className="rounded-full bg-cyan-50 px-2.5 py-1 text-xs font-bold text-cyan-600">
                      sort {project.sortOrder}
                    </span>
                    <span className={project.published ? "text-xs font-bold text-emerald-600" : "text-xs font-bold text-slate-400"}>
                      {project.published ? "Published" : "Hidden"}
                    </span>
                  </div>
                  <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">{project.summary}</p>
                  <p className="mt-2 text-xs font-semibold text-slate-500">
                    {project.techStacks.join(", ") || "Chưa có tech stack"}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => togglePublished(project)}
                    className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50"
                  >
                    {project.published ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    {project.published ? "Ẩn" : "Hiện"}
                  </button>
                  <Link
                    href={`/admin/projects/${project.id}/edit`}
                    className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50"
                  >
                    <Edit3 className="h-4 w-4" />
                    Sửa
                  </Link>
                  <button
                    type="button"
                    onClick={() => deleteProject(project)}
                    className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                    Xóa
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-sm text-slate-500 shadow-sm">
          Chưa có dự án.
        </div>
      )}
    </div>
  );
}
