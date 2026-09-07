import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
  prismaUrl?: string;
};

function getDatasourceUrl(): string | undefined {
  let url = process.env.DATABASE_URL?.trim();
  if (url && url.startsWith('"') && url.endsWith('"')) {
    url = url.slice(1, -1).trim();
  }
  if (!url) return undefined;
  
  // For Neon serverless adapter, we SHOULD use the pooler URL for better performance
  // in serverless/edge environments. Ensure we use the pooled connection.
  if (!url.includes("-pooler.") && url.includes(".neon.tech")) {
    // If you want to force pooler, you can replace it, but usually Neon provides it.
  }
  
  return url;
}

function initPrisma() {
  return new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });
}

// Lazy initialization using a Proxy
const prisma = new Proxy({} as PrismaClient, {
  get(target, prop) {
    if (!globalForPrisma.prisma) {
      globalForPrisma.prisma = initPrisma();
    }
    return (globalForPrisma.prisma as any)[prop];
  }
});

export { prisma };

// Re-export types from @prisma/client (named exports only, no wildcard for Turbopack compat)
export type { Prisma } from "@prisma/client";
export { PrismaClient } from "@prisma/client";
