import Link from "next/link";
import { loginAction } from "@/auth/auth.actions";
import { Container } from "@/components/common/container";

export default function LoginPage({
  searchParams,
}: {
  searchParams?: { error?: string };
}) {
  const error = searchParams?.error;

  return (
    <Container className="py-12">
      <div className="mx-auto max-w-md rounded-3xl border p-6">
        <h1 className="text-2xl font-semibold tracking-tight">Admin Login</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Demo account: <span className="font-medium">admin@site.local</span> /{" "}
          <span className="font-medium">123456</span>
        </p>

        {error ? (
          <div className="mt-4 rounded-xl border p-3 text-sm">
            Sai email hoặc mật khẩu.
          </div>
        ) : null}

        <form className="mt-6 grid gap-3" action={loginAction}>
          <div className="grid gap-2">
            <label className="text-sm font-medium">Email</label>
            <input
              name="email"
              className="h-10 rounded-xl border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
              placeholder="admin@site.local"
              defaultValue="admin@site.local"
            />
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium">Password</label>
            <input
              name="password"
              type="password"
              className="h-10 rounded-xl border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
              placeholder="123456"
              defaultValue="123456"
            />
          </div>

          <button
            type="submit"
            className="mt-2 h-10 rounded-xl border px-4 text-sm font-medium hover:bg-muted"
          >
            Sign in
          </button>
        </form>

        <div className="mt-5 text-sm">
          <Link className="underline underline-offset-4" href="/">
            ← Back to Home
          </Link>
        </div>
      </div>
    </Container>
  );
}
