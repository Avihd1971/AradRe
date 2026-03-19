// Always import from @prisma/client/edge — uses runtime/edge.js (no eval("__dirname"),
// no native binary). In local dev, next.config.js maps this back to @prisma/client
// so SQLite works without a driver adapter.
import { PrismaClient } from "@prisma/client/edge"
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
 *     (next.config.js aliases @prisma/client/edge → @prisma/client for local builds)
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
