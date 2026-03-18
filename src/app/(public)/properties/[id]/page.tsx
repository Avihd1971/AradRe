import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { getPropertyById } from "@/lib/actions/property.actions"
import { formatPrice, formatArea, parseImages, CATEGORY_LABELS, TYPE_LABELS } from "@/lib/utils"

export const dynamic = "force-dynamic"

interface Props {
  params: { id: string }
}

export default async function PropertyDetailPage({ params }: Props) {
  const property = await getPropertyById(params.id)
  if (!property || property.status === "INACTIVE") notFound()

  const images = parseImages(property.images)

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Link href="/properties" className="text-blue-600 text-sm hover:underline mb-6 inline-block">
        ← Back to listings
      </Link>

      {/* Image gallery */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8 rounded-2xl overflow-hidden">
        {images.length > 0 ? (
          images.slice(0, 4).map((src, i) => (
            <div
              key={i}
              className={`relative ${i === 0 && images.length === 1 ? "sm:col-span-2" : ""} h-64`}
            >
              <Image src={src} alt={`${property.title} ${i + 1}`} fill className="object-cover" />
            </div>
          ))
        ) : (
          <div className="sm:col-span-2 h-72 bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center rounded-2xl">
            <svg className="w-20 h-20 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 9.75L12 3l9 6.75V21H3V9.75z" />
            </svg>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main info */}
        <div className="lg:col-span-2">
          <div className="flex flex-wrap gap-2 mb-3">
            <span
              className={`text-xs font-semibold px-3 py-1 rounded-full ${
                property.type === "RENT"
                  ? "bg-blue-100 text-blue-800"
                  : "bg-emerald-100 text-emerald-800"
              }`}
            >
              {TYPE_LABELS[property.type] || property.type}
            </span>
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-gray-100 text-gray-700">
              {CATEGORY_LABELS[property.category] || property.category}
            </span>
            {property.status === "SOLD" && (
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-red-100 text-red-700">
                Sold
              </span>
            )}
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-2">{property.title}</h1>
          <p className="text-gray-500 flex items-center gap-1.5 mb-6">
            <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {property.location}
          </p>

          {/* Specs grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 bg-gray-50 rounded-2xl mb-8">
            <div className="text-center">
              <p className="text-xs text-gray-400 mb-1">Area</p>
              <p className="font-semibold text-gray-900">{formatArea(property.area)}</p>
            </div>
            {property.bedrooms != null && (
              <div className="text-center">
                <p className="text-xs text-gray-400 mb-1">Bedrooms</p>
                <p className="font-semibold text-gray-900">{property.bedrooms}</p>
              </div>
            )}
            {property.bathrooms != null && (
              <div className="text-center">
                <p className="text-xs text-gray-400 mb-1">Bathrooms</p>
                <p className="font-semibold text-gray-900">{property.bathrooms}</p>
              </div>
            )}
            <div className="text-center">
              <p className="text-xs text-gray-400 mb-1">Type</p>
              <p className="font-semibold text-gray-900">
                {CATEGORY_LABELS[property.category] || property.category}
              </p>
            </div>
          </div>

          <h2 className="text-lg font-semibold text-gray-900 mb-3">Description</h2>
          <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">{property.description}</p>
        </div>

        {/* Price card + contact */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 sticky top-20">
            <p className="text-3xl font-bold text-blue-600 mb-1">
              {formatPrice(property.price, property.type)}
            </p>
            <p className="text-sm text-gray-400 mb-6">
              {property.type === "RENT" ? "per month" : "asking price"}
            </p>

            <a
              href="tel:+1234567890"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-xl text-center flex items-center justify-center gap-2 transition-colors mb-3"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              Call Agent
            </a>

            <a
              href="mailto:info@aradre.com"
              className="w-full border border-blue-600 text-blue-600 hover:bg-blue-50 font-medium py-3 rounded-xl text-center flex items-center justify-center gap-2 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Send Email
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
