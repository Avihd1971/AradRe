/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**" },
      { protocol: "http", hostname: "**" },
    ],
  },

  webpack(config) {
    // The app imports @prisma/client/edge everywhere (no eval("__dirname"),
    // works in Cloudflare Workers). For local dev we swap it back to the full
    // client so SQLite works without a driver adapter.
    if (process.env.TARGET_PLATFORM !== "cloudflare") {
      config.resolve.alias["@prisma/client/edge"] = require.resolve("@prisma/client")
    }
    return config
  },
}

module.exports = nextConfig
