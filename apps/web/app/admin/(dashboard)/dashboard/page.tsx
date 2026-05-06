import { prisma } from "@minh-dev/database";
import { FolderKanban, Share2, Sparkles, UserRound } from "lucide-react";

export const dynamic = "force-dynamic";

type DashboardData = {
  profile: { id: string } | null;
  projectCount: number;
  skillCount: number;
  visibleSocialCount: number;
  recentLogs: Array<{
    id: string;
    action: string;
    entity: string;
    message: string | null;
    createdAt: Date;
  }>;
};

export default async function AdminDashboardPage() {
  const dashboardData = await getDashboardData();
  const { profile, projectCount, skillCount, visibleSocialCount, recentLogs } = dashboardData;

  const cards = [
    { label: "Hồ sơ", value: profile ? "Đã có" : "Chưa có", icon: UserRound },
    { label: "Dự án", value: projectCount, icon: FolderKanban },
    { label: "Kỹ năng", value: skillCount, icon: Sparkles },
    { label: "Social visible", value: visibleSocialCount, icon: Share2 },
  ];

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-cyan-600">Overview</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-900">Tổng quan nội dung</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
          Các thay đổi ở đây sẽ được website public đọc từ PostgreSQL sau khi lưu.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xl">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-slate-500">{card.label}</p>
                  <p className="mt-2 text-3xl font-black text-slate-900">{card.value}</p>
                </div>
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500 text-white shadow-sm">
                  <Icon className="h-5 w-5" />
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-black text-slate-900">Audit log gần đây</h2>
        <div className="mt-4 divide-y divide-slate-100">
          {recentLogs.length ? (
            recentLogs.map((log) => (
              <div key={log.id} className="flex flex-col gap-1 py-3 text-sm sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <span className="font-bold text-cyan-600">{log.action}</span>
                  <span className="text-slate-500"> / {log.entity}</span>
                  {log.message ? <p className="mt-1 text-slate-600">{log.message}</p> : null}
                </div>
                <span className="text-xs font-medium text-slate-400">
                  {log.createdAt.toLocaleString("vi-VN")}
                </span>
              </div>
            ))
          ) : (
            <p className="py-3 text-sm text-slate-500">Chưa có log.</p>
          )}
        </div>
      </section>
    </div>
  );
}

async function getDashboardData(): Promise<DashboardData> {
  try {
    const [profile, projectCount, skillCount, visibleSocialCount, recentLogs] = await Promise.all([
      prisma.siteProfile.findFirst(),
      prisma.project.count(),
      prisma.skill.count(),
      prisma.socialLink.count({ where: { visible: true } }),
      prisma.auditLog.findMany({ orderBy: { createdAt: "desc" }, take: 6 }),
    ]);

    return { profile, projectCount, skillCount, visibleSocialCount, recentLogs };
  } catch (error) {
    console.error("Admin dashboard database read failed", error);
    return {
      profile: null,
      projectCount: 0,
      skillCount: 0,
      visibleSocialCount: 0,
      recentLogs: [],
    };
  }
}
