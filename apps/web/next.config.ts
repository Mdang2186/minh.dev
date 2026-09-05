import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@minh-dev/database"],
  // Treat Prisma client as server-only external to avoid Turbopack CJS warning
  serverExternalPackages: ["@prisma/client"],
  experimental: {
    swcPlugins: [],
    outputFileTracingExcludes: {
      "**/*": [
        "public/uploads/**/*", 
        "node_modules/typescript/**/*", 
        "node_modules/@swc/core/**/*"
      ],
    },
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**" },
    ],
  },
};

export default withNextIntl(nextConfig);
