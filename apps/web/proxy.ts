import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ADMIN_SESSION_COOKIE, verifyAdminSession } from "@/lib/admin/session";

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  const session = await verifyAdminSession(token);

  if (pathname === "/admin/login") {
    if (session) {
      return NextResponse.redirect(new URL("/admin/dashboard", req.url));
    }
    return NextResponse.next();
  }

  if (!session) {
    const loginUrl = new URL("/admin/login", req.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
