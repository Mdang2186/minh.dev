import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@minh-dev/database"],
  // Treat Prisma client as server-only external to avoid Turbopack CJS warning
  serverExternalPackages: ["@prisma/client"],
  outputFileTracingExcludes: {
    "**/*": [
      "public/uploads/**/*",
      "node_modules/typescript/**/*",
      "node_modules/@swc/core/**/*"
    ],
  },
  experimental: {
    swcPlugins: [],
  },
  // Optimize images: serve WebP/AVIF, cache for 1 year
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 31536000, // 1 year
    remotePatterns: [
      { protocol: "https", hostname: "**" },
    ],
  },
  // HTTP cache headers for static assets & API routes
  async headers() {
    return [
      {
        // Cache public static assets for 1 year
        source: "/(.*)\\.(png|jpg|jpeg|gif|svg|ico|webp|avif|woff|woff2|ttf|otf)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        // No-store for admin API routes
        source: "/api/admin/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "no-store",
          },
        ],
      },
    ];
  },
};

export default withNextIntl(nextConfig);
