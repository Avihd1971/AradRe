// In a regular build this is @prisma/client.
// When TARGET_PLATFORM=cloudflare the webpack alias in next.config.js
// silently swaps it for @prisma/client/edge — no native engine, no eval().
import { PrismaClient } from "@prisma/client"
import { PrismaD1 } from "@prisma/adapter-d1"

declare global {
  // eslint-disable-next-line no-var
  var __prisma: PrismaClient | undefined
}

/**
 * Returns a Prisma client for the current environment.
 *
 * - Cloudflare Workers (d1 binding provided):
 *     @prisma/client/edge + PrismaD1 adapter — pure-JS, no native binary.
 * - Node.js / local dev (no binding):
 *     @prisma/client singleton backed by the local SQLite file.
 */
export function getDB(d1?: D1Database): PrismaClient {
  if (d1) {
    const adapter = new PrismaD1(d1)
    return new PrismaClient({ adapter } as never)
  }
  if (!globalThis.__prisma) {
    globalThis.__prisma = new PrismaClient()
  }
  return globalThis.__prisma
}

// Convenience singleton used by seed scripts (Node.js only)
export const prisma: PrismaClient =
  globalThis.__prisma ?? (globalThis.__prisma = new PrismaClient())
