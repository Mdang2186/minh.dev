import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@minh-dev/database";
import { adminCookieOptions, ADMIN_SESSION_COOKIE, signAdminSession } from "@/lib/admin/session";
import { loginSchema, zodErrorMessage } from "@/lib/admin/validators";

export async function POST(request: Request) {
  const parsed = loginSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ message: zodErrorMessage(parsed.error) }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { email: parsed.data.email } });
  if (!user || !user.isActive) {
    return NextResponse.json({ message: "Email hoặc mật khẩu không đúng." }, { status: 401 });
  }

  const isValidPassword = await bcrypt.compare(parsed.data.password, user.passwordHash);
  if (!isValidPassword) {
    return NextResponse.json({ message: "Email hoặc mật khẩu không đúng." }, { status: 401 });
  }

  const token = await signAdminSession({
    userId: user.id,
    email: user.email,
    name: user.name,
    role: "ADMIN",
  });

  const response = NextResponse.json({
    user: { id: user.id, email: user.email, name: user.name, role: user.role },
  });
  response.cookies.set(ADMIN_SESSION_COOKIE, token, adminCookieOptions());

  return response;
}
