import { PrismaClient } from "@prisma/client"

declare global {
  // eslint-disable-next-line no-var
  var __prisma: PrismaClient | undefined
}

/**
 * Returns a PrismaClient.
 *
 * - Local development (Node.js): uses the standard SQLite client via DATABASE_URL.
 * - Cloudflare Workers: caller must pass a D1 binding; a new client is created
 *   per-request using @prisma/adapter-d1.
 *
 * Pass `d1` (the D1Database binding from getCloudflareContext().env.DB) when
 * running inside a Cloudflare Worker.  In all other environments omit it.
 */
export async function getDB(d1?: D1Database): Promise<PrismaClient> {
  if (d1) {
    const { PrismaD1 } = await import("@prisma/adapter-d1")
    const adapter = new PrismaD1(d1)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return new PrismaClient({ adapter } as any)
  }
  // Node.js / local dev: singleton
  if (!globalThis.__prisma) {
    globalThis.__prisma = new PrismaClient()
  }
  return globalThis.__prisma
}

// Convenience singleton for server actions that already know they're in Node env
export const prisma: PrismaClient =
  globalThis.__prisma ?? (globalThis.__prisma = new PrismaClient())
