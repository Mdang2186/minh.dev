import { EducationManager } from "@/components/admin/education-manager";

export default function AdminEducationPage() {
  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-cyan-600">Education</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-900">Học vấn</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
          Quản lý thông tin bằng cấp, chứng chỉ học vấn.
        </p>
      </div>
      <EducationManager />
    </div>
  );
}
