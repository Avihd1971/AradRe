"use client"

import { useState, useRef, useTransition, useCallback } from "react"
import Image from "next/image"
import { createProperty, updateProperty } from "@/lib/actions/property.actions"
import { parseImages } from "@/lib/utils"
import type { PropertyData } from "@/types"

const TYPES = ["SALE", "RENT"]
const CATEGORIES = ["APARTMENT", "HOUSE", "VILLA", "LAND", "COMMERCIAL"]
const STATUSES = ["ACTIVE", "INACTIVE", "SOLD"]

const inputCls =
  "w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
const labelCls = "block text-sm font-medium text-gray-700 mb-1"

const MAX_WIDTH = 1600
const MAX_HEIGHT = 1200
const QUALITY = 0.85

/** Resize image on the client before uploading */
function resizeImage(file: File): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = document.createElement("img")
    const url = URL.createObjectURL(file)
    img.onload = () => {
      URL.revokeObjectURL(url)
      let { width, height } = img
      if (width > MAX_WIDTH || height > MAX_HEIGHT) {
        const ratio = Math.min(MAX_WIDTH / width, MAX_HEIGHT / height)
        width = Math.round(width * ratio)
        height = Math.round(height * ratio)
      }
      const canvas = document.createElement("canvas")
      canvas.width = width
      canvas.height = height
      const ctx = canvas.getContext("2d")!
      ctx.drawImage(img, 0, 0, width, height)
      canvas.toBlob(
        (blob) => (blob ? resolve(blob) : reject(new Error("Failed to resize"))),
        "image/jpeg",
        QUALITY,
      )
    }
    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error("Failed to load image"))
    }
    img.src = url
  })
}

interface ImageItem {
  url: string
  uploading?: boolean
  error?: string
}

export default function PropertyForm({ property }: { property?: PropertyData }) {
  const [pending, startTransition] = useTransition()
  const isEdit = !!property
  const fileRef = useRef<HTMLInputElement>(null)
  const [dragOver, setDragOver] = useState(false)

  const existing = property ? parseImages(property.images) : []
  const [images, setImages] = useState<ImageItem[]>(
    existing.map((url) => ({ url })),
  )

  const uploadFile = useCallback(async (file: File) => {
    const tempId = `temp-${Date.now()}-${Math.random()}`
    const preview = URL.createObjectURL(file)

    setImages((prev) => [...prev, { url: preview, uploading: true }])

    try {
      const resized = await resizeImage(file)
      const form = new FormData()
      form.append("file", resized, file.name.replace(/\.[^.]+$/, ".jpg"))

      const res = await fetch("/api/upload", { method: "POST", body: form })
      const data: { url?: string; error?: string } = await res.json()

      if (!res.ok) throw new Error(data.error || "Upload failed")

      setImages((prev) =>
        prev.map((img) =>
          img.url === preview ? { url: data.url!, uploading: false } : img,
        ),
      )
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Upload failed"
      setImages((prev) =>
        prev.map((img) =>
          img.url === preview ? { ...img, uploading: false, error: msg } : img,
        ),
      )
    }
  }, [])

  function handleFiles(files: FileList | File[]) {
    const allowed = ["image/jpeg", "image/png", "image/webp", "image/avif"]
    Array.from(files).forEach((file) => {
      if (allowed.includes(file.type)) uploadFile(file)
    })
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setDragOver(false)
    if (e.dataTransfer.files.length) handleFiles(e.dataTransfer.files)
  }

  function removeImage(idx: number) {
    setImages((prev) => prev.filter((_, i) => i !== idx))
  }

  function moveImage(from: number, to: number) {
    if (to < 0 || to >= images.length) return
    setImages((prev) => {
      const next = [...prev]
      const [item] = next.splice(from, 1)
      next.splice(to, 0, item)
      return next
    })
  }

  function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    // Replace images field with our managed URLs (exclude errored ones)
    const urls = images.filter((i) => !i.error && !i.uploading).map((i) => i.url)
    data.set("images", urls.join("\n"))

    startTransition(async () => {
      if (isEdit && property) {
        await updateProperty(property.id, data)
      } else {
        await createProperty(data)
      }
    })
  }

  const anyUploading = images.some((i) => i.uploading)

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Info */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 className="font-semibold text-gray-900 mb-4">Basic Information</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className={labelCls}>Title *</label>
            <input
              name="title"
              required
              defaultValue={property?.title}
              placeholder="Modern 3-Bedroom Apartment in Downtown"
              className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls}>Type *</label>
            <select name="type" required defaultValue={property?.type || "SALE"} className={inputCls}>
              {TYPES.map((t) => (
                <option key={t} value={t}>{t === "SALE" ? "For Sale" : "For Rent"}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelCls}>Category *</label>
            <select name="category" required defaultValue={property?.category || "APARTMENT"} className={inputCls}>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c.charAt(0) + c.slice(1).toLowerCase()}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelCls}>Status *</label>
            <select name="status" required defaultValue={property?.status || "ACTIVE"} className={inputCls}>
              {STATUSES.map((s) => (
                <option key={s} value={s}>{s.charAt(0) + s.slice(1).toLowerCase()}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelCls}>Featured</label>
            <select name="featured" defaultValue={property?.featured ? "true" : "false"} className={inputCls}>
              <option value="false">No</option>
              <option value="true">Yes — show on homepage</option>
            </select>
          </div>
        </div>
      </div>

      {/* Location & Price */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 className="font-semibold text-gray-900 mb-4">Location & Price</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className={labelCls}>Location *</label>
            <input
              name="location"
              required
              defaultValue={property?.location}
              placeholder="Downtown, New York"
              className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls}>Price (USD) *</label>
            <input
              name="price"
              type="number"
              step="any"
              required
              defaultValue={property?.price}
              placeholder="450000"
              className={inputCls}
            />
          </div>
        </div>
      </div>

      {/* Property Details */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 className="font-semibold text-gray-900 mb-4">Property Details</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className={labelCls}>Area (m²) *</label>
            <input
              name="area"
              type="number"
              step="any"
              required
              defaultValue={property?.area}
              placeholder="120"
              className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls}>Bedrooms</label>
            <input
              name="bedrooms"
              type="number"
              defaultValue={property?.bedrooms ?? ""}
              placeholder="3"
              className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls}>Bathrooms</label>
            <input
              name="bathrooms"
              type="number"
              defaultValue={property?.bathrooms ?? ""}
              placeholder="2"
              className={inputCls}
            />
          </div>
          <div className="sm:col-span-3">
            <label className={labelCls}>Description *</label>
            <textarea
              name="description"
              required
              rows={5}
              defaultValue={property?.description}
              placeholder="Describe the property features, condition, nearby amenities…"
              className={`${inputCls} resize-none`}
            />
          </div>
        </div>
      </div>

      {/* Images */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 className="font-semibold text-gray-900 mb-1">Property Images</h2>
        <p className="text-xs text-gray-400 mb-4">
          Drag & drop or click to upload. JPEG, PNG, WebP — max 5 MB each. Images auto-resize to 1600×1200.
        </p>

        {/* Drop zone */}
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
            dragOver
              ? "border-blue-400 bg-blue-50"
              : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
          }`}
        >
          <svg className="w-10 h-10 mx-auto text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="text-sm text-gray-500">
            <span className="text-blue-600 font-medium">Click to upload</span> or drag and drop
          </p>
          <p className="text-xs text-gray-400 mt-1">JPEG, PNG, WebP, AVIF up to 5 MB</p>
        </div>

        <input
          ref={fileRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/avif"
          multiple
          className="hidden"
          onChange={(e) => e.target.files && handleFiles(e.target.files)}
        />

        {/* Image grid */}
        {images.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mt-4">
            {images.map((img, idx) => (
              <div
                key={`${img.url}-${idx}`}
                className="group relative aspect-[4/3] rounded-xl overflow-hidden bg-gray-100 border border-gray-200"
              >
                <Image
                  src={img.url}
                  alt={`Image ${idx + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />

                {/* Uploading overlay */}
                {img.uploading && (
                  <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
                    <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" />
                  </div>
                )}

                {/* Error overlay */}
                {img.error && (
                  <div className="absolute inset-0 bg-red-50/90 flex flex-col items-center justify-center p-2">
                    <svg className="w-6 h-6 text-red-400 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-xs text-red-600 text-center">{img.error}</p>
                  </div>
                )}

                {/* Cover badge */}
                {idx === 0 && !img.uploading && !img.error && (
                  <span className="absolute top-2 left-2 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-600 text-white">
                    Cover
                  </span>
                )}

                {/* Action buttons */}
                {!img.uploading && (
                  <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {idx > 0 && (
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); moveImage(idx, idx - 1) }}
                        className="w-7 h-7 rounded-full bg-white/90 shadow flex items-center justify-center hover:bg-white"
                        title="Move left"
                      >
                        <svg className="w-3.5 h-3.5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>
                    )}
                    {idx < images.length - 1 && (
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); moveImage(idx, idx + 1) }}
                        className="w-7 h-7 rounded-full bg-white/90 shadow flex items-center justify-center hover:bg-white"
                        title="Move right"
                      >
                        <svg className="w-3.5 h-3.5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); removeImage(idx) }}
                      className="w-7 h-7 rounded-full bg-red-500/90 shadow flex items-center justify-center hover:bg-red-600"
                      title="Remove"
                    >
                      <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Hidden field so the form always has an images value */}
        <input type="hidden" name="images" value="" />
      </div>

      {/* Actions */}
      <div className="flex gap-3 justify-end">
        <a
          href="/admin"
          className="border border-gray-200 text-gray-600 hover:bg-gray-50 font-medium px-6 py-2.5 rounded-xl transition-colors"
        >
          Cancel
        </a>
        <button
          type="submit"
          disabled={pending || anyUploading}
          className="bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-medium px-6 py-2.5 rounded-xl transition-colors"
        >
          {anyUploading ? "Uploading images…" : pending ? "Saving…" : isEdit ? "Update Property" : "Create Property"}
        </button>
      </div>
    </form>
  )
}
