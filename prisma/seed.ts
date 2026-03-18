import "dotenv/config"
import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

const sampleProperties = [
  {
    title: "Modern 3-Bedroom Apartment in Downtown",
    price: 450000,
    type: "SALE",
    category: "APARTMENT",
    location: "Downtown, New York",
    area: 120,
    bedrooms: 3,
    bathrooms: 2,
    description:
      "A stunning modern apartment in the heart of downtown. Features floor-to-ceiling windows, open-plan kitchen, and a spacious balcony with city views. Walking distance to restaurants, shops, and public transit.",
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800",
    ]),
    status: "ACTIVE",
    featured: true,
  },
  {
    title: "Spacious Family Villa with Garden",
    price: 1200000,
    type: "SALE",
    category: "VILLA",
    location: "Beverly Hills, Los Angeles",
    area: 350,
    bedrooms: 5,
    bathrooms: 4,
    description:
      "Luxurious villa set on a large plot with a beautifully landscaped garden and private pool. Features include a chef's kitchen, home theater, and a 3-car garage.",
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800",
    ]),
    status: "ACTIVE",
    featured: true,
  },
  {
    title: "Cozy Studio Apartment for Rent",
    price: 1800,
    type: "RENT",
    category: "APARTMENT",
    location: "Midtown, Manhattan",
    area: 45,
    bedrooms: 1,
    bathrooms: 1,
    description:
      "A well-maintained studio apartment in a prime location. Fully furnished with modern appliances. Utilities included. Perfect for young professionals.",
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800",
    ]),
    status: "ACTIVE",
    featured: false,
  },
  {
    title: "Commercial Office Space — Prime Location",
    price: 8500,
    type: "RENT",
    category: "COMMERCIAL",
    location: "Financial District, San Francisco",
    area: 200,
    bedrooms: null,
    bathrooms: 3,
    description:
      "Modern open-plan office space on the 15th floor with panoramic bay views. Includes 20 dedicated parking spaces, a conference room, and a kitchenette.",
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800",
    ]),
    status: "ACTIVE",
    featured: false,
  },
  {
    title: "Charming Townhouse in Historic District",
    price: 680000,
    type: "SALE",
    category: "HOUSE",
    location: "Beacon Hill, Boston",
    area: 190,
    bedrooms: 4,
    bathrooms: 3,
    description:
      "A beautifully restored Victorian townhouse offering original period features alongside modern conveniences. Private rear garden and rooftop terrace with city views.",
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800",
      "https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?w=800",
    ]),
    status: "ACTIVE",
    featured: true,
  },
  {
    title: "Beachfront Development Land",
    price: 950000,
    type: "SALE",
    category: "LAND",
    location: "Malibu, California",
    area: 2000,
    bedrooms: null,
    bathrooms: null,
    description:
      "A rare opportunity to acquire prime beachfront land with planning permission for a luxury residential development. Unobstructed ocean views from all angles.",
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=800",
    ]),
    status: "ACTIVE",
    featured: true,
  },
  {
    title: "Luxury Penthouse with Panoramic Views",
    price: 3200000,
    type: "SALE",
    category: "APARTMENT",
    location: "Upper East Side, New York",
    area: 280,
    bedrooms: 4,
    bathrooms: 4,
    description:
      "An extraordinary penthouse occupying the entire top floor of a prestigious building. Features a wraparound terrace, private elevator, smart home system, and concierge service.",
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800",
    ]),
    status: "ACTIVE",
    featured: false,
  },
  {
    title: "Modern Family Home — Suburban Retreat",
    price: 2800,
    type: "RENT",
    category: "HOUSE",
    location: "Palo Alto, California",
    area: 230,
    bedrooms: 4,
    bathrooms: 3,
    description:
      "A beautiful modern home in a quiet suburban neighborhood. Open-plan living, updated kitchen, and large backyard perfect for families. Top-rated school district.",
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1572120360610-d971b9d7767c?w=800",
    ]),
    status: "ACTIVE",
    featured: false,
  },
]

async function main() {
  console.log("Seeding database…")

  // Admin user
  const hash = await bcrypt.hash("admin123", 12)
  await prisma.user.upsert({
    where: { email: "admin@aradre.com" },
    update: {},
    create: {
      email: "admin@aradre.com",
      password: hash,
      name: "Admin",
    },
  })
  console.log("✓ Admin user created: admin@aradre.com / admin123")

  // Properties
  await prisma.property.deleteMany()
  for (const p of sampleProperties) {
    await prisma.property.create({ data: p })
  }
  console.log(`✓ ${sampleProperties.length} sample properties created`)
  console.log("Done!")
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
