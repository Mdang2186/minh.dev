import { NextResponse } from "next/server";
import { requireAdminUser } from "@/lib/admin/api";

export async function GET() {
  const user = await requireAdminUser();
  if (!user) {
    return NextResponse.json({ user: null }, { status: 401 });
  }

  return NextResponse.json({ user });
}
