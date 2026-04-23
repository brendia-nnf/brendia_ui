import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,

  // Image optimization
  images: {
    // Enable modern image formats
    formats: ["image/avif", "image/webp"],

    // Configure device sizes for srcset generation
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],

    // Configure image sizes for smaller images
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],

    // Minimize quality for production (adjustable)
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days

    // Remote patterns if needed later
    remotePatterns: [],
  },

  // Headers for caching and security
  async headers() {
    return [
      {
        source: "/images/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/:path*.woff2",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },

  // Experimental features for performance
  experimental: {
    optimizeCss: true,
  },
};

export default nextConfig;
