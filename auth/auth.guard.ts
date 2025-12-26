import { getSession } from "./auth.session";

export async function requireAdmin() {
  const s = await getSession();
  if (!s || s.role !== "admin") {
    return null;
  }
  return s;
}
