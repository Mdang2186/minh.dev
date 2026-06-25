import { ProjectsList } from "@/components/admin/projects-list";

export default function AdminProjectsPage() {
  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-cyan-600">Projects</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-900">Dự án</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
          Quản lý dự án public, ảnh minh họa, tech stack và trạng thái published.
        </p>
      </div>
      <ProjectsList />
    </div>
  );
}
