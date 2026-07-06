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

  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      canvas: false,
    };

    return config;
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
      {
        // SEO : /cgv (stub) → CGV officielle complète. Le stub n'est pas
        // supprimé (juridique intact) ; la redirection le supersède.
        source: "/cgv",
        destination: "/legal/cgv",
        permanent: true,
      },
    ];
  },

  async headers() {
    // Headers de sécurité sans risque (PROD-002-B). Pas de CSP.
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;