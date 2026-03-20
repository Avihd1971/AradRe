import { NextRequest, NextResponse } from "next/server"
import { getCloudflareContext } from "@opennextjs/cloudflare"

export const dynamic = "force-dynamic"

export async function GET(
  _req: NextRequest,
  { params }: { params: { key: string[] } },
) {
  const key = params.key.join("/")

  try {
    const { env } = getCloudflareContext()
    const bucket = env.IMAGES

    if (!bucket) {
      return new NextResponse("Image storage not configured", { status: 500 })
    }

    const object = await bucket.get(key)

    if (!object) {
      return new NextResponse("Not found", { status: 404 })
    }

    const headers = new Headers()
    headers.set(
      "Content-Type",
      object.httpMetadata?.contentType || "image/jpeg",
    )
    headers.set("Cache-Control", "public, max-age=31536000, immutable")

    return new NextResponse(object.body as ReadableStream, { headers })
  } catch {
    return new NextResponse("Error loading image", { status: 500 })
  }
}
