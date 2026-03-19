/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**" },
      { protocol: "http", hostname: "**" },
    ],
  },

  // Tell webpack NOT to bundle @prisma/client into route chunks.
  // This lets @opennextjs/cloudflare's esbuild step (which uses the
  // "workerd" package condition) resolve @prisma/client to the WASM
  // build (wasm.js / runtime/wasm.js) that works with driver adapters
  // and has no eval("__dirname"). In local dev, the regular Node.js
  // @prisma/client is used at runtime (webpack just leaves the require()
  // for Node to resolve normally).
  serverExternalPackages: ["@prisma/client", ".prisma/client"],
}

module.exports = nextConfig
