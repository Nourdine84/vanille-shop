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
      url: `${baseUrl}/b2b`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/cgv`,
      lastModified: new Date(),
    },
  ];
}