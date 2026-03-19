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
 *     PrismaD1 adapter — @opennextjs/cloudflare's esbuild resolves
 *     @prisma/client via the "workerd" package condition to wasm.js
 *     (runtime/wasm.js + WASM query engine, no eval("__dirname")).
 * - Node.js / local dev (no binding):
 *     Singleton backed by the local SQLite file.
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
