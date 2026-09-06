import { PrismaClient } from "@prisma/client";
import { Pool, neonConfig } from "@neondatabase/serverless";
import { PrismaNeon } from "@prisma/adapter-neon";
import ws from "ws";

// Setup Neon config to use WebSockets in Node.js environment
neonConfig.webSocketConstructor = ws;

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
  prismaUrl?: string;
};

function getDatasourceUrl(): string | undefined {
  let url = process.env.DATABASE_URL;
  if (!url) return undefined;
  
  // For Neon serverless adapter, we SHOULD use the pooler URL for better performance
  // in serverless/edge environments. Ensure we use the pooled connection.
  if (!url.includes("-pooler.") && url.includes(".neon.tech")) {
    // If you want to force pooler, you can replace it, but usually Neon provides it.
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

let prisma: PrismaClient;

if (!targetUrl) {
  prisma = globalForPrisma.prisma ?? new PrismaClient();
} else {
  // Use connection pooling via Neon Serverless driver + Prisma Adapter
  const pool = new Pool({ connectionString: targetUrl });
  pool.on('error', (err) => console.error('Neon pool error:', err));
  
  if (!targetUrl) throw new Error("targetUrl is completely empty in the else block!");
  const maskedUrl = targetUrl.replace(/:[^:@]*@/, ':***@');
  
  try {
    const adapter = new PrismaNeon(pool as any);
    prisma =
      globalForPrisma.prisma ??
      new PrismaClient({
        adapter,
        log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
      });
  } catch (err: any) {
    throw new Error(`PrismaNeon Init Error (URL: ${maskedUrl}): ${err.message}`);
  }
}

globalForPrisma.prisma = prisma;
globalForPrisma.prismaUrl = targetUrl;

export { prisma };

// Re-export types from @prisma/client (named exports only, no wildcard for Turbopack compat)
export type { Prisma } from "@prisma/client";
export { PrismaClient } from "@prisma/client";
