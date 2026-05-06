"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { LockKeyhole, Mail } from "lucide-react";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const data = await response.json().catch(() => null);
      setError(data?.message || "Không thể đăng nhập.");
      setLoading(false);
      return;
    }

    router.push(searchParams?.get("next") || "/admin/dashboard");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {error}
        </div>
      ) : null}

      <label className="block space-y-2">
        <span className="text-sm font-bold text-slate-700">Email</span>
        <span className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 focus-within:border-cyan-500 focus-within:ring-4 focus-within:ring-cyan-500/10">
          <Mail className="h-4 w-4 text-slate-400" />
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="w-full bg-transparent text-sm font-medium outline-none"
            placeholder="admin@example.com"
            required
          />
        </span>
      </label>

      <label className="block space-y-2">
        <span className="text-sm font-bold text-slate-700">Mật khẩu</span>
        <span className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 focus-within:border-cyan-500 focus-within:ring-4 focus-within:ring-cyan-500/10">
          <LockKeyhole className="h-4 w-4 text-slate-400" />
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="w-full bg-transparent text-sm font-medium outline-none"
            placeholder="••••••••"
            required
          />
        </span>
      </label>

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-xl bg-slate-950 px-5 py-3 text-sm font-black text-white transition-colors hover:bg-cyan-600 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "Đang đăng nhập..." : "Đăng nhập admin"}
      </button>
    </form>
  );
}
