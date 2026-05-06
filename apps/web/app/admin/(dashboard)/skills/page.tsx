import { SkillsManager } from "@/components/admin/skills-manager";

export default function AdminSkillsPage() {
  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-cyan-600">Skills</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-900">Kỹ năng</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
          Thêm nhóm kỹ năng, kỹ năng con, level và thứ tự hiển thị.
        </p>
      </div>
      <SkillsManager />
    </div>
  );
}
