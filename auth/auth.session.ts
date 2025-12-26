import { cookies } from "next/headers";
import { authConfig } from "./auth.config";

export type SessionUser = {
  email: string;
  role: "admin";
};

export async function getSession(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const c = cookieStore.get(authConfig.cookieName)?.value;

  if (!c) return null;

  // cookie value: "admin:<email>"
  if (!c.startsWith("admin:")) return null;

  const email = c.slice("admin:".length);
  if (!email) return null;

  return { email, role: "admin" };
}

export async function setAdminSession(email: string) {
  const cookieStore = await cookies();
  cookieStore.set(authConfig.cookieName, `admin:${email}`, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
  });
}

export async function clearSession() {
  const cookieStore = await cookies();
  cookieStore.set(authConfig.cookieName, "", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}
