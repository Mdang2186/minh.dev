import type { NextConfig } from "next";

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

export default nextConfig;
