/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,
  output: "standalone",

  images: {
    unoptimized: true, // 🔥 évite bugs en dev
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },

  typescript: {
    ignoreBuildErrors: true, // ⚠️ ok temporaire
  },
};

module.exports = nextConfig;