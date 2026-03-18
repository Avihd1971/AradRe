"use client"

import Link from "next/link"
import { useTransition } from "react"
import { deleteProperty, toggleFeatured, toggleStatus } from "@/lib/actions/property.actions"
import StatusBadge from "./StatusBadge"
import { formatPrice, parseImages, CATEGORY_LABELS } from "@/lib/utils"
import type { PropertyData } from "@/types"

export default function PropertyTable({ properties }: { properties: PropertyData[] }) {
  const [, startTransition] = useTransition()

  function handleDelete(id: string, title: string) {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return
    startTransition(() => deleteProperty(id))
  }

  function handleFeatured(id: string, current: boolean) {
    startTransition(() => toggleFeatured(id, !current))
  }

  function handleStatus(id: string, value: string) {
    startTransition(() => toggleStatus(id, value))
  }

  if (properties.length === 0) {
    return (
      <div className="text-center py-16 text-gray-400">
        <p className="text-lg font-medium">No properties yet</p>
        <Link href="/admin/properties/new" className="text-blue-600 text-sm hover:underline mt-2 inline-block">
          Add your first property →
        </Link>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200 text-gray-500 text-xs uppercase tracking-wide">
            <th className="text-left py-3 px-4 font-medium">Property</th>
            <th className="text-left py-3 px-4 font-medium">Category</th>
            <th className="text-left py-3 px-4 font-medium">Price</th>
            <th className="text-left py-3 px-4 font-medium">Status</th>
            <th className="text-left py-3 px-4 font-medium">Featured</th>
            <th className="text-right py-3 px-4 font-medium">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {properties.map((p) => {
            const images = parseImages(p.images)
            const cover = images[0]
            return (
              <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                <td className="py-3 px-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                      {cover ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={cover} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-blue-100" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 line-clamp-1">{p.title}</p>
                      <p className="text-xs text-gray-400 line-clamp-1">{p.location}</p>
                    </div>
                  </div>
                </td>
                <td className="py-3 px-4 text-gray-600">
                  <span className="text-xs">
                    {CATEGORY_LABELS[p.category] || p.category}
                    {" · "}
                    <span className={p.type === "RENT" ? "text-blue-600" : "text-emerald-600"}>
                      {p.type === "RENT" ? "Rent" : "Sale"}
                    </span>
                  </span>
                </td>
                <td className="py-3 px-4 font-semibold text-gray-900">
                  {formatPrice(p.price, p.type)}
                </td>
                <td className="py-3 px-4">
                  <select
                    value={p.status}
                    onChange={(e) => handleStatus(p.id, e.target.value)}
                    className="text-xs border border-gray-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
                  >
                    <option value="ACTIVE">Active</option>
                    <option value="INACTIVE">Inactive</option>
                    <option value="SOLD">Sold</option>
                  </select>
                </td>
                <td className="py-3 px-4">
                  <button
                    onClick={() => handleFeatured(p.id, p.featured)}
                    className={`w-9 h-5 rounded-full transition-colors relative ${
                      p.featured ? "bg-blue-600" : "bg-gray-200"
                    }`}
                    title={p.featured ? "Remove from featured" : "Mark as featured"}
                  >
                    <span
                      className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                        p.featured ? "translate-x-4" : "translate-x-0.5"
                      }`}
                    />
                  </button>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      href={`/admin/properties/${p.id}/edit`}
                      className="text-xs text-blue-600 hover:underline px-2 py-1 rounded hover:bg-blue-50"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(p.id, p.title)}
                      className="text-xs text-red-500 hover:underline px-2 py-1 rounded hover:bg-red-50"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
