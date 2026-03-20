// Extend CloudflareEnv with the bindings declared in wrangler.jsonc

interface CloudflareEnv {
  DB: D1Database
  ASSETS: Fetcher
  IMAGES: R2Bucket
}
