import Link from "next/link"
import PropertyTable from "@/components/admin/PropertyTable"
import { getProperties } from "@/lib/actions/property.actions"

export default async function AdminDashboard() {
  const properties = await getProperties()

  const stats = {
    total: properties.length,
    active: properties.filter((p) => p.status === "ACTIVE").length,
    sold: properties.filter((p) => p.status === "SOLD").length,
    featured: properties.filter((p) => p.featured).length,
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Properties</h1>
          <p className="text-sm text-gray-500 mt-0.5">Manage all your listings</p>
        </div>
        <Link
          href="/admin/properties/new"
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2.5 rounded-xl text-sm transition-colors flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Property
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total", value: stats.total, color: "text-gray-900" },
          { label: "Active", value: stats.active, color: "text-green-600" },
          { label: "Sold", value: stats.sold, color: "text-red-600" },
          { label: "Featured", value: stats.featured, color: "text-blue-600" },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <p className="text-xs text-gray-400 font-medium mb-1">{s.label}</p>
            <p className={`text-3xl font-bold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <PropertyTable properties={properties} />
      </div>
    </div>
  )
}
