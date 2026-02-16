import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@react-three/drei", "@react-three/fiber", "three"],
  serverExternalPackages: ["mongoose", "mongodb"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "img.clerk.com",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "i01.appmifile.com",
      },
      {
        protocol: "https",
        hostname: "flagcdn.com",
      },
      {
        protocol: "https",
        hostname: "placehold.co",
      },
    ],
  },
};


export default nextConfig;

// Force rebuild for hydration fix
