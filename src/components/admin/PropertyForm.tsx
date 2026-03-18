"use client"

import { useTransition } from "react"
import { createProperty, updateProperty } from "@/lib/actions/property.actions"
import { parseImages } from "@/lib/utils"
import type { PropertyData } from "@/types"

const TYPES = ["SALE", "RENT"]
const CATEGORIES = ["APARTMENT", "HOUSE", "VILLA", "LAND", "COMMERCIAL"]
const STATUSES = ["ACTIVE", "INACTIVE", "SOLD"]

const inputCls =
  "w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
const labelCls = "block text-sm font-medium text-gray-700 mb-1"

export default function PropertyForm({ property }: { property?: PropertyData }) {
  const [pending, startTransition] = useTransition()
  const isEdit = !!property
  const existingImages = property ? parseImages(property.images).join("\n") : ""

  function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    startTransition(async () => {
      if (isEdit && property) {
        await updateProperty(property.id, data)
      } else {
        await createProperty(data)
      }
    })
  }

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
        <h2 className="font-semibold text-gray-900 mb-1">Images</h2>
        <p className="text-xs text-gray-400 mb-4">One URL per line (HTTPS)</p>
        <textarea
          name="images"
          rows={4}
          defaultValue={existingImages}
          placeholder={"https://images.unsplash.com/photo-xxx\nhttps://images.unsplash.com/photo-yyy"}
          className={`${inputCls} resize-none font-mono text-xs`}
        />
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
          disabled={pending}
          className="bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-medium px-6 py-2.5 rounded-xl transition-colors"
        >
          {pending ? "Saving…" : isEdit ? "Update Property" : "Create Property"}
        </button>
      </div>
    </form>
  )
}
