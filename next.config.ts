import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // AVIF first: noticeably cleaner than WebP at the same size for photographic renders.
    formats: ["image/avif", "image/webp"],
    // 75 for thumbnails and cards, 90 for full-screen imagery (hero, design pages).
    qualities: [75, 90],
  },
};

export default nextConfig;
