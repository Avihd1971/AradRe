export type PropertyType = "SALE" | "RENT"
export type Category = "APARTMENT" | "HOUSE" | "VILLA" | "LAND" | "COMMERCIAL"
export type Status = "ACTIVE" | "INACTIVE" | "SOLD"

export interface FilterParams {
  search?: string
  type?: PropertyType
  category?: Category
  minPrice?: number
  maxPrice?: number
}

export interface PropertyData {
  id: string
  title: string
  price: number
  type: string
  category: string
  location: string
  area: number
  bedrooms: number | null
  bathrooms: number | null
  description: string
  images: string
  status: string
  featured: boolean
  createdAt: Date
  updatedAt: Date
}

export interface PropertyWithImages extends PropertyData {
  parsedImages: string[]
}
