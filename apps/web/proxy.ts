import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ADMIN_SESSION_COOKIE, verifyAdminSession } from "@/lib/admin/session";
import createIntlMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

const intlMiddleware = createIntlMiddleware(routing);

export async function proxy(req: NextRequest) {
  // 1. Run next-intl middleware first to handle redirects and locale injection
  const res = intlMiddleware(req);

  const { pathname } = req.nextUrl;

  // 2. Intercept admin routes for authentication
  const isAdminRoute = /^\/(en|vi|ja|fr|es|zh|ko)\/admin(\/|$)/.test(pathname) || /^\/admin(\/|$)/.test(pathname);

  if (isAdminRoute) {
    const token = req.cookies.get(ADMIN_SESSION_COOKIE)?.value;
    const session = await verifyAdminSession(token);

    const isLoginPath = pathname.endsWith("/admin/login");

    if (isLoginPath) {
      if (session) {
        const dashboardUrl = new URL(req.url);
        dashboardUrl.pathname = pathname.replace("/admin/login", "/admin/dashboard");
        return NextResponse.redirect(dashboardUrl);
      }
      return res;
    }

    if (!session) {
      const loginUrl = new URL(req.url);
      loginUrl.pathname = pathname.replace(/\/admin.*/, "/admin/login");
      loginUrl.searchParams.set("next", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // 3. For all other routes, return the intl response
  return res;
}

export const config = {
  // Combine matchers: next-intl matcher and admin matcher
  matcher: [
    '/',
    '/(vi|en|ja|fr|es|zh|ko)/:path*',
    '/((?!api|_next|_vercel|.*\\..*).*)'
  ],
};
