"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useCallback } from "react"

const CATEGORIES = ["APARTMENT", "HOUSE", "VILLA", "LAND", "COMMERCIAL"]
const CATEGORY_LABELS: Record<string, string> = {
  APARTMENT: "Apartment",
  HOUSE: "House",
  VILLA: "Villa",
  LAND: "Land",
  COMMERCIAL: "Commercial",
}

export default function FilterPanel() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const updateParam = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      if (value) {
        params.set(key, value)
      } else {
        params.delete(key)
      }
      router.push(`/properties?${params.toString()}`)
    },
    [router, searchParams]
  )

  const current = {
    search: searchParams.get("search") || "",
    type: searchParams.get("type") || "",
    category: searchParams.get("category") || "",
    minPrice: searchParams.get("minPrice") || "",
    maxPrice: searchParams.get("maxPrice") || "",
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-5">
      <h2 className="font-semibold text-gray-900">Filters</h2>

      {/* Search */}
      <div>
        <label className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5 block">
          Search
        </label>
        <input
          type="text"
          defaultValue={current.search}
          onKeyDown={(e) => {
            if (e.key === "Enter") updateParam("search", (e.target as HTMLInputElement).value)
          }}
          onBlur={(e) => updateParam("search", e.target.value)}
          placeholder="Title, location…"
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Type */}
      <div>
        <label className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5 block">
          Listing Type
        </label>
        <div className="flex gap-2">
          {["", "SALE", "RENT"].map((t) => (
            <button
              key={t}
              onClick={() => updateParam("type", t)}
              className={`flex-1 text-sm py-1.5 rounded-lg border transition-colors ${
                current.type === t
                  ? "bg-blue-600 text-white border-blue-600"
                  : "border-gray-200 text-gray-600 hover:border-blue-300"
              }`}
            >
              {t === "" ? "All" : t === "SALE" ? "Sale" : "Rent"}
            </button>
          ))}
        </div>
      </div>

      {/* Category */}
      <div>
        <label className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5 block">
          Category
        </label>
        <select
          value={current.category}
          onChange={(e) => updateParam("category", e.target.value)}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Categories</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {CATEGORY_LABELS[c]}
            </option>
          ))}
        </select>
      </div>

      {/* Price Range */}
      <div>
        <label className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5 block">
          Price Range
        </label>
        <div className="flex gap-2">
          <input
            type="number"
            defaultValue={current.minPrice}
            onBlur={(e) => updateParam("minPrice", e.target.value)}
            placeholder="Min"
            className="w-1/2 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="number"
            defaultValue={current.maxPrice}
            onBlur={(e) => updateParam("maxPrice", e.target.value)}
            placeholder="Max"
            className="w-1/2 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Clear */}
      <button
        onClick={() => router.push("/properties")}
        className="w-full text-sm text-gray-500 hover:text-red-500 transition-colors"
      >
        Clear all filters
      </button>
    </div>
  )
}
