import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { getCloudflareContext } from "@opennextjs/cloudflare"

export const dynamic = "force-dynamic"

const MAX_SIZE = 5 * 1024 * 1024 // 5 MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif"]

export async function POST(req: NextRequest) {
  // Auth check
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const formData = await req.formData()
  const file = formData.get("file") as File | null

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 })
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json(
      { error: "Invalid file type. Allowed: JPEG, PNG, WebP, AVIF" },
      { status: 400 },
    )
  }

  if (file.size > MAX_SIZE) {
    return NextResponse.json(
      { error: "File too large. Max 5 MB" },
      { status: 400 },
    )
  }

  // Generate a unique key
  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg"
  const key = `properties/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`

  try {
    const { env } = getCloudflareContext()
    const bucket = env.IMAGES

    if (!bucket) {
      return NextResponse.json(
        { error: "Image storage not configured" },
        { status: 500 },
      )
    }

    const arrayBuffer = await file.arrayBuffer()
    await bucket.put(key, arrayBuffer, {
      httpMetadata: { contentType: file.type },
    })

    // Return the internal serving path
    const url = `/api/images/${key}`
    return NextResponse.json({ url, key })
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
