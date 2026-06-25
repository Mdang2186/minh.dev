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
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**" },
    ],
  },
};

export default withNextIntl(nextConfig);
