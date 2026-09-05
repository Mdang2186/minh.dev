import { TimelineNodesList } from "@/components/admin/timeline-nodes-list";

export default function AdminTimelineNodesPage() {
  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-cyan-600">My Journey / Timeline</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-900">Timeline Nodes</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
          Quản lý các mốc thời gian (Milestone/Project) và Sprints hiển thị trên trang chủ.
        </p>
      </div>
      <TimelineNodesList />
    </div>
  );
}
