import Link from "next/link"
import { notFound } from "next/navigation"
import PropertyForm from "@/components/admin/PropertyForm"
import { getPropertyById } from "@/lib/actions/property.actions"

interface Props {
  params: { id: string }
}

export default async function EditPropertyPage({ params }: Props) {
  const property = await getPropertyById(params.id)
  if (!property) notFound()

  return (
    <div className="p-8 max-w-3xl">
      <div className="mb-6">
        <Link href="/admin" className="text-sm text-blue-600 hover:underline">
          ← Back
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 mt-2">Edit Property</h1>
        <p className="text-sm text-gray-500 mt-0.5">{property.title}</p>
      </div>
      <PropertyForm property={property} />
    </div>
  )
}
