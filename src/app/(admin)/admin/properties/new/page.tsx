import Link from "next/link"
import PropertyForm from "@/components/admin/PropertyForm"

export const dynamic = "force-dynamic"

export default function NewPropertyPage() {
  return (
    <div className="p-8 max-w-3xl">
      <div className="mb-6">
        <Link href="/admin" className="text-sm text-blue-600 hover:underline">
          ← Back
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 mt-2">Add Property</h1>
      </div>
      <PropertyForm />
    </div>
  )
}
