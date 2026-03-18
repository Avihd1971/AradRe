"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function HeroSection() {
  const router = useRouter()
  const [search, setSearch] = useState("")

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    router.push(`/properties${search ? `?search=${encodeURIComponent(search)}` : ""}`)
  }

  return (
    <section className="bg-gradient-to-br from-blue-700 via-blue-600 to-blue-500 text-white py-24 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl sm:text-5xl font-extrabold mb-4 leading-tight">
          Find Your Perfect Property
        </h1>
        <p className="text-blue-100 text-lg mb-10">
          Browse thousands of listings — houses, apartments, villas, and more.
        </p>

        <form
          onSubmit={handleSearch}
          className="flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto"
        >
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by city, neighborhood, or keyword…"
            className="flex-1 rounded-xl px-5 py-3.5 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-white shadow"
          />
          <button
            type="submit"
            className="bg-white text-blue-700 font-semibold px-7 py-3.5 rounded-xl hover:bg-blue-50 transition-colors shadow whitespace-nowrap"
          >
            Search
          </button>
        </form>

        <div className="flex justify-center gap-8 mt-12 text-blue-100 text-sm">
          <div>
            <span className="block text-3xl font-bold text-white">500+</span>
            Listings
          </div>
          <div className="w-px bg-blue-500" />
          <div>
            <span className="block text-3xl font-bold text-white">50+</span>
            Locations
          </div>
          <div className="w-px bg-blue-500" />
          <div>
            <span className="block text-3xl font-bold text-white">100%</span>
            Verified
          </div>
        </div>
      </div>
    </section>
  )
}
