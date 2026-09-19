import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@minh-dev/database"],
  // Treat Prisma client as server-only external to avoid Turbopack CJS warning
  serverExternalPackages: ["@prisma/client"],

  // ── Reduce serverless function bundle size ──────────────────────────────
  // Exclude heavy files from being traced & bundled into serverless functions
  outputFileTracingExcludes: {
    "**/*": [
      // User-uploaded media — served via Vercel Blob, not from bundle
      "public/uploads/**/*",
      "public/projects/**/*",
      "public/avatars/**/*",
      "public/avatar*.png",
      "public/avatar.jpg",
      // Dev tooling
      "node_modules/typescript/**/*",
      "node_modules/@swc/core/**/*",
      "node_modules/webpack/**/*",
      "node_modules/esbuild/**/*",
      "node_modules/terser/**/*",
      // Heavy packages not needed at runtime
      "node_modules/@next/swc-*/**/*",
      "node_modules/sharp/**/*",
    ],
  },

  experimental: {
    swcPlugins: [],
  },

  // ── Image optimization ──────────────────────────────────────────────────
  images: {
    unoptimized: true, // Disable Vercel Image Optimization to stay under 1000 images/month
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 31536000, // 1 year
    remotePatterns: [
      { protocol: "https", hostname: "**" },
    ],
  },

  // ── HTTP cache headers ──────────────────────────────────────────────────
  async headers() {
    return [
      {
        // Cache static assets for 1 year (immutable)
        source: "/(.*)\\.（png|jpg|jpeg|gif|svg|ico|webp|avif|woff|woff2|ttf|otf|glb|gltf)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      {
        // Cache static assets for 1 year (immutable) — ASCII-safe pattern
        source: "/(.*)\\.(png|jpg|jpeg|gif|svg|ico|webp|avif|woff|woff2|ttf|otf|glb|gltf)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      {
        // No-store for admin API routes
        source: "/api/admin/:path*",
        headers: [
          { key: "Cache-Control", value: "no-store" },
        ],
      },
    ];
  },
};

export default withNextIntl(nextConfig);
