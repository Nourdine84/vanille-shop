/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,
  output: "standalone",

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },

  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },

  typescript: {
    ignoreBuildErrors: false, // ✅ ON FIX PROPRE
  },

  async redirects() {
    return [
      {
        source: "/vanille",
        destination: "/collections/vanille",
        permanent: true,
      },
      {
        source: "/epices",
        destination: "/collections/epices",
        permanent: true,
      },
      {
        source: "/privacy",
        destination: "/legal/confidentialite",
        permanent: true,
      },
      {
        source: "/confidentialite",
        destination: "/legal/confidentialite",
        permanent: true,
      },
      {
        source: "/mentions-legales",
        destination: "/legal/mentions-legales",
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;