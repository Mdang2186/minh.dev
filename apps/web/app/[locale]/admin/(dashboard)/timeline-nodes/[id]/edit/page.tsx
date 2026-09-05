import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { TimelineNodeForm } from "@/components/admin/timeline-node-form";

export default async function EditTimelineNodePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div className="flex items-center gap-4">
        <Link
          href="/admin/timeline-nodes"
          className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white text-slate-500 shadow-sm transition hover:bg-slate-50 hover:text-slate-900"
        >
          <ChevronLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900">Sửa Timeline Node</h1>
          <p className="mt-1 text-sm text-slate-500">Cập nhật thông tin mốc thời gian.</p>
        </div>
      </div>
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <TimelineNodeForm nodeId={id} />
      </div>
    </div>
  );
}
