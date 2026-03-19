"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { getCloudflareContext } from "@opennextjs/cloudflare"
import { getDB } from "@/lib/prisma"
import type { FilterParams, PropertyData } from "@/types"

function db() {
  try {
    const { env } = getCloudflareContext()
    if (env.DB) return getDB(env.DB as D1Database)
  } catch {
    // Not in a Cloudflare Workers context — fall through to local SQLite
  }
  return getDB()
}

export async function getProperties(filters?: FilterParams): Promise<PropertyData[]> {
  const client = db()
  const where: Record<string, unknown> = {}

  if (filters?.search) {
    where.OR = [
      { title: { contains: filters.search } },
      { location: { contains: filters.search } },
      { description: { contains: filters.search } },
    ]
  }
  if (filters?.type) where.type = filters.type
  if (filters?.category) where.category = filters.category
  if (filters?.minPrice || filters?.maxPrice) {
    where.price = {}
    if (filters.minPrice) (where.price as Record<string, number>).gte = filters.minPrice
    if (filters.maxPrice) (where.price as Record<string, number>).lte = filters.maxPrice
  }

  return client.property.findMany({ where, orderBy: { createdAt: "desc" } })
}

export async function getActiveProperties(filters?: FilterParams): Promise<PropertyData[]> {
  const client = db()
  const where: Record<string, unknown> = { status: "ACTIVE" }

  if (filters?.search) {
    where.OR = [
      { title: { contains: filters.search } },
      { location: { contains: filters.search } },
    ]
  }
  if (filters?.type) where.type = filters.type
  if (filters?.category) where.category = filters.category
  if (filters?.minPrice || filters?.maxPrice) {
    where.price = {}
    if (filters.minPrice) (where.price as Record<string, number>).gte = filters.minPrice
    if (filters.maxPrice) (where.price as Record<string, number>).lte = filters.maxPrice
  }

  return client.property.findMany({ where, orderBy: { createdAt: "desc" } })
}

export async function getFeaturedProperties(): Promise<PropertyData[]> {
  return db().property.findMany({
    where: { featured: true, status: "ACTIVE" },
    orderBy: { createdAt: "desc" },
    take: 6,
  })
}

export async function getPropertyById(id: string): Promise<PropertyData | null> {
  return db().property.findUnique({ where: { id } })
}

export async function createProperty(formData: FormData): Promise<void> {
  const imagesRaw = (formData.get("images") as string) || ""
  const images = JSON.stringify(
    imagesRaw.split("\n").map((s) => s.trim()).filter(Boolean)
  )

  await db().property.create({
    data: {
      title: formData.get("title") as string,
      price: parseFloat(formData.get("price") as string),
      type: formData.get("type") as string,
      category: formData.get("category") as string,
      location: formData.get("location") as string,
      area: parseFloat(formData.get("area") as string),
      bedrooms: formData.get("bedrooms") ? parseInt(formData.get("bedrooms") as string) : null,
      bathrooms: formData.get("bathrooms") ? parseInt(formData.get("bathrooms") as string) : null,
      description: formData.get("description") as string,
      images,
      status: (formData.get("status") as string) || "ACTIVE",
      featured: formData.get("featured") === "true",
    },
  })

  revalidatePath("/admin")
  revalidatePath("/")
  revalidatePath("/properties")
  redirect("/admin")
}

export async function updateProperty(id: string, formData: FormData): Promise<void> {
  const imagesRaw = (formData.get("images") as string) || ""
  const images = JSON.stringify(
    imagesRaw.split("\n").map((s) => s.trim()).filter(Boolean)
  )

  await db().property.update({
    where: { id },
    data: {
      title: formData.get("title") as string,
      price: parseFloat(formData.get("price") as string),
      type: formData.get("type") as string,
      category: formData.get("category") as string,
      location: formData.get("location") as string,
      area: parseFloat(formData.get("area") as string),
      bedrooms: formData.get("bedrooms") ? parseInt(formData.get("bedrooms") as string) : null,
      bathrooms: formData.get("bathrooms") ? parseInt(formData.get("bathrooms") as string) : null,
      description: formData.get("description") as string,
      images,
      status: formData.get("status") as string,
      featured: formData.get("featured") === "true",
    },
  })

  revalidatePath("/admin")
  revalidatePath("/")
  revalidatePath("/properties")
  redirect("/admin")
}

export async function deleteProperty(id: string): Promise<void> {
  await db().property.delete({ where: { id } })
  revalidatePath("/admin")
  revalidatePath("/")
  revalidatePath("/properties")
}

export async function toggleFeatured(id: string, value: boolean): Promise<void> {
  await db().property.update({ where: { id }, data: { featured: value } })
  revalidatePath("/admin")
  revalidatePath("/")
}

export async function toggleStatus(id: string, value: string): Promise<void> {
  await db().property.update({ where: { id }, data: { status: value } })
  revalidatePath("/admin")
  revalidatePath("/")
  revalidatePath("/properties")
}
