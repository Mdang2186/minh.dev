"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  BarChart3,
  BriefcaseBusiness,
  FolderKanban,
  LogOut,
  Share2,
  Sparkles,
  UserRound,
} from "lucide-react";
import { cn } from "@/lib/cn";

const navItems = [
  { href: "/admin/dashboard", label: "Tổng quan", icon: BarChart3 },
  { href: "/admin/profile", label: "Hồ sơ cá nhân", icon: UserRound },
  { href: "/admin/projects", label: "Dự án", icon: FolderKanban },
  { href: "/admin/skills", label: "Kỹ năng", icon: Sparkles },
  { href: "/admin/experience", label: "Kinh nghiệm", icon: BriefcaseBusiness },
  { href: "/admin/social-links", label: "Mạng xã hội", icon: Share2 },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? "";
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <aside className="fixed inset-y-0 left-0 hidden w-72 border-r border-slate-200 bg-white/95 px-5 py-6 lg:block">
        <Link href="/admin/dashboard" className="flex items-center gap-3 rounded-2xl px-3 py-2">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-cyan-500 text-white font-black">
            M
          </span>
          <span>
            <span className="block text-sm font-black tracking-tight">minh.dev</span>
            <span className="block text-xs text-slate-500">Content Admin</span>
          </span>
        </Link>

        <nav className="mt-9 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors",
                  active
                    ? "bg-cyan-100 text-cyan-900"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <button
          type="button"
          onClick={handleLogout}
          className="absolute bottom-6 left-5 right-5 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
        >
          <LogOut className="h-4 w-4" />
          Đăng xuất
        </button>
      </aside>

      <div className="lg:pl-72">
        <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/85 px-4 py-3 backdrop-blur lg:hidden">
          <div className="flex items-center justify-between gap-3">
            <Link href="/admin/dashboard" className="font-black">
              minh.dev admin
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold hover:bg-slate-100"
            >
              Đăng xuất
            </button>
          </div>
          <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "shrink-0 rounded-full px-3 py-1.5 text-xs font-bold",
                  pathname === item.href ? "bg-cyan-100 text-cyan-900" : "bg-slate-100 text-slate-600"
                )}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </header>

        <main className="mx-auto min-h-screen max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  );
}
