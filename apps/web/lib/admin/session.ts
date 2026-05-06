import { jwtVerify, SignJWT } from "jose";

export const ADMIN_SESSION_COOKIE = "minh_admin_session";
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

export type AdminSession = {
  userId: string;
  email: string;
  name: string;
  role: "ADMIN";
};

function getJwtSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("JWT_SECRET is required in production.");
    }
    return new TextEncoder().encode("dev-only-secret-change-before-production");
  }

  return new TextEncoder().encode(secret);
}

export async function signAdminSession(session: AdminSession) {
  return new SignJWT(session)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE_SECONDS}s`)
    .sign(getJwtSecret());
}

export async function verifyAdminSession(token?: string | null): Promise<AdminSession | null> {
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, getJwtSecret());
    if (
      typeof payload.userId !== "string" ||
      typeof payload.email !== "string" ||
      typeof payload.name !== "string" ||
      payload.role !== "ADMIN"
    ) {
      return null;
    }

    return {
      userId: payload.userId,
      email: payload.email,
      name: payload.name,
      role: "ADMIN",
    };
  } catch {
    return null;
  }
}

export function adminCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  };
}
