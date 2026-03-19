import { NextResponse } from "next/server"
import { getCloudflareContext } from "@opennextjs/cloudflare"
import { getDB } from "@/lib/prisma"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    let source = "unknown"
    let client
    try {
      const { env } = getCloudflareContext()
      if (env.DB) {
        source = "cloudflare-d1"
        client = getDB(env.DB as D1Database)
      } else {
        source = "cloudflare-no-db"
      }
    } catch (e) {
      source = "local-sqlite"
      client = getDB()
    }

    if (!client) {
      return NextResponse.json({ source, error: "no client" }, { status: 500 })
    }

    const count = await client.property.count()
    return NextResponse.json({ source, propertyCount: count, ok: true })
  } catch (e) {
    return NextResponse.json({
      error: String(e),
      stack: e instanceof Error ? e.stack?.split("\n").slice(0, 5).join("\n") : undefined,
    }, { status: 500 })
  }
}
