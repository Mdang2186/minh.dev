import Link from "next/link";

export default function AdminDashboardPage() {
  return (
    <div className="grid gap-6">
      <div className="rounded-3xl border p-6">
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Admin area (demo). Sau này bạn có thể gắn database để quản trị thật.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Link href="/admin/posts" className="rounded-2xl border p-5 hover:bg-muted">
          <div className="text-base font-semibold">Manage Posts</div>
          <p className="mt-2 text-sm text-muted-foreground">Danh sách bài viết (demo).</p>
        </Link>

        <Link href="/admin/projects" className="rounded-2xl border p-5 hover:bg-muted">
          <div className="text-base font-semibold">Manage Projects</div>
          <p className="mt-2 text-sm text-muted-foreground">Danh sách dự án (demo).</p>
        </Link>

        <Link href="/admin/users" className="rounded-2xl border p-5 hover:bg-muted">
          <div className="text-base font-semibold">Users</div>
          <p className="mt-2 text-sm text-muted-foreground">Quản lý user (placeholder).</p>
        </Link>

        <Link href="/admin/settings" className="rounded-2xl border p-5 hover:bg-muted">
          <div className="text-base font-semibold">Settings</div>
          <p className="mt-2 text-sm text-muted-foreground">Cấu hình hệ thống (placeholder).</p>
        </Link>
      </div>
    </div>
  );
}
