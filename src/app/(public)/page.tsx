import Link from "next/link"
import HeroSection from "@/components/public/HeroSection"
import PropertyGrid from "@/components/public/PropertyGrid"
import { getFeaturedProperties } from "@/lib/actions/property.actions"

export default async function HomePage() {
  const featured = await getFeaturedProperties()

  return (
    <>
      <HeroSection />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {featured.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-gray-900">Featured Properties</h2>
              <Link
                href="/properties"
                className="text-blue-600 text-sm font-medium hover:underline"
              >
                View all →
              </Link>
            </div>
            <PropertyGrid properties={featured} />
          </section>
        )}

        {featured.length === 0 && (
          <div className="text-center py-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Browse Properties</h2>
            <p className="text-gray-500 mb-6">Discover available properties for sale and rent.</p>
            <Link
              href="/properties"
              className="inline-block bg-blue-600 text-white px-8 py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors"
            >
              View All Properties
            </Link>
          </div>
        )}

        {/* Category Quick Links */}
        <section className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Browse by Category</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {[
              { key: "APARTMENT", label: "Apartments", emoji: "🏢" },
              { key: "HOUSE", label: "Houses", emoji: "🏠" },
              { key: "VILLA", label: "Villas", emoji: "🏡" },
              { key: "LAND", label: "Land", emoji: "🌳" },
              { key: "COMMERCIAL", label: "Commercial", emoji: "🏪" },
            ].map((cat) => (
              <Link
                key={cat.key}
                href={`/properties?category=${cat.key}`}
                className="bg-white border border-gray-100 rounded-2xl p-6 text-center hover:border-blue-300 hover:shadow-sm transition-all group"
              >
                <span className="text-3xl block mb-2">{cat.emoji}</span>
                <span className="text-sm font-medium text-gray-700 group-hover:text-blue-600">
                  {cat.label}
                </span>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </>
  )
}
