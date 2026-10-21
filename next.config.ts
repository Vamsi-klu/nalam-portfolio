import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Preserve artwork detail while retaining the default quality for other images.
    qualities: [75, 85],
  },
};

export default nextConfig;
