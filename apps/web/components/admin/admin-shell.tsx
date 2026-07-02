"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  BarChart3,
  BriefcaseBusiness,
  FolderKanban,
  LogOut,
  Share2,
  Sparkles,
  UserRound,
  Languages,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/cn";
import { useAdminLanguage } from "./admin-language-provider";

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
  const { language, setLanguage } = useAdminLanguage();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

        <div className="absolute bottom-20 left-5 right-5 space-y-2 border-t border-slate-200 pt-4">
          <div className="flex items-center gap-2 px-1 text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
            <Languages className="w-3.5 h-3.5" /> Ngôn ngữ hiển thị
          </div>
          <div className="relative">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as any)}
              className="w-full appearance-none rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-bold text-slate-700 outline-none hover:bg-slate-50 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 cursor-pointer transition-colors"
            >
              <option value="en">English (EN)</option>
              <option value="vi">Tiếng Việt (VI)</option>
              <option value="ja">日本語 (JA)</option>
              <option value="fr">Français (FR)</option>
              <option value="es">Español (ES)</option>
              <option value="zh">中文 (ZH)</option>
              <option value="ko">한국어 (KO)</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-500">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
              </svg>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="absolute bottom-6 left-5 right-5 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-600 transition-colors hover:bg-red-50 hover:text-red-600"
        >
          <LogOut className="h-4 w-4" />
          Đăng xuất
        </button>
      </aside>

      <div className="lg:pl-72">
        <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 px-4 py-3 backdrop-blur lg:hidden">
          <div className="flex items-center justify-between gap-3 relative z-50">
            <Link href="/admin/dashboard" className="font-black text-lg text-slate-900 tracking-tight">
              minh.dev
            </Link>
            <div className="flex items-center gap-2">
              <div className="relative flex items-center">
                <Languages className="absolute left-2 w-3.5 h-3.5 text-slate-400" />
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value as any)}
                  className="appearance-none rounded-lg border border-slate-200 bg-white pl-7 pr-6 py-1.5 text-xs font-bold text-slate-700 shadow-sm outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 cursor-pointer"
                >
                  <option value="en">EN</option>
                  <option value="vi">VI</option>
                  <option value="ja">JA</option>
                  <option value="fr">FR</option>
                  <option value="es">ES</option>
                  <option value="zh">ZH</option>
                  <option value="ko">KO</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-1.5 text-slate-500">
                  <svg className="fill-current h-3 w-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                  </svg>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="rounded-lg border border-slate-200 p-1.5 text-slate-600 bg-white shadow-sm hover:bg-slate-50 focus:outline-none transition-colors"
              >
                {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {/* Mobile dropdown menu overlay */}
          {isMobileMenuOpen && (
            <div className="absolute left-0 right-0 top-full z-40 border-b border-slate-200 bg-white px-4 py-4 shadow-xl flex flex-col gap-1.5 animate-in slide-in-from-top-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-colors",
                      active
                        ? "bg-cyan-100 text-cyan-900"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                );
              })}
              <div className="my-2 border-t border-slate-100" />
              <button
                type="button"
                onClick={handleLogout}
                className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50"
              >
                <LogOut className="h-4 w-4" />
                Đăng xuất
              </button>
            </div>
          )}
        </header>

        <main className="mx-auto min-h-screen max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  );
}
