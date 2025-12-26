import Link from "next/link";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/auth/auth.guard";
import { logoutAction } from "@/auth/auth.actions";
import { Container } from "@/components/common/container";

const nav = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/posts", label: "Posts" },
  { href: "/admin/projects", label: "Projects" },
  { href: "/admin/users", label: "Users" },
  { href: "/admin/settings", label: "Settings" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = requireAdmin();
  if (!session) redirect("/login");

  return (
    <div className="min-h-dvh">
      <header className="border-b">
        <Container className="flex h-14 items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="text-sm font-semibold">
              Admin
            </Link>
            <nav className="hidden gap-3 sm:flex">
              {nav.map((n) => (
                <Link
                  key={n.href}
                  href={n.href}
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  {n.label}
                </Link>
              ))}
            </nav>
          </div>

          <form action={logoutAction}>
            <button className="h-9 rounded-xl border px-3 text-sm font-medium hover:bg-muted">
              Logout
            </button>
          </form>
        </Container>
      </header>

      <main>
        <Container className="py-10">{children}</Container>
      </main>
    </div>
  );
}
