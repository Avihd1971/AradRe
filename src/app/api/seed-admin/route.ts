import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { getCloudflareContext } from "@opennextjs/cloudflare"
import { getDB } from "@/lib/prisma"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    let client
    try {
      const { env } = getCloudflareContext()
      if (env.DB) client = getDB(env.DB as D1Database)
    } catch {
      client = getDB()
    }
    if (!client) client = getDB()

    // Check if admin already exists
    const existing = await client.user.findUnique({
      where: { email: "admin@aradre.com" },
    })

    if (existing) {
      return NextResponse.json({ status: "admin already exists", id: existing.id })
    }

    const hash = await bcrypt.hash("admin123", 12)
    const user = await client.user.create({
      data: {
        id: "admin-001",
        email: "admin@aradre.com",
        password: hash,
        name: "Admin",
      },
    })

    return NextResponse.json({ status: "admin created", id: user.id })
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
