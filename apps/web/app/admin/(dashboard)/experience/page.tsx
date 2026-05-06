import { ExperienceManager } from "@/components/admin/experience-manager";

export default function AdminExperiencePage() {
  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-cyan-600">Experience</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-900">Kinh nghiệm</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
          Quản lý timeline kinh nghiệm hoặc vai trò trong dự án, có thể ẩn/hiện từng mục.
        </p>
      </div>
      <ExperienceManager />
    </div>
  );
}
