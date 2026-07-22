import type { MetadataRoute } from "next";

const routes = ["", "/about", "/information", "/media-archive", "/media-archive/photoshoot", "/media-archive/series", "/media-archive/short-film", "/mission", "/contact"];

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://vutrutaskvu.local";
  return routes.map((route) => ({ url: `${baseUrl}${route}`, lastModified: new Date(), changeFrequency: "weekly", priority: route === "" ? 1 : 0.7 }));
}
