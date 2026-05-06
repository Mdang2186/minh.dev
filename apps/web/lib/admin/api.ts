import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { prisma } from "@minh-dev/database";
import { ADMIN_SESSION_COOKIE, verifyAdminSession } from "./session";

export async function requireAdminUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
  const session = await verifyAdminSession(token);
  if (!session) return null;

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      isActive: true,
    },
  });

  if (!user || !user.isActive || user.role !== "ADMIN") return null;

  return user;
}

export async function requireAdminResponse() {
  const user = await requireAdminUser();
  if (!user) {
    return {
      user: null,
      response: NextResponse.json({ message: "Bạn cần đăng nhập admin." }, { status: 401 }),
    };
  }

  return { user, response: null };
}

export function jsonError(message: string, status = 400) {
  return NextResponse.json({ message }, { status });
}

export async function writeAuditLog(input: {
  action: string;
  entity: string;
  entityId?: string | null;
  message?: string | null;
}) {
  try {
    await prisma.auditLog.create({ data: input });
  } catch (error) {
    console.error("Failed to write audit log", error);
  }
}
