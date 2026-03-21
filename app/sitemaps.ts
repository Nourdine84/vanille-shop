import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://ton-site.com";

  const res = await fetch("http://localhost:3000/api/products", {
    cache: "no-store",
  });

  const products = await res.json();

  const productUrls = products.map((p: any) => ({
    url: `${baseUrl}/product/${p.slug}`,
    lastModified: new Date(),
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/products`,
      lastModified: new Date(),
    },
    ...productUrls,
  ];
}