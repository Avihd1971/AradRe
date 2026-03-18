const styles: Record<string, string> = {
  ACTIVE: "bg-green-100 text-green-800",
  INACTIVE: "bg-yellow-100 text-yellow-800",
  SOLD: "bg-red-100 text-red-800",
}

export default function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${styles[status] || "bg-gray-100 text-gray-700"}`}>
      {status.charAt(0) + status.slice(1).toLowerCase()}
    </span>
  )
}
