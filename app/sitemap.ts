import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://vanille-or.com";

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/products`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/collections/vanille`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/collections/epices`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/packs`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/b2b`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/vanille-madagascar`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/vanille-patisserie`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/acheter-vanille`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/confiance`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/cgv`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/legal/mentions-legales`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/legal/confidentialite`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/legal/cookies`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/legal/cgu`,
      lastModified: new Date(),
    },
  ];
}