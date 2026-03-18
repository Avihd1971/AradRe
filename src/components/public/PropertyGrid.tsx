import PropertyCard from "./PropertyCard"
import type { PropertyData } from "@/types"

export default function PropertyGrid({ properties }: { properties: PropertyData[] }) {
  if (properties.length === 0) {
    return (
      <div className="text-center py-20 text-gray-400">
        <svg className="w-16 h-16 mx-auto mb-4 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 9.75L12 3l9 6.75V21H3V9.75z" />
        </svg>
        <p className="text-lg font-medium text-gray-500">No properties found</p>
        <p className="text-sm">Try adjusting your filters</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {properties.map((p) => (
        <PropertyCard key={p.id} property={p} />
      ))}
    </div>
  )
}
