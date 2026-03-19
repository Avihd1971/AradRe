/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**" },
      { protocol: "http", hostname: "**" },
    ],
  },

  webpack(config) {
    // When building for Cloudflare Workers, replace @prisma/client with the
    // edge-compatible version that has no native engine and no eval("__dirname").
    // The regular client is kept for local development and seed scripts.
    if (process.env.TARGET_PLATFORM === "cloudflare") {
      config.resolve.alias["@prisma/client"] = require.resolve("@prisma/client/edge")
    }
    return config
  },
}

module.exports = nextConfig
