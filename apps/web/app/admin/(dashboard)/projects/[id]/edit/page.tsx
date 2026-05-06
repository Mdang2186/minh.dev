import Link from "next/link";
import { ProjectForm } from "@/components/admin/project-form";

export default async function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <div className="space-y-8">
      <div>
        <Link href="/admin/projects" className="text-sm font-bold text-cyan-600 hover:text-cyan-700">
          ← Quay lại dự án
        </Link>
        <h1 className="mt-4 text-3xl font-black tracking-tight text-slate-900">Sửa dự án</h1>
      </div>
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <ProjectForm projectId={id} />
      </section>
    </div>
  );
}
