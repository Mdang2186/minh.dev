import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
  prismaUrl?: string;
};

function getDatasourceUrl(): string | undefined {
  let url = process.env.DATABASE_URL;
  if (!url) return undefined;
  // Use direct connection without PgBouncer pooler to guarantee transaction stability
  if (url.includes("-pooler.")) {
    url = url.replace("-pooler.", ".");
  }
  // Ensure connection parameters for stability
  if (!url.includes("connect_timeout")) {
    const separator = url.includes("?") ? "&" : "?";
    url = `${url}${separator}connect_timeout=30&pool_timeout=30`;
  }
  return url;
}

const targetUrl = getDatasourceUrl();

// Disconnect and remove stale cached client from globalThis if URL changed or stale
if (globalForPrisma.prisma && globalForPrisma.prismaUrl !== targetUrl) {
  try {
    globalForPrisma.prisma.$disconnect().catch(() => {});
  } catch {}
  delete globalForPrisma.prisma;
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
    datasourceUrl: targetUrl,
  });

globalForPrisma.prisma = prisma;
globalForPrisma.prismaUrl = targetUrl;

// Re-export types from @prisma/client (named exports only, no wildcard for Turbopack compat)
export type { Prisma } from "@prisma/client";
export { PrismaClient } from "@prisma/client";
