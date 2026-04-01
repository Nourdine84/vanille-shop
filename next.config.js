/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,

  // 🔥 IMPORTANT VERCEL + PRISMA
  output: "standalone",

  // 🔥 Évite certains comportements agressifs de cache/build
  experimental: {
    serverActions: true,
  },

  // 🔥 Images (safe large scope)
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },

  // 🔥 OPTION SAFE (évite erreurs build CSS/externes)
  webpack: (config) => {
    return config;
  },
};

module.exports = nextConfig;