"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Edit3, Plus, Trash2, GripVertical } from "lucide-react";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

function SortableItem({ node, onDelete }: { node: any; onDelete: (node: any) => void }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: node.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} className="grid gap-4 bg-white p-4 md:grid-cols-[1fr_auto] md:items-center relative">
      <div className="flex items-center gap-3">
        <div {...attributes} {...listeners} className="cursor-grab hover:text-cyan-600 text-slate-400">
          <GripVertical className="h-5 w-5" />
        </div>
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-black text-slate-900">{node.title}</h3>
            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-600">
              {node.date}
            </span>
            <span className="rounded-full bg-cyan-50 px-2.5 py-1 text-xs font-bold text-cyan-600">
              sort {node.sortOrder}
            </span>
            <span className="rounded-full bg-purple-50 px-2.5 py-1 text-xs font-bold text-purple-600">
              {node.type}
            </span>
          </div>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">{node.description || "Không có mô tả"}</p>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        <Link
          href={`/admin/timeline-nodes/${node.id}/edit`}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50"
        >
          <Edit3 className="h-4 w-4" />
          Sửa
        </Link>
        <button
          type="button"
          onClick={() => onDelete(node)}
          className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-50"
        >
          <Trash2 className="h-4 w-4" />
          Xóa
        </button>
      </div>
    </div>
  );
}

export function TimelineNodesList() {
  const [nodes, setNodes] = useState<any[]>([]);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [savingOrder, setSavingOrder] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  async function loadNodes() {
    setLoading(true);
    const response = await fetch("/api/admin/timeline-nodes", { cache: "no-store" });
    const data = await response.json();
    
    // Server currently sorts by date desc, then sortOrder asc.
    // Let's sort them purely by sortOrder ascending here for drag and drop to make sense,
    // or assume the server returns them in the correct visual order.
    // For manual dragging, relying purely on sortOrder is best.
    const sortedNodes = (data.nodes ?? []).sort((a: any, b: any) => a.sortOrder - b.sortOrder);
    setNodes(sortedNodes);
    setLoading(false);
  }

  useEffect(() => {
    loadNodes();
  }, []);

  async function deleteNode(node: any) {
    if (!confirm(`Xóa timeline node "${node.title}"?`)) return;
    const response = await fetch(`/api/admin/timeline-nodes/${node.id}`, { method: "DELETE" });
    if (!response.ok) {
      const data = await response.json().catch(() => null);
      setStatus(data?.message || "Không thể xóa timeline node.");
      return;
    }
    setStatus("Đã xóa timeline node.");
    loadNodes();
  }

  async function handleDragEnd(event: any) {
    const { active, over } = event;

    if (active.id !== over.id) {
      const oldIndex = nodes.findIndex((n) => n.id === active.id);
      const newIndex = nodes.findIndex((n) => n.id === over.id);

      const newNodes = arrayMove(nodes, oldIndex, newIndex);
      // Re-assign sortOrder based on new index
      const updatedNodes = newNodes.map((n, i) => ({ ...n, sortOrder: i }));
      setNodes(updatedNodes);

      // Save to server
      setSavingOrder(true);
      try {
        const response = await fetch("/api/admin/timeline-nodes/reorder", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ order: updatedNodes.map((n) => ({ id: n.id, sortOrder: n.sortOrder })) }),
        });
        if (!response.ok) {
          setStatus("Lỗi khi lưu thứ tự mới.");
          loadNodes(); // Revert
        } else {
          setStatus("Đã cập nhật thứ tự.");
        }
      } catch (err) {
        setStatus("Lỗi mạng khi lưu thứ tự.");
        loadNodes(); // Revert
      } finally {
        setSavingOrder(false);
      }
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-black text-slate-900">Danh sách Timeline Nodes</h2>
          {status ? <p className="mt-1 text-sm text-cyan-600">{status}</p> : null}
        </div>
        <Link
          href="/admin/timeline-nodes/create"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-500 px-4 py-2.5 text-sm font-black text-white transition hover:bg-cyan-600"
        >
          <Plus className="h-4 w-4" />
          Thêm Timeline Node
        </Link>
      </div>

      {loading ? (
        <p className="text-sm text-slate-500">Đang tải danh sách...</p>
      ) : nodes.length ? (
        <div className={`overflow-hidden rounded-2xl border border-slate-200 shadow-sm ${savingOrder ? 'opacity-50 pointer-events-none' : ''}`}>
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={nodes.map((n) => n.id)} strategy={verticalListSortingStrategy}>
              <div className="divide-y divide-slate-100">
                {nodes.map((node) => (
                  <SortableItem key={node.id} node={node} onDelete={deleteNode} />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </div>
      ) : (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-sm text-slate-500 shadow-sm">
          Chưa có Timeline Node nào.
        </div>
      )}
    </div>
  );
}
