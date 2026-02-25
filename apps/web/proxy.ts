import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(req: NextRequest) {
  // Pass-through since no admin routes to protect
  return NextResponse.next();
}

export const config = {
  matcher: [],
};
