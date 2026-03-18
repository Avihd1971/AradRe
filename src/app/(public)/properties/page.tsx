import { Suspense } from "react"
import PropertyGrid from "@/components/public/PropertyGrid"
import FilterPanel from "@/components/public/FilterPanel"
import { getActiveProperties } from "@/lib/actions/property.actions"
import type { FilterParams } from "@/types"

export const dynamic = "force-dynamic"

interface Props {
  searchParams: {
    search?: string
    type?: string
    category?: string
    minPrice?: string
    maxPrice?: string
  }
}

export default async function PropertiesPage({ searchParams }: Props) {
  const filters: FilterParams = {
    search: searchParams.search,
    type: searchParams.type as FilterParams["type"],
    category: searchParams.category as FilterParams["category"],
    minPrice: searchParams.minPrice ? parseFloat(searchParams.minPrice) : undefined,
    maxPrice: searchParams.maxPrice ? parseFloat(searchParams.maxPrice) : undefined,
  }

  const properties = await getActiveProperties(filters)

  const hasFilters =
    filters.search || filters.type || filters.category || filters.minPrice || filters.maxPrice

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Properties</h1>
        <p className="text-gray-500 mt-1">
          {properties.length} propert{properties.length !== 1 ? "ies" : "y"} found
          {hasFilters ? " (filtered)" : ""}
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters sidebar */}
        <aside className="lg:w-72 shrink-0">
          <Suspense fallback={<div className="h-96 bg-white rounded-2xl animate-pulse" />}>
            <FilterPanel />
          </Suspense>
        </aside>

        {/* Grid */}
        <div className="flex-1 min-w-0">
          <PropertyGrid properties={properties} />
        </div>
      </div>
    </div>
  )
}
