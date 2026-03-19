// Static imports — bundled into the Worker at build time
import { PrismaClient } from "@prisma/client"
import { PrismaClient as PrismaClientEdge } from "@prisma/client/edge"
import { PrismaD1 } from "@prisma/adapter-d1"

declare global {
  // eslint-disable-next-line no-var
  var __prisma: PrismaClient | undefined
}

/**
 * Returns a Prisma client appropriate for the current environment.
 *
 * - Cloudflare Workers (d1 binding provided): uses PrismaClientEdge + PrismaD1 adapter.
 *   The edge client has no native engine / no eval() so it works in the Workers sandbox.
 * - Node.js / local dev (no binding): uses the regular client with the SQLite file.
 */
export function getDB(d1?: D1Database): PrismaClient {
  if (d1) {
    const adapter = new PrismaD1(d1)
    // PrismaClientEdge is type-compatible at runtime; cast to satisfy shared typings
    return new PrismaClientEdge({ adapter } as never) as unknown as PrismaClient
  }
  if (!globalThis.__prisma) {
    globalThis.__prisma = new PrismaClient()
  }
  return globalThis.__prisma
}

// Convenience singleton for local dev / seed scripts
export const prisma: PrismaClient =
  globalThis.__prisma ?? (globalThis.__prisma = new PrismaClient())
