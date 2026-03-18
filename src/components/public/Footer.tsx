export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 py-10 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-white font-bold text-xl mb-2">AradRe</p>
        <p className="text-sm">© {new Date().getFullYear()} AradRe. All rights reserved.</p>
      </div>
    </footer>
  )
}
