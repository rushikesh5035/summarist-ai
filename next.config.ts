import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "api.dicebear.com",
      },
    ],
    qualities: [100, 75, 50], // Added quality levels for Logo component
  },
};

export default nextConfig;
