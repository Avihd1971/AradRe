export function formatPrice(price: number, type: string): string {
  const formatted = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(price)
  return type === "RENT" ? `${formatted}/mo` : formatted
}

export function formatArea(area: number): string {
  return `${area.toLocaleString()} m²`
}

export function parseImages(json: string): string[] {
  try {
    const parsed = JSON.parse(json)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function cn(...classes: (string | undefined | false | null)[]): string {
  return classes.filter(Boolean).join(" ")
}

export const CATEGORY_LABELS: Record<string, string> = {
  APARTMENT: "Apartment",
  HOUSE: "House",
  VILLA: "Villa",
  LAND: "Land",
  COMMERCIAL: "Commercial",
}

export const TYPE_LABELS: Record<string, string> = {
  SALE: "For Sale",
  RENT: "For Rent",
}
