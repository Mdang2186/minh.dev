"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2, Edit2, Image as ImageIcon } from "lucide-react";
import { Modal } from "@/components/ui/modal";

type Skill = {
  id: string;
  groupId: string;
  name: string;
  level: string | null;
  iconUrl: string | null;
  sortOrder: number;
};

type SkillGroup = {
  id: string;
  title: string;
  sortOrder: number;
  skills: Skill[];
};

const LEVELS = ["Frequently Used", "Occasionally", "Familiar", "Learning"];

export function SkillsManager() {
  const [groups, setGroups] = useState<SkillGroup[]>([]);
  const [status, setStatus] = useState("");
  
  // Modal states
  const [isAddGroupOpen, setIsAddGroupOpen] = useState(false);
  const [draftGroup, setDraftGroup] = useState({ title: "", sortOrder: 0 });
  const [editGroup, setEditGroup] = useState<SkillGroup | null>(null);

  const [addSkillToGroupId, setAddSkillToGroupId] = useState<string | null>(null);
  const [draftSkill, setDraftSkill] = useState({ name: "", level: "", iconUrl: "", sortOrder: 0 });
  const [editSkill, setEditSkill] = useState<Skill | null>(null);

  async function loadGroups() {
    const response = await fetch("/api/admin/skill-groups", { cache: "no-store" });
    const data = await response.json();
    setGroups(data.groups ?? []);
  }

  useEffect(() => {
    loadGroups();
  }, []);

  // --- Group Actions ---
  async function saveNewGroup() {
    if (!draftGroup.title) return setStatus("Tên nhóm không được trống.");
    const response = await fetch("/api/admin/skill-groups", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(draftGroup),
    });
    if (!response.ok) return setStatus((await response.json()).message || "Không thể thêm nhóm.");
    setDraftGroup({ title: "", sortOrder: 0 });
    setIsAddGroupOpen(false);
    setStatus("Đã thêm nhóm kỹ năng.");
    loadGroups();
  }

  async function saveEditedGroup() {
    if (!editGroup || !editGroup.title) return setStatus("Tên nhóm không được trống.");
    const response = await fetch(`/api/admin/skill-groups/${editGroup.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: editGroup.title, sortOrder: editGroup.sortOrder }),
    });
    if (!response.ok) return setStatus((await response.json()).message || "Không thể lưu nhóm.");
    setEditGroup(null);
    setStatus("Đã lưu nhóm kỹ năng.");
    loadGroups();
  }

  async function deleteGroup(group: SkillGroup) {
    if (!confirm(`Xóa nhóm "${group.title}" và toàn bộ kỹ năng con?`)) return;
    await fetch(`/api/admin/skill-groups/${group.id}`, { method: "DELETE" });
    setStatus("Đã xóa nhóm kỹ năng.");
    loadGroups();
  }

  // --- Skill Actions ---
  function openAddSkill(groupId: string) {
    setDraftSkill({ name: "", level: "", iconUrl: "", sortOrder: 0 });
    setAddSkillToGroupId(groupId);
  }

  async function saveNewSkill() {
    if (!addSkillToGroupId || !draftSkill.name) return setStatus("Tên kỹ năng không được trống.");
    const response = await fetch("/api/admin/skills", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...draftSkill, groupId: addSkillToGroupId }),
    });
    if (!response.ok) return setStatus((await response.json()).message || "Không thể thêm kỹ năng.");
    setAddSkillToGroupId(null);
    setDraftSkill({ name: "", level: "", iconUrl: "", sortOrder: 0 });
    setStatus("Đã thêm kỹ năng.");
    loadGroups();
  }

  async function saveEditedSkill() {
    if (!editSkill || !editSkill.name) return setStatus("Tên kỹ năng không được trống.");
    const response = await fetch(`/api/admin/skills/${editSkill.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        groupId: editSkill.groupId,
        name: editSkill.name,
        level: editSkill.level ?? "",
        iconUrl: editSkill.iconUrl ?? "",
        sortOrder: editSkill.sortOrder,
      }),
    });
    if (!response.ok) return setStatus((await response.json()).message || "Không thể lưu kỹ năng.");
    setEditSkill(null);
    setStatus("Đã lưu kỹ năng.");
    loadGroups();
  }

  async function deleteSkill(skill: Skill) {
    if (!confirm(`Xóa kỹ năng "${skill.name}"?`)) return;
    await fetch(`/api/admin/skills/${skill.id}`, { method: "DELETE" });
    setStatus("Đã xóa kỹ năng.");
    loadGroups();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-black text-slate-900">Quản lý Kỹ năng</h2>
        <button type="button" onClick={() => setIsAddGroupOpen(true)} className="rounded-xl bg-cyan-500 px-4 py-2.5 text-sm font-black text-white hover:bg-cyan-600 transition-colors flex items-center gap-2">
          <Plus className="h-4 w-4" /> Thêm Nhóm
        </button>
      </div>

      {status && <p className="text-sm font-semibold text-cyan-600">{status}</p>}

      <div className="space-y-6">
        {groups.map((group) => (
          <section key={group.id} className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden transition-all hover:shadow-md">
            {/* Group Header */}
            <div className="flex items-center justify-between bg-slate-50 px-5 py-4 border-b border-slate-200">
              <div>
                <h3 className="text-lg font-bold text-slate-900">{group.title}</h3>
                <p className="text-xs text-slate-500 mt-1">Sort order: {group.sortOrder} &bull; {group.skills.length} skills</p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => openAddSkill(group.id)} className="p-2 text-cyan-600 hover:bg-cyan-50 rounded-lg transition-colors" title="Thêm kỹ năng">
                  <Plus className="h-4 w-4" />
                </button>
                <div className="w-px h-4 bg-slate-300 mx-1"></div>
                <button onClick={() => setEditGroup(group)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Sửa nhóm">
                  <Edit2 className="h-4 w-4" />
                </button>
                <button onClick={() => deleteGroup(group)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Xóa nhóm">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Skills List */}
            <div className="p-5">
              {group.skills.length === 0 ? (
                <div className="text-center py-6 text-slate-500 text-sm border border-slate-200 border-dashed rounded-xl">
                  Nhóm chưa có kỹ năng. Nhấn nút <Plus className="inline h-3 w-3" /> để thêm.
                </div>
              ) : (
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {group.skills.map((skill) => (
                    <div key={skill.id} className="flex items-center justify-between rounded-xl border border-slate-100 bg-white p-3 hover:border-slate-200 hover:shadow-sm transition-all group/skill">
                      <div className="flex items-center gap-3 overflow-hidden">
                        <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                          {skill.iconUrl ? (
                            <img src={skill.iconUrl} alt={skill.name} className="w-4 h-4 object-contain" />
                          ) : (
                            <ImageIcon className="w-4 h-4 text-slate-400" />
                          )}
                        </div>
                        <div className="overflow-hidden">
                          <h4 className="font-bold text-sm text-slate-800 truncate">{skill.name}</h4>
                          <p className="text-xs text-slate-500 truncate">{skill.level || "No level"}</p>
                        </div>
                      </div>
                      <div className="flex items-center opacity-0 group-hover/skill:opacity-100 transition-opacity">
                        <button onClick={() => setEditSkill(skill)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md transition-colors" title="Sửa">
                          <Edit2 className="h-3 w-3" />
                        </button>
                        <button onClick={() => deleteSkill(skill)} className="p-1.5 text-red-600 hover:bg-red-50 rounded-md transition-colors" title="Xóa">
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        ))}
        {groups.length === 0 && (
          <div className="text-center py-10 text-slate-500 bg-white rounded-2xl border border-slate-200 border-dashed">
            Chưa có nhóm kỹ năng nào. Nhấn "Thêm Nhóm" để tạo.
          </div>
        )}
      </div>

      {/* MODALS */}

      {/* Add Group Modal */}
      <Modal isOpen={isAddGroupOpen} onClose={() => setIsAddGroupOpen(false)} title="Thêm Nhóm Kỹ Năng">
        <div className="space-y-6">
          <div className="grid gap-4">
            <AdminInput label="Tên nhóm mới" value={draftGroup.title} onChange={(value) => setDraftGroup((c) => ({ ...c, title: value }))} required />
            <AdminNumber label="Sort Order" value={draftGroup.sortOrder} onChange={(value) => setDraftGroup((c) => ({ ...c, sortOrder: value }))} />
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button onClick={() => setIsAddGroupOpen(false)} className="rounded-xl px-4 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-100 transition-colors">Hủy</button>
            <button onClick={saveNewGroup} className="rounded-xl bg-cyan-500 px-6 py-2.5 text-sm font-black text-white hover:bg-cyan-600 transition-colors">Thêm nhóm</button>
          </div>
        </div>
      </Modal>

      {/* Edit Group Modal */}
      <Modal isOpen={!!editGroup} onClose={() => setEditGroup(null)} title="Sửa Nhóm Kỹ Năng">
        {editGroup && (
          <div className="space-y-6">
            <div className="grid gap-4">
              <AdminInput label="Tên nhóm" value={editGroup.title} onChange={(value) => setEditGroup({ ...editGroup, title: value } as SkillGroup)} required />
              <AdminNumber label="Sort Order" value={editGroup.sortOrder} onChange={(value) => setEditGroup({ ...editGroup, sortOrder: value } as SkillGroup)} />
            </div>
            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
              <button onClick={() => setEditGroup(null)} className="rounded-xl px-4 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-100 transition-colors">Hủy</button>
              <button onClick={saveEditedGroup} className="rounded-xl bg-cyan-500 px-6 py-2.5 text-sm font-black text-white hover:bg-cyan-600 transition-colors">Lưu nhóm</button>
            </div>
          </div>
        )}
      </Modal>

      {/* Add Skill Modal */}
      <Modal isOpen={!!addSkillToGroupId} onClose={() => setAddSkillToGroupId(null)} title="Thêm Kỹ Năng">
        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <AdminInput label="Tên kỹ năng" value={draftSkill.name} onChange={(value) => setDraftSkill((c) => ({ ...c, name: value }))} required />
            <AdminSelect label="Mức độ (Level)" value={draftSkill.level} onChange={(value) => setDraftSkill((c) => ({ ...c, level: value }))} options={LEVELS} />
            <div className="md:col-span-2">
              <AdminInput label="Logo URL / Icon" value={draftSkill.iconUrl} onChange={(value) => setDraftSkill((c) => ({ ...c, iconUrl: value }))} placeholder="VD: /icons/react.svg" icon={<ImageIcon className="h-4 w-4 text-slate-400" />} />
            </div>
            <AdminNumber label="Sort Order" value={draftSkill.sortOrder} onChange={(value) => setDraftSkill((c) => ({ ...c, sortOrder: value }))} />
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button onClick={() => setAddSkillToGroupId(null)} className="rounded-xl px-4 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-100 transition-colors">Hủy</button>
            <button onClick={saveNewSkill} className="rounded-xl bg-cyan-500 px-6 py-2.5 text-sm font-black text-white hover:bg-cyan-600 transition-colors">Thêm kỹ năng</button>
          </div>
        </div>
      </Modal>

      {/* Edit Skill Modal */}
      <Modal isOpen={!!editSkill} onClose={() => setEditSkill(null)} title="Sửa Kỹ Năng">
        {editSkill && (
          <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <AdminInput label="Tên kỹ năng" value={editSkill.name} onChange={(value) => setEditSkill({ ...editSkill, name: value } as Skill)} required />
              <AdminSelect label="Mức độ (Level)" value={editSkill.level ?? ""} onChange={(value) => setEditSkill({ ...editSkill, level: value } as Skill)} options={LEVELS} />
              <div className="md:col-span-2">
                <AdminInput label="Logo URL / Icon" value={editSkill.iconUrl ?? ""} onChange={(value) => setEditSkill({ ...editSkill, iconUrl: value } as Skill)} placeholder="VD: /icons/react.svg" icon={<ImageIcon className="h-4 w-4 text-slate-400" />} />
              </div>
              <AdminNumber label="Sort Order" value={editSkill.sortOrder} onChange={(value) => setEditSkill({ ...editSkill, sortOrder: value } as Skill)} />
            </div>
            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
              <button onClick={() => setEditSkill(null)} className="rounded-xl px-4 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-100 transition-colors">Hủy</button>
              <button onClick={saveEditedSkill} className="rounded-xl bg-cyan-500 px-6 py-2.5 text-sm font-black text-white hover:bg-cyan-600 transition-colors">Lưu thay đổi</button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

function AdminInput({
  label,
  value,
  onChange,
  required,
  placeholder,
  icon
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  placeholder?: string;
  icon?: React.ReactNode;
}) {
  return (
    <label className="block space-y-2">
      <span className="text-xs font-bold text-slate-600">{label}</span>
      <div className="relative">
        {icon && <div className="absolute left-3 top-1/2 -translate-y-1/2">{icon}</div>}
        <input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          required={required}
          placeholder={placeholder}
          className={`w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 text-sm font-medium text-slate-900 outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all ${icon ? 'pl-9 pr-3' : 'px-3'}`}
        />
      </div>
    </label>
  );
}

function AdminSelect({
  label,
  value,
  onChange,
  options
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
}) {
  return (
    <label className="block space-y-2">
      <span className="text-xs font-bold text-slate-600">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-medium text-slate-900 outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
      >
        <option value="">-- Chọn --</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
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
      <span className="text-xs font-bold text-slate-600">{label}</span>
      <input
        type="number"
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-medium text-slate-900 outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
      />
    </label>
  );
}
