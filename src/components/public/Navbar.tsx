import Link from "next/link"

export default function Navbar() {
  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        <Link href="/" className="text-2xl font-bold text-blue-600">
          AradRe
        </Link>
        <nav className="flex items-center gap-6 text-sm font-medium">
          <Link href="/properties" className="text-gray-600 hover:text-blue-600 transition-colors">
            Properties
          </Link>
          <Link
            href="/properties?type=SALE"
            className="text-gray-600 hover:text-blue-600 transition-colors"
          >
            Buy
          </Link>
          <Link
            href="/properties?type=RENT"
            className="text-gray-600 hover:text-blue-600 transition-colors"
          >
            Rent
          </Link>
        </nav>
      </div>
    </header>
  )
}
