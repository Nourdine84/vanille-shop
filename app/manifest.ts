import { MetadataRoute } from "next";
import { SITE_NAME, SITE_DESCRIPTION } from "@/lib/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Vanille’Or — Vanille premium de Madagascar",
    short_name: SITE_NAME,
    description: SITE_DESCRIPTION,
    start_url: "/",
    display: "standalone",
    background_color: "#f8f5ef",
    theme_color: "#a16207",
    lang: "fr",
    icons: [
      {
        src: "/images/logo-vanilleor.png",
        sizes: "any",
        type: "image/png",
      },
    ],
  };
}
