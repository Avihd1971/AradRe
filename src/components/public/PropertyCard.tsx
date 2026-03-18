import Link from "next/link"
import Image from "next/image"
import { formatPrice, formatArea, parseImages, CATEGORY_LABELS } from "@/lib/utils"
import type { PropertyData } from "@/types"

export default function PropertyCard({ property }: { property: PropertyData }) {
  const images = parseImages(property.images)
  const cover = images[0] || null

  return (
    <Link
      href={`/properties/${property.id}`}
      className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-100 flex flex-col"
    >
      {/* Image */}
      <div className="relative h-52 bg-gray-100 overflow-hidden">
        {cover ? (
          <Image
            src={cover}
            alt={property.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
            <svg className="w-12 h-12 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9.75L12 3l9 6.75V21H3V9.75z" />
            </svg>
          </div>
        )}
        {/* Type badge */}
        <span
          className={`absolute top-3 left-3 text-xs font-semibold px-2.5 py-1 rounded-full ${
            property.type === "RENT"
              ? "bg-blue-100 text-blue-800"
              : "bg-emerald-100 text-emerald-800"
          }`}
        >
          {property.type === "RENT" ? "For Rent" : "For Sale"}
        </span>
        {property.featured && (
          <span className="absolute top-3 right-3 text-xs font-semibold px-2.5 py-1 rounded-full bg-yellow-100 text-yellow-800">
            Featured
          </span>
        )}
      </div>

      {/* Info */}
      <div className="p-4 flex flex-col gap-2 flex-1">
        <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">
          {CATEGORY_LABELS[property.category] || property.category}
        </p>
        <h3 className="font-semibold text-gray-900 line-clamp-1 group-hover:text-blue-600 transition-colors">
          {property.title}
        </h3>
        <p className="text-sm text-gray-500 flex items-center gap-1">
          <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="line-clamp-1">{property.location}</span>
        </p>

        {/* Specs */}
        <div className="flex items-center gap-3 text-xs text-gray-500 mt-auto pt-3 border-t border-gray-50">
          <span className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
            </svg>
            {formatArea(property.area)}
          </span>
          {property.bedrooms != null && (
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12h18M3 12V8a2 2 0 012-2h14a2 2 0 012 2v4M3 12v6m18-6v6M3 18h18" />
              </svg>
              {property.bedrooms} bd
            </span>
          )}
          {property.bathrooms != null && (
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 12h16M4 12a2 2 0 01-2-2V6a2 2 0 012-2h16a2 2 0 012 2v4a2 2 0 01-2 2M4 12v6a2 2 0 002 2h12a2 2 0 002-2v-6" />
              </svg>
              {property.bathrooms} ba
            </span>
          )}
        </div>

        <p className="text-xl font-bold text-blue-600">
          {formatPrice(property.price, property.type)}
        </p>
      </div>
    </Link>
  )
}
