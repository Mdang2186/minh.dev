import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const COOKIE_NAME = "my_site_session"; // phải khớp authConfig.cookieName của bạn

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Chỉ bảo vệ /admin
  if (!pathname.startsWith("/admin")) return NextResponse.next();

  const cookie = req.cookies.get(COOKIE_NAME)?.value ?? "";
  const ok = cookie.startsWith("admin:");

  if (!ok) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
