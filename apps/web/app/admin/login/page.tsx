import Link from "next/link";
import { Suspense } from "react";
import { LoginForm } from "@/components/admin/login-form";

export default function AdminLoginPage() {
  return (
    <main className="min-h-screen bg-slate-100 px-4 py-10 text-slate-950">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-md flex-col justify-center">
        <div className="rounded-3xl border border-white bg-white/90 p-8 shadow-2xl shadow-slate-300/40 backdrop-blur">
          <Link href="/" className="mb-8 inline-flex items-center text-sm font-bold text-slate-500 hover:text-cyan-600">
            ← Về portfolio
          </Link>
          <div className="mb-8">
            <p className="text-xs font-black uppercase tracking-[0.28em] text-cyan-600">Admin</p>
            <h1 className="mt-3 text-3xl font-black tracking-tight">Đăng nhập</h1>
            <p className="mt-2 text-sm font-medium leading-6 text-slate-500">
              Quản lý hồ sơ, dự án, kỹ năng, kinh nghiệm và mạng xã hội hiển thị trên portfolio.
            </p>
          </div>
          <Suspense fallback={<p className="text-sm text-slate-500">Đang tải form đăng nhập...</p>}>
            <LoginForm />
          </Suspense>
        </div>
      </div>
    </main>
  );
}
