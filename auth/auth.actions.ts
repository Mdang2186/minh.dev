"use server";

import { redirect } from "next/navigation";
import { authConfig } from "./auth.config";
import { clearSession, setAdminSession } from "./auth.session";

export async function loginAction(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "").trim();

  const ok =
    email.toLowerCase() === authConfig.admin.email.toLowerCase() &&
    password === authConfig.admin.password;

  if (!ok) {
    redirect("/login?error=invalid");
  }

  setAdminSession(email);
  redirect("/admin");
}

export async function logoutAction() {
  clearSession();
  redirect("/");
}
